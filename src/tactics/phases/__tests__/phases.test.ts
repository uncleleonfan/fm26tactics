import { describe, it, expect } from "vitest";
import { formationPresets, playerRoles } from "@/lib/tactics-data";
import {
  ensurePhases,
  resolvePhasePlayers,
  encodeTacticState,
  decodeTacticState,
} from "@/hooks/use-tactic-builder";
import { recognizeShape, type ShapePoint } from "@/tactics/phases/shape-recognition";
import { computePhaseMetrics } from "@/tactics/phases/phase-analysis";
import { analyzeTransition } from "@/tactics/phases/transition-analysis";
import type {
  PhasePlayerMap,
  PlayerNode,
  TacticBoardState,
} from "@/types/tactic";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

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
    teamInstructions: {
      mentality: "balanced",
      inPossession: [],
      inTransition: [],
      outOfPossession: [],
    },
  };
}

/** [x, y] pairs; index 0 is the goalkeeper (matching formation presets). */
function makePlayers(coords: Array<[number, number]>): PlayerNode[] {
  const gk = playerRoles.find((r) => r.id === "sweeper-keeper")!;
  const outfield = playerRoles.filter((r) => r.category !== "goalkeeper");
  return coords.map(([x, y], i) => ({
    id: `p${i}`,
    x,
    y,
    roleId: i === 0 ? gk.id : outfield[(i - 1) % outfield.length].id,
    duty: "support",
    individualInstructions: [],
  }));
}

function phaseMapFor(players: PlayerNode[], coords: Array<[number, number]>): PhasePlayerMap {
  return Object.fromEntries(
    players.map((p, i) => [p.id, { x: coords[i][0], y: coords[i][1] }])
  );
}

/** Explicit shape points: a GK plus horizontal lines of outfield players. */
function points(lines: Array<{ y: number; xs: number[] }>): ShapePoint[] {
  const out: ShapePoint[] = [{ id: "gk", x: 50, y: 88, isGoalkeeper: true }];
  let i = 0;
  for (const line of lines) {
    for (const x of line.xs) {
      out.push({ id: `o${i++}`, x, y: line.y, isGoalkeeper: false });
    }
  }
  return out;
}

// Conservative 4-4-2: deep block, nobody in the final third, both phases identical.
const LOW_RISK_PLAYERS = makePlayers([
  [50, 88], // GK
  [15, 75], [35, 75], [65, 75], [85, 75], // back 4
  [15, 55], [38, 55], [62, 55], [85, 55], // mid 4
  [38, 35], [62, 35], // front 2
]);

// All-out attack in possession vs a bizarre high defensive line out of possession.
const HIGH_RISK_IN = makePlayers([
  [50, 88], // GK
  [15, 15], [35, 15], [50, 15], [65, 15], [85, 15], // 5 committed forward
  [15, 50], [35, 50],
  [50, 70], [65, 70], [85, 70],
]);
const HIGH_RISK_OUT: Array<[number, number]> = [
  [50, 88],
  [15, 70], [35, 70],
  [50, 50], [65, 50],
  [85, 20], [15, 20], [35, 20],
  [50, 40], [65, 40], [85, 40],
];

// ---------------------------------------------------------------------------
// Legacy data migration (ensurePhases / decodeTacticState)
// ---------------------------------------------------------------------------

describe("ensurePhases migration", () => {
  it("duplicates base positions into both phases for legacy state without phases", () => {
    const legacy = stateForFormation("4-4-2");
    expect(legacy.phases).toBeUndefined();

    const migrated = ensurePhases(legacy);
    expect(migrated.phases).toBeDefined();
    for (const phase of ["in-possession", "out-of-possession"] as const) {
      for (const p of legacy.players) {
        expect(migrated.phases![phase][p.id]).toEqual({ x: p.x, y: p.y });
      }
    }
    // Roles, duties and instructions stay untouched
    expect(migrated.players).toEqual(legacy.players);
    expect(migrated.teamInstructions).toEqual(legacy.teamInstructions);
  });

  it("returns valid phase data untouched (same reference, movement preserved)", () => {
    const state = ensurePhases(stateForFormation("4-3-3"));
    const target = state.players[5];
    state.phases!["in-possession"][target.id] = { x: 42, y: 42, movement: { type: "press" } };

    expect(ensurePhases(state)).toBe(state);
  });

  it("regenerates stale phase maps saved across a formation change", () => {
    const state = ensurePhases(stateForFormation("4-4-2"));
    // Simulate drift: one player has no entry in the out-of-possession map
    const stale = {
      ...state,
      players: state.players.map((p, i) => (i === 10 ? { ...p, id: "p10-new" } : p)),
    };
    const regenerated = ensurePhases(stale);
    expect(regenerated).not.toBe(stale);
    const newcomer = regenerated.players[10];
    expect(regenerated.phases!["out-of-possession"][newcomer.id]).toEqual({
      x: newcomer.x,
      y: newcomer.y,
    });
  });
});

