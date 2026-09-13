import { describe, expect, it } from "vitest";
import { formationPresets } from "@/lib/tactics-data";
import { tacticTemplates } from "@/lib/tactic-templates";
import {
  buildPresetPlayers,
  findAppliedTemplate,
  matchesPresetXI,
} from "@/hooks/use-tactic-builder";
import type { PlayerDuty, PlayerNode } from "@/types/tactic";

/** The XI a meta template puts on the board (ids/positions are irrelevant here). */
function templateXI(assignments: { roleId: string; duty: PlayerDuty }[]): PlayerNode[] {
  return assignments.map((a, i) => ({
    id: `player-${i}`,
    x: 0,
    y: 0,
    roleId: a.roleId,
    duty: a.duty,
    individualInstructions: [],
  }));
}

const presetFor = (formation: string) =>
  formationPresets.find((f) => f.formation === formation)!;

describe("matchesPresetXI", () => {
  it("accepts the default XI of every formation preset", () => {
    for (const preset of formationPresets) {
      expect(matchesPresetXI(buildPresetPlayers(preset), preset)).toBe(true);
    }
  });

  it("rejects the same formation once a single duty deviates", () => {
    const preset = presetFor("4-3-3");
    // Slot 1 is a full-back on support in the preset.
    const players = buildPresetPlayers(preset).map((p, i) =>
      i === 1 ? { ...p, duty: "defend" as PlayerDuty } : p
    );
    expect(matchesPresetXI(players, preset)).toBe(false);
  });

  it("rejects a meta template XI loaded on top of the same formation", () => {
    const template = tacticTemplates.find((t) => t.id === "gegenpress-4-3-3")!;
    expect(
      matchesPresetXI(templateXI(template.roleAssignments), presetFor(template.formation))
    ).toBe(false);
  });

  it("rejects an XI of the wrong length", () => {
    const preset = presetFor("4-3-3");
    expect(matchesPresetXI(buildPresetPlayers(preset).slice(0, 10), preset)).toBe(false);
  });
});

describe("findAppliedTemplate", () => {
  it("names the template each template XI came from", () => {
    for (const template of tacticTemplates) {
      expect(findAppliedTemplate(templateXI(template.roleAssignments))?.id).toBe(template.id);
    }
  });

  it("returns undefined for an XI that matches no template", () => {
    expect(findAppliedTemplate(buildPresetPlayers(presetFor("4-4-2")))).toBeUndefined();
  });
});
