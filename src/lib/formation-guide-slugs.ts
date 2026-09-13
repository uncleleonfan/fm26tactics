/**
 * Formation → every deep-dive guide written for it (/tactics/<slug>).
 *
 * Client-safe, hand-maintained data (importing `contentlayer/generated` in a
 * client component would inline every document body), so a test cross-checks
 * both directions against content/tactics/*.mdx: no stale slug here, no article
 * missing from here.
 *
 * ORDER MATTERS. The FIRST entry is the article the Tactic Builder preset's
 * roles were transcribed from — the preset carries that slug as its `id`, and
 * `formationVariants` in tactics-data.ts holds one entry per extra article.
 * Picking a formation card loads that preset's XI, so the card's primary guide
 * link must point at the same article; otherwise the roles on the board and the
 * article you land on describe two different elevens. Further entries are other
 * documented ways to play the same shape (3-5-2 counter-attack vs catenaccio)
 * and get a card of their own.
 */
export interface FormationGuide {
  slug: string;
  /** Short name for card chips — the article's own name, minus its subtitle. */
  label: string;
}

export const formationGuides: Record<string, FormationGuide[]> = {
  "3-3-3-1": [{ slug: "3-3-3-1-vertical-bands", label: "3-3-3-1 Vertical Bands" }],
  "3-4-2-1": [{ slug: "3-4-2-1-counter-attack", label: "3-4-2-1 Counter-Attack" }],
  "3-4-3": [{ slug: "3-4-3-control-possession", label: "3-4-3 Control Possession" }],
  "3-5-2": [
    // Preset roles come from counter-attack, not catenaccio.
    { slug: "3-5-2-counter-attack", label: "3-5-2 Counter-Attack" },
    { slug: "3-5-2-catenaccio", label: "3-5-2 Catenaccio" },
  ],
  "4-1-2-1-2": [{ slug: "4-1-2-1-2-diamond", label: "4-1-2-1-2 Diamond Narrow" }],
  "4-1-4-1": [{ slug: "4-1-4-1-mid-block", label: "4-1-4-1 Mid-Block" }],
  "4-2-2-2": [{ slug: "4-2-2-2-fluid-attack", label: "4-2-2-2 Fluid Attack" }],
  "4-2-3-1": [{ slug: "4-2-3-1-gegenpress", label: "4-2-3-1 Gegenpress" }],
  "4-2-4": [{ slug: "4-2-4-attacking", label: "4-2-4 Attacking" }],
  "4-3-2-1": [{ slug: "4-3-2-1-christmas-tree", label: "4-3-2-1 Christmas Tree" }],
  "4-3-3": [
    // Preset roles come from tiki-taka, not fluid counter.
    { slug: "4-3-3-tiki-taka", label: "4-3-3 Tiki-Taka" },
    { slug: "4-3-3-fluid-counter", label: "4-3-3 Fluid Counter" },
  ],
  "4-4-1-1": [{ slug: "4-4-1-1-counter-attack", label: "4-4-1-1 Counter-Attack" }],
  "4-4-2": [{ slug: "4-4-2-wing-play", label: "4-4-2 Wing Play" }],
  "4-5-1": [{ slug: "4-5-1-midfield-wall", label: "4-5-1 Midfield Wall" }],
  "5-1-2-2": [{ slug: "5-1-2-2-anchor-strike", label: "5-1-2-2 Anchor Strike" }],
  "5-2-3": [{ slug: "5-2-3-gegenpress", label: "5-2-3 Gegenpress" }],
  "5-3-2": [{ slug: "5-3-2-route-one", label: "5-3-2 Route One" }],
};

/**
 * Formation → primary guide slug, for consumers that only want one link
 * (e.g. the /meta table's formation column). Derived from the lists above so
 * the two can never disagree.
 */
export const formationGuideSlugs: Record<string, string> = Object.fromEntries(
  Object.entries(formationGuides).map(([formation, guides]) => [formation, guides[0].slug])
);
