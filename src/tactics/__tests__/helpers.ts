import type { TacticBoardState, PlayerDuty, FormationType, Mentality } from "@/types/tactic";
import { formationPresets, playerRoles } from "@/lib/tactics-data";

export interface PlayerSpec {
  roleId: string;
  duty: PlayerDuty;
}

/**
 * Sort formation slots into canonical order:
 * GK → defenders → midfielders → forwards, each line left-to-right.
 * Formation presets use inconsistent index orders (e.g. 4-3-3 lists
 * GK,LB,RB,DM,LM,CM,CM,RM,LW,ST,RW), so specs must follow line order.
 */
function sortSlots(positions: Array<{ x: number; y: number }>) {
  const line = (y: number) => (y > 80 ? 0 : y > 60 ? 1 : y > 32 ? 2 : 3);
  return positions
    .map((pos, i) => ({ pos, originalIndex: i }))
    .sort((a, b) => line(a.pos.y) - line(b.pos.y) || a.pos.x - b.pos.x)
    .map((e) => e.pos);
}

/** Build a tactic state with explicit role/duty assignments in line order. */
export function buildState(
  formation: string,
  specs: PlayerSpec[],
  mentality: Mentality = "balanced"
): TacticBoardState {
  const preset = formationPresets.find((f) => f.formation === formation)!;
  const positions = sortSlots(preset.positions);
  const gk = playerRoles.find((r) => r.id === "sweeper-keeper")!;
  return {
    formation: preset.formation as FormationType,
    players: positions.map((pos, i) => {
      const spec = specs[i] ?? { roleId: gk.id, duty: "defend" as PlayerDuty };
      const role = playerRoles.find((r) => r.id === spec.roleId);
      return {
        id: `p${i}`,
        x: pos.x,
        y: pos.y,
        roleId: spec.roleId,
        duty: role?.availableDuties.includes(spec.duty) ? spec.duty : role!.availableDuties[0],
        individualInstructions: [],
      };
    }),
    teamInstructions: { mentality, inPossession: [], inTransition: [], outOfPossession: [] },
  };
}

/**
 * Balanced 4-3-3 in line order:
 * GK | LB CB CB RB | CM DM CM | LW ST RW
 */
export const state433 = (
  overrides: Partial<Record<number, PlayerSpec>> = {},
  mentality: Mentality = "balanced"
) => buildState("4-3-3", default433Specs(overrides), mentality);

function default433Specs(overrides: Partial<Record<number, PlayerSpec>>): PlayerSpec[] {
  const base: PlayerSpec[] = [
    { roleId: "sweeper-keeper", duty: "defend" },      // 0 GK
    { roleId: "wing-back", duty: "support" },          // 1 LB (x10)
    { roleId: "central-defender", duty: "defend" },    // 2 CB (x35)
    { roleId: "central-defender", duty: "defend" },    // 3 CB (x65)
    { roleId: "wing-back", duty: "support" },          // 4 RB (x90)
    { roleId: "box-to-box-midfielder", duty: "support" }, // 5 CM (x35)
    { roleId: "deep-lying-playmaker", duty: "defend" },// 6 DM (x50)
    { roleId: "advanced-playmaker", duty: "support" }, // 7 CM (x65)
    { roleId: "inside-forward", duty: "support" },     // 8 LW
    { roleId: "advanced-forward", duty: "attack" },    // 9 ST
    { roleId: "inside-forward", duty: "support" },     // 10 RW
  ];
  return base.map((s, i) => overrides[i] ?? s);
}
