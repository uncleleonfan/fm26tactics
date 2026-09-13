import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  formationPresets,
  formationVariants,
  playerRoles,
  presetsForFormation,
} from "@/lib/tactics-data";
import { formationGuides } from "@/lib/formation-guide-slugs";
import {
  buildPresetPlayers,
  decodeTacticState,
  encodeTacticSetupParam,
  matchesPresetXI,
} from "@/hooks/use-tactic-builder";
import type { FormationPreset } from "@/types/tactic";

const ALL_PRESETS: FormationPreset[] = [...formationPresets, ...formationVariants];

interface GuideSlot {
  roleId: string;
  duty: string;
  x: number;
  y: number;
}

/** Parse the `setup:` list out of an article's frontmatter. */
function guideSetup(slug: string): GuideSlot[] {
  const frontmatter =
    readFileSync(path.join(process.cwd(), "content", "tactics", `${slug}.mdx`), "utf8").split(
      "---"
    )[1] ?? "";
  const line = /-\s*\{\s*roleId:\s*([\w-]+),\s*duty:\s*(\w+),\s*x:\s*([\d.]+),\s*y:\s*([\d.]+)/g;
  const setup: GuideSlot[] = [];
  let match = line.exec(frontmatter);
  while (match) {
    setup.push({
      roleId: match[1],
      duty: match[2],
      x: Number(match[3]),
      y: Number(match[4]),
    });
    match = line.exec(frontmatter);
  }
  return setup;
}

const xiOf = (preset: FormationPreset) =>
  preset.defaultRoles!.map((slot) => `${slot.roleId}:${slot.duty}`).join("|");

describe("formation presets and their variants", () => {
  it("keeps exactly one primary preset per formation", () => {
    const formations = formationPresets.map((p) => p.formation);
    expect(new Set(formations).size).toBe(formations.length);
  });

  it("gives every preset a unique id that is one of the shape's guides", () => {
    const ids = ALL_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const preset of ALL_PRESETS) {
      const slugs = (formationGuides[preset.formation] ?? []).map((g) => g.slug);
      expect(slugs, `${preset.id} is not a listed guide of ${preset.formation}`).toContain(
        preset.id
      );
    }
  });

  it("gives every guide a loadable preset, so no article CTA is dead", () => {
    const loadable = new Set(ALL_PRESETS.map((p) => p.id));
    for (const [formation, guides] of Object.entries(formationGuides)) {
      // The shape needs a preset or FormationDiagram has no positions to draw
      // the article's board from (it renders null without one).
      expect(
        formationPresets.some((p) => p.formation === formation),
        `${formation} has no preset, so its articles render no diagram`
      ).toBe(true);
      for (const guide of guides) {
        // The slug has to be a preset id: it drives both the builder card and
        // the article's Open in Builder payload.
        expect(loadable, `${guide.slug} has no preset to load`).toContain(guide.slug);
      }
    }
  });

  it("attaches variants to a real shape and names them", () => {
    for (const variant of formationVariants) {
      expect(
        formationPresets.some((p) => p.formation === variant.formation),
        `${variant.id} hangs off an unknown formation`
      ).toBe(true);
      expect(variant.variantLabel, `${variant.id} needs a variantLabel`).toBeTruthy();
      // The card still leads with the shape; the variant name is the badge.
      expect(variant.label).toBe(variant.formation);
    }
  });

  it("resolves every slot against the role database", () => {
    for (const preset of ALL_PRESETS) {
      expect(preset.defaultRoles, `${preset.id} has no XI`).toBeDefined();
      expect(preset.defaultRoles!).toHaveLength(11);
      expect(preset.positions).toHaveLength(11);
      preset.defaultRoles!.forEach((slot, i) => {
        const role = playerRoles.find((r) => r.id === slot.roleId);
        expect(role, `${preset.id} slot ${i}: unknown role ${slot.roleId}`).toBeTruthy();
        expect(role!.availableDuties, `${preset.id} slot ${i}: ${slot.duty}`).toContain(slot.duty);
      });
    }
  });

  it("gives each variant a genuinely different XI from its primary", () => {
    const formations = Array.from(new Set(formationVariants.map((v) => v.formation)));
    expect(formations.length).toBeGreaterThan(0);
    for (const formation of formations) {
      const presets = presetsForFormation(formation);
      expect(presets[0].variantLabel, `${formation} primary must stay unnamed`).toBeUndefined();
      const xis = presets.map(xiOf);
      expect(new Set(xis).size, `${formation} lists two identical XIs`).toBe(xis.length);
    }
  });

  it("recognises each variant as the loaded XI, and only itself", () => {
    for (const formation of Array.from(new Set(formationVariants.map((v) => v.formation)))) {
      const presets = presetsForFormation(formation);
      expect(presets.length).toBeGreaterThan(1);
      for (const preset of presets) {
        const players = buildPresetPlayers(preset);
        expect(matchesPresetXI(players, preset), `${preset.id} does not match itself`).toBe(true);
        for (const other of presets.filter((p) => p.id !== preset.id)) {
          expect(
            matchesPresetXI(players, other),
            `${preset.id} also claims to be ${other.id}`
          ).toBe(false);
        }
      }
    }
  });

  it("reproduces a guide's exact XI through the Try in Builder CTA", () => {
    const drifted: string[] = [];
    for (const preset of ALL_PRESETS) {
      const setup = guideSetup(preset.id);
      expect(setup, `no setup parsed from content/tactics/${preset.id}.mdx`).toHaveLength(11);

      const param = encodeTacticSetupParam(preset.formation, setup);
      expect(param, `CTA could not encode ${preset.id}`).toBeTruthy();
      const decoded = decodeTacticState(decodeURIComponent(param!))!;
      const cta = decoded.players.map((p) => `${p.roleId}:${p.duty}`).join("|");
      // …and the card that lights up for that payload must be the one whose
      // article the CTA came from, not a different take on the same shape.
      if (cta !== xiOf(preset) || !matchesPresetXI(decoded.players, preset)) {
        drifted.push(`${preset.id}\n  CTA  ${cta}\n  card ${xiOf(preset)}`);
      }
    }
    expect(drifted).toEqual([]);
  });

  it("lists the primary first, then its variants", () => {
    expect(presetsForFormation("3-5-2").map((p) => p.id)).toEqual([
      "3-5-2-counter-attack",
      "3-5-2-catenaccio",
    ]);
    expect(presetsForFormation("4-3-3").map((p) => p.id)).toEqual([
      "4-3-3-tiki-taka",
      "4-3-3-fluid-counter",
    ]);
    expect(presetsForFormation("4-4-2").map((p) => p.id)).toEqual(["4-4-2-wing-play"]);
  });
});
