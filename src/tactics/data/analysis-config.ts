/**
 * Analysis tuning parameters — all thresholds and weights live here (spec §12/§16).
 * The engines never hardcode these numbers.
 */
import type { Mentality } from "@/types/tactic";

/**
 * FM26 mentality ladder: the 7 in-game mindsets mapped to a symmetric push
 * factor (-1 very-defensive … 0 balanced … +1 very-attacking).
 */
export const MENTALITY_FACTORS: Record<Mentality, number> = {
  "very-defensive": -1,
  defensive: -0.66,
  cautious: -0.33,
  balanced: 0,
  positive: 0.33,
  attacking: 0.66,
  "very-attacking": 1,
};

/** How strongly mentality scales the spatial engine's vertical adjustments. */
export const MENTALITY_PUSH = {
  /** Duty-based attacking push amplification (±40% at the extremes). */
  attack: 0.4,
  /** Forward-run amplification when the ball is advanced. */
  runs: 0.25,
  /** Defensive-recovery amplification (defensive mindsets recover harder). */
  recovery: 0.2,
} as const;

/** Resolve a mentality string to its factor; unknown values degrade to balanced. */
export function mentalityFactor(mentality: string): number {
  return MENTALITY_FACTORS[mentality as Mentality] ?? 0;
}

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
  /** Symmetric mindset exposure: attacking mentalities add risk, defensive reduce it. */
  mentalityExposure: 1.2,
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
