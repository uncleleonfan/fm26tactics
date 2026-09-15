import { describe, it, expect } from "vitest";
import { computeDefensiveScenario } from "@/tactics/engine/defensive-engine";
import { ballZones } from "@/tactics/data/zones";
import { state433, buildState } from "@/tactics/__tests__/helpers";
import type { PlayerDuty } from "@/types/tactic";

function scenario(
  overrides: Partial<Parameters<typeof computeDefensiveScenario>[0]> = {}
) {
  const state = state433();
  return computeDefensiveScenario({
    players: state.players.map((p) => ({
      id: p.id,
      roleId: p.roleId,
      duty: p.duty as PlayerDuty,
      x: p.x,
      y: p.y,
    })),
    oppBallZone: "central-midfield",
    mentality: "balanced",
    oopInstructions: [],
    ...overrides,
  });
}

describe("defensive engine basics", () => {
  it("produces one movement per player, all inside the pitch", () => {
    for (const zone of ballZones.map((z) => z.id)) {
      const r = scenario({ oppBallZone: zone });
      expect(r.movements).toHaveLength(11);
      for (const m of r.movements) {
        expect(m.expectedPosition.x).toBeGreaterThanOrEqual(2);
        expect(m.expectedPosition.x).toBeLessThanOrEqual(98);
        expect(m.expectedPosition.y).toBeGreaterThanOrEqual(6);
        expect(m.expectedPosition.y).toBeLessThanOrEqual(96);
      }
    }
  });

  it("is deterministic — identical input yields identical output", () => {
    expect(JSON.stringify(scenario())).toBe(JSON.stringify(scenario()));
  });

  it("moving the opponent ball changes the response", () => {
    const left = scenario({ oppBallZone: "left-final-third" });
    const right = scenario({ oppBallZone: "right-final-third" });
    const sig = (r: ReturnType<typeof scenario>) =>
      r.movements.map((m) => `${m.expectedPosition.x.toFixed(1)},${m.expectedPosition.y.toFixed(1)}`).join(";");
    expect(sig(left)).not.toBe(sig(right));
  });

  it("keeps all metrics in 0-1 and the line inside pitch bounds", () => {
    for (const zone of ballZones.map((z) => z.id)) {
      const { metrics } = scenario({ oppBallZone: zone });
      for (const key of ["pressureOnBall", "compactness", "ballSideCover", "spaceInBehind"] as const) {
        expect(metrics[key]).toBeGreaterThanOrEqual(0);
        expect(metrics[key]).toBeLessThanOrEqual(1);
      }
      expect(metrics.defensiveLineY).toBeGreaterThanOrEqual(28);
      expect(metrics.defensiveLineY).toBeLessThanOrEqual(78);
    }
  });
});

describe("presser selection", () => {
  it("sends 3 pressers when the ball is in the attacking third (high press scenario)", () => {
    const r = scenario({ oppBallZone: "left-final-third" });
    const presses = r.movements.filter((m) => m.action === "press");
    expect(presses.length).toBe(3);
  });

  it("pressers close distance to the ball", () => {
    const r = scenario({ oppBallZone: "left-final-third" });
    const ball = r.ball;
    for (const m of r.movements.filter((x) => x.action === "press")) {
      const before = Math.hypot(m.basePosition.x - ball.x, m.basePosition.y - ball.y);
      const after = Math.hypot(m.expectedPosition.x - ball.x, m.expectedPosition.y - ball.y);
      expect(after).toBeLessThanOrEqual(before + 0.001);
    }
  });

  it("High Press instruction adds a presser in midfield scenarios", () => {
    const base = scenario({ oppBallZone: "left-midfield" });
    const pressed = scenario({ oppBallZone: "left-midfield", oopInstructions: ["High Press"] });
    expect(
      base.movements.filter((m) => m.action === "press").length
    ).toBe(2);
    expect(
      pressed.movements.filter((m) => m.action === "press").length
    ).toBe(3);
  });

  it("picks the same pressers for identical input (rank determinism)", () => {
    const a = scenario({ oppBallZone: "left-final-third" });
    const b = scenario({ oppBallZone: "left-final-third" });
    expect(
      a.movements.filter((m) => m.action === "press").map((m) => m.playerId)
    ).toEqual(
      b.movements.filter((m) => m.action === "press").map((m) => m.playerId)
    );
  });
});

