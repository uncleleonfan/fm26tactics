import type { PhasePlayerMap, PlayerNode } from "@/types/tactic";
import { playerRoles } from "@/lib/tactics-data";

/**
 * Approximate shape recognition: cluster outfield players into horizontal
 * lines by y-coordinate gaps and derive a "4-4-2"-style label.
 *
 * Coordinate system: y grows towards the own goal (GK y ≈ 88, striker y ≈ 12).
 * Results are approximations of the designed structure — they never claim
 * to predict FM engine behaviour.
 */

export interface ShapePoint {
  id: string;
  x: number;
  y: number;
  isGoalkeeper: boolean;
}

export interface ShapeLine {
  /** Players in this line. */
  count: number;
  /** Average y of the line (smaller = further up the pitch). */
  avgY: number;
  minY: number;
  maxY: number;
  playerIds: string[];
}

export interface ShapeResult {
  /** e.g. "4-4-2" (goalkeeper excluded), derived from line sizes. */
  label: string;
  /** Lines ordered back (defensive line) to front. */
  lines: ShapeLine[];
  goalkeeperId?: string;
  /** 0-1 — how tightly players cluster into the detected lines. */
  confidence: number;
  /** Horizontal span of the outfield block (0-100 scale). */
  width: number;
  /** Outfield players within |x - 50| <= 15. */
  centralPlayers: number;
  /** y of the deepest outfield line (smaller values = higher line). */
  lastLineY: number;
  /** y of the most advanced outfield line. */
  firstLineY: number;
}

/** y-gap above which two adjacent players form separate lines. */
const LINE_GAP_THRESHOLD = 8;

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function recognizeShape(points: ShapePoint[]): ShapeResult {
  const goalkeeper = points.find((p) => p.isGoalkeeper);
  const outfield = points
    .filter((p) => !p.isGoalkeeper)
    .slice()
    .sort((a, b) => a.y - b.y);

  // Cluster into lines by y-gap
  const clusters: ShapePoint[][] = [];
  for (const p of outfield) {
    const current = clusters[clusters.length - 1];
    if (current && p.y - current[current.length - 1].y <= LINE_GAP_THRESHOLD) {
      current.push(p);
    } else {
      clusters.push([p]);
    }
  }

  const lines: ShapeLine[] = clusters.map((cluster) => ({
    count: cluster.length,
    avgY: cluster.reduce((sum, p) => sum + p.y, 0) / cluster.length,
    minY: Math.min(...cluster.map((p) => p.y)),
    maxY: Math.max(...cluster.map((p) => p.y)),
    playerIds: cluster.map((p) => p.id),
  }));

  // Order back → front (defensive line first), matching "4-4-2" convention
  lines.sort((a, b) => b.avgY - a.avgY);

  const xs = outfield.map((p) => p.x);
  const width = xs.length ? Math.max(...xs) - Math.min(...xs) : 0;

  // Confidence: tight lines → high; spread-out lines → lower
  const avgSpread =
    lines.length > 0
      ? lines.reduce((sum, l) => sum + (l.maxY - l.minY), 0) / lines.length
      : 0;
  const confidence = clamp01(1 - avgSpread / 14) * 0.9 + 0.08;

  return {
    label: lines.map((l) => l.count).join("-") || "0",
    lines,
    goalkeeperId: goalkeeper?.id,
    confidence: Math.round(confidence * 100) / 100,
    width: Math.round(width * 10) / 10,
    centralPlayers: outfield.filter((p) => Math.abs(p.x - 50) <= 15).length,
    lastLineY: lines.length ? Math.round(lines[0].avgY) : 0,
    firstLineY: lines.length ? Math.round(lines[lines.length - 1].avgY) : 0,
  };
}

/** Adapt a phase of a board state into shape-recognition input points. */
export function toShapePoints(
  players: PlayerNode[],
  phaseMap: PhasePlayerMap | undefined
): ShapePoint[] {
  return players.map((p) => {
    const entry = phaseMap?.[p.id];
    const role = playerRoles.find((r) => r.id === p.roleId);
    return {
      id: p.id,
      x: entry ? entry.x : p.x,
      y: entry ? entry.y : p.y,
      isGoalkeeper: role?.category === "goalkeeper",
    };
  });
}

/** Convenience: recognize the shape of one phase of a board state. */
export function recognizePhaseShape(
  state: { players: PlayerNode[] },
  phaseMap: PhasePlayerMap | undefined
): ShapeResult {
  return recognizeShape(toShapePoints(state.players, phaseMap));
}
