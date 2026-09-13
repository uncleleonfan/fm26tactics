/**
 * Formation → primary deep-dive guide slug (/tactics/<slug>).
 *
 * Client-safe mapping (keeps contentlayer data out of the client bundle —
 * importing `contentlayer/generated` in a client component would inline every
 * document body). Keep in sync with content/tactics/*.mdx: when a formation
 * has multiple guides this lists the first one, matching the formations page.
 */
export const formationGuideSlugs: Record<string, string> = {
  "3-3-3-1": "3-3-3-1-vertical-bands",
  "3-4-2-1": "3-4-2-1-counter-attack",
  "3-4-3": "3-4-3-control-possession",
  "3-5-2": "3-5-2-catenaccio",
  "4-1-2-1-2": "4-1-2-1-2-diamond",
  "4-1-4-1": "4-1-4-1-mid-block",
  "4-2-2-2": "4-2-2-2-fluid-attack",
  "4-2-3-1": "4-2-3-1-gegenpress",
  "4-2-4": "4-2-4-attacking",
  "4-3-2-1": "4-3-2-1-christmas-tree",
  "4-3-3": "4-3-3-fluid-counter",
  "4-4-1-1": "4-4-1-1-counter-attack",
  "4-4-2": "4-4-2-wing-play",
  "4-5-1": "4-5-1-midfield-wall",
  "5-1-2-2": "5-1-2-2-anchor-strike",
  "5-2-3": "5-2-3-gegenpress",
  "5-3-2": "5-3-2-route-one",
};
