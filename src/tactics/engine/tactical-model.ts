import { playerRoles } from "@/lib/tactics-data";
import type { PlayerRoleData, TacticBoardState, PlayerDuty } from "@/types/tactic";
import type { RoleBehavior } from "@/tactics/data/role-behaviors";
import { getRoleBehavior } from "@/tactics/data/role-behaviors";

/**
 * Tactical model — normalizes the existing TacticBoardState into an
 * engine-friendly representation by joining each PlayerNode with its
 * role metadata and behavioral attributes (spec §5).
 */

export interface TacticalPlayer {
  id: string;
  index: number;
  x: number;
  y: number;
  roleId: string;
  roleName: string;
  roleCategory: PlayerRoleData["category"];
  availableDuties: PlayerDuty[];
  duty: PlayerDuty;
  behavior: RoleBehavior;
  /** Shorthand label like "WB(A)" or "SK(D)". */
  label: string;
}

export interface TacticalModel {
  formation: string;
  players: TacticalPlayer[];
  mentality: string;
}

function roleShortName(meta: PlayerRoleData | undefined, roleName: string): string {
  // Prefer the explicit FM-standard abbreviation (GK, BPD, BBM...).
  if (meta?.abbr) return meta.abbr;
  // Fallback acronym for roles outside the database.
  const acronym = roleName
    .split(/[\s-]+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return acronym.length <= 3 ? acronym : roleName;
}

const dutyShort: Record<PlayerDuty, string> = { defend: "D", support: "S", attack: "A" };

export function buildTacticalModel(state: TacticBoardState): TacticalModel {
  const roleIndex: Record<string, PlayerRoleData> = Object.fromEntries(
    playerRoles.map((r) => [r.id, r])
  );

  const players: TacticalPlayer[] = state.players.map((node, index) => {
    const meta = roleIndex[node.roleId];
    const roleName = meta?.name ?? node.roleId;
    return {
      id: node.id,
      index,
      x: node.x,
      y: node.y,
      roleId: node.roleId,
      roleName,
      roleCategory: meta?.category ?? "midfielder",
      availableDuties: meta?.availableDuties ?? ["support"],
      duty: node.duty,
      behavior: getRoleBehavior(node.roleId, node.duty),
      label: `${roleShortName(meta, roleName)}(${dutyShort[node.duty]})`,
    };
  });

  return {
    formation: state.formation,
    players,
    mentality: state.teamInstructions.mentality,
  };
}

/** Is this player positioned/behaving on the left/central/right half? */
export function horizontalBand(x: number): "left" | "central" | "right" {
  if (x < 34) return "left";
  if (x > 66) return "right";
  return "central";
}
