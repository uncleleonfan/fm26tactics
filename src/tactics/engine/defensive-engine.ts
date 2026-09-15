import type { BallZoneId, Point } from "@/types/analysis";
import { zoneById } from "@/tactics/data/zones";
import { mentalityFactor } from "@/tactics/data/analysis-config";
import { getRoleBehavior } from "@/tactics/data/role-behaviors";
import { playerRoles } from "@/lib/tactics-data";
import { horizontalBand } from "@/tactics/engine/tactical-model";
import type { PlayerDuty } from "@/types/tactic";

/**
 * Defensive scenario engine — deterministic rules answering:
 * "the opponent has the ball HERE, how does our out-of-possession
 * shape respond?" (mirror of the possession spatial-engine).
 *
 * Coordinate system (matches the board): x 0=left → 100=right,
 * y 100=own goal → 0=opponent goal. A HIGH defensive line = low y.
 * All rules are explainable heuristics — no black-box scoring.
 */

export type DefensiveAction = "press" | "press-support" | "cover" | "hold" | "drop";

export interface DefensivePlayerMovement {
  playerId: string;
  roleId: string;
  basePosition: Point;
  expectedPosition: Point;
  action: DefensiveAction;
}

export interface DefensiveMetrics {
  /** Weighted pressing presence around the opponent ball (0-1). */
  pressureOnBall: number;
  /** How tightly the outfield block holds its shape in response (0-1). */
  compactness: number;
  /** Bodies + proximity on the ball side of the pitch (0-1). */
  ballSideCover: number;
  /** Exposure of the space behind the defensive line (0-1, higher = riskier). */
  spaceInBehind: number;
  /** Board y of the (instruction-adjusted) defensive line. */
  defensiveLineY: number;
}

export interface DefensiveFinding {
  id: string;
  severity: "info" | "warning";
  /** i18n key suffix under `visualize.defensiveFindings.*`. */
  messageKey: string;
  values?: Record<string, string | number>;
  playerIds: string[];
}

export interface DefensiveResult {
  movements: DefensivePlayerMovement[];
  metrics: DefensiveMetrics;
  findings: DefensiveFinding[];
  /** Opponent ball anchor in board coordinates. */
  ball: Point;
}

export interface DefensiveScenarioInput {
  /** The out-of-possession phase XI (resolvePhasePlayers output). */
  players: Array<{ id: string; roleId: string; duty: PlayerDuty; x: number; y: number }>;
  oppBallZone: BallZoneId;
  mentality: string;
  oopInstructions: string[];
}

// Instruction strings — must match instruction-panel's English originals.
const OOP = {
  HIGHER_LINE: "Higher Defensive Line",
  LOWER_LINE: "Lower Defensive Line",
  MUCH_HIGHER_LINE: "Much Higher Defensive Line",
  MUCH_LOWER_LINE: "Much Lower Defensive Line",
  HIGH_PRESS: "High Press",
  LOW_BLOCK: "Low Block",
  OFFSIDE_TRAP: "Offside Trap",
  TIGHTER_MARKING: "Tighter Marking",
} as const;

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

