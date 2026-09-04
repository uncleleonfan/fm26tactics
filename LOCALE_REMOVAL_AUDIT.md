# Locale Removal Audit — Remove /tr /fr /de

> Date: 2026-09-04 · Branch: `remove-non-en-locales` · Status: AUDIT ONLY (no code changed yet)
>
> Decision: FM26Tactics becomes English-only. GSC 28d: /tr = 17 impressions / 0 clicks; /fr, /de = 0 / 0.

## 1. Locale Routes (app router)

| Route segment | Files | Note |
|---|---|---|
| `src/app/[locale]/layout.tsx` | generateStaticParams → `routing.locales.map()` | KEEP (auto-shrinks to en) |
| `src/app/[locale]/layout.tsx:36-40` | `localeOgMap` has `de: "de_DE"`, `fr: "fr_FR"` (tr falls back to en_US) | MODIFY: remove de/fr entries |
| All 12 page blocks under `[locale]` | — | KEEP structure (en-only via routing) |

## 2. Locale Middleware

| Location | Finding | Action |
|---|---|---|
| `src/middleware.ts:7-24` | BOT_UA regex + `pathname.match(/^\/(de\|fr)(\/\|$)/)` → 301 strip for bots; NOTE comment about tr | MODIFY: delete entire bot block; keep plain `intlMiddleware` |

## 3. i18n Config

| Location | Finding | Action |
|---|---|---|
| `src/i18n/routing.ts:5` | `locales: ["en", "de", "fr", "tr"]` | MODIFY → `["en"]` |
| `src/i18n/request.ts` | dynamic `routing.locales.includes()` + `messages/${locale}.json` import | KEEP (auto-shrinks) |

## 4. Redirects (existing precedent: `/it` removal)

| Location | Finding | Action |
|---|---|---|
| `next.config.mjs:21-34` | `/it` + `/it/:path*` permanent redirects | ADD: `/tr`, `/tr/:path*`, `/fr`, `/fr/:path*`, `/de`, `/de/:path*` → `/:path*` (308) |

Redirect mapping (single-hop, no chains):

```
/tr            → /            /tr/tactics        → /tactics
/tr/formations → /formations  /tr/tactics/:slug  → /tactics/:slug
/tr/roles      → /roles       /tr/best           → /best
/tr/meta       → /meta        /tr/blog/:slug     → /blog/:slug
(fr / de: identical pattern via :path* wildcard)
```

Loop safety: next.config redirects run BEFORE next-intl middleware; `/` is defaultLocale with `localePrefix: "as-needed"` (never re-prefixed).

## 5. Translation Files

| File | Action |
|---|---|
| `messages/tr.json` | DELETE (after build passes without it) |
| `messages/de.json` | DELETE |
| `messages/fr.json` | DELETE |
| `messages/en.json` | KEEP — single source |

## 6. Contentlayer / TR Content

| Location | Finding | Action |
|---|---|---|
| `contentlayer.config.ts:40-78` | `TacticTr` document type (`filePathPattern: "tr/tactics/**/*.mdx"`) | MODIFY: delete type + remove from `documentTypes` (:170) |
| `content/tr/tactics/` | 14 TR MDX files | DELETE directory |
| `src/lib/community-data-tr.ts` | TR-only data (formationInsightsTr, metaRolesTr, bestRoleCombosTr, communityConsensusTr, dualFormationTipsTr, commonMistakesTr, topTestedNotesTr) | DELETE (only imported by meta-page.tsx + community-insights.tsx — both cleaned in §9) |

## 7. Sitemap / hreflang / canonical

| Location | Finding | Action |
|---|---|---|
| `src/app/sitemap.ts:1` | `import { allTacticTrs }` | REMOVE import |
| `src/app/sitemap.ts:10-11` | `trSlugs` Set | DELETE |
| `src/app/sitemap.ts:13-31` | `localeAwarePaths`/`localeAwareRoutes` build `languages = { en, tr }` alternates for home/tactics/best/formations/meta | DELETE tr alternates → plain en URLs |
| `src/app/sitemap.ts:51-58` | en tactic pages reverse-declare tr alternate | DELETE |
| `src/app/sitemap.ts:61-73,99` | `trTacticRoutes` (14 TR URLs + hreflang) | DELETE |
| `src/lib/metadata.ts:94-130` | `LocaleSEOProps.tr` field + `generateLocaleSEO` (isTr, `/tr${suffix}`, `ogLocale: "tr_TR"`, en↔tr hreflang, x-default) | MODIFY: strip tr; simplify to en-only output |
| `src/lib/metadata.ts:14-18,19,33,44` | comments + `languageAlternates` param | MODIFY: remove tr examples; param stays (used by tactics/[slug]) |
| `src/app/robots.ts` | allow-all, no locale logic | KEEP unchanged |