describe("decodeTacticState legacy compatibility", () => {
  it("migrates legacy shared-link payloads on decode", () => {
    const legacy = stateForFormation("4-2-3-1");
    const decoded = decodeTacticState(encodeTacticState(legacy));

    expect(decoded).not.toBeNull();
    expect(decoded!.phases).toBeDefined();
    for (const p of legacy.players) {
      expect(decoded!.phases!["in-possession"][p.id]).toEqual({ x: p.x, y: p.y });
      expect(decoded!.phases!["out-of-possession"][p.id]).toEqual({ x: p.x, y: p.y });
    }
  });

  it("preserves edited phase coordinates and movement arrows through a round trip", () => {
    const state = ensurePhases(stateForFormation("4-3-3"));
    const target = state.players[7];
    state.phases!["in-possession"][target.id] = { x: 33, y: 33, movement: { type: "forward" } };
    state.phases!["out-of-possession"][target.id] = { x: 66, y: 66 };

    const decoded = decodeTacticState(encodeTacticState(state));
    expect(decoded!.phases!["in-possession"][target.id]).toEqual({
      x: 33,
      y: 33,
      movement: { type: "forward" },
    });
    expect(decoded!.phases!["out-of-possession"][target.id]).toEqual({ x: 66, y: 66 });
  });

  it("returns null for invalid payloads instead of throwing", () => {
    expect(decodeTacticState("not-valid-base64!!")).toBeNull();
    // Valid base64 of a JSON that is not a tactic state
    expect(decodeTacticState(btoa("hello world"))).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Phase resolution
// ---------------------------------------------------------------------------

describe("resolvePhasePlayers", () => {
  it("overlays phase coordinates on base player identities", () => {
    const state = ensurePhases(stateForFormation("4-4-2"));
    state.phases!["in-possession"][state.players[9].id] = { x: 10, y: 20 };

    const resolved = resolvePhasePlayers(state, "in-possession");
    expect(resolved[9]).toMatchObject({ id: state.players[9].id, x: 10, y: 20, roleId: state.players[9].roleId });
    // Untouched players keep their base coordinates
    expect(resolved[0]).toMatchObject({ x: state.players[0].x, y: state.players[0].y });
  });

  it("falls back to base positions for players missing a phase entry", () => {
    const state = ensurePhases(stateForFormation("4-4-2"));
    delete state.phases!["out-of-possession"][state.players[4].id];
    state.phases!["out-of-possession"][state.players[5].id] = { x: 70, y: 70 };

    const resolved = resolvePhasePlayers(state, "out-of-possession");
    expect(resolved[4]).toMatchObject({ x: state.players[4].x, y: state.players[4].y });
    expect(resolved[5]).toMatchObject({ x: 70, y: 70 });
  });

  it("returns base players when no phase data exists", () => {
    const legacy = stateForFormation("3-5-2");
    expect(resolvePhasePlayers(legacy, "in-possession")).toEqual(legacy.players);
  });
});

// ---------------------------------------------------------------------------
// Shape recognition
// ---------------------------------------------------------------------------

describe("recognizeShape", () => {
  it("recognizes a 4-4-2 and orders lines back to front", () => {
    const r = recognizeShape(points([
      { y: 72, xs: [15, 38, 62, 85] },
      { y: 48, xs: [15, 38, 62, 85] },
      { y: 20, xs: [38, 62] },
    ]));

    expect(r.label).toBe("4-4-2");
    expect(r.lines).toHaveLength(3);
    expect(r.goalkeeperId).toBe("gk"); // GK excluded from lines
    expect(r.lines[0].count).toBe(4); // defensive line first
    expect(r.lines[2].count).toBe(2);
    expect(r.lastLineY).toBe(72);
    expect(r.firstLineY).toBe(20);
  });

  it("recognizes a 2-3-5 with modern numbering direction", () => {
    const r = recognizeShape(points([
      { y: 70, xs: [30, 70] },
      { y: 45, xs: [15, 50, 85] },
      { y: 18, xs: [10, 30, 50, 70, 90] },
    ]));

    expect(r.label).toBe("2-3-5");
  });

  it("merges banks less than the line-gap threshold apart", () => {
    // Two banks 6 units apart merge (threshold is 8)
    const r = recognizeShape(points([
      { y: 50, xs: [20, 80] },
      { y: 56, xs: [35, 65] },
      { y: 90, xs: [50] },
    ]));

    expect(r.lines).toHaveLength(2);
    expect(r.label).toBe("1-4");
  });

  it("computes width, central presence and confidence", () => {
    const r = recognizeShape(points([
      { y: 72, xs: [15, 38, 62, 85] },
      { y: 48, xs: [15, 38, 62, 85] },
      { y: 20, xs: [38, 62] },
    ]));

    expect(r.width).toBe(70); // 85 - 15
    expect(r.centralPlayers).toBe(6); // 38/62 pairs across all three lines
    expect(r.confidence).toBeGreaterThan(0);
    expect(r.confidence).toBeLessThanOrEqual(1);
  });

  it("recognizes every formation preset as its own label (badge regression)", () => {
    for (const preset of formationPresets) {
      const state = stateForFormation(preset.formation);
      const shape = recognizeShape(
        state.players.map((p) => ({
          id: p.id,
          x: p.x,
          y: p.y,
          isGoalkeeper: p.roleId === "sweeper-keeper",
        }))
      );
      expect(shape.label, `${preset.formation} preset shape`).toBe(preset.label);
    }
  });
});

// ---------------------------------------------------------------------------
// Phase metrics
// ---------------------------------------------------------------------------

describe("computePhaseMetrics", () => {
  it("counts final-third, rest-defence and press-line players (GK excluded)", () => {
    const identity = HIGH_RISK_IN.map((p) => [p.x, p.y] as [number, number]);
    const metrics = computePhaseMetrics(
      HIGH_RISK_IN,
      phaseMapFor(HIGH_RISK_IN, identity)
    );

    // 5 attackers at y=15, 2 at y=50, 3 at y=70
    expect(metrics.shape.label).toBe("3-2-5");
    expect(metrics.finalThirdCount).toBe(5);
    expect(metrics.restDefenceCount).toBe(3);
    expect(metrics.pressLineCount).toBe(5);
    expect(metrics.boxPresence).toBe(3); // y<=25 and 20<=x<=80
  });

  it("prefers phase coordinates over base coordinates", () => {
    const base = LOW_RISK_PLAYERS.map((p) => [p.x, p.y] as [number, number]);
    const shifted: Array<[number, number]> = base.map(([x, y], i) =>
      i === 0 ? [x, y] : [x, Math.max(5, y - 30)]
    );
    const metrics = computePhaseMetrics(LOW_RISK_PLAYERS, phaseMapFor(LOW_RISK_PLAYERS, shifted));

    // Pushed 30 up: mids (y 25) and strikers (y 5) reach the final third
    expect(metrics.finalThirdCount).toBe(6);
  });
});

// ---------------------------------------------------------------------------
// Transition analysis
// ---------------------------------------------------------------------------

describe("analyzeTransition", () => {
  it("rates identical conservative phases as low risk with no findings", () => {
    const identity = LOW_RISK_PLAYERS.map((p) => [p.x, p.y] as [number, number]);
    const phases = {
      "in-possession": phaseMapFor(LOW_RISK_PLAYERS, identity),
      "out-of-possession": phaseMapFor(LOW_RISK_PLAYERS, identity),
    };

    const result = analyzeTransition(LOW_RISK_PLAYERS, phases);
    expect(result.riskLevel).toBe("low");
    expect(result.riskScore).toBeLessThan(0.35);
    expect(result.findings).toEqual([]);
    expect(result.avgShift).toBe(0);
    expect(result.possessionShapeLabel).toBe("4-4-2");
    expect(result.defensiveShapeLabel).toBe("4-4-2");
  });

  it("flags exposure, long recovery and thin cover on a reckless split", () => {
    const inMap = phaseMapFor(HIGH_RISK_IN, HIGH_RISK_IN.map((p) => [p.x, p.y] as [number, number]));
    const outMap = phaseMapFor(HIGH_RISK_IN, HIGH_RISK_OUT);
    const result = analyzeTransition(HIGH_RISK_IN, {
      "in-possession": inMap,
      "out-of-possession": outMap,
    });

    // exposure 0.5, avgShift 33.5, cover 0.4 → 0.45*0.5 + 0.35*1 + 0.2*0.6 = 0.695
    expect(result.riskLevel).toBe("high");
    expect(result.riskScore).toBeCloseTo(0.7, 1);
    expect(result.avgShift).toBeCloseTo(33.5, 1);

    const ids = result.findings.map((f) => f.id);
    expect(ids).toContain("transition-exposure");
    expect(ids).toContain("long-recovery");
    expect(ids).toContain("thin-cover");

    // Biggest shifts sorted descending; recoveryY positive = dropping back
    expect(result.biggestShifts[0].distance).toBe(55);
    const firstShifter = result.biggestShifts[0];
    expect(firstShifter.recoveryY).toBeGreaterThan(0);
  });

  it("keeps the goalkeeper out of the recovery burden", () => {
    const inMap = phaseMapFor(HIGH_RISK_IN, HIGH_RISK_IN.map((p) => [p.x, p.y] as [number, number]));
    const outMap = phaseMapFor(HIGH_RISK_IN, HIGH_RISK_OUT);
    const result = analyzeTransition(HIGH_RISK_IN, {
      "in-possession": inMap,
      "out-of-possession": outMap,
    });

    expect(result.biggestShifts.map((s) => s.playerId)).not.toContain("p0");
  });
});
