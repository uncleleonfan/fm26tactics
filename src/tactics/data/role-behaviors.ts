import type { PlayerDuty } from "@/types/tactic";

/**
 * FM26 Role Behavior Database — the foundation of the rule-based analyzer.
 *
 * All values are normalized 0–1:
 *   0 = none · 0.25 = low · 0.5 = medium · 0.75 = high · 1 = very high
 *
 * These describe EXPECTED tactical behavior — a useful, explainable
 * approximation, NOT an exact reproduction of the FM26 match engine.
 *
 * Modelling assumptions (conservative approximations, documented per spec §7):
 *  - GK "attacking/penetration/chanceCreation" describe distribution impact only.
 *  - Overlapping Centre-Back assumes a back-three context (its native system).
 *  - Playmaking Wing-Back models the FM26 inside-drift behaviour explicitly
 *    via high `inside`/`halfSpace` and low `outside`.
 *  - Channel Midfielder models late half-space arrivals via high `underlap`
 *    + `halfSpace` + `forward`.
 *  - Line-Holding Keeper stays deeper than standard GK; long distribution
 *    gives it slightly higher chanceCreation.
 */

export interface RoleBehavior {
  roleId: string;
  duty: PlayerDuty;
  possession: {
    width: number; depth: number; centrality: number;
    attacking: number; support: number; penetration: number; chanceCreation: number;
  };
  outOfPossession: {
    defensiveResponsibility: number; pressing: number;
    defensiveWidth: number; defensiveDepth: number; centralProtection: number;
  };
  movement: {
    forward: number; backward: number; inside: number; outside: number;
    halfSpace: number; overlap: number; underlap: number;
  };
}

