import type { PlayerDuty, PlayerNode, TacticBoardState } from "@/types/tactic";

/** Version of the rule-based tactical model. Bump when data/rules change semantics. */
export const TACTICAL_MODEL_VERSION = "fm26-v1";

// ---------------------------------------------------------------------------
// Ball zones — 10 tactical zones the user can move the ball to
// ---------------------------------------------------------------------------

export type BallZoneId =
  | "defensive-third"
  | "left-build-up"
  | "central-build-up"
  | "right-build-up"
  | "left-midfield"
  | "central-midfield"
  | "right-midfield"
  | "left-final-third"
  | "central-final-third"
  | "right-final-third";

export interface ZoneDefinition {
  id: BallZoneId;
  /**
   * Normalized ball anchor point inside the zone.
   * Matches the existing board coordinates: x 0=left, 100=right;
   * y 100=own goal (GK at ~88), 0=opponent goal (ST at ~10).
   */
  x: number;
  y: number;
  /** Third of the pitch this zone belongs to. */
  third: "defensive" | "middle" | "attacking";
  /** Horizontal band of the zone. */
  band: "left" | "central" | "right";
  label: string;
}

// ---------------------------------------------------------------------------
// Movement & spatial results
// ---------------------------------------------------------------------------

export type MovementType =
  | "forward"
  | "backward"
  | "inside"
  | "outside"
  | "overlap"
  | "underlap"
  | "support"
  | "cover"
  | "press";

export interface Point {
  x: number;
  y: number;
}

export interface PlayerMovement {
  playerId: string;
  roleId: string;
  duty: PlayerDuty;
  basePosition: Point;
  expectedPosition: Point;
  movementVector: { dx: number; dy: number };
  movementType: MovementType;
  /** Zones this player is expected to occupy in the current ball scenario. */
  occupiedZones: BallZoneId[];
}

// ---------------------------------------------------------------------------
// Relationships
// ---------------------------------------------------------------------------

export type RelationshipType =
  | "support"
  | "overlap"
  | "underlap"
  | "creator-runner"
  | "cover"
  | "space-sharing"
  | "complementary";

export interface PlayerRelationship {
  playerA: string;
  playerB: string;
  type: RelationshipType;
  /** 0-1 normalized strength. */
  strength: number;
  /** Human-readable explanation key parts for i18n. */
  reason: string;
}

// ---------------------------------------------------------------------------
// Analysis scores
// ---------------------------------------------------------------------------

export type Rating = "strong" | "moderate" | "weak";

export interface AttackAnalysis {
  width: number;
  penetration: number;
  chanceCreation: number;
  finishing: number;
  centralPresence: number;
  finalThirdPresence: number;
  rating: Rating;
}

export interface SupportAnalysis {
  buildUp: number;
  midfield: number;
  wide: number;
  central: number;
  rating: Rating;
}

export interface DefenceAnalysis {
  coverage: number;
  centralProtection: number;
  wideProtection: number;
  restDefence: number;
  defensiveDepth: number;
  rating: Rating;
}

export type RiskLevel = "low" | "medium" | "high" | "very-high";

export interface TransitionAnalysis {
  counterPressing: number;
  recoveryStructure: number;
  riskScore: number;
  riskLevel: RiskLevel;
}

// ---------------------------------------------------------------------------
// Warnings & recommendations
// ---------------------------------------------------------------------------

export type WarningSeverity = "critical" | "warning" | "positive";

export interface TacticalWarning {
  id: string;
  severity: WarningSeverity;
  /** i18n message key suffix under `analysis.warnings.*`. */
  key: string;
  /** Structured params interpolated into the localized reason. */
  params?: Record<string, string | number>;
  /** Which analysis dimension this warning belongs to. */
  dimension: "attack" | "support" | "defence" | "transition";
  /** Full explainable reason — already composed params, rendered as default when no i18n. */
  reason: string;
  /** Player ids implicated in the warning. */
  playerIds: string[];
}

export interface AnalysisConstraints {
  /** Players whose role AND duty must never be changed by recommendations. */
  lockedPlayerIds: string[];
  /** Role categories excluded from modification (e.g. lock all attacking roles). */
  lockedCategories: Array<"goalkeeper" | "defender" | "midfielder" | "forward">;
}

export interface RecommendationImpact {
  attack: number;
  support: number;
  defence: number;
  risk: number;
}

export interface Recommendation {
  id: string;
  playerId: string;
  playerLabel: string;
  /** Change description, e.g. "WB(A) → FB(S)" or "DLP(D) → DLP(S)". */
  suggestedChange: string;
  /** Role to change to (same as current when only duty changes). */
  newRoleId: string;
  newDuty: PlayerDuty;
  problemKey: string;
  problemParams?: Record<string, string | number>;
  reasonKey: string;
  reasonParams?: Record<string, string | number>;
  impact: RecommendationImpact;
}

export interface BeforeAfterComparison {
  before: {
    attack: number;
    support: number;
    defence: number;
    riskScore: number;
    riskLevel: RiskLevel;
  };
  after: {
    attack: number;
    support: number;
    defence: number;
    riskScore: number;
    riskLevel: RiskLevel;
  };
  changedPlayers: Array<{
    player: PlayerNode;
    fromLabel: string;
    toLabel: string;
  }>;
}

// ---------------------------------------------------------------------------
// Top-level result
// ---------------------------------------------------------------------------

export interface AnalysisResult {
  modelVersion: string;
  attack: AttackAnalysis;
  support: SupportAnalysis;
  defence: DefenceAnalysis;
  transition: TransitionAnalysis;
  /** Per-player expected positions for the current ball zone. */
  movements: PlayerMovement[];
  relationships: PlayerRelationship[];
  warnings: TacticalWarning[];
  recommendations: Recommendation[];
  /** Per-zone expected occupancy counts for the current ball zone. */
  zoneOccupancy: Partial<Record<BallZoneId, number>>;
}

export type AnalyzeTactic = (
  state: TacticBoardState,
  ballZone: BallZoneId,
  constraints?: AnalysisConstraints
) => AnalysisResult;
