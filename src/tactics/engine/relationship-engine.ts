import type { PlayerRelationship, RelationshipType } from "@/types/analysis";
import { RELATIONSHIP_RULES as R } from "@/tactics/data/relationship-rules";
import type { TacticalPlayer } from "@/tactics/engine/tactical-model";
import { horizontalBand } from "@/tactics/engine/tactical-model";
import type { PlayerMovement } from "@/types/analysis";

/**
 * Relationship engine — identifies tactical partnerships and conflicts
 * from role behaviors and expected positions (spec §13).
 */

function dist(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

const RULE_KEY: Record<RelationshipType, keyof typeof R> = {
  overlap: "overlap",
  underlap: "underlap",
  "creator-runner": "creatorRunner",
  cover: "cover",
  "space-sharing": "spaceSharing",
  support: "support",
  complementary: "support",
};

function make(
  a: TacticalPlayer,
  b: TacticalPlayer,
  type: RelationshipType,
  strength: number,
  reason: string
): PlayerRelationship | null {
  if (strength < R[RULE_KEY[type]].minStrength) return null;
  return { playerA: a.id, playerB: b.id, type, strength: Math.min(1, strength), reason };
}

export function detectRelationships(
  players: TacticalPlayer[],
  movements: PlayerMovement[]
): PlayerRelationship[] {
  const posById = new Map(movements.map((m) => [m.playerId, m.expectedPosition]));
  const results: PlayerRelationship[] = [];
  const seen = new Set<string>();

  const pairKey = (a: string, b: string) => [a, b].sort().join("|");

  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const a = players[i];
      const b = players[j];
      const pa = posById.get(a.id)!;
      const pb = posById.get(b.id)!;
      const d = dist(pa, pb);
      const key = pairKey(a.id, b.id);
      if (seen.has(key)) continue;

      // --- Overlap: aggressive wide runner + inside-cutting partner on same flank ---
      const sameFlank =
        horizontalBand(a.x) === horizontalBand(b.x) && horizontalBand(a.x) !== "central" && d < R.overlap.sameFlankDistance;
      if (sameFlank) {
        const [runner, cutter] =
          a.behavior.movement.overlap >= b.behavior.movement.overlap ? [a, b] : [b, a];
        if (
          runner.behavior.movement.overlap > R.overlap.overlapTendency &&
          cutter.behavior.movement.inside > R.overlap.partnerInsideDrift
        ) {
          const strength =
            (runner.behavior.movement.overlap + cutter.behavior.movement.inside) / 2;
          const rel = make(runner, cutter, "overlap", strength, `${runner.label} overlaps while ${cutter.label} cuts inside`);
          if (rel) {
            results.push(rel);
            seen.add(key);
            continue;
          }
        }
        // --- Underlap: inside runner + width-holding partner ---
        const [inner, wideHolder] =
          a.behavior.movement.underlap >= b.behavior.movement.underlap ? [a, b] : [b, a];
        if (
          inner.behavior.movement.underlap > R.underlap.underlapTendency &&
          wideHolder.behavior.possession.width > R.underlap.partnerWidthHold
        ) {
          const strength =
            (inner.behavior.movement.underlap + wideHolder.behavior.possession.width) / 2;
          const rel = make(inner, wideHolder, "underlap", strength, `${inner.label} underlaps while ${wideHolder.label} holds width`);
          if (rel) {
            results.push(rel);
            seen.add(key);
            continue;
          }
        }
      }

      // --- Creator ↔ runner ---
      {
        const [creator, runner] =
          a.behavior.possession.chanceCreation >= b.behavior.possession.chanceCreation ? [a, b] : [b, a];
        if (
          creator.behavior.possession.chanceCreation > R.creatorRunner.creation &&
          runner.behavior.possession.penetration > R.creatorRunner.penetration &&
          d < R.creatorRunner.maxDistance
        ) {
          const strength =
            (creator.behavior.possession.chanceCreation + runner.behavior.possession.penetration) / 2;
          const rel = make(creator, runner, "creator-runner", strength, `${creator.label} creates for runner ${runner.label}`);
          if (rel) {
            results.push(rel);
            seen.add(key);
            continue;
          }
        }
      }

      // --- Defensive cover partnership ---
      if (
        d < R.cover.adjacency &&
        a.behavior.outOfPossession.defensiveResponsibility > R.cover.defensiveResponsibility &&
        b.behavior.outOfPossession.defensiveResponsibility > R.cover.defensiveResponsibility
      ) {
        const strength =
          (a.behavior.outOfPossession.defensiveResponsibility + b.behavior.outOfPossession.defensiveResponsibility) / 2;
        const rel = make(a, b, "cover", strength, `${a.label} and ${b.label} provide mutual defensive cover`);
        if (rel) {
          results.push(rel);
          seen.add(key);
          continue;
        }
      }

      // --- Space sharing (conflict) ---
      if (
        d < R.spaceSharing.conflictDistance &&
        a.behavior.possession.attacking > R.spaceSharing.attacking &&
        b.behavior.possession.attacking > R.spaceSharing.attacking
      ) {
        // Inside the conflict radius the relationship is always significant;
        // distance only modulates how severe the overlap is.
        const strength =
          0.4 + 0.6 * (1 - d / R.spaceSharing.conflictDistance);
        const rel = make(a, b, "space-sharing", strength, `${a.label} and ${b.label} are expected to occupy the same space`);
        if (rel) {
          results.push(rel);
          seen.add(key);
          continue;
        }
      }

      // --- Generic support ---
      {
        const combined = a.behavior.possession.support + b.behavior.possession.support;
        if (d < R.support.nearDistance && combined > R.support.combinedSupport) {
          const strength = combined / 2 * (1 - d / (R.support.nearDistance * 2));
          const rel = make(a, b, "support", strength, `${a.label} and ${b.label} offer close support`);
          if (rel) {
            results.push(rel);
            seen.add(key);
          }
        }
      }
    }
  }

  // Sort: conflicts and partnerships first, then by strength.
  const typeWeight: Record<RelationshipType, number> = {
    "space-sharing": 0,
    overlap: 1,
    underlap: 1,
    "creator-runner": 2,
    cover: 3,
    support: 4,
    complementary: 5,
  };
  return results.sort(
    (x, y) => typeWeight[x.type] - typeWeight[y.type] || y.strength - x.strength
  );
}
