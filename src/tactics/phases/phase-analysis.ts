import type { PhasePlayerMap, PhaseType, PlayerNode } from "@/types/tactic";
import { playerRoles } from "@/lib/tactics-data";
import { recognizeShape, type ShapeResult, type ShapePoint } from "./shape-recognition";

/**
 * Per-phase metrics & findings. All rules are explainable heuristics over
 * the designed phase coordinates — no black-box scoring.
 *
 * Coordinate system: y grows towards the own goal (GK ≈ 88, striker ≈ 12).
 */

export interface PhaseMetrics {
  shape: ShapeResult;
  /** Outfield players positioned in the final third (y <= 33). */
  finalThirdCount: number;
  /** Outfield players behind the halfway-ish line (y >= 58) — rest defence. */
  restDefenceCount: number;
  /** Outfield players in/around the box (y <= 25, 20 <= x <= 80). */
  boxPresence: number;
  /** Average vertical gap between consecutive lines. */
  avgLineSpread: number;
  /** Players in the most advanced line (press line size). */
  pressLineCount: number;
}

export interface PhaseFinding {
  id: string;
  phase: PhaseType;
  severity: "info" | "warning";
  /** i18n key under the phaseAnalysis namespace. */
  messageKey: string;
  /** Values interpolated into the translated message. */
  values?: Record<string, string | number>;
  playerIds: string[];
}

function isGoalkeeper(p: PlayerNode): boolean {
  return playerRoles.find((r) => r.id === p.roleId)?.category === "goalkeeper";
}

function resolvePoints(
  players: PlayerNode[],
  phaseMap: PhasePlayerMap | undefined
): ShapePoint[] {
  return players.map((p) => {
    const entry = phaseMap?.[p.id];
    return {
      id: p.id,
      x: entry ? entry.x : p.x,
      y: entry ? entry.y : p.y,
      isGoalkeeper: isGoalkeeper(p),
    };
  });
}

export function computePhaseMetrics(
  players: PlayerNode[],
  phaseMap: PhasePlayerMap | undefined
): PhaseMetrics {
  const points = resolvePoints(players, phaseMap);
  const shape = recognizeShape(points);
  const outfield = points.filter((p) => !p.isGoalkeeper);

  const finalThirdCount = outfield.filter((p) => p.y <= 33).length;
  const restDefenceCount = outfield.filter((p) => p.y >= 58).length;
  const boxPresence = outfield.filter(
    (p) => p.y <= 25 && p.x >= 20 && p.x <= 80
  ).length;

  const spreads: number[] = [];
  for (let i = 0; i < shape.lines.length - 1; i++) {
    spreads.push(Math.abs(shape.lines[i].avgY - shape.lines[i + 1].avgY));
  }
  const avgLineSpread =
    spreads.length > 0
      ? spreads.reduce((a, b) => a + b, 0) / spreads.length
      : 0;

  const pressLine = shape.lines[shape.lines.length - 1];

  return {
    shape,
    finalThirdCount,
    restDefenceCount,
    boxPresence,
    avgLineSpread: Math.round(avgLineSpread * 10) / 10,
    pressLineCount: pressLine ? pressLine.count : 0,
  };
}

/**
 * Explainable findings for one phase. Possession findings focus on width,
 * rest defence and support; defensive findings on block compactness,
 * line spacing and press structure.
 */
export function computePhaseFindings(
  metrics: PhaseMetrics,
  phase: PhaseType,
  players: PlayerNode[],
  phaseMap: PhasePlayerMap | undefined
): PhaseFinding[] {
  const findings: PhaseFinding[] = [];
  const points = resolvePoints(players, phaseMap);
  const outfield = points.filter((p) => !p.isGoalkeeper);

  if (phase === "in-possession") {
    // Width: someone must hold the touchline on both sides
    const leftMost = Math.min(...outfield.map((p) => p.x));
    const rightMost = Math.max(...outfield.map((p) => p.x));
    if (leftMost > 22 || rightMost < 78) {
      findings.push({
        id: "narrow-width",
        phase,
        severity: "warning",
        messageKey: "narrowWidth",
        values: { left: Math.round(leftMost), right: Math.round(rightMost) },
        playerIds: outfield
          .filter((p) => p.x === leftMost || p.x === rightMost)
          .map((p) => p.id),
      });
    }

    // Rest defence: keep enough bodies behind the ball while attacking
    if (metrics.restDefenceCount <= 2) {
      findings.push({
        id: "weak-rest-defence",
        phase,
        severity: "warning",
        messageKey: "weakRestDefence",
        values: { count: metrics.restDefenceCount },
        playerIds: outfield.filter((p) => p.y <= 45).map((p) => p.id),
      });
    }

    // Central overload with no wide pull-out
    if (metrics.shape.centralPlayers >= 6) {
      findings.push({
        id: "central-overload",
        phase,
        severity: "info",
        messageKey: "centralOverload",
        values: { count: metrics.shape.centralPlayers },
        playerIds: outfield
          .filter((p) => Math.abs(p.x - 50) <= 15)
          .map((p) => p.id),
      });
    }

    // Front-line isolation: two or fewer advanced players
    if (metrics.finalThirdCount <= 1) {
      findings.push({
        id: "isolated-attack",
        phase,
        severity: "info",
        messageKey: "isolatedAttack",
        values: { count: metrics.finalThirdCount },
        playerIds: outfield.filter((p) => p.y <= 33).map((p) => p.id),
      });
    }
  } else {
    // Out of possession: pressing structure
    if (metrics.pressLineCount <= 1) {
      findings.push({
        id: "isolated-presser",
        phase,
        severity: "warning",
        messageKey: "isolatedPresser",
        values: { count: metrics.pressLineCount },
        playerIds: metrics.shape.lines[metrics.shape.lines.length - 1]?.playerIds ?? [],
      });
    }

    // Vertical compactness between lines
    if (metrics.avgLineSpread > 20) {
      findings.push({
        id: "gap-between-lines",
        phase,
        severity: "warning",
        messageKey: "gapBetweenLines",
        values: { gap: Math.round(metrics.avgLineSpread) },
        playerIds: [],
      });
    }

    // Defensive block width
    if (metrics.shape.width < 45) {
      findings.push({
        id: "narrow-block",
        phase,
        severity: "warning",
        messageKey: "narrowBlock",
        values: { width: Math.round(metrics.shape.width) },
        playerIds: [],
      });
    }

    // Block height descriptors (context, not necessarily a flaw)
    const firstLineY = metrics.shape.firstLineY;
    if (firstLineY < 25) {
      findings.push({
        id: "high-press",
        phase,
        severity: "info",
        messageKey: "highPress",
        values: { y: firstLineY },
        playerIds: metrics.shape.lines[metrics.shape.lines.length - 1]?.playerIds ?? [],
      });
    } else if (firstLineY > 45) {
      findings.push({
        id: "deep-block",
        phase,
        severity: "info",
        messageKey: "deepBlock",
        values: { y: firstLineY },
        playerIds: metrics.shape.lines[metrics.shape.lines.length - 1]?.playerIds ?? [],
      });
    }
  }

  return findings;
}