const behaviors: RoleBehavior[] = [
  // --- Goalkeepers ---
  { roleId: "sweeper-keeper", duty: "defend", possession: { width: .1, depth: .9, centrality: .3, attacking: .1, support: .4, penetration: 0, chanceCreation: .1 }, outOfPossession: { defensiveResponsibility: 1, pressing: .2, defensiveWidth: .2, defensiveDepth: 1, centralProtection: .6 }, movement: { forward: .25, backward: .1, inside: .1, outside: .1, halfSpace: .1, overlap: 0, underlap: 0 } },
  { roleId: "sweeper-keeper", duty: "support", possession: { width: .1, depth: .8, centrality: .35, attacking: .15, support: .55, penetration: .05, chanceCreation: .15 }, outOfPossession: { defensiveResponsibility: 1, pressing: .3, defensiveWidth: .25, defensiveDepth: .95, centralProtection: .6 }, movement: { forward: .35, backward: .1, inside: .15, outside: .15, halfSpace: .1, overlap: 0, underlap: 0 } },
  { roleId: "sweeper-keeper", duty: "attack", possession: { width: .15, depth: .65, centrality: .35, attacking: .25, support: .6, penetration: .1, chanceCreation: .2 }, outOfPossession: { defensiveResponsibility: 1, pressing: .4, defensiveWidth: .3, defensiveDepth: .85, centralProtection: .55 }, movement: { forward: .5, backward: .1, inside: .2, outside: .2, halfSpace: .15, overlap: 0, underlap: 0 } },
  { roleId: "goalkeeper", duty: "defend", possession: { width: .05, depth: .95, centrality: .2, attacking: 0, support: .2, penetration: 0, chanceCreation: .05 }, outOfPossession: { defensiveResponsibility: 1, pressing: .1, defensiveWidth: .15, defensiveDepth: 1, centralProtection: .6 }, movement: { forward: .05, backward: .05, inside: .05, outside: .05, halfSpace: .05, overlap: 0, underlap: 0 } },
  { roleId: "line-holding-keeper", duty: "defend", possession: { width: .05, depth: 1, centrality: .2, attacking: 0, support: .25, penetration: .05, chanceCreation: .1 }, outOfPossession: { defensiveResponsibility: 1, pressing: .05, defensiveWidth: .1, defensiveDepth: 1, centralProtection: .6 }, movement: { forward: 0, backward: .05, inside: .05, outside: .05, halfSpace: .05, overlap: 0, underlap: 0 } },
  // --- Defenders ---
  { roleId: "ball-playing-defender", duty: "defend", possession: { width: .2, depth: .9, centrality: .5, attacking: .15, support: .5, penetration: .05, chanceCreation: .35 }, outOfPossession: { defensiveResponsibility: .9, pressing: .3, defensiveWidth: .3, defensiveDepth: .9, centralProtection: .7 }, movement: { forward: .15, backward: .05, inside: .2, outside: .2, halfSpace: .25, overlap: .05, underlap: .1 } },
  { roleId: "ball-playing-defender", duty: "support", possession: { width: .2, depth: .8, centrality: .55, attacking: .25, support: .6, penetration: .1, chanceCreation: .45 }, outOfPossession: { defensiveResponsibility: .85, pressing: .35, defensiveWidth: .35, defensiveDepth: .8, centralProtection: .7 }, movement: { forward: .3, backward: .05, inside: .25, outside: .25, halfSpace: .3, overlap: .1, underlap: .15 } },
  { roleId: "central-defender", duty: "defend", possession: { width: .15, depth: .95, centrality: .4, attacking: .05, support: .3, penetration: 0, chanceCreation: .1 }, outOfPossession: { defensiveResponsibility: 1, pressing: .25, defensiveWidth: .25, defensiveDepth: 1, centralProtection: .8 }, movement: { forward: .05, backward: .05, inside: .15, outside: .15, halfSpace: .15, overlap: 0, underlap: 0 } },
  { roleId: "central-defender", duty: "support", possession: { width: .15, depth: .9, centrality: .4, attacking: .1, support: .35, penetration: 0, chanceCreation: .1 }, outOfPossession: { defensiveResponsibility: .95, pressing: .3, defensiveWidth: .3, defensiveDepth: .95, centralProtection: .8 }, movement: { forward: .15, backward: .05, inside: .15, outside: .15, halfSpace: .15, overlap: 0, underlap: 0 } },
  { roleId: "full-back", duty: "defend", possession: { width: .5, depth: .85, centrality: .25, attacking: .1, support: .35, penetration: .05, chanceCreation: .15 }, outOfPossession: { defensiveResponsibility: .9, pressing: .4, defensiveWidth: .8, defensiveDepth: .85, centralProtection: .3 }, movement: { forward: .15, backward: .1, inside: .2, outside: .5, halfSpace: .15, overlap: .1, underlap: .1 } },
  { roleId: "full-back", duty: "support", possession: { width: .6, depth: .75, centrality: .25, attacking: .25, support: .5, penetration: .1, chanceCreation: .2 }, outOfPossession: { defensiveResponsibility: .75, pressing: .45, defensiveWidth: .8, defensiveDepth: .75, centralProtection: .3 }, movement: { forward: .35, backward: .1, inside: .25, outside: .6, halfSpace: .2, overlap: .25, underlap: .15 } },
  { roleId: "full-back", duty: "attack", possession: { width: .7, depth: .6, centrality: .2, attacking: .4, support: .55, penetration: .15, chanceCreation: .25 }, outOfPossession: { defensiveResponsibility: .55, pressing: .45, defensiveWidth: .75, defensiveDepth: .6, centralProtection: .25 }, movement: { forward: .6, backward: .1, inside: .25, outside: .7, halfSpace: .2, overlap: .45, underlap: .2 } },
  { roleId: "wing-back", duty: "defend", possession: { width: .7, depth: .8, centrality: .2, attacking: .15, support: .4, penetration: .05, chanceCreation: .2 }, outOfPossession: { defensiveResponsibility: .8, pressing: .5, defensiveWidth: .85, defensiveDepth: .8, centralProtection: .3 }, movement: { forward: .25, backward: .1, inside: .2, outside: .6, halfSpace: .15, overlap: .15, underlap: .1 } },
  { roleId: "wing-back", duty: "support", possession: { width: .8, depth: .65, centrality: .2, attacking: .35, support: .5, penetration: .1, chanceCreation: .3 }, outOfPossession: { defensiveResponsibility: .6, pressing: .55, defensiveWidth: .85, defensiveDepth: .65, centralProtection: .3 }, movement: { forward: .5, backward: .1, inside: .25, outside: .7, halfSpace: .2, overlap: .35, underlap: .15 } },
  { roleId: "wing-back", duty: "attack", possession: { width: .9, depth: .5, centrality: .15, attacking: .55, support: .55, penetration: .15, chanceCreation: .35 }, outOfPossession: { defensiveResponsibility: .4, pressing: .55, defensiveWidth: .8, defensiveDepth: .5, centralProtection: .25 }, movement: { forward: .75, backward: .1, inside: .25, outside: .75, halfSpace: .2, overlap: .65, underlap: .2 } },
  { roleId: "overlapping-centre-back", duty: "defend", possession: { width: .3, depth: .9, centrality: .5, attacking: .15, support: .45, penetration: .05, chanceCreation: .3 }, outOfPossession: { defensiveResponsibility: .9, pressing: .3, defensiveWidth: .4, defensiveDepth: .9, centralProtection: .75 }, movement: { forward: .2, backward: .05, inside: .2, outside: .45, halfSpace: .25, overlap: .15, underlap: .1 } },
  { roleId: "overlapping-centre-back", duty: "support", possession: { width: .55, depth: .7, centrality: .35, attacking: .35, support: .5, penetration: .1, chanceCreation: .3 }, outOfPossession: { defensiveResponsibility: .7, pressing: .35, defensiveWidth: .5, defensiveDepth: .7, centralProtection: .7 }, movement: { forward: .5, backward: .05, inside: .2, outside: .65, halfSpace: .25, overlap: .55, underlap: .15 } },
  { roleId: "playmaking-wing-back", duty: "support", possession: { width: .6, depth: .6, centrality: .55, attacking: .35, support: .65, penetration: .15, chanceCreation: .55 }, outOfPossession: { defensiveResponsibility: .6, pressing: .5, defensiveWidth: .7, defensiveDepth: .6, centralProtection: .45 }, movement: { forward: .4, backward: .1, inside: .6, outside: .2, halfSpace: .55, overlap: .15, underlap: .35 } },
  { roleId: "playmaking-wing-back", duty: "attack", possession: { width: .6, depth: .45, centrality: .6, attacking: .5, support: .6, penetration: .2, chanceCreation: .65 }, outOfPossession: { defensiveResponsibility: .45, pressing: .5, defensiveWidth: .65, defensiveDepth: .5, centralProtection: .4 }, movement: { forward: .6, backward: .1, inside: .65, outside: .2, halfSpace: .6, overlap: .2, underlap: .45 } },
  // --- Midfielders ---
  { roleId: "deep-lying-playmaker", duty: "defend", possession: { width: .2, depth: .85, centrality: .8, attacking: .15, support: .7, penetration: .05, chanceCreation: .6 }, outOfPossession: { defensiveResponsibility: .8, pressing: .35, defensiveWidth: .25, defensiveDepth: .85, centralProtection: .75 }, movement: { forward: .1, backward: .05, inside: .4, outside: .1, halfSpace: .45, overlap: 0, underlap: .2 } },
  { roleId: "deep-lying-playmaker", duty: "support", possession: { width: .25, depth: .75, centrality: .8, attacking: .25, support: .8, penetration: .1, chanceCreation: .7 }, outOfPossession: { defensiveResponsibility: .6, pressing: .4, defensiveWidth: .3, defensiveDepth: .75, centralProtection: .7 }, movement: { forward: .2, backward: .05, inside: .45, outside: .1, halfSpace: .5, overlap: 0, underlap: .25 } },
  { roleId: "box-to-box-midfielder", duty: "support", possession: { width: .3, depth: .6, centrality: .7, attacking: .5, support: .75, penetration: .25, chanceCreation: .35 }, outOfPossession: { defensiveResponsibility: .65, pressing: .55, defensiveWidth: .35, defensiveDepth: .6, centralProtection: .55 }, movement: { forward: .6, backward: .3, inside: .4, outside: .3, halfSpace: .5, overlap: .05, underlap: .25 } },
  { roleId: "advanced-playmaker", duty: "support", possession: { width: .35, depth: .45, centrality: .85, attacking: .6, support: .8, penetration: .35, chanceCreation: .9 }, outOfPossession: { defensiveResponsibility: .4, pressing: .5, defensiveWidth: .3, defensiveDepth: .45, centralProtection: .5 }, movement: { forward: .4, backward: .1, inside: .6, outside: .25, halfSpace: .65, overlap: .05, underlap: .4 } },
  { roleId: "advanced-playmaker", duty: "attack", possession: { width: .35, depth: .35, centrality: .85, attacking: .75, support: .7, penetration: .5, chanceCreation: .85 }, outOfPossession: { defensiveResponsibility: .25, pressing: .45, defensiveWidth: .25, defensiveDepth: .35, centralProtection: .45 }, movement: { forward: .6, backward: .05, inside: .6, outside: .25, halfSpace: .65, overlap: .05, underlap: .4 } },
  { roleId: "channel-midfielder", duty: "support", possession: { width: .3, depth: .55, centrality: .6, attacking: .6, support: .65, penetration: .5, chanceCreation: .4 }, outOfPossession: { defensiveResponsibility: .5, pressing: .5, defensiveWidth: .3, defensiveDepth: .55, centralProtection: .45 }, movement: { forward: .7, backward: .2, inside: .55, outside: .2, halfSpace: .75, overlap: .05, underlap: .5 } },
  { roleId: "channel-midfielder", duty: "attack", possession: { width: .3, depth: .4, centrality: .6, attacking: .75, support: .6, penetration: .7, chanceCreation: .4 }, outOfPossession: { defensiveResponsibility: .35, pressing: .45, defensiveWidth: .25, defensiveDepth: .4, centralProtection: .4 }, movement: { forward: .85, backward: .15, inside: .55, outside: .2, halfSpace: .8, overlap: .05, underlap: .55 } },
  // --- FM26 standard roles (renamed / consolidated classics) ---
  { roleId: "pressing-central-midfielder", duty: "defend", possession: { width: .3, depth: .7, centrality: .7, attacking: .15, support: .5, penetration: .1, chanceCreation: .2 }, outOfPossession: { defensiveResponsibility: .85, pressing: .9, defensiveWidth: .4, defensiveDepth: .7, centralProtection: .7 }, movement: { forward: .35, backward: .3, inside: .4, outside: .3, halfSpace: .45, overlap: 0, underlap: .15 } },
  { roleId: "pressing-central-midfielder", duty: "support", possession: { width: .3, depth: .6, centrality: .7, attacking: .3, support: .6, penetration: .2, chanceCreation: .3 }, outOfPossession: { defensiveResponsibility: .7, pressing: .8, defensiveWidth: .4, defensiveDepth: .6, centralProtection: .6 }, movement: { forward: .5, backward: .25, inside: .4, outside: .3, halfSpace: .5, overlap: .05, underlap: .2 } },
  { roleId: "defensive-midfielder", duty: "defend", possession: { width: .2, depth: .9, centrality: .75, attacking: .1, support: .5, penetration: .05, chanceCreation: .25 }, outOfPossession: { defensiveResponsibility: .9, pressing: .45, defensiveWidth: .3, defensiveDepth: .9, centralProtection: .85 }, movement: { forward: .1, backward: .1, inside: .35, outside: .1, halfSpace: .35, overlap: 0, underlap: .1 } },
  { roleId: "defensive-midfielder", duty: "support", possession: { width: .25, depth: .8, centrality: .75, attacking: .2, support: .6, penetration: .1, chanceCreation: .3 }, outOfPossession: { defensiveResponsibility: .8, pressing: .5, defensiveWidth: .35, defensiveDepth: .8, centralProtection: .8 }, movement: { forward: .2, backward: .1, inside: .4, outside: .15, halfSpace: .4, overlap: 0, underlap: .15 } },
  { roleId: "attacking-midfielder", duty: "support", possession: { width: .35, depth: .45, centrality: .8, attacking: .5, support: .7, penetration: .3, chanceCreation: .7 }, outOfPossession: { defensiveResponsibility: .35, pressing: .45, defensiveWidth: .3, defensiveDepth: .45, centralProtection: .45 }, movement: { forward: .45, backward: .2, inside: .5, outside: .25, halfSpace: .6, overlap: .05, underlap: .3 } },
  { roleId: "attacking-midfielder", duty: "attack", possession: { width: .35, depth: .35, centrality: .8, attacking: .7, support: .65, penetration: .5, chanceCreation: .75 }, outOfPossession: { defensiveResponsibility: .25, pressing: .4, defensiveWidth: .25, defensiveDepth: .35, centralProtection: .4 }, movement: { forward: .65, backward: .1, inside: .5, outside: .25, halfSpace: .6, overlap: .05, underlap: .35 } },
  { roleId: "wide-covering-central-midfielder", duty: "support", possession: { width: .45, depth: .6, centrality: .5, attacking: .35, support: .55, penetration: .25, chanceCreation: .3 }, outOfPossession: { defensiveResponsibility: .7, pressing: .6, defensiveWidth: .6, defensiveDepth: .6, centralProtection: .45 }, movement: { forward: .45, backward: .3, inside: .35, outside: .55, halfSpace: .5, overlap: .05, underlap: .2 } },
  { roleId: "central-midfielder", duty: "defend", possession: { width: .3, depth: .75, centrality: .7, attacking: .2, support: .55, penetration: .1, chanceCreation: .3 }, outOfPossession: { defensiveResponsibility: .8, pressing: .6, defensiveWidth: .4, defensiveDepth: .75, centralProtection: .65 }, movement: { forward: .3, backward: .25, inside: .4, outside: .3, halfSpace: .45, overlap: 0, underlap: .15 } },
  { roleId: "central-midfielder", duty: "support", possession: { width: .3, depth: .65, centrality: .7, attacking: .4, support: .65, penetration: .2, chanceCreation: .35 }, outOfPossession: { defensiveResponsibility: .65, pressing: .55, defensiveWidth: .4, defensiveDepth: .65, centralProtection: .55 }, movement: { forward: .45, backward: .2, inside: .4, outside: .3, halfSpace: .45, overlap: .05, underlap: .2 } },
  // --- Forwards ---
  { roleId: "inside-forward", duty: "support", possession: { width: .7, depth: .35, centrality: .6, attacking: .7, support: .6, penetration: .65, chanceCreation: .55 }, outOfPossession: { defensiveResponsibility: .3, pressing: .45, defensiveWidth: .5, defensiveDepth: .35, centralProtection: .25 }, movement: { forward: .6, backward: .1, inside: .8, outside: .15, halfSpace: .75, overlap: .05, underlap: .45 } },
  { roleId: "inside-forward", duty: "attack", possession: { width: .7, depth: .25, centrality: .55, attacking: .85, support: .5, penetration: .85, chanceCreation: .5 }, outOfPossession: { defensiveResponsibility: .2, pressing: .4, defensiveWidth: .45, defensiveDepth: .25, centralProtection: .2 }, movement: { forward: .75, backward: .05, inside: .85, outside: .1, halfSpace: .8, overlap: .05, underlap: .5 } },
  { roleId: "free-role", duty: "attack", possession: { width: .5, depth: .45, centrality: .65, attacking: .8, support: .55, penetration: .65, chanceCreation: .9 }, outOfPossession: { defensiveResponsibility: .15, pressing: .3, defensiveWidth: .2, defensiveDepth: .25, centralProtection: .2 }, movement: { forward: .65, backward: .2, inside: .6, outside: .5, halfSpace: .65, overlap: .05, underlap: .4 } },
  { roleId: "target-forward", duty: "support", possession: { width: .4, depth: .4, centrality: .7, attacking: .55, support: .7, penetration: .35, chanceCreation: .45 }, outOfPossession: { defensiveResponsibility: .35, pressing: .5, defensiveWidth: .35, defensiveDepth: .4, centralProtection: .35 }, movement: { forward: .35, backward: .2, inside: .45, outside: .25, halfSpace: .5, overlap: .05, underlap: .15 } },
  { roleId: "target-forward", duty: "attack", possession: { width: .4, depth: .3, centrality: .7, attacking: .7, support: .6, penetration: .45, chanceCreation: .4 }, outOfPossession: { defensiveResponsibility: .25, pressing: .45, defensiveWidth: .3, defensiveDepth: .3, centralProtection: .3 }, movement: { forward: .5, backward: .15, inside: .45, outside: .25, halfSpace: .5, overlap: .05, underlap: .15 } },
  { roleId: "winger", duty: "support", possession: { width: .85, depth: .5, centrality: .2, attacking: .5, support: .6, penetration: .4, chanceCreation: .5 }, outOfPossession: { defensiveResponsibility: .5, pressing: .5, defensiveWidth: .8, defensiveDepth: .5, centralProtection: .25 }, movement: { forward: .6, backward: .15, inside: .3, outside: .8, halfSpace: .3, overlap: .1, underlap: .15 } },
  { roleId: "winger", duty: "attack", possession: { width: .9, depth: .35, centrality: .15, attacking: .7, support: .55, penetration: .6, chanceCreation: .55 }, outOfPossession: { defensiveResponsibility: .35, pressing: .45, defensiveWidth: .75, defensiveDepth: .35, centralProtection: .2 }, movement: { forward: .8, backward: .1, inside: .35, outside: .9, halfSpace: .35, overlap: .1, underlap: .2 } },
  { roleId: "tracking-winger", duty: "defend", possession: { width: .8, depth: .6, centrality: .25, attacking: .25, support: .5, penetration: .2, chanceCreation: .3 }, outOfPossession: { defensiveResponsibility: .8, pressing: .7, defensiveWidth: .9, defensiveDepth: .6, centralProtection: .35 }, movement: { forward: .35, backward: .45, inside: .35, outside: .7, halfSpace: .3, overlap: .1, underlap: .1 } },
  { roleId: "tracking-winger", duty: "support", possession: { width: .8, depth: .5, centrality: .25, attacking: .4, support: .55, penetration: .3, chanceCreation: .35 }, outOfPossession: { defensiveResponsibility: .65, pressing: .65, defensiveWidth: .85, defensiveDepth: .5, centralProtection: .3 }, movement: { forward: .5, backward: .35, inside: .35, outside: .75, halfSpace: .3, overlap: .15, underlap: .15 } },
  { roleId: "centre-forward", duty: "support", possession: { width: .35, depth: .45, centrality: .75, attacking: .65, support: .75, penetration: .55, chanceCreation: .55 }, outOfPossession: { defensiveResponsibility: .3, pressing: .55, defensiveWidth: .3, defensiveDepth: .45, centralProtection: .35 }, movement: { forward: .55, backward: .3, inside: .5, outside: .3, halfSpace: .5, overlap: .05, underlap: .2 } },
  { roleId: "centre-forward", duty: "attack", possession: { width: .35, depth: .3, centrality: .75, attacking: .85, support: .6, penetration: .8, chanceCreation: .5 }, outOfPossession: { defensiveResponsibility: .2, pressing: .5, defensiveWidth: .25, defensiveDepth: .3, centralProtection: .3 }, movement: { forward: .8, backward: .15, inside: .5, outside: .3, halfSpace: .55, overlap: .05, underlap: .25 } },
  { roleId: "deep-lying-forward", duty: "support", possession: { width: .35, depth: .5, centrality: .7, attacking: .5, support: .85, penetration: .4, chanceCreation: .6 }, outOfPossession: { defensiveResponsibility: .35, pressing: .55, defensiveWidth: .3, defensiveDepth: .45, centralProtection: .35 }, movement: { forward: .4, backward: .4, inside: .5, outside: .3, halfSpace: .5, overlap: .05, underlap: .2 } },
  { roleId: "deep-lying-forward", duty: "attack", possession: { width: .35, depth: .4, centrality: .7, attacking: .7, support: .8, penetration: .55, chanceCreation: .6 }, outOfPossession: { defensiveResponsibility: .25, pressing: .5, defensiveWidth: .3, defensiveDepth: .4, centralProtection: .3 }, movement: { forward: .55, backward: .3, inside: .5, outside: .3, halfSpace: .55, overlap: .05, underlap: .25 } },
  { roleId: "tracking-centre-forward", duty: "defend", possession: { width: .35, depth: .55, centrality: .7, attacking: .3, support: .55, penetration: .3, chanceCreation: .25 }, outOfPossession: { defensiveResponsibility: .65, pressing: .85, defensiveWidth: .3, defensiveDepth: .5, centralProtection: .45 }, movement: { forward: .35, backward: .4, inside: .45, outside: .3, halfSpace: .45, overlap: 0, underlap: .1 } },
  { roleId: "tracking-centre-forward", duty: "support", possession: { width: .35, depth: .5, centrality: .7, attacking: .4, support: .65, penetration: .35, chanceCreation: .3 }, outOfPossession: { defensiveResponsibility: .55, pressing: .75, defensiveWidth: .3, defensiveDepth: .45, centralProtection: .4 }, movement: { forward: .45, backward: .35, inside: .45, outside: .3, halfSpace: .45, overlap: .05, underlap: .15 } },
];

/** Indexed lookup: `${roleId}:${duty}` → behavior. */
export const roleBehaviorDatabase: Record<string, RoleBehavior> = Object.fromEntries(
  behaviors.map((b) => [`${b.roleId}:${b.duty}`, b])
);

/** Conservative fallback for unknown role/duty combos (defensive neutral shape). */
export const fallbackBehavior: RoleBehavior = {
  roleId: "unknown",
  duty: "support",
  possession: { width: .3, depth: .7, centrality: .5, attacking: .3, support: .5, penetration: .2, chanceCreation: .3 },
  outOfPossession: { defensiveResponsibility: .6, pressing: .4, defensiveWidth: .4, defensiveDepth: .7, centralProtection: .5 },
  movement: { forward: .3, backward: .15, inside: .3, outside: .3, halfSpace: .3, overlap: 0, underlap: .1 },
};

export function getRoleBehavior(roleId: string, duty: PlayerDuty): RoleBehavior {
  const found = roleBehaviorDatabase[`${roleId}:${duty}`];
  if (!found) {
    console.error(`[tactics] no behavior entry for ${roleId}:${duty}, using conservative fallback`);
    return { ...fallbackBehavior, roleId, duty };
  }
  return found;
}
