import { describe, it, expect } from "vitest";
import { analyzeTactic } from "@/tactics/engine";
import { buildState, state433 } from "@/tactics/__tests__/helpers";
import { playerRoles } from "@/lib/tactics-data";
import type { AnalysisResult } from "@/types/analysis";
import type { PlayerRoleCategory, TacticBoardState } from "@/types/tactic";

/** Weighted dimension aggregate mirroring BALANCE_WEIGHTS semantics. */
function dimensionMean(result: AnalysisResult, dim: "attack" | "support" | "defence"): number {
  const d = result[dim] as unknown as Record<string, number | string>;
  const values = Object.entries(d)
    .filter(([k, v]) => k !== "rating" && typeof v === "number")
    .map(([, v]) => v as number);
  return values.reduce((s, v) => s + v, 0) / values.length;
}

/**
 * Attack-heavy 4-2-4 in line order:
 * GK | LB CB CB RB | DM(A) DM(A) | IF(A) CF(A) CF(A) IF(A)
 */
function attacking424(): TacticBoardState {
  return buildState("4-2-4", [
    { roleId: "sweeper-keeper", duty: "defend" },
    { roleId: "wing-back", duty: "support" },
    { roleId: "central-defender", duty: "defend" },
    { roleId: "central-defender", duty: "defend" },
    { roleId: "wing-back", duty: "support" },
    { roleId: "advanced-playmaker", duty: "attack" },
    { roleId: "advanced-playmaker", duty: "attack" },
    { roleId: "inside-forward", duty: "attack" },
    { roleId: "centre-forward", duty: "attack" },
    { roleId: "centre-forward", duty: "attack" },
    { roleId: "inside-forward", duty: "attack" },
  ]);
}

describe("recommendation engine", () => {
  it("is deterministic — same input produces identical recommendations", () => {
    const a = analyzeTactic(state433(), "central-midfield");
    const b = analyzeTactic(state433(), "central-midfield");
    expect(a.recommendations).toEqual(b.recommendations);
  });

  it("locks respected: locking every attacking line only suggests defender changes", () => {
    const state = attacking424();
    const constraints = {
      lockedPlayerIds: [] as string[],
      lockedCategories: ["goalkeeper", "midfielder", "forward"] as PlayerRoleCategory[],
    };
    const result = analyzeTactic(state, "central-midfield", constraints);

    expect(result.recommendations.length).toBeGreaterThan(0);
    for (const rec of result.recommendations) {
      const player = state.players.find((p) => p.id === rec.playerId)!;
      const role = playerRoles.find((r) => r.id === player.roleId)!;
      expect(role.category).toBe("defender");
    }
  });

  it("never recommends a change for an individually locked player", () => {
    const state = attacking424();
    const lockedPlayerIds = state.players.slice(1).map((p) => p.id); // lock all outfield
    const result = analyzeTactic(state, "central-midfield", { lockedPlayerIds, lockedCategories: [] });
    expect(result.recommendations).toHaveLength(0);
  });

  it("applying the top recommendation improves the analysis it targets", () => {
    const state = attacking424();
    const before = analyzeTactic(state, "central-midfield");

    // An attack-heavy 4-2-4 must produce improvement suggestions.
    expect(before.recommendations.length).toBeGreaterThan(0);

    const rec = before.recommendations[0];
    const afterState: TacticBoardState = {
      ...state,
      players: state.players.map((p) =>
        p.id === rec.playerId ? { ...p, roleId: rec.newRoleId, duty: rec.newDuty } : p
      ),
    };
    const after = analyzeTactic(afterState, "central-midfield");

    // The primary problem dimension must not get worse, and risk must drop.
    expect(dimensionMean(after, "defence") + 0.001).toBeGreaterThanOrEqual(
      dimensionMean(before, "defence")
    );
    expect(after.transition.riskScore).toBeLessThan(before.transition.riskScore);
  });

  it("before/after impact deltas match a re-analysis of the applied state", () => {
    const state = attacking424();
    const before = analyzeTactic(state, "central-midfield");
    const rec = before.recommendations[0];

    const afterState: TacticBoardState = {
      ...state,
      players: state.players.map((p) =>
        p.id === rec.playerId ? { ...p, roleId: rec.newRoleId, duty: rec.newDuty } : p
      ),
    };
    const after = analyzeTactic(afterState, "central-midfield");

    // Reported impact must never regress, and — since candidates are scored
    // through the same spatial pipeline as the main analysis — the deltas must
    // exactly match a full re-analysis of the applied state.
    expect(rec.impact.risk).toBeGreaterThanOrEqual(0);
    expect(rec.impact.defence).toBeGreaterThan(0);
    expect(rec.impact.risk).toBeCloseTo(before.transition.riskScore - after.transition.riskScore, 6);
    expect(rec.impact.attack).toBeCloseTo(
      dimensionMean(after, "attack") - dimensionMean(before, "attack"),
      6
    );
    expect(rec.impact.support).toBeCloseTo(
      dimensionMean(after, "support") - dimensionMean(before, "support"),
      6
    );
    expect(rec.impact.defence).toBeCloseTo(
      dimensionMean(after, "defence") - dimensionMean(before, "defence"),
      6
    );
    expect(after.transition.riskScore - before.transition.riskScore).toBeLessThan(0);
  });
});
