import type { MovementType, Point } from "@/types/analysis";

/**
 * Movement arrow visualization mapping (spec §9/§15).
 * Direction = semantics, line style = phase (attack/support/defence).
 */

export interface ArrowStyle {
  /** Stroke color. */
  stroke: string;
  /** SVG dash pattern — solid for attacking runs, dashed otherwise. */
  dash: string;
  /** Human-readable movement label shown in tooltips. */
  labelKey: string;
}

export const MOVEMENT_STYLES: Record<MovementType, ArrowStyle> = {
  forward: { stroke: "#00E676", dash: "", labelKey: "movements.forward" },
  overlap: { stroke: "#00E676", dash: "", labelKey: "movements.overlap" },
  underlap: { stroke: "#00E676", dash: "", labelKey: "movements.underlap" },
  inside: { stroke: "#00E676", dash: "", labelKey: "movements.inside" },
  outside: { stroke: "#00E676", dash: "", labelKey: "movements.outside" },
  support: { stroke: "#FFB300", dash: "1.6,1.2", labelKey: "movements.support" },
  cover: { stroke: "#448AFF", dash: "1.6,1.2", labelKey: "movements.cover" },
  backward: { stroke: "#448AFF", dash: "1.6,1.2", labelKey: "movements.backward" },
  press: { stroke: "#FF5252", dash: "0.6,1", labelKey: "movements.press" },
};

export interface ArrowGeometry {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** Head rotation in degrees for a marker pointing along +x. */
  angleDeg: number;
}

/**
 * Clip an arrow from `from` to `to` so it starts outside the player node
 * (startPad) and ends just before the expected position (endPad).
 * Returns null when the movement is too short to visualize.
 */
export function arrowGeometry(
  from: Point,
  to: Point,
  startPad = 4.2,
  endPad = 3
): ArrowGeometry | null {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.hypot(dx, dy);
  if (dist < startPad + endPad + 0.8) return null;

  const ux = dx / dist;
  const uy = dy / dist;
  return {
    x1: from.x + ux * startPad,
    y1: from.y + uy * startPad,
    x2: to.x - ux * endPad,
    y2: to.y - uy * endPad,
    angleDeg: (Math.atan2(dy, dx) * 180) / Math.PI,
  };
}
