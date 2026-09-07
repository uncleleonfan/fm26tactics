import { describe, it, expect } from "vitest";
import { analyzeTactic } from "@/tactics/engine";
import { state433, buildState } from "@/tactics/__tests__/helpers";

/**
 * Mentality integration (FM26 7-step mindset ladder).
 * The same XI must analyze differently under very-attacking vs
 * very-defensive mindsets: positions, attack presence and risk.
 */

const avgY = (r: ReturnType<typeof analyzeTactic>) =>
  r.movements.reduce((s, m) => s + m.expectedPosition.y, 0) / r.movements.length;

describe("mentality — spatial engine", () => {
  it("very-attacking pushes the whole XI higher up the pitch than very-defensive", () => {
    const va = analyzeTactic(state433({}, "very-attacking"), "central-midfield");
    const vd = analyzeTactic(state433({}, "very-defensive"), "central-midfield");
    expect(avgY(va)).toBeLessThan(avgY(vd));
  });

  it("balanced sits between the two extremes", () => {
    const va = analyzeTactic(state433({}, "very-attacking"), "central-midfield");
    const bal = analyzeTactic(state433({}, "balanced"), "central-midfield");
    const vd = analyzeTactic(state433({}, "very-defensive"), "central-midfield");
    expect(avgY(va)).toBeLessThan(avgY(bal));
    expect(avgY(bal)).toBeLessThan(avgY(vd));
  });

  it("defensive mindsets recover deeper when the ball is in our own third", () => {
    const vd = analyzeTactic(state433({}, "very-defensive"), "defensive-third");
    const va = analyzeTactic(state433({}, "very-attacking"), "defensive-third");
    expect(avgY(vd)).toBeGreaterThan(avgY(va));
  });
});

describe("mentality — risk engine", () => {
  it("very-attacking carries higher transition risk than very-defensive", () => {
    const va = analyzeTactic(state433({}, "very-attacking"), "central-midfield");
    const vd = analyzeTactic(state433({}, "very-defensive"), "central-midfield");
    expect(va.transition.riskScore).toBeGreaterThan(vd.transition.riskScore);
  });

  it("risk ordering is monotonic across the 7-step ladder", () => {
    const ladder = [
      "very-defensive",
      "defensive",
      "cautious",
      "balanced",
      "positive",
      "attacking",
      "very-attacking",
    ] as const;
    const scores = ladder.map((m) => analyzeTactic(state433({}, m), "central-midfield").transition.riskScore);
    for (let i = 1; i < scores.length; i++) {
      expect(scores[i]).toBeGreaterThanOrEqual(scores[i - 1]);
    }
    expect(scores[6]).toBeGreaterThan(scores[0]);
  });
});

describe("mentality — balance engine (via expected positions)", () => {
  it("very-attacking yields stronger final-third presence", () => {
    const va = analyzeTactic(state433({}, "very-attacking"), "central-midfield");
    const vd = analyzeTactic(state433({}, "very-defensive"), "central-midfield");
    expect(va.attack.finalThirdPresence).toBeGreaterThan(vd.attack.finalThirdPresence);
  });

  it("a reckless 4-2-4 on very-attacking reaches very-high risk", () => {
    // 4-2-4 line order: GK | CB CB | LM RM | CM CM | LW STL STR RW
    const reckless = buildState(
      "4-2-4",
      [
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
      ],
      "very-attacking"
    );
    const r = analyzeTactic(reckless, "central-final-third");
    expect(r.transition.riskLevel).toBe("very-high");
    const w = r.warnings.find((x) => x.id === "transition-risk-high");
    expect(w?.severity).toBe("critical");
    // The reason must attribute to the real drivers: 8 attack duties AND
    // the very-attacking mindset, not a fixed narrative.
    expect(w?.reason).toContain("8 players carry the attack duty");
    expect(w?.reason).toContain("mentality");
  });

  it("mentality-driven risk without attack duties never blames '0 players'", () => {
    // Same 4-2-4 shape, every duty relaxed to support: any remaining risk is
    // driven by aggressive roles + mindset, not by attack duties.
    const noAttackDuties = buildState(
      "4-2-4",
      [
        { roleId: "sweeper-keeper", duty: "defend" },
        { roleId: "ball-playing-defender", duty: "support" },
        { roleId: "ball-playing-defender", duty: "support" },
        { roleId: "wing-back", duty: "support" },
        { roleId: "wing-back", duty: "support" },
        { roleId: "advanced-playmaker", duty: "support" },
        { roleId: "channel-midfielder", duty: "support" },
        { roleId: "inside-forward", duty: "support" },
        { roleId: "advanced-forward", duty: "support" },
        { roleId: "advanced-forward", duty: "support" },
        { roleId: "inside-forward", duty: "support" },
      ],
      "very-attacking"
    );
    const r = analyzeTactic(noAttackDuties, "central-final-third");
    const w = r.warnings.find((x) => x.id === "transition-risk-high");
    if (w) {
      expect(w.reason).not.toContain("0 players");
      expect(w.reason).toContain("mentality");
    }
  });
});
