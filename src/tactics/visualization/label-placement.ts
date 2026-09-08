/**
 * Label auto-placement (rendering layer, no persistence).
 *
 * A role label defaults to above its node; when it would overlap another
 * player's node circle or an already-placed label box, we walk the candidate
 * order (below → left → right) and pick the first collision-free position
 * that stays inside the pitch bounds. Re-run on every render — pure function,
 * cheap for n=11 (O(n²)).
 */

export type LabelPlacement = "above" | "below" | "left" | "right";

export interface LabelAnchor {
  id: string;
  x: number;
  y: number;
  radius: number;
  labelWidth: number;
  /** Visualize mode, arrow pointing up: prefer below first so the label never covers the own arrow. */
  preferBelow?: boolean;
}

/** Label box height (matches the rect in player-node.tsx). */
export const LABEL_HEIGHT = 4.4;
/** Vertical gap between node edge and label box edge (offset = radius + this). */
export const LABEL_V_GAP = 3.5;
/** Horizontal gap between node edge and label box edge. */
export const LABEL_H_GAP = 1.2;
/** Labels must stay inside the pitch (0-100) with this margin. */
export const PITCH_MARGIN = 0.5;

/** Label box width for a role abbreviation (matches player-node.tsx). */
export function roleLabelWidth(abbr: string): number {
  return Math.max(abbr.length * 1.5 + 2, 5);
}

interface Rect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** Candidate label box for a given placement around the anchor. */
function labelRect(a: LabelAnchor, placement: LabelPlacement): Rect {
  const vOffset = a.radius + LABEL_V_GAP;
  const halfH = LABEL_HEIGHT / 2;
  const halfW = a.labelWidth / 2;
  switch (placement) {
    case "above":
      return { x1: a.x - halfW, y1: a.y - vOffset - halfH, x2: a.x + halfW, y2: a.y - vOffset + halfH };
    case "below":
      return { x1: a.x - halfW, y1: a.y + vOffset - halfH, x2: a.x + halfW, y2: a.y + vOffset + halfH };
    case "left":
      return { x1: a.x - a.radius - LABEL_H_GAP - a.labelWidth, y1: a.y - halfH, x2: a.x - a.radius - LABEL_H_GAP, y2: a.y + halfH };
    case "right":
      return { x1: a.x + a.radius + LABEL_H_GAP, y1: a.y - halfH, x2: a.x + a.radius + LABEL_H_GAP + a.labelWidth, y2: a.y + halfH };
  }
}

function inBounds(r: Rect): boolean {
  return r.x1 >= PITCH_MARGIN && r.y1 >= PITCH_MARGIN && r.x2 <= 100 - PITCH_MARGIN && r.y2 <= 100 - PITCH_MARGIN;
}

function rectsOverlap(a: Rect, b: Rect): boolean {
  return a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1;
}

/** Circle-rect intersection (closest-point clamp). */
function circleOverlapsRect(cx: number, cy: number, r: number, rect: Rect): boolean {
  const px = Math.max(rect.x1, Math.min(cx, rect.x2));
  const py = Math.max(rect.y1, Math.min(cy, rect.y2));
  const dx = cx - px;
  const dy = cy - py;
  return dx * dx + dy * dy < r * r;
}

function candidateOrder(preferBelow?: boolean): LabelPlacement[] {
  return preferBelow
    ? ["below", "above", "left", "right"]
    : ["above", "below", "left", "right"];
}

/**
 * Greedy placement: players are processed top-to-bottom (stable ordering by
 * anchor input order), each placed label becomes an obstacle for the rest.
 * When every candidate collides or leaves the pitch, fall back to the first
 * in-bounds candidate so the result stays deterministic and the label visible.
 */
export function computeLabelPlacements(anchors: LabelAnchor[]): Map<string, LabelPlacement> {
  const placements = new Map<string, LabelPlacement>();
  const placedRects: Array<{ anchorId: string; rect: Rect }> = [];

  for (const a of anchors) {
    const order = candidateOrder(a.preferBelow);
    let chosen: LabelPlacement | null = null;
    let fallback: LabelPlacement | null = null;

    for (const placement of order) {
      const rect = labelRect(a, placement);
      if (!inBounds(rect)) continue;
      if (fallback === null) fallback = placement;

      const collides =
        placedRects.some((p) => rectsOverlap(rect, p.rect)) ||
        anchors.some(
          (o) => o.id !== a.id && circleOverlapsRect(o.x, o.y, o.radius, rect)
        );
      if (!collides) {
        chosen = placement;
        break;
      }
    }

    // All candidates blocked: use the first in-bounds one (or the default).
    const finalPlacement = chosen ?? fallback ?? order[0];
    placements.set(a.id, finalPlacement);
    placedRects.push({ anchorId: a.id, rect: labelRect(a, finalPlacement) });
  }

  return placements;
}