Canonical after change: every page canonical = its English URL (e.g. `/tactics` → `https://www.fm26tactics.com/tactics`).

## 8. Language Switcher

| Location | Finding | Action |
|---|---|---|
| `src/components/shared/language-switcher.tsx` | entire component | DELETE |
| `src/components/layout/header.tsx:11,93` | import + `<LanguageSwitcher />` | REMOVE both |
| `src/components/layout/footer.tsx` | no switcher | KEEP |

## 9. TR Branch Logic in Components (isTr)

| File | Location | Content | Action |
|---|---|---|---|
| `src/components/home/meta-page.tsx` | :17-23 import, :38-49 `isTr` + 6 ternaries | TR data selection | MODIFY: use EN data directly, drop import |
| `src/components/home/community-insights.tsx` | :7 import, :17 `isTr`, :18, :74 | metaRolesTr / topTestedNotesTr | MODIFY: use EN |
| `src/components/shared/related-tactics.tsx` | :15,20 `locale === "tr" ? allTacticTrs : allTactics` | TR pool | MODIFY: use allTactics |
| `src/components/builder/instruction-panel.tsx` | — | NO locale logic (verified: 0 matches) | KEEP |

## 10. TR Branch Logic in Pages

| File | Location | Content | Action |
|---|---|---|---|
| `src/app/[locale]/page.tsx` | :35 comment, :49-57 `tr:` SEO object, :84 `faqTr`, :108 `params.locale === "tr" ? faqTr : faqEn` | MODIFY: strip tr branches |
| `src/app/[locale]/tactics/page.tsx` | :13,:41 comments, :132 `faqPairsTr`, :169-170 `isTr`+anchors, :327 `isTr ? allTacticTrs`, :329-330 TR fallback block, :395 faqs | MODIFY: strip all |
| `src/app/[locale]/tactics/[slug]/page.tsx` | :2 import allTacticTrs, :14 trSlugs, :19,:28-29 gSP tr params, :37-58 TR metadata+alternates, :66-89 en reverse-declare, :96-113 TR page lookup + fallback redirect | MODIFY: strip all TR paths; gSP en-only |
| `src/app/[locale]/best/page.tsx` | :10 comment, :80 `faqTr`, :97 `locale === "tr"` | MODIFY: strip |

Verified FALSE POSITIVES (keep untouched): `roles/[slug]/page.tsx`, `privacy/page.tsx`, `builder/layout.tsx` (only "distribution"/English text matches); `src/lib/tactic-copy-texts.ts`, `tactic-templates.ts`, `role-wonderkids.ts`, `tactics-data.ts` ("Distribute", "inTransition", "Prevent Short GK Distribution" — English FM terms, not Turkish).

## 11. Internal Links to Old Locales

Grep for hardcoded `/tr/`, `/fr/`, `/de/` hrefs in src/: none found outside the metadata/sitemap alternates already covered in §7. next-intl `Link` component usage is architecture-normal → KEEP.

## 12. Database / API locale dependency

No supabase/ directory; no database in repo. Contentlayer is the only content source (covered in §6). GA4/analytics: no locale-keyed events found. → No action.

## 13. Execution Order

1. next.config.mjs redirects + middleware simplify
2. routing.ts → `["en"]` + layout localeOgMap
3. SEO cleanup (sitemap, metadata.ts, tactics/[slug])
4. UI cleanup (header, language-switcher, meta-page, community-insights, related-tactics, page FAQs)
5. Delete assets (content/tr/, messages/{tr,de,fr}.json, community-data-tr.ts, TacticTr type)
6. `next build` + lint + typecheck
7. Vercel Preview: test 18 old URLs (tr/fr/de × home/tactics/formations/roles/best + /tr/tactics/:slug sample) redirect→200; English regression list all 200
