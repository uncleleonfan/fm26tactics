import type {
  AnalysisConstraints,
  AttackAnalysis,
  BallZoneId,
  DefenceAnalysis,
  Recommendation,
  SupportAnalysis,
  TransitionAnalysis,
} from "@/types/analysis";
import type { TacticBoardState, PlayerDuty } from "@/types/tactic";
import { playerRoles } from "@/lib/tactics-data";
import { buildTacticalModel } from "@/tactics/engine/tactical-model";
import { computeSpatial } from "@/tactics/engine/spatial-engine";
import { analyzeAttack, analyzeSupport, analyseDefence } from "@/tactics/engine/balance-engine";
import { analyzeTransition } from "@/tactics/engine/risk-engine";

/**
 * Recommendation engine (spec §17-18).
 *
 * Instead of vague critique, it searches concrete role/duty changes that
 * measurably improve the weakest dimension, while respecting user-intent
 * constraints (locked players / locked categories).
 *
 * Candidate search: for every modifiable player we enumerate same-category
 * role/duty alternatives, re-score the tactic, and rank by weighted delta.
 */

interface ScoreSnapshot {
  attack: number;
  defence: number;
  support: number;
  risk: number;
}

function meanScore(a: AttackAnalysis | DefenceAnalysis | SupportAnalysis): number {
  const values = Object.entries(a)
    .filter(([k, v]) => typeof v === "number" && k !== "rating")
    .map(([, v]) => v as number);
  return values.reduce((s, v) => s + v, 0) / Math.max(1, values.length);
}

/**
 * Re-score a candidate state through the same spatial pipeline as the main
 * analysis, so candidate deltas and reported impact match a full re-analysis
 * (including ball-zone displacement and mentality effects).
 */
function scoreOf(state: TacticBoardState, ballZone: BallZoneId): ScoreSnapshot {
  const model = buildTacticalModel(state);
  const { movements } = computeSpatial(model, ballZone);
  return {
    attack: meanScore(analyzeAttack(model.players, movements, ballZone)),
    support: meanScore(analyzeSupport(model.players, movements, ballZone)),
    defence: meanScore(analyseDefence(model.players, movements, ballZone)),
    risk: analyzeTransition(model.players, movements, ballZone, model.mentality).riskScore,
  };
}

export function generateRecommendations(
  state: TacticBoardState,
  ballZone: BallZoneId,
  analysis: {
    attack: AttackAnalysis;
    support: SupportAnalysis;
    defence: DefenceAnalysis;
    transition: TransitionAnalysis;
  },
  constraints?: AnalysisConstraints
): Recommendation[] {
  const before = scoreOf(state, ballZone);
  const model = buildTacticalModel(state);
  const lockedIds = new Set(constraints?.lockedPlayerIds ?? []);
  const lockedCats = new Set(constraints?.lockedCategories ?? []);

  // Target the weakest defensive-relevant dimension.
  const problemPriority = [
    { key: "defence" as const, value: before.defence, weight: 1.0 },
    { key: "risk" as const, value: 1 - before.risk, weight: 0.9 },
    { key: "support" as const, value: before.support, weight: 0.6 },
    { key: "attack" as const, value: before.attack, weight: 0.5 },
  ].sort((a, b) => a.value * a.weight - b.value * b.weight);
  const primaryProblem = problemPriority[0].key;

  interface Candidate {
    playerIndex: number;
    newRoleId: string;
    newDuty: PlayerDuty;
    after: ScoreSnapshot;
    delta: number;
  }
  const candidates: Candidate[] = [];

  state.players.forEach((node, playerIndex) => {
    const tactical = model.players[playerIndex];
    if (lockedIds.has(node.id) || lockedCats.has(tactical.roleCategory)) return;
    if (tactical.roleCategory === "goalkeeper") return; // GK changes rarely fix balance

    for (const role of playerRoles) {
      if (role.category !== tactical.roleCategory) continue;
      for (const duty of role.availableDuties) {
        if (role.id === node.roleId && duty === node.duty) continue;

        const nextState: TacticBoardState = {
          ...state,
          players: state.players.map((p, i) =>
            i === playerIndex ? { ...p, roleId: role.id, duty } : p
          ),
        };
        const after = scoreOf(nextState, ballZone);

        // Improvement function: defensive equilibrium first. Recommendations
        // may trade creativity and threat, but never the defensive floor.
        const delta =
          (after.defence - before.defence) * 1.5 +
          (before.risk - after.risk) * 1.5 +
          (after.support - before.support) * 0.3 +
          (after.attack - before.attack) * 0.2;

        // Gate: a recommendation must measurably improve defensive balance
        // and never raise transition risk. (When the front line is locked,
        // risk may be untouchable from defence-only changes — flat risk is
        // still acceptable as long as defence genuinely improves.)
        if (delta > 0.01 && after.defence > before.defence && after.risk <= before.risk + 1e-9) {
          candidates.push({ playerIndex, newRoleId: role.id, newDuty: duty, after, delta });
        }
      }
    }
  });

  // Best candidate per player, then global top-3.
  const bestPerPlayer = new Map<number, Candidate>();
  for (const c of candidates) {
    const existing = bestPerPlayer.get(c.playerIndex);
    if (!existing || c.delta > existing.delta) bestPerPlayer.set(c.playerIndex, c);
  }
  const top = Array.from(bestPerPlayer.values()).sort((a, b) => b.delta - a.delta).slice(0, 3);

  return top.map((c, rank) => {
    const player = state.players[c.playerIndex];
    const tactical = model.players[c.playerIndex];
    const newRole = playerRoles.find((r) => r.id === c.newRoleId);
    const newLabel = `${newRole?.abbr ?? c.newRoleId}(${c.newDuty[0].toUpperCase()})`;
    const problemText: Record<string, string> = {
      defence: "defensive balance is weak",
      risk: `transition risk is ${analysis.transition.riskLevel.replace("-", " ")}`,
      support: "support structure is thin",
      attack: "attacking structure lacks threat",
    };
    return {
      id: `rec-${rank}-${player.id}`,
      playerId: player.id,
      playerLabel: tactical.label,
      suggestedChange: `${tactical.label} → ${newLabel}`,
      newRoleId: c.newRoleId,
      newDuty: c.newDuty,
      problemKey: primaryProblem,
      problemParams: { problem: problemText[primaryProblem] },
      reasonKey: "recommendationReason",
      reasonParams: { change: `${tactical.label} to ${newLabel}` },
      impact: {
        attack: c.after.attack - before.attack,
        support: c.after.support - before.support,
        defence: c.after.defence - before.defence,
        risk: before.risk - c.after.risk, // positive = risk reduced
      },
    };
  });
}
