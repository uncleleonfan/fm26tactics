import type { BallZoneId, ZoneDefinition } from "@/types/analysis";

/**
 * 10 tactical ball zones (MVP scope).
 * Coordinates follow the existing board system: x 0=left → 100=right,
 * y 100=own goal → 0=opponent goal.
 */
export const ballZones: ZoneDefinition[] = [
  { id: "defensive-third", x: 50, y: 80, third: "defensive", band: "central", label: "Defensive Third" },
  { id: "left-build-up", x: 22, y: 66, third: "defensive", band: "left", label: "Left Build-up" },
  { id: "central-build-up", x: 50, y: 64, third: "defensive", band: "central", label: "Central Build-up" },
  { id: "right-build-up", x: 78, y: 66, third: "defensive", band: "right", label: "Right Build-up" },
  { id: "left-midfield", x: 22, y: 44, third: "middle", band: "left", label: "Left Midfield" },
  { id: "central-midfield", x: 50, y: 44, third: "middle", band: "central", label: "Central Midfield" },
  { id: "right-midfield", x: 78, y: 44, third: "middle", band: "right", label: "Right Midfield" },
  { id: "left-final-third", x: 22, y: 16, third: "attacking", band: "left", label: "Left Final Third" },
  { id: "central-final-third", x: 50, y: 14, third: "attacking", band: "central", label: "Central Final Third" },
  { id: "right-final-third", x: 78, y: 16, third: "attacking", band: "right", label: "Right Final Third" },
];

export const zoneById: Record<BallZoneId, ZoneDefinition> = Object.fromEntries(
  ballZones.map((z) => [z.id, z])
) as Record<BallZoneId, ZoneDefinition>;

export const DEFAULT_BALL_ZONE: BallZoneId = "central-midfield";

/** Vertical band edges (x) for assigning any pitch point to left/central/right. */
export const BAND_EDGES = { left: 34, right: 66 } as const;

/** Depth band edges (y): high y = deep, low y = advanced. */
export const THIRD_EDGES = { defensive: 58, attacking: 30 } as const;

/** Resolve which of the 10 zones a pitch point falls into (nearest zone wins). */
export function zoneAtPoint(x: number, y: number): BallZoneId {
  const band: ZoneDefinition["band"] = x < BAND_EDGES.left ? "left" : x > BAND_EDGES.right ? "right" : "central";
  const third: ZoneDefinition["third"] =
    y > THIRD_EDGES.defensive ? "defensive" : y < THIRD_EDGES.attacking ? "attacking" : "middle";
  if (third === "defensive") {
    // Collapse the three deep zones into their nearest anchor; defensive-third is central
    if (band === "central") return "defensive-third";
    return band === "left" ? "left-build-up" : "right-build-up";
  }
  if (third === "middle") {
    return band === "left" ? "left-midfield" : band === "right" ? "right-midfield" : "central-midfield";
  }
  return band === "left" ? "left-final-third" : band === "right" ? "right-final-third" : "central-final-third";
}

/** Occupancy thresholds — configurable per spec §12. */
export const ZONE_OCCUPANCY_THRESHOLDS = {
  /** Players expected in one zone before it counts as overloaded. */
  overload: 3,
  /** Zones with zero expected attacking presence are flagged as empty. */
  empty: 0,
} as const;