function std(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

type InputPlayer = DefensiveScenarioInput["players"][number];

interface EnginePlayer extends InputPlayer {
  isGK: boolean;
  roleCategory: "goalkeeper" | "defender" | "midfielder" | "forward";
  pressing: number;
  defensiveWidth: number;
  defensiveDepth: number;
  defensiveResponsibility: number;
  band: "left" | "central" | "right";
  distToBall: number;
  /** pressing-weighted proximity score used to pick pressers. */
  pressScore: number;
}

export function computeDefensiveScenario(input: DefensiveScenarioInput): DefensiveResult {
  const zone = zoneById[input.oppBallZone];
  const ball = { x: zone.x, y: zone.y };
  const ballBand = zone.band === "central" ? "central" : zone.band;
  const mf = mentalityFactor(input.mentality);
  const inst = input.oopInstructions;

  // --- Team-level instruction modifiers ---
  let lineLift = 0; // positive = push line up (y decreases)
  if (inst.includes(OOP.MUCH_HIGHER_LINE)) lineLift += 10;
  else if (inst.includes(OOP.HIGHER_LINE)) lineLift += 6;
  if (inst.includes(OOP.MUCH_LOWER_LINE)) lineLift -= 10;
  else if (inst.includes(OOP.LOWER_LINE)) lineLift -= 6;
  if (inst.includes(OOP.OFFSIDE_TRAP)) lineLift += 2;
  const highPress = inst.includes(OOP.HIGH_PRESS);
  const lowBlock = inst.includes(OOP.LOW_BLOCK);
  const tighter = inst.includes(OOP.TIGHTER_MARKING);
  const offsideTrap = inst.includes(OOP.OFFSIDE_TRAP);

  // Attacking mindsets squeeze the line up a little; defensive ones drop it.
  const lineShift = lineLift + mf * 3 + (highPress ? 4 : 0) - (lowBlock ? 6 : 0);

  // --- Join players with role behavior ---
  const roleIndex = Object.fromEntries(playerRoles.map((r) => [r.id, r]));
  const players: EnginePlayer[] = input.players.map((p) => {
    const meta = roleIndex[p.roleId];
    const roleCategory = meta?.category ?? "midfielder";
    const behavior = getRoleBehavior(p.roleId, p.duty).outOfPossession;
    const distToBall = Math.hypot(p.x - ball.x, p.y - ball.y);
    return {
      ...p,
      isGK: roleCategory === "goalkeeper",
      roleCategory,
      pressing: behavior.pressing,
      defensiveWidth: behavior.defensiveWidth,
      defensiveDepth: behavior.defensiveDepth,
      defensiveResponsibility: behavior.defensiveResponsibility,
      band: horizontalBand(p.x),
      distToBall,
      // Distance penalty caps how far a presser can be useful (60+ → 20%).
      pressScore: behavior.pressing * (1 - clamp(distToBall / 60, 0, 1) * 0.8),
    };
  });
  const outfield = players.filter((p) => !p.isGK);

  // --- Defensive line (outfield defenders, instruction-adjusted) ---
  const defenders = outfield.filter((p) => p.roleCategory === "defender");
  const defLineSource = defenders.length > 0 ? defenders : outfield.filter((p) => p.y >= 60);
  const baseLineY = defLineSource.reduce((s, p) => s + p.y, 0) / defLineSource.length;
  const lineY = clamp(baseLineY - lineShift, 28, 78);
  const lineDy = lineY - baseLineY;

  // --- Presser selection (deterministic: score rank, distance tiebreak) ---
  const ranked = [...outfield].sort(
    (a, b) => b.pressScore - a.pressScore || a.distToBall - b.distToBall
  );
  let pressCount = zone.third === "attacking" ? 3 : 2;
  if (highPress) pressCount += 1;
  if (lowBlock) pressCount -= 1;
  pressCount = clamp(pressCount, 1, 3);
  const pressers = new Set(ranked.slice(0, pressCount).map((p) => p.id));

  // Supporters: next ranked players on/near the ball side.
  const supporters = new Set<string>();
  for (const p of ranked) {
    if (supporters.size >= 2) break;
    if (pressers.has(p.id)) continue;
    if (p.band === ballBand || p.band === "central" || ballBand === "central") {
      supporters.add(p.id);
    }
  }

  // --- Expected positions ---
  const positions = new Map<string, Point>();
  const actions = new Map<string, DefensiveAction>();

  for (const p of players) {
    if (p.isGK) {
      positions.set(p.id, {
        x: clamp(lerp(p.x, ball.x, 0.18), 30, 70),
        y: clamp(p.y - lineShift * 0.25, 80, 92),
      });
      actions.set(p.id, "hold");
      continue;
    }

    if (pressers.has(p.id)) {
      // Close the ball down, stopping ~3.5 units short of it. A player
      // already inside that radius is on the ball — he holds his spot.
      const STOP = 3.5;
      const len = Math.max(p.distToBall, 0.001);
      const ideal =
        p.distToBall <= STOP
          ? { x: p.x, y: p.y }
          : {
              x: ball.x - ((ball.x - p.x) / len) * STOP,
              y: ball.y - ((ball.y - p.y) / len) * STOP,
            };
      const factor = clamp(0.85 - p.distToBall / 90, 0.4, 0.85);
      positions.set(p.id, {
        x: lerp(p.x, ideal.x, factor),
        y: lerp(p.y, ideal.y, factor),
      });
      actions.set(p.id, "press");
      continue;
    }

    if (supporters.has(p.id)) {
      // Shift across to cover behind the presser (~5.5 units off the ball).
      const len = Math.max(p.distToBall, 0.001);
      const ideal = {
        x: ball.x - ((ball.x - p.x) / len) * 5.5,
        y: ball.y - ((ball.y - p.y) / len) * 5.5,
      };
      positions.set(p.id, {
        x: lerp(p.x, ideal.x, 0.5),
        y: lerp(p.y, ideal.y, 0.5),
      });
      actions.set(p.id, "press-support");
      continue;
    }

    // Everyone else: slide toward the ball side, follow the line vertically.
    const sameSide = p.band === ballBand || ballBand === "central";
    let pull = sameSide
      ? 0.1 + (1 - p.defensiveWidth) * 0.12
      : 0.05 + (1 - p.defensiveWidth) * 0.06;
    if (tighter) pull *= 1.3;

    let x = p.x + (ball.x - p.x) * pull;
    let y = p.y + lineDy * (p.roleCategory === "defender" ? 1 : 0.4 + p.defensiveDepth * 0.4);
    y += clamp((ball.y - p.y) * 0.08, -4, 4); // slight ball-side lean
    if (lowBlock) y += 5;

    positions.set(p.id, { x: clamp(x, 2, 98), y: clamp(y, 6, 96) });
    actions.set(
      p.id,
      p.roleCategory === "defender"
        ? "cover"
        : ball.y > 50 && p.defensiveDepth >= 0.55
          ? "drop"
          : "hold"
    );
  }

  const movements: DefensivePlayerMovement[] = players.map((p) => ({
    playerId: p.id,
    roleId: p.roleId,
    basePosition: { x: p.x, y: p.y },
    expectedPosition: positions.get(p.id) ?? { x: p.x, y: p.y },
    action: actions.get(p.id) ?? "hold",
  }));

  // --- Metrics (over expected outfield positions) ---
  const expectedOutfield = outfield.map((p) => positions.get(p.id)!);
  const behaviorById = new Map(players.map((p) => [p.id, p.pressing]));

  let pressSum = 0;
  for (const p of outfield) {
    const pos = positions.get(p.id)!;
    const dist = Math.hypot(pos.x - ball.x, pos.y - ball.y);
    if (dist < 30) pressSum += behaviorById.get(p.id)! * (1 - dist / 30);
  }
  const pressureOnBall = clamp(pressSum / 2.6, 0, 1);

  const stdX = std(expectedOutfield.map((p) => p.x));
  const stdY = std(expectedOutfield.map((p) => p.y));
  const compactness = 1 - clamp((stdX / 26 + stdY / 32) / 2, 0, 1);

  const sidePlayers = outfield.filter((p) => {
    if (ballBand === "central") return true;
    const pos = positions.get(p.id)!;
    return horizontalBand(pos.x) === ballBand || horizontalBand(pos.x) === "central";
  });
  const avgSideDist =
    sidePlayers.length > 0
      ? sidePlayers.reduce(
          (s, p) => s + Math.hypot(positions.get(p.id)!.x - ball.x, positions.get(p.id)!.y - ball.y),
          0
        ) / sidePlayers.length
      : 999;
  const ballSideCover =
    clamp(sidePlayers.length / 4, 0, 1) * 0.55 + clamp(1 - avgSideDist / 50, 0, 1) * 0.45;

  const highLineExposure = clamp((62 - lineY) / 30, 0, 1);
  const ballBehindLine = ball.y > lineY + 2 && ball.y > 50;
  const spaceInBehind = clamp(highLineExposure * 0.45 + (ballBehindLine ? 0.6 : 0), 0, 1);

  const metrics: DefensiveMetrics = {
    pressureOnBall,
    compactness,
    ballSideCover,
    spaceInBehind,
    defensiveLineY: lineY,
  };

  // --- Findings (i18n keys under visualize.defensiveFindings.*) ---
  const findings: DefensiveFinding[] = [];
  const pct = (v: number) => Math.round(v * 100);

  if (pressureOnBall < 0.22) {
    findings.push({
      id: "no-pressure",
      severity: "warning",
      messageKey: "noPressure",
      values: { pressure: pct(pressureOnBall) },
      playerIds: Array.from(pressers),
    });
  }
  if (spaceInBehind > 0.55) {
    findings.push({
      id: "exposed-line",
      severity: "warning",
      messageKey: "exposedLine",
      values: { lineY: Math.round(lineY) },
      playerIds: defenders.map((p) => p.id),
    });
  }
  if (compactness < 0.45) {
    findings.push({
      id: "stretched-block",
      severity: "warning",
      messageKey: "stretchedBlock",
      values: { compactness: pct(compactness) },
      playerIds: [],
    });
  }
  if (ballSideCover < 0.35) {
    findings.push({
      id: "weak-ball-side-cover",
      severity: "warning",
      messageKey: "weakBallSideCover",
      values: { cover: pct(ballSideCover) },
      playerIds: [],
    });
  }
  if (offsideTrap) {
    findings.push({
      id: "offside-trap",
      severity: "info",
      messageKey: "offsideTrapActive",
      values: {},
      playerIds: defenders.map((p) => p.id),
    });
  }
  if (findings.every((f) => f.severity === "info") && pressureOnBall >= 0.55 && compactness >= 0.6) {
    findings.push({
      id: "solid-shape",
      severity: "info",
      messageKey: "solidShape",
      values: { pressure: pct(pressureOnBall), compactness: pct(compactness) },
      playerIds: [],
    });
  }

  return { movements, metrics, findings, ball };
}
