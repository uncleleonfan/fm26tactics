import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { TacticsList } from "@/components/tactics/tactics-list";
import { JsonLd } from "@/components/shared/json-ld";
import { allTactics, allTacticTrs } from "contentlayer/generated";
import type { Tactic } from "contentlayer/generated";
import { ArrowRight, BookOpen, Globe, LayoutGrid, Sparkles } from "lucide-react";
import { generateSEO } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "FM26 Tactics Library — Best FM26 Tactics & Formations",
  description:
    "Explore the complete FM26 tactics library — every formation with player roles, team instructions, and performance breakdowns. Find the best FM26 tactics for your squad in Football Manager 2026.",
  path: "/tactics",
});

// Turkish pilot: only translated tactics are exposed under /tr (see docs/optimization-plan-2026-09.md §2b)
const trSlugs = new Set(allTacticTrs.map((t) => t.slug));

const formationAnchors = [
  { slug: "4-3-3-tiki-taka", label: "4-3-3", style: "Tiki-Taka" },
  { slug: "4-2-3-1-gegenpress", label: "4-2-3-1", style: "Gegenpress" },
  { slug: "3-5-2-catenaccio", label: "3-5-2", style: "Catenaccio" },
  { slug: "4-4-2-wing-play", label: "4-4-2", style: "Wing Play" },
  { slug: "4-1-2-1-2-diamond", label: "4-1-2-1-2", style: "Diamond" },
];

const relatedArticles = [
  { slug: "gegenpress-setup-guide", label: "Gegenpress Setup Guide" },
  { slug: "de-zerbi-tactics-fm26", label: "De Zerbi Tactics" },
  { slug: "fm26-best-tactics-beginners", label: "Best FM26 Tactics for Beginners" },
  { slug: "how-to-load-tactics-fm26", label: "How to Load Tactics in FM26" },
];

const faqData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the best FM26 tactics?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The best FM26 tactics depend on your squad and style of play. The 4-2-3-1 gegenpress is a top choice for high pressing, 4-3-3 systems dominate possession and meta play, while the 3-5-2 works brilliantly for counter-attacking teams.",
      },
    },
    {
      "@type": "Question",
      name: "How do I choose the right FM26 formation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Match the formation to your squad's strengths. Strong wingers? Use a 4-2-3-1 or 4-4-2. A stacked midfield? Try a 4-3-3. An underdog with a deep defensive line? The 3-5-2 or 5-3-2 counter is a proven choice.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best FM26 tactic for beginners?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Start with the 4-2-3-1 gegenpress or the balanced 4-4-2 wing play. Both are straightforward to set up, forgiving in the FM26 match engine, and teach the core principles of Football Manager tactics.",
      },
    },
    {
      "@type": "Question",
      name: "Can I create my own FM26 tactic?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — use the free FM26 Tactic Builder to place players, assign roles and duties, configure team instructions, and export or share your custom formation for Football Manager 2026.",
      },
    },
  ],
};

export default async function TacticsListPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const isTr = locale === "tr";
  const anchors = isTr
    ? formationAnchors.filter((a) => trSlugs.has(a.slug))
    : formationAnchors;
  const tc = await getTranslations({ locale, namespace: "tactics" });
  const cm = await getTranslations({ locale, namespace: "common" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  return (
    <div className="min-h-screen bg-background-primary pt-24 pb-20">
      <JsonLd data={faqData} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Breadcrumb
          items={[{ label: cm("home"), href: "/" }, { label: nav("tactics") }]}
          className="mb-6"
        />

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="gradient-text">{tc("h1")}</span>
          </h1>
          <p className="text-text-secondary max-w-2xl">
            {tc("description")}
          </p>
        </div>

        {/* 介绍正文 */}
        <section className="glass-panel p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary shrink-0" />
            <h2 className="text-xl font-bold">{tc("introTitle")}</h2>
          </div>
          <p className="text-text-secondary leading-relaxed mb-3">
            {tc("introText1")}
          </p>
          <p className="text-text-secondary leading-relaxed">
            {tc("introText2")}
          </p>
        </section>

        {/* 阵型快捷锚点 */}
        <nav className="mb-8" aria-label="FM26 Formations">
          <div className="flex items-center gap-2 mb-3">
            <LayoutGrid className="w-4 h-4 text-primary shrink-0" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
              {tc("quickNavTitle")}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {anchors.map((anchor) => (
              <Link
                key={anchor.slug}
                href={`/tactics/${anchor.slug}`}
                className="inline-flex items-baseline gap-2 px-4 py-2 rounded-xl glass-card border border-primary/10 hover:border-primary/40 transition-colors"
              >
                <span className="font-mono font-semibold text-primary">
                  {anchor.label}
                </span>
                <span className="text-xs text-text-secondary">{anchor.style}</span>
              </Link>
            ))}
          </div>
        </nav>

        <TacticsList tactics={(isTr ? allTacticTrs : allTactics) as Tactic[]} />

        {/* Turkish pilot: remaining tactics live in the English library */}
        {isTr && (
          <div className="mt-6 glass-panel border border-primary/10 rounded-xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Globe className="w-4 h-4 text-primary shrink-0" />
              <p className="text-sm text-text-secondary">
                Diğer taktikler İngilizce kütüphanede — çeviriler yolda.
              </p>
            </div>
            <a
              href="/tactics"
              className="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Tam kütüphane
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Builder CTA */}
        <section className="mt-12">
          <Link
            href="/builder"
            className="block glass-panel border border-primary/10 p-8 sm:p-10 bg-gradient-to-r from-primary/5 via-transparent to-accent-blue/5 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  {tc("builderCtaTitle")}
                </h2>
                <p className="text-text-secondary leading-relaxed max-w-2xl">
                  {tc("builderCtaText")}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 px-6 py-3 rounded-xl bg-primary text-background-primary font-semibold hover:shadow-[0_0_30px_rgba(0,230,118,0.3)] transition-all duration-300">
                {tc("builderCtaButton")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        </section>

        {/* 相关文章互链 */}
        <section className="mt-12">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary shrink-0" />
            <h2 className="text-xl font-bold">{tc("relatedGuidesTitle")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {relatedArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="glass-card p-4 rounded-xl border border-primary/10 hover:border-primary/40 transition-colors flex items-center justify-between gap-3 group"
              >
                <span className="text-sm font-medium text-text-primary">
                  {article.label}
                </span>
                <ArrowRight className="w-4 h-4 text-primary shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
