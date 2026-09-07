/**
 * Analysis tuning parameters — all thresholds and weights live here (spec §12/§16).
 * The engines never hardcode these numbers.
 */

export const RATING_THRESHOLDS = {
  /** Aggregate score below this → "weak". */
  weak: 0.4,
  /** Aggregate score below this → "moderate". */
  moderate: 0.62,
  /** At or above → "strong". */
  strong: 0.62,
} as const;

export const RISK_LEVELS = {
  low: 0.35,
  medium: 0.55,
  high: 0.75,
  /** Above high threshold → "very-high". */
  veryHigh: 0.75,
} as const;

/** Transition risk scoring weights (spec §16 — tuned, not blindly applied). */
export const RISK_WEIGHTS = {
  /** Weight per attack-duty outfield player (normalized). */
  attackDuty: 1.6,
  /** Extra weight for attack-duty wide defenders (WB/FB/PWB-A). */
  aggressiveWide: 2.2,
  /** Weight for low-rest-defence shapes (few players behind the ball line). */
  poorRestDefence: 1.5,
  /** Weight for weak central protective cover. */
  weakCentralCover: 1.8,
  /** Weight for weak counter-pressing structure. */
  weakCounterPress: 0.8,
  /** Attacking overload in one zone amplifies turnover exposure. */
  zoneOverload: 0.6,
  /** Divisor normalizing the 11-player aggregate to 0-1. */
  normalizer: 10,
} as const;

/** Balance-engine aggregation weights. */
export const BALANCE_WEIGHTS = {
  attack: { width: .16, penetration: .2, chanceCreation: .2, finishing: .18, centralPresence: .12, finalThirdPresence: .14 },
  support: { buildUp: .3, midfield: .3, wide: .2, central: .2 },
  defence: { coverage: .25, centralProtection: .25, wideProtection: .2, restDefence: .2, defensiveDepth: .1 },
} as const;

/** Rest defence: how many outfield players must hold positions behind the ball. */
export const REST_DEFENCE = {
  /** Minimum deep + responsible players for a "strong" rest defence. */
  strong: 4,
  moderate: 3,
} as const;

/** Final-third presence: outfield players expected to reach the final third. */
export const FINAL_THIRD = {
  strong: 5,
  moderate: 3,
} as const;
