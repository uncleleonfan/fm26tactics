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

export interface TacticBoardState {
  formation: FormationType;
  players: PlayerNode[];
  teamInstructions: TeamInstruction;
}

export interface FormationPreset {
  formation: FormationType;
  label: string;
  positions: Array<{ x: number; y: number }>;
  description: string;
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
