import type {
  BallZoneId,
  PlayerMovement,
  RiskLevel,
  TacticalWarning,
  TransitionAnalysis,
  AttackAnalysis,
  DefenceAnalysis,
  SupportAnalysis,
} from "@/types/analysis";
import { RISK_LEVELS, RISK_WEIGHTS as W } from "@/tactics/data/analysis-config";
import { zoneById, ZONE_OCCUPANCY_THRESHOLDS } from "@/tactics/data/zones";
import type { TacticalPlayer } from "@/tactics/engine/tactical-model";
import { horizontalBand } from "@/tactics/engine/tactical-model";
import { counterPressScore, spatialContextFor } from "@/tactics/engine/spatial-engine";

/**
 * Risk engine — deterministic transition risk model and explainable
 * warnings (spec §16, §24). Every warning carries a full reason.
 */

function riskLevel(score: number): RiskLevel {
  if (score < RISK_LEVELS.low) return "low";
  if (score < RISK_LEVELS.medium) return "medium";
  if (score < RISK_LEVELS.high) return "high";
  return "very-high";
}

export function analyzeTransition(
  players: TacticalPlayer[],
  movements: PlayerMovement[],
  ballZone: BallZoneId
): TransitionAnalysis {
  const zone = zoneById[ballZone];
  const ctx = spatialContextFor(ballZone);
  const outfield = players.filter((p) => p.roleCategory !== "goalkeeper");
  const posById = new Map(movements.map((m) => [m.playerId, m.expectedPosition]));

  // Counter-pressing: pressing attributes near the ball.
  const counterPressing = counterPressScore(players, movements, ctx);

  // Recovery structure: how many responsible defenders stay goal-side.
  const restDefenders = outfield.filter((p) => {
    const pos = posById.get(p.id)!;
    return pos.y > zone.y + 6 && p.behavior.outOfPossession.defensiveResponsibility > 0.5;
  });
  const recoveryStructure = Math.min(1, restDefenders.length / 4);

  // --- Risk factors ---
  const attackDutyCount = outfield.filter((p) => p.duty === "attack").length;

  const aggressiveWide = outfield.filter(
    (p) =>
      horizontalBand(p.x) !== "central" &&
      p.behavior.possession.attacking > 0.45 &&
      (p.roleCategory === "defender" || p.roleCategory === "midfielder")
  ).length;

  const playersAheadOfBall = movements.filter((m) => m.expectedPosition.y < zone.y - 4).length;

  const weakCentralCoverPlayers = outfield.filter(
    (p) =>
      horizontalBand(posById.get(p.id)!.x) === "central" &&
      posById.get(p.id)!.y > 50 &&
      p.behavior.outOfPossession.centralProtection > 0.55
  ).length;

  const overloadedZones = Object.entries(
    movements.reduce<Record<string, number>>((acc, m) => {
      const z = m.occupiedZones[0];
      acc[z] = (acc[z] ?? 0) + 1;
      return acc;
    }, {})
  ).filter(([, count]) => count >= ZONE_OCCUPANCY_THRESHOLDS.overload).length;

  const raw =
    (attackDutyCount / 5) * W.attackDuty +
    (aggressiveWide / 3) * W.aggressiveWide +
    (playersAheadOfBall / 7) * W.poorRestDefence * (1 - recoveryStructure) +
    (weakCentralCoverPlayers === 0 ? 1 : 0) * W.weakCentralCover * 0.55 +
    (1 - counterPressing) * W.weakCounterPress +
    (overloadedZones / 3) * W.zoneOverload;

  const riskScore = Math.max(0, Math.min(1, raw / W.normalizer));

  return {
    counterPressing,
    recoveryStructure,
    riskScore,
    riskLevel: riskLevel(riskScore),
  };
}

