import { describe, expect, it } from "vitest";
import { tacticCopyTexts } from "@/lib/tactic-copy-texts";
import { formationGuides } from "@/lib/formation-guide-slugs";

/**
 * Guides whose Copy Full Setup card has not been written yet. Keeping them in
 * one explicit list means a NEW article cannot ship without one unnoticed: the
 * article page renders the button only when `tacticCopyTexts[slug]` exists, so
 * a missing entry is a silently missing button. Remove a slug from this list
 * when its card lands.
 */
const MISSING_COPY_TEXT = new Set(["4-1-4-1-mid-block", "4-3-2-1-christmas-tree"]);

const guideFormations = new Map<string, string>(
  Object.entries(formationGuides).flatMap(([formation, guides]) =>
    guides.map((guide) => [guide.slug, formation] as const)
  )
);

describe("tactic copy texts", () => {
  it("writes a copyable setup for every guide that is not backlogged", () => {
    const missing = Array.from(guideFormations.keys()).filter(
      (slug) => !MISSING_COPY_TEXT.has(slug) && !tacticCopyTexts[slug]
    );
    expect(missing).toEqual([]);
  });

  it("keeps every backlogged guide out of the list once it is written", () => {
    const stale = Array.from(MISSING_COPY_TEXT).filter((slug) => tacticCopyTexts[slug]);
    expect(stale, "these guides have a copy text now — drop them from the list").toEqual([]);
  });

  it("only holds copy texts for slugs that are listed guides", () => {
    const orphans = Object.keys(tacticCopyTexts).filter((slug) => !guideFormations.has(slug));
    expect(orphans).toEqual([]);
  });

  it("declares each guide's own formation and a style", () => {
    for (const [slug, text] of Object.entries(tacticCopyTexts)) {
      // "4-1-2-1-2 (Diamond)" spells the shape out, so match on the prefix.
      const declared = text.match(/^FORMATION: (.+)$/m)?.[1];
      expect(declared, `${slug} declares no formation`).toBeTruthy();
      expect(declared!.startsWith(guideFormations.get(slug)!), slug).toBe(true);
      expect(text, `${slug} declares no style`).toMatch(/^STYLE: .+ \| Mentality: .+$/m);
      expect(text, `${slug} lists no roles`).toContain("PLAYER ROLES");
    }
  });
});
