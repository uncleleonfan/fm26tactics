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
  /** Actual arrowhead length for this arrow (shrinks on short movements). */
  headLen: number;
}

/** Movements shorter than this are treated as holding position (no visual). */
export const MIN_MOVEMENT_DIST = 3;
/** Minimum visible arrow shaft kept between the node edge and ghost marker. */
const MIN_SHAFT = 1.5;

/** Dashed ghost marker radius at the expected position (see visualize-layer). */
export const GHOST_RADIUS = 2.2;
/** Gap kept between the arrowhead tip and the ghost marker edge. */
export const ARROW_GAP = 0.4;
/** Inviolable distance between the arrowhead tip and the target center. */
const TIP_CLEARANCE = GHOST_RADIUS + ARROW_GAP;
/** Arrowhead length bounds — the head shrinks before anything else gives way. */
export const HEAD_MAX = 2.2;
export const HEAD_MIN = 1.4;

/**
 * Clip an arrow from `from` to `to` so that the whole arrow — shaft plus
 * head — starts outside the player node and stops outside the ghost marker
 * (the tip never enters it). On short movements we degrade in priority
 * order: head length (HEAD_MAX → HEAD_MIN), start pad (→ 0), then shaft
 * length; if even the smallest head cannot clear the ghost marker the
 * movement is treated as a hold and null is returned.
 */
export function arrowGeometry(
  from: Point,
  to: Point,
  startPad = 4.2
): ArrowGeometry | null {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.hypot(dx, dy);
  if (dist < MIN_MOVEMENT_DIST) return null;
  if (dist < TIP_CLEARANCE + HEAD_MIN) return null;

  let headLen = HEAD_MAX;
  let sPad = startPad;
  if (dist < TIP_CLEARANCE + headLen + MIN_SHAFT + sPad) {
    headLen = Math.max(HEAD_MIN, dist - TIP_CLEARANCE - MIN_SHAFT - sPad);
  }
  if (dist < TIP_CLEARANCE + headLen + MIN_SHAFT + sPad) {
    sPad = Math.max(0, dist - TIP_CLEARANCE - headLen - MIN_SHAFT);
  }

  const ux = dx / dist;
  const uy = dy / dist;
  const endPad = TIP_CLEARANCE + headLen;
  return {
    x1: from.x + ux * sPad,
    y1: from.y + uy * sPad,
    x2: to.x - ux * endPad,
    y2: to.y - uy * endPad,
    angleDeg: (Math.atan2(dy, dx) * 180) / Math.PI,
    headLen,
  };
}
