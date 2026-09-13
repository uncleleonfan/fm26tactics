export type FormationType =
  | "4-2-3-1" | "4-3-3" | "4-4-2" | "3-5-2" | "5-3-2"
  | "4-2-2-2" | "4-1-4-1" | "3-4-3" | "4-4-1-1" | "5-2-3"
  | "4-2-4" | "3-4-2-1" | "4-3-2-1" | "4-1-2-1-2";

export type PlayStyle =
  | "gegenpress" | "tiki-taka" | "counter-attack"
  | "wing-play" | "route-one" | "fluid" | "fluid-counter-attack"
  | "park-the-bus" | "control-possession";

export type Mentality =
  | "very-defensive" | "defensive" | "cautious"
  | "balanced" | "positive" | "attacking" | "very-attacking";

export type PlayerDuty = "defend" | "support" | "attack";

export type PlayerRoleCategory = "goalkeeper" | "defender" | "midfielder" | "forward";

export interface PlayerRoleData {
  id: string;
  name: string;
  /** Standard FM-style abbreviation shown on pitch tokens (GK, BPD, DLP...). */
  abbr: string;
  category: PlayerRoleCategory;
  availableDuties: PlayerDuty[];
  keyAttributes: string[];
  description: string;
  bestFormations: FormationType[];
}

export interface PlayerNode {
  id: string;
  x: number;
  y: number;
  roleId: string;
  duty: PlayerDuty;
  individualInstructions: string[];
}

export interface TeamInstruction {
  mentality: Mentality;
  inPossession: string[];
  inTransition: string[];
  outOfPossession: string[];
}

/** The two phases of play a tactic can be designed in. */
export type PhaseType = "in-possession" | "out-of-possession";

/** Tactical-intent movement markers for a player within a phase. */
export type MovementType =
  | "forward"
  | "backward"
  | "inside"
  | "outside"
  | "press"
  | "cover";

export interface PlayerMovement {
  type: MovementType;
  /** Optional explicit arrow endpoint; defaults to a direction-derived offset. */
  targetX?: number;
  targetY?: number;
}

/** Per-phase position (and intent arrow) of a single player. */
export interface PhasePlayer {
  x: number;
  y: number;
  movement?: PlayerMovement;
}

export type PhasePlayerMap = Record<string, PhasePlayer>;

export interface TacticPhases {
  "in-possession": PhasePlayerMap;
  "out-of-possession": PhasePlayerMap;
}

export interface TacticBoardState {
  formation: FormationType;
  players: PlayerNode[];
  teamInstructions: TeamInstruction;
  /**
   * Per-phase player positions & movement arrows. Optional so legacy tactic
   * data (shared links, drafts, JSON imports) stays valid — it is migrated
   * on load by duplicating the base positions into both phases.
   */
  phases?: TacticPhases;
}

export interface FormationPreset {
  formation: FormationType;
  label: string;
  positions: Array<{ x: number; y: number }>;
  description: string;
  /**
   * Default XI roles/duties, same order as `positions` — transcribed from the
   * formation's deep-dive tactic article (content/tactics/*.mdx `setup`) so
   * the builder opens with the exact roles the article documents.
   */
  defaultRoles?: Array<{ roleId: string; duty: PlayerDuty }>;
}

export interface TacticMeta {
  title: string;
  slug: string;
  formation: FormationType;
  style: PlayStyle;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  excerpt: string;
  coverImage?: string;
}

export interface RoleDictEntry {
  id: string;
  name: string;
  category: string;
  duties: PlayerDuty[];
  keyAttributes: string[];
  suitableFormations: FormationType[];
  description: string;
  icon?: string;
}

export interface GuideMeta {
  title: string;
  slug: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  publishedAt: string;
  description: string;
  coverImage?: string;
}
