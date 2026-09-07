/**
 * Relationship detection rules — data-driven thresholds (spec §13).
 * Engines read these; no behavior is hardcoded in engine code.
 */

export const RELATIONSHIP_RULES = {
  overlap: {
    /** Wide defender's overlap tendency must exceed this. */
    overlapTendency: 0.4,
    /** Partner wide attacker's inside drift must exceed this. */
    partnerInsideDrift: 0.6,
    /** Max horizontal distance to be considered same-flank partners. */
    sameFlankDistance: 34,
    minStrength: 0.3,
  },
  underlap: {
    underlapTendency: 0.4,
    partnerWidthHold: 0.5,
    sameFlankDistance: 34,
    minStrength: 0.3,
  },
  creatorRunner: {
    /** Creator's chance creation threshold. */
    creation: 0.6,
    /** Runner's penetration threshold. */
    penetration: 0.5,
    /** Max distance between creator and runner. */
    maxDistance: 45,
    minStrength: 0.3,
  },
  cover: {
    /** Both players need this defensive responsibility. */
    defensiveResponsibility: 0.6,
    /** Vertical/horizontal adjacency distance. */
    adjacency: 26,
    minStrength: 0.3,
  },
  spaceSharing: {
    /**
     * Expected positions closer than this = shared space (potential conflict).
     * ~15 ≈ half-space-to-central channel width; front-line players in a
     * properly spread shape keep ≥ 20 between each other (5-channel grid).
     */
    conflictDistance: 15,
    /** Both must be this attacking-minded. */
    attacking: 0.55,
    minStrength: 0.4,
  },
  support: {
    /** Passing-lane distance band for support partnerships. */
    nearDistance: 30,
    /** Minimum combined support attribute. */
    combinedSupport: 1.0,
    minStrength: 0.35,
  },
} as const;
