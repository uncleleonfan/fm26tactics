import { describe, it, expect } from "vitest";
import { analyzeTactic } from "@/tactics/engine";
import { ballZones } from "@/tactics/data/zones";
import { state433, buildState } from "@/tactics/__tests__/helpers";

describe("spatial engine across all ball zones", () => {
  it.each(ballZones.map((z) => z.id))("produces 11 movements for zone %s", (zone) => {
    const result = analyzeTactic(state433(), zone);
    expect(result.movements).toHaveLength(11);
    for (const m of result.movements) {
      expect(m.expectedPosition.x).toBeGreaterThanOrEqual(2);
      expect(m.expectedPosition.x).toBeLessThanOrEqual(98);
      expect(m.expectedPosition.y).toBeGreaterThanOrEqual(3);
      expect(m.expectedPosition.y).toBeLessThanOrEqual(97);
    }
  });

  it("every zone assignment is one of the 10 zones", () => {
    const result = analyzeTactic(state433(), "central-final-third");
    const validIds = new Set(ballZones.map((z) => z.id));
    for (const m of result.movements) {
      for (const z of m.occupiedZones) expect(validIds.has(z)).toBe(true);
    }
  });

  it("is deterministic — identical input yields identical output", () => {
    const a = JSON.stringify(analyzeTactic(state433(), "left-midfield"));
    const b = JSON.stringify(analyzeTactic(state433(), "left-midfield"));
    expect(a).toBe(b);
  });

  it("moving the ball changes expected positions", () => {
    const left = analyzeTactic(state433(), "left-final-third");
    const right = analyzeTactic(state433(), "right-final-third");
    const sig = (r: ReturnType<typeof analyzeTactic>) =>
      r.movements.map((m) => `${m.expectedPosition.x.toFixed(1)},${m.expectedPosition.y.toFixed(1)}`).join(";");
    expect(sig(left)).not.toBe(sig(right));
  });
});

describe("known tactical patterns (spec §23)", () => {
  it("IF(A) + WB(A) on the same flank pushes that side higher up the pitch", () => {
    // Line order: index 7 = right wide midfield (x90), index 10 = RW.
    const aggressive = state433({
      7: { roleId: "wing-back", duty: "attack" },
      10: { roleId: "inside-forward", duty: "attack" },
    });
    const balanced = state433();

    // Average expected depth (lower y = higher up) of the right-flank players.
    const rightFlankAvgY = (r: ReturnType<typeof analyzeTactic>) => {
      const rightFlank = r.movements.filter((m) => m.basePosition.x > 55);
      return rightFlank.reduce((s, m) => s + m.expectedPosition.y, 0) / rightFlank.length;
    };

    expect(rightFlankAvgY(analyzeTactic(aggressive, "right-midfield"))).toBeLessThan(
      rightFlankAvgY(analyzeTactic(balanced, "right-midfield"))
    );
  });

  it("PWB(S) vs WB(S): playmaking wing-back inverts while the winger holds width", () => {
    // The inside-drift behaviour frees the outside channel for the wide partner.
    const withPWB = state433({ 7: { roleId: "playmaking-wing-back", duty: "support" } });
    const withWB = state433({ 7: { roleId: "wing-back", duty: "support" } });

    const pwbX = analyzeTactic(withPWB, "right-midfield").movements[7].expectedPosition.x;
    const wbX = analyzeTactic(withWB, "right-midfield").movements[7].expectedPosition.x;

    // PWB ends noticeably more central than a traditional wing-back.
    expect(pwbX).toBeLessThan(wbX);
    expect(wbX - pwbX).toBeGreaterThan(3);
  });

  it("multiple attack duties + weak DM cover → high transition risk", () => {
    // 4-2-4 line order: GK | LB CB CB RB | DM DM | LW STL STR RW
    const reckless = buildState("4-2-4", [
      { roleId: "sweeper-keeper", duty: "defend" },
      { roleId: "wing-back", duty: "attack" },
      { roleId: "ball-playing-defender", duty: "support" },
      { roleId: "ball-playing-defender", duty: "support" },
      { roleId: "wing-back", duty: "attack" },
      { roleId: "advanced-playmaker", duty: "attack" },
      { roleId: "channel-midfielder", duty: "attack" },
      { roleId: "inside-forward", duty: "attack" },
      { roleId: "centre-forward", duty: "attack" },
      { roleId: "centre-forward", duty: "attack" },
      { roleId: "inside-forward", duty: "attack" },
    ]);
    const solid = state433({
      3: { roleId: "wing-back", duty: "defend" },
      6: { roleId: "deep-lying-playmaker", duty: "defend" },
      7: { roleId: "wing-back", duty: "defend" },
    });

    const recklessRisk = analyzeTactic(reckless, "central-final-third").transition;
    const solidRisk = analyzeTactic(solid, "central-final-third").transition;

    expect(recklessRisk.riskScore).toBeGreaterThan(solidRisk.riskScore);
    expect(["high", "very-high"]).toContain(recklessRisk.riskLevel);
    expect(solidRisk.riskScore).toBeLessThan(recklessRisk.riskScore);
  });
});

describe("movement classification", () => {
  it("classifies overlap movement for WB(A) when ball is advanced on their flank", () => {
    const state = state433({ 7: { roleId: "wing-back", duty: "attack" } });
    const result = analyzeTactic(state, "right-final-third");
    const rw = result.movements[7];
    expect(["overlap", "forward", "underlap"]).toContain(rw.movementType);
    // The WB should end higher up the pitch than his base position.
    expect(rw.expectedPosition.y).toBeLessThan(rw.basePosition.y);
  });

  it("classifies defensive recovery when ball is deep in our third", () => {
    const result = analyzeTactic(state433(), "defensive-third");
    const cb = result.movements[2];
    expect(cb.expectedPosition.y).toBeGreaterThanOrEqual(cb.basePosition.y - 1);
  });
});

describe("relationships", () => {
  it("detects creator-runner between playmaker and centre forward", () => {
    const result = analyzeTactic(state433(), "central-midfield");
    const hasCreatorRunner = result.relationships.some((r) => r.type === "creator-runner");
    expect(hasCreatorRunner).toBe(true);
  });

  it("flags space-sharing when attackers crowd one zone", () => {
    // 4-2-4 line order: GK | CB CB | LM RM | CM CM | LW STL STR RW
    const crowded = buildState("4-2-4", [
      { roleId: "sweeper-keeper", duty: "defend" },
      { roleId: "central-defender", duty: "defend" },
      { roleId: "central-defender", duty: "defend" },
      { roleId: "full-back", duty: "support" },
      { roleId: "full-back", duty: "support" },
      { roleId: "channel-midfielder", duty: "attack" },
      { roleId: "channel-midfielder", duty: "attack" },
      { roleId: "inside-forward", duty: "attack" },
      { roleId: "centre-forward", duty: "attack" },
      { roleId: "centre-forward", duty: "attack" },
      { roleId: "inside-forward", duty: "attack" },
    ]);
    const result = analyzeTactic(crowded, "central-final-third");
    const conflicts = result.relationships.filter((r) => r.type === "space-sharing");
    expect(conflicts.length).toBeGreaterThan(0);
    expect(result.warnings.some((w) => w.id.startsWith("zone-overload"))).toBe(true);
  });
});
