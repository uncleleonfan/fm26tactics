import type { PhasePlayerMap, PlayerNode } from "@/types/tactic";
import { playerRoles } from "@/lib/tactics-data";
import type { PhaseFinding, PhaseMetrics } from "./phase-analysis";
import { computePhaseMetrics } from "./phase-analysis";

/**
 * Transition analysis: compares the two designed phases to estimate how
 * exposed the team is when possession changes hands. Explainable rule
 * combination — exposure (bodies committed forward), recovery distance
 * (possession → defence shift) and cover (bodies in the defensive third).
 */

export interface PlayerShift {
  playerId: string;
  /** Euclidean distance between the two phases. */
  distance: number;
  /** Positive = dropping back towards own goal when defending. */
  recoveryY: number;
}

export type TransitionRiskLevel = "low" | "moderate" | "high" | "very-high";

export interface TransitionResult {
  riskScore: number; // 0-1
  riskLevel: TransitionRiskLevel;
  possessionShapeLabel: string;
  defensiveShapeLabel: string;
  avgShift: number;
  biggestShifts: PlayerShift[];
  findings: PhaseFinding[];
}

function isGoalkeeper(p: PlayerNode): boolean {
  return playerRoles.find((r) => r.id === p.roleId)?.category === "goalkeeper";
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function riskLevelOf(score: number): TransitionRiskLevel {
  if (score >= 0.75) return "very-high";
  if (score >= 0.55) return "high";
  if (score >= 0.35) return "moderate";
  return "low";
}

export function computeTransition(
  players: PlayerNode[],
  phases: { "in-possession": PhasePlayerMap; "out-of-possession": PhasePlayerMap },
  possessionMetrics: PhaseMetrics
): TransitionResult {
  const shifts: PlayerShift[] = [];
  const outfield = players.filter((p) => !isGoalkeeper(p));

  for (const p of players) {
    const inPos = phases["in-possession"][p.id] ?? { x: p.x, y: p.y };
    const outPos = phases["out-of-possession"][p.id] ?? { x: p.x, y: p.y };
    const distance = Math.hypot(inPos.x - outPos.x, inPos.y - outPos.y);
    shifts.push({
      playerId: p.id,
      distance: Math.round(distance * 10) / 10,
      recoveryY: Math.round((outPos.y - inPos.y) * 10) / 10,
    });
  }

  const outfieldShifts = shifts.filter((s) =>
    outfield.some((p) => p.id === s.playerId)
  );
  const avgShift =
    outfieldShifts.length > 0
      ? outfieldShifts.reduce((sum, s) => sum + s.distance, 0) / outfieldShifts.length
      : 0;

  // Exposure: players committed to the final third while in possession
  const exposure = possessionMetrics.finalThirdCount / 10;
  // Recovery burden: how far the team must run to get into its defensive shape
  const recovery = clamp01(avgShift / 25);
  // Cover: bodies positioned in the defensive half of the defensive shape
  const defensiveOutfield = outfield.map((p) => {
    const entry = phases["out-of-possession"][p.id];
    return entry ? entry.y : p.y;
  });
  const cover =
    defensiveOutfield.length > 0
      ? defensiveOutfield.filter((y) => y >= 50).length / defensiveOutfield.length
      : 0;

  const riskScore = Math.round(
    clamp01(0.45 * exposure + 0.35 * recovery + 0.2 * (1 - cover)) * 100
  ) / 100;

  const biggestShifts = [...outfieldShifts]
    .sort((a, b) => b.distance - a.distance)
    .slice(0, 3);

  const findings: PhaseFinding[] = [];
  if (exposure >= 0.5) {
    findings.push({
      id: "transition-exposure",
      phase: "in-possession",
      severity: "warning",
      messageKey: "transitionExposure",
      values: { count: possessionMetrics.finalThirdCount },
      playerIds: [],
    });
  }
  if (avgShift >= 18) {
    findings.push({
      id: "long-recovery",
      phase: "out-of-possession",
      severity: "warning",
      messageKey: "longRecovery",
      values: { avg: Math.round(avgShift) },
      playerIds: biggestShifts.map((s) => s.playerId),
    });
  }
  if (cover < 0.5) {
    findings.push({
      id: "thin-cover",
      phase: "out-of-possession",
      severity: "info",
      messageKey: "thinCover",
      values: { count: Math.round(cover * 10) },
      playerIds: [],
    });
  }

  return {
    riskScore,
    riskLevel: riskLevelOf(riskScore),
    possessionShapeLabel: "",
    defensiveShapeLabel: "",
    avgShift: Math.round(avgShift * 10) / 10,
    biggestShifts,
    findings,
  };
}

/** Full transition result including shape labels for both phases. */
export function analyzeTransition(
  players: PlayerNode[],
  phases: { "in-possession": PhasePlayerMap; "out-of-possession": PhasePlayerMap }
): TransitionResult {
  const possessionMetrics = computePhaseMetrics(players, phases["in-possession"]);
  const result = computeTransition(players, phases, possessionMetrics);
  return {
    ...result,
    possessionShapeLabel: possessionMetrics.shape.label,
    defensiveShapeLabel: computePhaseMetrics(players, phases["out-of-possession"]).shape.label,
  };
}
