import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { formationGuideSlugs, formationGuides } from "@/lib/formation-guide-slugs";
import { formationPresets } from "@/lib/tactics-data";

const GUIDES_DIR = path.join(process.cwd(), "content", "tactics");

/** slug → the `formation` its frontmatter declares, for every article on disk. */
function guidesOnDisk(): Map<string, string> {
  const onDisk = new Map<string, string>();
  for (const file of readdirSync(GUIDES_DIR).filter((f) => f.endsWith(".mdx"))) {
    const frontmatter = readFileSync(path.join(GUIDES_DIR, file), "utf8").split("---")[1] ?? "";
    const match = frontmatter.match(/^formation:\s*"?([^"\n]+)"?/m);
    onDisk.set(file.replace(/\.mdx$/, ""), match ? match[1].trim() : "");
  }
  return onDisk;
}

describe("formationGuides", () => {
  it("only lists guides that exist and declare the same formation", () => {
    const onDisk = guidesOnDisk();
    for (const [formation, guides] of Object.entries(formationGuides)) {
      for (const guide of guides) {
        expect(onDisk.has(guide.slug), `${guide.slug} is not a file in content/tactics`)
          .toBe(true);
        expect(onDisk.get(guide.slug), `${guide.slug} frontmatter formation`).toBe(formation);
      }
    }
  });

  it("lists every article in content/tactics", () => {
    const listed = new Set(
      Object.values(formationGuides).flatMap((guides) => guides.map((g) => g.slug))
    );
    const missing = Array.from(guidesOnDisk().keys()).filter((slug) => !listed.has(slug));
    expect(missing, "articles missing from formationGuides").toEqual([]);
  });

  it("has no duplicate slug within a formation", () => {
    for (const [formation, guides] of Object.entries(formationGuides)) {
      const slugs = guides.map((g) => g.slug);
      expect(new Set(slugs).size, `${formation} lists a slug twice`).toBe(slugs.length);
    }
  });

  it("covers every formation the builder can load, primary guide first", () => {
    for (const preset of formationPresets) {
      const guides = formationGuides[preset.formation];
      expect(guides, `no guide listed for ${preset.formation}`).toBeTruthy();
      expect(formationGuideSlugs[preset.formation]).toBe(guides[0].slug);
    }
  });
});
