import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { TacticsList } from "@/components/tactics/tactics-list";
import { JsonLd } from "@/components/shared/json-ld";
import { allTactics, allTacticTrs } from "contentlayer/generated";
import type { Tactic } from "contentlayer/generated";
import { ArrowRight, BookOpen, Globe, LayoutGrid, Shield, Sparkles, Users, Wrench } from "lucide-react";
import { generateLocaleSEO } from "@/lib/metadata";
import type { Metadata } from "next";
import { FaqSection } from "@/components/home/faq-section";

// Turkish pilot L1: core list page is part of the minimal indexable set (§2b)
export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return generateLocaleSEO({
    locale: params.locale,
    path: "/tactics",
    en: {
      title: "FM26 Tactics Library – Football Manager 2026 Tactics & Formations",
      description:
        "Browse the complete FM26 tactics library for Football Manager 2026. Every tactical style — gegenpress, tiki-taka, counter-attack, wing play — with complete player roles, team instructions, and performance breakdowns.",
      keywords: [
        "fm26 tactics", "fm 26 tactics", "football manager 2026 tactics",
        "fm26 tactic", "fm26 tactics library", "fm26 gegenpress",
        "fm26 tiki taka", "fm26 counter attack", "fm26 formations",
      ],
    },
    tr: {
      title: "FM26 Taktik Kütüphanesi — Football Manager 2026 Taktikleri ve Dizilişleri",
      description:
        "Tam FM26 taktik kütüphanesini keşfedin — her diziliş oyuncu rolleri, takım talimatları ve performans analizleriyle. Football Manager 2026'da kadronuz için FM26 taktiklerini bulun.",
      keywords: [
        "fm26 taktikleri", "fm 26 taktikleri", "football manager 2026 taktikleri",
        "fm26 taktik", "fm26 taktik kütüphanesi", "fm26 gegenpress",
        "fm26 tiki taka", "fm26 kontra atak", "fm26 dizilişleri",
      ],
    },
  });
}

// Turkish pilot: only translated tactics are exposed under /tr (see docs/optimization-plan-2026-09.md §2b)
const trSlugs = new Set(allTacticTrs.map((t) => t.slug));

