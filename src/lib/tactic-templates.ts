import type { FormationType, Mentality, PlayStyle, PlayerDuty } from "@/types/tactic";

export interface TacticTemplate {
  id: string;
  name: string;
  style: PlayStyle;
  description: string;
  formation: FormationType;
  /** roleId + duty for each player index (index 0 = GK, follows formation preset order) */
  roleAssignments: { roleId: string; duty: PlayerDuty }[];
  mentality: Mentality;
  inPossession: string[];
  inTransition: string[];
  outOfPossession: string[];
}

export const tacticTemplates: TacticTemplate[] = [
  {
    id: "gegenpress-4-3-3",
    name: "Gegenpress 4-3-3",
    style: "gegenpress",
    description: "High-pressing, relentless attacking. The community meta for winning back the ball fast and overwhelming opponents.",
    formation: "4-3-3",
    roleAssignments: [
      { roleId: "sweeper-keeper", duty: "support" },
      { roleId: "full-back", duty: "attack" },
      { roleId: "full-back", duty: "attack" },
      { roleId: "ball-playing-defender", duty: "defend" },
      { roleId: "inside-forward", duty: "attack" },
      { roleId: "box-to-box-midfielder", duty: "support" },
      { roleId: "box-to-box-midfielder", duty: "support" },
      { roleId: "inside-forward", duty: "attack" },
      { roleId: "advanced-forward", duty: "attack" },
      { roleId: "pressing-forward", duty: "attack" },
      { roleId: "advanced-forward", duty: "attack" },
    ],
    mentality: "attacking",
    inPossession: ["Play Out of Defense", "Run At Defense"],
    inTransition: ["Counter-Press", "Counter"],
    outOfPossession: [
      "Much Higher Defensive Line",
      "High Press",
      "Offside Trap",
      "Prevent Short GK Distribution",
      "Tighter Marking",
      "Get Stuck In",
    ],
  },
  {
    id: "tiki-taka-4-2-3-1",
    name: "Tiki-Taka 4-2-3-1",
    style: "tiki-taka",
    description: "Patient possession football. Dominate the ball, work it into the box and suffocate opponents by keeping it.",
    formation: "4-2-3-1",
    roleAssignments: [
      { roleId: "sweeper-keeper", duty: "defend" },
      { roleId: "full-back", duty: "support" },
      { roleId: "full-back", duty: "support" },
      { roleId: "deep-lying-playmaker", duty: "defend" },
      { roleId: "advanced-playmaker", duty: "support" },
      { roleId: "box-to-box-midfielder", duty: "support" },
      { roleId: "box-to-box-midfielder", duty: "support" },
      { roleId: "advanced-playmaker", duty: "support" },
      { roleId: "advanced-forward", duty: "support" },
      { roleId: "advanced-forward", duty: "attack" },
      { roleId: "advanced-forward", duty: "attack" },
    ],
    mentality: "positive",
    inPossession: ["Play Out of Defense", "Work Ball Into Box", "Be More Expressive"],
    inTransition: ["Counter-Press", "Take Short Kicks"],
    outOfPossession: ["Higher Defensive Line", "High Press", "Offside Trap", "Tighter Marking"],
  },
  {
    id: "counter-5-3-2",
    name: "Counter Attack 5-3-2",
    style: "counter-attack",
    description: "Solid low block with lightning-fast transitions. Perfect for underdog sides against stronger opponents.",
    formation: "5-3-2",
    roleAssignments: [
      { roleId: "goalkeeper", duty: "defend" },
      { roleId: "central-defender", duty: "defend" },
      { roleId: "central-defender", duty: "defend" },
      { roleId: "central-defender", duty: "defend" },
      { roleId: "wing-back", duty: "support" },
      { roleId: "wing-back", duty: "support" },
      { roleId: "deep-lying-playmaker", duty: "defend" },
      { roleId: "box-to-box-midfielder", duty: "support" },
      { roleId: "deep-lying-playmaker", duty: "support" },
      { roleId: "target-forward", duty: "attack" },
      { roleId: "advanced-forward", duty: "attack" },
    ],
    mentality: "cautious",
    inPossession: ["Be More Disciplined", "Dribble Less"],
    inTransition: ["Regroup", "Counter", "Distribute Quickly"],
    outOfPossession: ["Lower Defensive Line", "Low Block", "Stay On Feet", "Invite Crosses"],
  },
  {
    id: "control-3-5-2",
    name: "Control 3-5-2 (Conte)",
    style: "control-possession",
    description: "Conte-style wing-back overloads. Control the midfield with three central players and attack wide.",
    formation: "3-5-2",
    roleAssignments: [
      { roleId: "sweeper-keeper", duty: "support" },
      { roleId: "ball-playing-defender", duty: "defend" },
      { roleId: "ball-playing-defender", duty: "defend" },
      { roleId: "ball-playing-defender", duty: "defend" },
      { roleId: "wing-back", duty: "attack" },
      { roleId: "deep-lying-playmaker", duty: "support" },
      { roleId: "box-to-box-midfielder", duty: "support" },
      { roleId: "deep-lying-playmaker", duty: "support" },
      { roleId: "wing-back", duty: "attack" },
      { roleId: "advanced-forward", duty: "support" },
      { roleId: "target-forward", duty: "attack" },
    ],
    mentality: "positive",
    inPossession: ["Play Out of Defense", "Work Ball Into Box", "Be More Disciplined"],
    inTransition: ["Counter-Press", "Take Short Kicks"],
    outOfPossession: ["Higher Defensive Line", "High Press", "Offside Trap", "Tighter Marking"],
  },
  {
    id: "park-the-bus-5-2-3",
    name: "Park the Bus 5-2-3",
    style: "park-the-bus",
    description: "Ultra-defensive. Ten men behind the ball to grind out results and protect a lead.",
    formation: "5-2-3",
    roleAssignments: [
      { roleId: "goalkeeper", duty: "defend" },
      { roleId: "central-defender", duty: "defend" },
      { roleId: "central-defender", duty: "defend" },
      { roleId: "central-defender", duty: "defend" },
      { roleId: "wing-back", duty: "defend" },
      { roleId: "wing-back", duty: "defend" },
      { roleId: "deep-lying-playmaker", duty: "defend" },
      { roleId: "box-to-box-midfielder", duty: "support" },
      { roleId: "advanced-forward", duty: "attack" },
      { roleId: "pressing-forward", duty: "support" },
      { roleId: "advanced-forward", duty: "attack" },
    ],
    mentality: "very-defensive",
    inPossession: ["Be More Disciplined", "Dribble Less", "Shoot On Sight"],
    inTransition: ["Regroup", "Hold Shape", "Distribute Quickly"],
    outOfPossession: ["Much Lower Defensive Line", "Low Block", "Stay On Feet", "Invite Crosses"],
  },
];

export function getTemplateById(id: string): TacticTemplate | undefined {
  return tacticTemplates.find((t) => t.id === id);
}
