import { describe, it, expect } from "vitest";
import { formationPresets, playerRoles } from "@/lib/tactics-data";
import type { TacticBoardState } from "@/types/tactic";
import { roleBehaviorDatabase, getRoleBehavior } from "@/tactics/data/role-behaviors";
import { ballZones, zoneAtPoint, DEFAULT_BALL_ZONE } from "@/tactics/data/zones";
import { buildTacticalModel } from "@/tactics/engine/tactical-model";

function stateForFormation(formation: string): TacticBoardState {
  const preset = formationPresets.find((f) => f.formation === formation)!;
  const roles = playerRoles.filter((r) => r.category !== "goalkeeper");
  return {
    formation: preset.formation as TacticBoardState["formation"],
    players: preset.positions.map((pos, i) => ({
      id: `p${i}`,
      x: pos.x,
      y: pos.y,
      roleId: i === 0 ? "sweeper-keeper" : roles[i % roles.length].id,
      duty: (i === 0 ? "defend" : roles[i % roles.length].availableDuties[0]) as "defend",
      individualInstructions: [],
    })),
    teamInstructions: { mentality: "balanced", inPossession: [], inTransition: [], outOfPossession: [] },
  };
}

const TEST_FORMATIONS = ["4-3-3", "4-2-3-1", "4-4-2", "3-4-3", "3-5-2"];

describe("role behavior database", () => {
  it("covers every supported role/duty combination with real data (no fallback needed)", () => {
    for (const role of playerRoles) {
      for (const duty of role.availableDuties) {
        const key = `${role.id}:${duty}`;
        expect(roleBehaviorDatabase[key], `missing ${key}`).toBeDefined();
      }
    }
  });

  it("returns conservative fallback for unknown combos instead of crashing", () => {
    const b = getRoleBehavior("no-such-role", "support");
    expect(b.roleId).toBe("no-such-role");
    expect(b.possession.support).toBeGreaterThan(0);
  });

  it("stores all attributes within normalized 0-1 bounds", () => {
    for (const b of Object.values(roleBehaviorDatabase)) {
      for (const group of [b.possession, b.outOfPossession, b.movement]) {
        for (const v of Object.values(group)) {
          expect(v).toBeGreaterThanOrEqual(0);
          expect(v).toBeLessThanOrEqual(1);
        }
      }
    }
  });
});

describe("tactical model", () => {
  it.each(TEST_FORMATIONS)("normalizes formation %s into 11 tactical players", (formation) => {
    const model = buildTacticalModel(stateForFormation(formation));
    expect(model.players).toHaveLength(11);
    for (const p of model.players) {
      expect(p.behavior.roleId).toBe(p.roleId);
      expect(p.label).toMatch(/\([DSA]\)$/);
      expect(["goalkeeper", "defender", "midfielder", "forward"]).toContain(p.roleCategory);
    }
  });

  it("produces stable output for identical input (determinism)", () => {
    const state = stateForFormation("4-3-3");
    const a = JSON.stringify(buildTacticalModel(state));
    const b = JSON.stringify(buildTacticalModel(state));
    expect(a).toBe(b);
  });
});

describe("zones", () => {
  it("defines exactly 10 ball zones with unique ids", () => {
    expect(ballZones).toHaveLength(10);
    expect(new Set(ballZones.map((z) => z.id)).size).toBe(10);
    expect(DEFAULT_BALL_ZONE).toBe("central-midfield");
  });

  it("maps pitch points to sensible zones", () => {
    expect(zoneAtPoint(50, 80)).toBe("defensive-third");
    expect(zoneAtPoint(20, 66)).toBe("left-build-up");
    expect(zoneAtPoint(80, 66)).toBe("right-build-up");
    expect(zoneAtPoint(50, 44)).toBe("central-midfield");
    expect(zoneAtPoint(25, 15)).toBe("left-final-third");
    expect(zoneAtPoint(75, 15)).toBe("right-final-third");
  });
});
