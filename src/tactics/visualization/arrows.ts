import type { MovementType, Point, RelationshipType } from "@/types/analysis";

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

/**
 * Relationship link visualization (spec §11/§17).
 * Color = combination phase, dash = solidity of the partnership;
 * space-sharing is the only hostile (red) link type.
 */
export const RELATION_STYLES: Record<
  RelationshipType,
  { stroke: string; dash: string; labelKey: string }
> = {
  support: { stroke: "#FFB300", dash: "0.8,1.2", labelKey: "relations.support" },
  complementary: { stroke: "#FFB300", dash: "0.8,1.2", labelKey: "relations.complementary" },
  overlap: { stroke: "#00E676", dash: "", labelKey: "relations.overlap" },
  underlap: { stroke: "#00E676", dash: "", labelKey: "relations.underlap" },
  "creator-runner": { stroke: "#00E676", dash: "", labelKey: "relations.creatorRunner" },
  cover: { stroke: "#448AFF", dash: "0.8,1.2", labelKey: "relations.cover" },
  "space-sharing": { stroke: "#FF5252", dash: "0.5,0.9", labelKey: "relations.spaceSharing" },
};

/** Relations weaker than this stay hidden to keep the overlay readable. */
export const RELATION_VISIBILITY_THRESHOLD = 0.45;

export interface ArrowGeometry {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** Head rotation in degrees for a marker pointing along +x. */
  angleDeg: number;
}

/** Movements shorter than this are treated as holding position (no visual). */
export const MIN_MOVEMENT_DIST = 3;
/** Minimum visible arrow shaft kept between the node edge and ghost marker. */
const MIN_SHAFT = 1.5;

/**
 * Clip an arrow from `from` to `to` so it starts outside the player node
 * (startPad) and ends just before the expected position (endPad).
 * For shorter movements both pads shrink proportionally so the arrow keeps a
 * visible shaft instead of vanishing between node and ghost marker.
 * Returns null when the movement is a hold (dist < MIN_MOVEMENT_DIST).
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
  if (dist < MIN_MOVEMENT_DIST) return null;

  const padScale = Math.min(1, (dist - MIN_SHAFT) / (startPad + endPad));
  const sPad = startPad * padScale;
  const ePad = endPad * padScale;

  const ux = dx / dist;
  const uy = dy / dist;
  return {
    x1: from.x + ux * sPad,
    y1: from.y + uy * sPad,
    x2: to.x - ux * ePad,
    y2: to.y - uy * ePad,
    angleDeg: (Math.atan2(dy, dx) * 180) / Math.PI,
  };
}
