import { describe, it, expect } from "vitest";
import { analyzeTactic, generateRecommendations } from "@/tactics/engine";
import { state433, buildState } from "@/tactics/__tests__/helpers";

describe("balance engine", () => {
  it("rates a balanced 4-3-3 reasonably across dimensions", () => {
    const r = analyzeTactic(state433(), "central-midfield");
    for (const dim of [r.attack, r.support, r.defence]) {
      expect(["weak", "moderate", "strong"]).toContain(dim.rating);
      const values = Object.entries(dim)
        .filter(([k, v]) => typeof v === "number")
        .map(([, v]) => v as number);
      for (const v of values) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
    }
  });

  it("defensive setup scores higher defence than all-out attack", () => {
    // 5-3-2 line order: GK | CB CB CB | WB WB | CM CM CM | ST ST
    const defensive = buildState("5-3-2", [
      { roleId: "sweeper-keeper", duty: "defend" },
      { roleId: "central-defender", duty: "defend" },
      { roleId: "central-defender", duty: "defend" },
      { roleId: "central-defender", duty: "defend" },
      { roleId: "wing-back", duty: "defend" },
      { roleId: "wing-back", duty: "defend" },
      { roleId: "deep-lying-playmaker", duty: "defend" },
      { roleId: "box-to-box-midfielder", duty: "support" },
      { roleId: "deep-lying-playmaker", duty: "defend" },
      { roleId: "pressing-forward", duty: "defend" },
      { roleId: "target-forward", duty: "support" },
    ]);
    // 4-2-4 line order: GK | CB CB | LM RM | CM CM | LW STL STR RW
    const reckless = buildState("4-2-4", [
      { roleId: "sweeper-keeper", duty: "defend" },
      { roleId: "ball-playing-defender", duty: "support" },
      { roleId: "ball-playing-defender", duty: "support" },
      { roleId: "wing-back", duty: "attack" },
      { roleId: "wing-back", duty: "attack" },
      { roleId: "advanced-playmaker", duty: "attack" },
      { roleId: "channel-midfielder", duty: "attack" },
      { roleId: "inside-forward", duty: "attack" },
      { roleId: "advanced-forward", duty: "attack" },
      { roleId: "advanced-forward", duty: "attack" },
      { roleId: "inside-forward", duty: "attack" },
    ]);

    const dR = analyzeTactic(defensive, "central-midfield");
    const aR = analyzeTactic(reckless, "central-midfield");
    expect(dR.defence.coverage).toBeGreaterThan(aR.defence.coverage);
    expect(aR.attack.penetration).toBeGreaterThan(dR.attack.penetration);
  });
});

describe("risk engine & warnings", () => {
  it("attacking overload triggers transition warning with an explainable reason", () => {
    // 4-2-4 line order: GK | CB CB | LM RM | CM CM | LW STL STR RW
    const reckless = buildState("4-2-4", [
      { roleId: "sweeper-keeper", duty: "defend" },
      { roleId: "ball-playing-defender", duty: "support" },
      { roleId: "ball-playing-defender", duty: "support" },
      { roleId: "wing-back", duty: "attack" },
      { roleId: "wing-back", duty: "attack" },
      { roleId: "advanced-playmaker", duty: "attack" },
      { roleId: "channel-midfielder", duty: "attack" },
      { roleId: "inside-forward", duty: "attack" },
      { roleId: "advanced-forward", duty: "attack" },
      { roleId: "advanced-forward", duty: "attack" },
      { roleId: "inside-forward", duty: "attack" },
    ]);
    const r = analyzeTactic(reckless, "central-final-third");
    const riskWarning = r.warnings.find((w) => w.id === "transition-risk-high");
    expect(riskWarning).toBeDefined();
    expect(riskWarning!.reason.length).toBeGreaterThan(30); // explainable, not just a score
  });

  it("wide defensive weakness warning fires for aggressive full-back setups", () => {
    // Both wide players (index 3 LM, index 7 RM) on attack duty → weak flanks.
    const state = state433({
      3: { roleId: "wing-back", duty: "attack" },
      7: { roleId: "wing-back", duty: "attack" },
    });
    const r = analyzeTactic(state, "central-midfield");
    const wideWarnings = r.warnings.filter((w) => w.id.startsWith("wide-coverage"));
    expect(wideWarnings.length).toBeGreaterThan(0);
    for (const w of wideWarnings) {
      expect(w.params?.side).toMatch(/^(Left|Right)$/);
    }
  });

  it("warnings are sorted by severity (critical first)", () => {
    const r = analyzeTactic(state433(), "central-midfield");
    const order = { critical: 0, warning: 1, positive: 2 };
    for (let i = 1; i < r.warnings.length; i++) {
      expect(order[r.warnings[i].severity]).toBeGreaterThanOrEqual(order[r.warnings[i - 1].severity]);
    }
  });
});

describe("recommendation engine (spec §17-18)", () => {
  // 4-3-3 line order: GK | CB CB | LM CM DM CM RM | LW ST RW
  const reckless = () =>
    buildState("4-3-3", [
      { roleId: "sweeper-keeper", duty: "defend" },
      { roleId: "ball-playing-defender", duty: "support" },
      { roleId: "ball-playing-defender", duty: "support" },
      { roleId: "wing-back", duty: "attack" },
      { roleId: "advanced-playmaker", duty: "attack" },
      { roleId: "box-to-box-midfielder", duty: "support" },
      { roleId: "advanced-playmaker", duty: "attack" },
      { roleId: "wing-back", duty: "attack" },
      { roleId: "inside-forward", duty: "attack" },
      { roleId: "advanced-forward", duty: "attack" },
      { roleId: "inside-forward", duty: "attack" },
    ]);

  it("suggests concrete role/duty changes with measurable impact", () => {
    const recs = generateRecommendations(reckless(), "central-midfield", analyzeTactic(reckless(), "central-midfield"));
    expect(recs.length).toBeGreaterThan(0);
    expect(recs.length).toBeLessThanOrEqual(3);
    for (const rec of recs) {
      expect(rec.suggestedChange).toMatch(/→/);
      expect(rec.impact.defence + rec.impact.risk).toBeGreaterThan(0);
    }
  });

  it("locked attacking roles force defensive-side suggestions only", () => {
    const state = reckless();
    const lockedIds = state.players
      .filter((_, i) => [8, 9, 10].includes(i))
      .map((p) => p.id);
    const recs = generateRecommendations(
      state,
      "central-midfield",
      analyzeTactic(state, "central-midfield"),
      { lockedPlayerIds: lockedIds, lockedCategories: ["forward"] }
    );
    expect(recs.length).toBeGreaterThan(0);
    // None of the recommendations may touch the locked forwards.
    for (const rec of recs) {
      expect(lockedIds).not.toContain(rec.playerId);
    }
  });

  it("applying a recommendation improves the aggregate defence score", () => {
    const state = reckless();
    const recs = generateRecommendations(state, "central-midfield", analyzeTactic(state, "central-midfield"));
    if (recs.length === 0) return; // already balanced enough
    const best = recs[0];
    const before = analyzeTactic(state, "central-midfield");
    const idx = state.players.findIndex((p) => p.id === best.playerId);
    const improved = {
      ...state,
      players: state.players.map((p, i) =>
        i === idx ? { ...p, roleId: best.newRoleId, duty: best.newDuty } : p
      ),
    };
    const after = analyzeTactic(improved, "central-midfield");
    expect(after.defence.coverage + after.transition.riskScore * -1).toBeGreaterThan(
      before.defence.coverage + before.transition.riskScore * -1
    );
  });
});