export function generateWarnings(
  players: TacticalPlayer[],
  movements: PlayerMovement[],
  zoneOccupancy: Partial<Record<BallZoneId, number>>,
  ballZone: BallZoneId,
  attack: AttackAnalysis,
  support: SupportAnalysis,
  defence: DefenceAnalysis,
  transition: TransitionAnalysis
): TacticalWarning[] {
  const warnings: TacticalWarning[] = [];
  const posById = new Map(movements.map((m) => [m.playerId, m.expectedPosition]));
  const nameById = new Map(players.map((p) => [p.id, p.label]));
  const outfield = players.filter((p) => p.roleCategory !== "goalkeeper");

  // --- Wide defensive coverage ---
  for (const side of ["left", "right"] as const) {
    const sideLabel = side === "left" ? "Left" : "Right";
    const sidePlayers = outfield.filter((p) => horizontalBand(posById.get(p.id)!.x) === side);
    // The flank's primary protector: strongest width×responsibility combo.
    const mainProt = Math.max(
      0,
      ...sidePlayers.map(
        (p) =>
          p.behavior.outOfPossession.defensiveWidth *
          p.behavior.outOfPossession.defensiveResponsibility
      )
    );
    const aggressiveIds = sidePlayers
      .filter((p) => p.behavior.possession.attacking > 0.45 && p.behavior.outOfPossession.defensiveResponsibility < 0.6)
      .map((p) => p.id);
    if (mainProt < 0.38 && sidePlayers.length > 0) {
      warnings.push({
        id: `wide-coverage-${side}`,
        severity: "warning",
        key: "wideCoverageWeak",
        params: { side: sideLabel, players: aggressiveIds.map((id) => nameById.get(id)).join(", ") },
        dimension: "defence",
        reason: `${sideLabel} side has limited defensive coverage because ${aggressiveIds
          .map((id) => nameById.get(id))
          .join(" and ") || "the wide players"} carry aggressive attacking duties with low defensive responsibility.`,
        playerIds: aggressiveIds,
      });
    }
  }

  // --- Central protection ---
  if (defence.centralProtection < 0.4) {
    warnings.push({
      id: "central-protection-weak",
      severity: "critical",
      key: "centralProtectionWeak",
      dimension: "defence",
      reason:
        "Central protection is limited — few central players combine high defensive responsibility with central coverage. Consider a holding midfielder or deeper midfield duties.",
      playerIds: [],
    });
  }

  // --- Rest defence ---
  if (defence.restDefence < 0.55) {
    warnings.push({
      id: "rest-defence-weak",
      severity: "warning",
      key: "restDefenceWeak",
      dimension: "transition",
      reason: `Only a few players stay goal-side of the ball in the ${zoneById[ballZone].label.toLowerCase()} scenario — counter-attacks would face a disorganized recovery shape.`,
      playerIds: [],
    });
  }

  // --- Transition risk ---
  if (transition.riskLevel === "high" || transition.riskLevel === "very-high") {
    const attackDuties = outfield.filter((p) => p.duty === "attack").map((p) => p.id);
    warnings.push({
      id: "transition-risk-high",
      severity: transition.riskLevel === "very-high" ? "critical" : "warning",
      key: "transitionRiskHigh",
      params: { level: transition.riskLevel },
      dimension: "transition",
      reason: `Transition risk is ${transition.riskLevel.replace("-", " ")}: ${attackDuties.length} players carry the attack duty while defensive cover and rest defence are stretched.`,
      playerIds: attackDuties,
    });
  }

  // --- Zone overload ---
  for (const [zoneId, count] of Object.entries(zoneOccupancy)) {
    if (count >= ZONE_OCCUPANCY_THRESHOLDS.overload) {
      const zone = zoneById[zoneId as BallZoneId];
      const zonePlayers = movements
        .filter((m) => m.occupiedZones.includes(zoneId as BallZoneId))
        .map((m) => m.playerId);
      warnings.push({
        id: `zone-overload-${zoneId}`,
        severity: "warning",
        key: "zoneOverload",
        params: { zone: zone.label, count },
        dimension: "attack",
        reason: `${zone.label} is overloaded — ${count} players are expected to occupy similar spaces, reducing passing options and marking dynamics.`,
        playerIds: zonePlayers,
      });
    }
  }

  // --- Attacking width imbalance ---
  if (attack.width < 0.4) {
    warnings.push({
      id: "attack-width-weak",
      severity: "warning",
      key: "attackWidthWeak",
      dimension: "attack",
      reason: "Attacking width is weak — play becomes predictable through the middle without wide occupation stretching the defensive block.",
      playerIds: [],
    });
  }

  // --- Positive findings ---
  if (support.central > 0.6 && support.midfield > 0.6) {
    warnings.push({
      id: "central-support-strong",
      severity: "positive",
      key: "centralSupportStrong",
      dimension: "support",
      reason: "Strong central support — midfielders offer reliable close passing options around the ball.",
      playerIds: [],
    });
  }
  if (transition.riskLevel === "low") {
    warnings.push({
      id: "transition-risk-low",
      severity: "positive",
      key: "transitionRiskLow",
      dimension: "transition",
      reason: "Transition risk is low — the shape keeps enough responsible defenders behind the ball.",
      playerIds: [],
    });
  }

  const severityOrder = { critical: 0, warning: 1, positive: 2 };
  return warnings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}
