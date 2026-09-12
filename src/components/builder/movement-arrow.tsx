import type { MovementType, PhaseType, PlayerMovement } from "@/types/tactic";

/**
 * Tactical-intent movement arrow rendered on the pitch SVG. Arrows are
 * design markers (forward runs, pressing triggers...), not trajectory
 * simulations — direction is derived from the movement type unless an
 * explicit target point is provided.
 */

const ARROW_LENGTH = 8;
const START_GAP = 4.2; // clears the player token (r ≈ 3.2) + glow
const CURVATURE = 1.6;

const PHASE_COLOR: Record<PhaseType, string> = {
  "in-possession": "#00E676",
  "out-of-possession": "#448AFF",
};

/** Unit direction vector for a movement type at a given pitch position. */
function movementDirection(type: MovementType, x: number): { dx: number; dy: number } {
  switch (type) {
    case "forward":
    case "press":
      return { dx: 0, dy: -1 };
    case "backward":
    case "cover":
      return { dx: 0, dy: 1 };
    case "inside": {
      const side = x < 50 ? 1 : -1;
      return Math.abs(x - 50) < 4 ? { dx: 0, dy: -1 } : { dx: side, dy: 0 };
    }
    case "outside": {
      const side = x < 50 ? -1 : 1;
      return Math.abs(x - 50) < 4 ? { dx: 0, dy: -1 } : { dx: side, dy: 0 };
    }
  }
}

interface MovementArrowProps {
  x: number;
  y: number;
  movement: PlayerMovement;
  phase: PhaseType;
}

export function MovementArrow({ x, y, movement, phase }: MovementArrowProps) {
  const color = PHASE_COLOR[phase];
  const hasTarget =
    typeof movement.targetX === "number" && typeof movement.targetY === "number";

  let endX: number;
  let endY: number;
  let dirX: number;
  let dirY: number;

  if (hasTarget) {
    endX = movement.targetX!;
    endY = movement.targetY!;
    const dLen = Math.hypot(endX - x, endY - y) || 1;
    dirX = (endX - x) / dLen;
    dirY = (endY - y) / dLen;
  } else {
    const dir = movementDirection(movement.type, x);
    dirX = dir.dx;
    dirY = dir.dy;
    endX = x + dirX * (START_GAP + ARROW_LENGTH);
    endY = y + dirY * (START_GAP + ARROW_LENGTH);
  }

  const startX = x + dirX * START_GAP;
  const startY = y + dirY * START_GAP;

  // Curve control point — perpendicular offset from the midpoint
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  const ctrlX = midX - dirY * CURVATURE;
  const ctrlY = midY + dirX * CURVATURE;

  // Arrowhead triangle at the end point
  const headLen = 2.4;
  const headWidth = 1.6;
  const tipX = endX + dirX * headLen;
  const tipY = endY + dirY * headLen;
  const baseLX = endX - dirY * headWidth / 2;
  const baseLY = endY + dirX * headWidth / 2;
  const baseRX = endX + dirY * headWidth / 2;
  const baseRY = endY - dirX * headWidth / 2;

  const isCover = movement.type === "cover";
  const isPress = movement.type === "press";

  return (
    <g pointerEvents="none" opacity="0.9">
      <path
        d={`M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`}
        fill="none"
        stroke={color}
        strokeWidth={isPress ? "0.6" : "0.45"}
        strokeDasharray={isPress ? undefined : "1.5,1.2"}
        strokeLinecap="round"
      />
      {isCover ? (
        // Hollow arrowhead for covering movement
        <polygon
          points={`${tipX},${tipY} ${baseLX},${baseLY} ${baseRX},${baseRY}`}
          fill="#0A0E17"
          stroke={color}
          strokeWidth="0.4"
        />
      ) : (
        <polygon
          points={`${tipX},${tipY} ${baseLX},${baseLY} ${baseRX},${baseRY}`}
          fill={color}
        />
      )}
    </g>
  );
}

/** Compact label for a movement type, used in chips and exports. */
export const MOVEMENT_LABELS: Record<MovementType, string> = {
  forward: "Forward",
  backward: "Backward",
  inside: "Inside",
  outside: "Outside",
  press: "Press",
  cover: "Cover",
};