describe("defensive line instructions", () => {
  it("Much Higher Defensive Line pushes the line up (lower y)", () => {
    const base = scenario();
    const high = scenario({ oopInstructions: ["Much Higher Defensive Line"] });
    expect(high.metrics.defensiveLineY).toBeLessThan(base.metrics.defensiveLineY - 8);
  });

  it("Much Lower Defensive Line drops the line (higher y)", () => {
    const base = scenario();
    const low = scenario({ oopInstructions: ["Much Lower Defensive Line"] });
    expect(low.metrics.defensiveLineY).toBeGreaterThan(base.metrics.defensiveLineY);
  });

  it("attacking mentality squeezes the line up vs very-defensive", () => {
    const attacking = scenario({ mentality: "attacking" });
    const cautious = scenario({ mentality: "very-defensive" });
    expect(attacking.metrics.defensiveLineY).toBeLessThan(cautious.metrics.defensiveLineY);
  });
});

describe("goalkeeper bounds", () => {
  it("GK stays in the box-ish area for every zone", () => {
    for (const zone of ballZones.map((z) => z.id)) {
      const r = scenario({ oppBallZone: zone });
      const gk = r.movements[0]; // p0 = sweeper-keeper in helpers' line order
      expect(gk.expectedPosition.x).toBeGreaterThanOrEqual(30);
      expect(gk.expectedPosition.x).toBeLessThanOrEqual(70);
      expect(gk.expectedPosition.y).toBeGreaterThanOrEqual(80);
      expect(gk.expectedPosition.y).toBeLessThanOrEqual(92);
      expect(gk.action).toBe("hold");
    }
  });
});

describe("metrics & findings", () => {
  it("ball behind a static line flags exposed line + high spaceInBehind", () => {
    const r = scenario({ oppBallZone: "defensive-third" });
    expect(r.metrics.spaceInBehind).toBeGreaterThan(0.55);
    expect(r.findings.some((f) => f.messageKey === "exposedLine")).toBe(true);
  });

  it("a spread-out shape flags a stretched block", () => {
    // GK + 10 outfield players scattered across the whole pitch.
    const players = [
      { id: "p0", roleId: "goalkeeper", duty: "defend" as PlayerDuty, x: 50, y: 88 },
      ...Array.from({ length: 10 }, (_, i) => ({
        id: `p${i + 1}`,
        roleId: "central-midfielder",
        duty: "support" as PlayerDuty,
        x: 5 + i * 10,
        y: 12 + i * 6.6,
      })),
    ];
    const r = computeDefensiveScenario({
      players,
      oppBallZone: "central-midfield",
      mentality: "balanced",
      oopInstructions: [],
    });
    expect(r.metrics.compactness).toBeLessThan(0.45);
    expect(r.findings.some((f) => f.messageKey === "stretchedBlock")).toBe(true);
  });

  it("Offside Trap surfaces an info finding", () => {
    const r = scenario({ oopInstructions: ["Offside Trap"] });
    const finding = r.findings.find((f) => f.messageKey === "offsideTrapActive");
    expect(finding?.severity).toBe("info");
  });

  it("Low Block drops the whole outfield block deeper", () => {
    const base = scenario();
    const low = scenario({ oopInstructions: ["Low Block"] });
    const avgY = (r: ReturnType<typeof scenario>) =>
      r.movements.slice(1).reduce((s, m) => s + m.expectedPosition.y, 0) / 10;
    expect(avgY(low)).toBeGreaterThan(avgY(base));
  });
});

describe("engine mirrors the possession pipeline contract", () => {
  it("accepts resolvePhasePlayers output for an OOP-designed shape", () => {
    const state = buildState("4-4-2", [
      { roleId: "sweeper-keeper", duty: "defend" },
      { roleId: "full-back", duty: "defend" },
      { roleId: "central-defender", duty: "defend" },
      { roleId: "central-defender", duty: "defend" },
      { roleId: "full-back", duty: "defend" },
      { roleId: "wide-midfielder", duty: "defend" },
      { roleId: "defensive-midfielder", duty: "defend" },
      { roleId: "central-midfielder", duty: "defend" },
      { roleId: "wide-midfielder", duty: "defend" },
      { roleId: "centre-forward", duty: "support" },
      { roleId: "centre-forward", duty: "support" },
    ]);
    const r = computeDefensiveScenario({
      players: state.players.map((p) => ({
        id: p.id, roleId: p.roleId, duty: p.duty, x: p.x, y: p.y,
      })),
      oppBallZone: "central-build-up",
      mentality: "defensive",
      oopInstructions: ["Lower Defensive Line"],
    });
    expect(r.movements).toHaveLength(11);
    // Deep 4-4-2: nobody should be classified as pressing from far away.
    expect(r.movements.some((m) => m.action === "cover")).toBe(true);
  });
});