const formationAnchors = [
  { slug: "4-3-3-tiki-taka", label: "4-3-3", style: "Tiki-Taka" },
  { slug: "4-2-3-1-gegenpress", label: "4-2-3-1", style: "Gegenpress" },
  { slug: "3-5-2-catenaccio", label: "3-5-2", style: "Catenaccio" },
  { slug: "4-4-2-wing-play", label: "4-4-2", style: "Wing Play" },
  { slug: "4-1-2-1-2-diamond", label: "4-1-2-1-2", style: "Diamond" },
  { slug: "5-3-2-route-one", label: "5-3-2", style: "Route One" },
  { slug: "4-2-2-2-fluid-attack", label: "4-2-2-2", style: "Fluid" },
  { slug: "3-4-2-1-counter-attack", label: "3-4-2-1", style: "Counter" },
  { slug: "5-2-3-gegenpress", label: "5-2-3", style: "Gegenpress" },
  { slug: "4-4-1-1-counter-attack", label: "4-4-1-1", style: "Counter" },
  { slug: "4-2-4-attacking", label: "4-2-4", style: "Route One" },
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
      name: "What tactical styles are available for FM26?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The FM26 tactics library covers every major tactical style: gegenpress, tiki-taka, counter-attack, wing play, catenaccio, and diamond midfield. Each tactic includes complete player roles, team instructions, and formation guides. For our ranked top 8, see the FM26 Best Tactics page.",
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
      name: "What is the best FM26 gegenpress tactic?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The 4-2-3-1 gegenpress is the most consistent high-pressing tactic in FM26. It uses two defensive midfielders to shield the back line, an advanced playmaker to create chances, and inside forwards who press high. Use a Sweeper Keeper on Attack and high defensive line with more aggressive pressing triggers.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best FM26 possession tactic?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The 4-3-3 tiki-taka is the best possession tactic in FM26. Three midfielders dominate the ball, wide forwards stretch the defense, and a Deep-Lying Playmaker controls the tempo. Use shorter passing, lower tempo, and work ball into box for maximum possession control.",
      },
    },
    {
      "@type": "Question",
      name: "Which FM26 tactic is best for weaker teams?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The 3-5-2 counter-attack and 4-4-2 wing play are the best tactics for underdogs in FM26. The 3-5-2 provides three center-backs for defensive solidity and two strikers for quick counter-attacks. The 4-4-2 offers two banks of four that are hard to break down while still posing an attacking threat.",
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

const faqPairsEn: Array<[string, string]> = faqData.mainEntity.map(
  (item: { name: string; acceptedAnswer: { text: string } }) => [item.name, item.acceptedAnswer.text]
);

const faqPairsTr: Array<[string, string]> = [
  [
    "FM26 için hangi taktik stilleri mevcut?",
    "FM26 taktik kütüphanesi her büyük taktik stilini kapsar: gegenpress, tiki-taka, kontra atak, kanat oyunu, catenaccio ve elmas orta saha. Her taktik eksiksiz oyuncu rolleri, takım talimatları ve diziliş rehberleri içerir. İlk 8 sıralamamız için FM26 En İyi Taktikler sayfasına bakın.",
  ],
  [
    "Doğru FM26 dizilişini nasıl seçerim?",
    "Dizilişi kadronuzun güçlü yönlerine uydurun. Güçlü kanatlar? 4-2-3-1 veya 4-4-2 kullanın. Dolu orta saha? 4-3-3 deneyin. Derin savunma hattına sahip alt sınıf? 3-5-2 veya 5-3-2 kontra kanıtlanmış bir seçim.",
  ],
  [
    "Yeni başlayanlar için en iyi FM26 taktiği nedir?",
    "4-2-3-1 gegenpress veya dengeli 4-4-2 kanat oyunu ile başlayın. İkisi de kurulumu kolay, FM26 maç motorunda affedici ve Football Manager taktiklerinin temel prensiplerini öğretir.",
  ],
  [
    "En iyi FM26 gegenpress taktiği nedir?",
    "4-2-3-1 gegenpress, FM26'daki en tutarlı yüksek press taktiğidir. Savunma hattını korumak için iki defansif orta saha, şans yaratmak için bir playmaker ve yüksek press yapan inside forward kullanır. Sweeper Keeper ve yüksek savunma hattı ile daha agresif press tetikleyicileri kullanın.",
  ],
  [
    "En iyi FM26 top hakimiyeti taktiği nedir?",
    "4-3-3 tiki-taka, FM26'daki en iyi top hakimiyeti taktiğidir. Üç orta saha topu domine eder, geniş forvetler savunmayı gerer ve Deep-Lying Playmaker tempoyu kontrol eder. Maksimum top hakimiyeti için daha kısa pas, düşük tempo ve kutuya çalış kullanın.",
  ],
  [
    "Hangi FM26 taktiği zayıf takımlar için en iyisidir?",
    "3-5-2 kontra atak ve 4-4-2 kanat oyunu, FM26'da alt sınıf takımlar için en iyi taktiklerdir. 3-5-2, savunma sağlamlığı için üç stoper ve hızlı kontra için iki forvet sağlar. 4-4-2, kırılması zor iki sıra dörtlü sunarken hücum tehdidi de taşır.",
  ],
  [
    "Kendi FM26 taktiğimi oluşturabilir miyim?",
    "Evet — ücretsiz FM26 Taktik Oluşturucu'nu kullanarak oyuncuları yerleştirin, roller ve görevler atayın, takım talimatlarını yapılandırın ve Football Manager 2026 için özel dizilişinizi dışa aktarın veya paylaşın.",
  ],
];

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

        {/* Best FM26 Tactics by Category */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary shrink-0" />
            <h2 className="text-xl font-bold">{tc("bestByCategoryTitle")}</h2>
          </div>
          <p className="text-text-secondary text-sm mb-4 max-w-2xl">{tc("bestByCategoryIntro")}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: tc("bestOverall"), href: "/best", desc: "Top-rated FM26 tactics across all play styles" },
              { label: tc("bestAttacking"), href: "/best#attacking", desc: "High-scoring, aggressive tactical setups" },
              { label: tc("bestDefensive"), href: "/best#defensive", desc: "Solid defensive structures and low blocks" },
              { label: tc("bestPossession"), href: "/best#possession", desc: "Dominate the ball with tiki-taka systems" },
              { label: tc("bestCounter"), href: "/best#counter", desc: "Hit teams on the break with pace" },
              { label: tc("bestUnderdog"), href: "/best#underdog", desc: "Best tactics for smaller clubs and budgets" },
            ].map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="glass-card p-4 rounded-xl border border-primary/10 hover:border-primary/40 transition-colors group"
              >
                <div className="font-semibold text-primary mb-1">{cat.label}</div>
                <p className="text-xs text-text-secondary">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* FM26 Tactical Styles */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary shrink-0" />
            <h2 className="text-xl font-bold">{tc("stylesTitle")}</h2>
          </div>
          <p className="text-text-secondary text-sm mb-4 max-w-2xl">{tc("stylesIntro")}</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Gegenpress", slug: "4-2-3-1-gegenpress" },
              { label: "Tiki-Taka", slug: "4-3-3-tiki-taka" },
              { label: "Counter Attack", slug: "3-5-2-counter-attack" },
              { label: "Wing Play", slug: "4-4-2-wing-play" },
              { label: "Catenaccio", slug: "3-5-2-catenaccio" },
              { label: "Diamond", slug: "4-1-2-1-2-diamond" },
              { label: "Route One", slug: "5-3-2-route-one" },
              { label: "Fluid", slug: "4-2-2-2-fluid-attack" },
              { label: "Conte 3-4-2-1", slug: "3-4-2-1-counter-attack" },
              { label: "Mourinho 4-4-1-1", slug: "4-4-1-1-counter-attack" },
            ].map((style) => (
              <Link
                key={style.slug}
                href={`/tactics/${style.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-card border border-primary/10 hover:border-primary/40 transition-colors"
              >
                <span className="text-sm font-medium">{style.label}</span>
                <ArrowRight className="w-3 h-3 text-primary" />
              </Link>
            ))}
          </div>
        </section>

        {/* Best FM26 Formations — merged with quick nav */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <LayoutGrid className="w-5 h-5 text-primary shrink-0" />
            <h2 className="text-xl font-bold">{tc("formationsSectionTitle")}</h2>
          </div>
          <p className="text-text-secondary text-sm mb-4 max-w-2xl">{tc("formationsSectionIntro")}</p>
          <div className="flex flex-wrap gap-2 mb-4">
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
          <Link
            href="/formations"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            {tc("formationsSectionCta")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* FM26 Tactics Guides */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary shrink-0" />
            <h2 className="text-xl font-bold">{tc("guidesSectionTitle")}</h2>
          </div>
          <p className="text-text-secondary text-sm mb-4 max-w-2xl">{tc("guidesSectionIntro")}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: "FM26 Player Roles", href: "/roles", icon: "users" },
              { label: "FM26 Shouts Guide", href: "/guides/match-day-shouts-guide", icon: "book" },
              { label: "How to Build a Tactic", href: "/guides/how-to-build-a-tactic", icon: "wrench" },
            ].map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="glass-card p-4 rounded-xl border border-primary/10 hover:border-primary/40 transition-colors flex items-center gap-3 group"
              >
                {guide.icon === "users" && <Users className="w-5 h-5 text-primary shrink-0" />}
                {guide.icon === "book" && <BookOpen className="w-5 h-5 text-primary shrink-0" />}
                {guide.icon === "wrench" && <Wrench className="w-5 h-5 text-primary shrink-0" />}
                <span className="text-sm font-medium">{guide.label}</span>
                <ArrowRight className="w-4 h-4 text-primary shrink-0 ml-auto group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </section>

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

        {/* 可见 FAQ 区域 — 与 JSON-LD 对齐 */}
        <FaqSection
          faqs={isTr ? faqPairsTr : faqPairsEn}
          locale={locale}
        />
      </div>
    </div>
  );
}
