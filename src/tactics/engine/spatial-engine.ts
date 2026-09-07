import type { BallZoneId, MovementType, PlayerMovement, Point } from "@/types/analysis";
import { zoneById, zoneAtPoint, BAND_EDGES, THIRD_EDGES } from "@/tactics/data/zones";
import type { TacticalPlayer } from "@/tactics/engine/tactical-model";
import { horizontalBand } from "@/tactics/engine/tactical-model";

/**
 * Spatial engine — deterministic rules mapping ball zone + role behavior
 * to expected positions and movement vectors (spec §8-10).
 *
 * Coordinate system (matches the board): x 0=left → 100=right,
 * y 100=own goal → 0=opponent goal. Moving "forward" DECREASES y.
 */

interface SpatialContext {
  ballZone: BallZoneId;
  ball: Point;
  ballSide: "left" | "central" | "right";
  ballThird: "defensive" | "middle" | "attacking";
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/** Rule-based expected position for one player given ball context. */
function computeExpectedPosition(player: TacticalPlayer, ctx: SpatialContext): Point {
  const b = player.behavior;
  let { x, y } = player;

  const ballDistance = Math.hypot(x - ctx.ball.x, y - ctx.ball.y);
  const sameSide = horizontalBand(x) === ctx.ballSide;

  // --- Vertical (attacking/defending) adjustments ---
  // Base duty push: attacking players push up, defensive players hold.
  y -= (b.possession.attacking - 0.35) * 22;

  // Ball third shifts the whole shape.
  if (ctx.ballThird === "attacking") y -= 5;
  if (ctx.ballThird === "defensive") y += 5;

  // Forward runners go when the ball reaches midfield/final third.
  if (ctx.ballThird !== "defensive") y -= b.movement.forward * 12;

  // Defensive recovery when the ball is deep in our half.
  if (ctx.ballThird === "defensive") y += b.movement.backward * 10;

  // Overlap: attacking width run past the winger on the ball side.
  if (b.movement.overlap > 0.4 && sameSide && ctx.ballThird !== "defensive") {
    y -= b.movement.overlap * 14;
    x += (x < 50 ? -1 : 1) * b.movement.overlap * 6;
  }

  // --- Horizontal adjustments ---
  // Inside drift toward central/half-space corridors.
  if (b.movement.inside > 0.3) {
    const pull = b.movement.inside * 0.45;
    x = x + (50 - x) * pull;
  }

  // Outside width when ball is on the opposite flank (stretch play).
  if (b.movement.outside > 0.3 && !sameSide) {
    x += (x < 50 ? -1 : 1) * b.movement.outside * 7;
  }

  // Half-space occupation: attracted to x ≈ 28/72 corridors.
  if (b.movement.halfSpace > 0.5) {
    const target = x < 50 ? 28 : 72;
    x = x + (target - x) * (b.movement.halfSpace - 0.5) * 1.2;
  }

  // Underlap: diagonal run inside from wide, ahead of play.
  if (b.movement.underlap > 0.4 && sameSide && ctx.ballThird === "attacking") {
    x = x + (50 - x) * b.movement.underlap * 0.5;
    y -= b.movement.underlap * 8;
  }

  // Support: near-ball players offer themselves.
  if (ballDistance < 26) {
    const pull = b.possession.support * 0.18;
    x += (ctx.ball.x - x) * pull;
    y += (ctx.ball.y - y) * pull;
  }

  // Goalkeeper never crosses the halfway line.
  if (player.roleCategory === "goalkeeper") {
    y = clamp(y, 62, 96);
    x = clamp(x, 30, 70);
  }

  return { x: clamp(x, 2, 98), y: clamp(y, 3, 97) };
}

function classifyMovement(
  player: TacticalPlayer,
  base: Point,
  expected: Point,
  ctx: SpatialContext
): MovementType {
  const dx = expected.x - base.x;
  const dy = expected.y - base.y;
  const m = player.behavior.movement;
  const sameSide = horizontalBand(base.x) === ctx.ballSide;

  if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
    // Holding position — classify the hold.
    if (ctx.ballThird === "attacking" && m.forward > 0.6) return "press";
    if (ctx.ballThird === "defensive" && player.behavior.outOfPossession.defensiveResponsibility > 0.7) return "cover";
    return "support";
  }

  if (dy < -2.5) {
    // Advancing
    if (m.overlap > 0.4 && sameSide && Math.abs(dx) > 1) return "overlap";
    if (m.underlap > 0.5 && Math.abs(50 - expected.x) < Math.abs(50 - base.x)) return "underlap";
    return "forward";
  }

  if (dy > 2.5) {
    // Recovering
    if (player.behavior.outOfPossession.defensiveResponsibility > 0.6) return "cover";
    return "backward";
  }

  // Lateral dominant
  if (Math.abs(dx) >= 2.5) {
    if (m.overlap > 0.4 && sameSide) return "overlap";
    return expected.x < base.x ? (base.x > 50 ? "inside" : "outside") : base.x > 50 ? "outside" : "inside";
  }

  return "support";
}

export interface SpatialResult {
  movements: PlayerMovement[];
  zoneOccupancy: Partial<Record<BallZoneId, number>>;
}

export function computeSpatial(model: { players: TacticalPlayer[] }, ballZone: BallZoneId): SpatialResult {
  const zone = zoneById[ballZone];
  const ctx: SpatialContext = {
    ballZone,
    ball: { x: zone.x, y: zone.y },
    ballSide: zone.band === "central" ? "central" : zone.band,
    ballThird: zone.third,
  };

  const movements: PlayerMovement[] = model.players.map((player) => {
    const base = { x: player.x, y: player.y };
    const expected = computeExpectedPosition(player, ctx);
    const movementType = classifyMovement(player, base, expected, ctx);
    return {
      playerId: player.id,
      roleId: player.roleId,
      duty: player.duty,
      basePosition: base,
      expectedPosition: expected,
      movementVector: { dx: expected.x - base.x, dy: expected.y - base.y },
      movementType,
      occupiedZones: [zoneAtPoint(expected.x, expected.y)],
    };
  });

  const zoneOccupancy: Partial<Record<BallZoneId, number>> = {};
  for (const mv of movements) {
    for (const z of mv.occupiedZones) {
      zoneOccupancy[z] = (zoneOccupancy[z] ?? 0) + 1;
    }
  }

  return { movements, zoneOccupancy };
}

/** Counter-press potential: players within pressing reach of the ball zone. */
export function counterPressScore(players: TacticalPlayer[], movements: PlayerMovement[], ctx: SpatialContext): number {
  let score = 0;
  const posById = new Map(movements.map((m) => [m.playerId, m.expectedPosition]));
  for (const p of players) {
    const pos = posById.get(p.id);
    if (!pos) continue;
    const dist = Math.hypot(pos.x - ctx.ball.x, pos.y - ctx.ball.y);
    if (dist < 30) score += p.behavior.outOfPossession.pressing * (1 - dist / 30);
  }
  return clamp(score / 3.2, 0, 1); // ~3 active pressers at full intensity = 1.0
}

export function spatialContextFor(ballZone: BallZoneId): SpatialContext {
  const zone = zoneById[ballZone];
  return {
    ballZone,
    ball: { x: zone.x, y: zone.y },
    ballSide: zone.band === "central" ? "central" : zone.band,
    ballThird: zone.third,
  };
}

export { BAND_EDGES, THIRD_EDGES };
