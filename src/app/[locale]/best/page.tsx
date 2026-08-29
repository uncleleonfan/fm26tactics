import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { allTactics } from "contentlayer/generated";
import { ArrowRight, Trophy, Star, Zap, Shield } from "lucide-react";
import { styleColors } from "@/lib/tactics-data";
import { generateLocaleSEO } from "@/lib/metadata";
import Script from "next/script";

// Turkish pilot L1: core list page is part of the minimal indexable set (§2b)
export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return generateLocaleSEO({
    locale: params.locale,
    path: "/best",
    en: {
      title: "FM26 Best Tactics 2026: Top 8 Meta Formations Ranked",
      description:
        "Discover the best FM26 tactics ranked and tested. From gegenpress to tiki-taka, find the top meta formations that dominate Football Manager 2026 — best fm26 tactics for every playstyle.",
      keywords: [
        "fm26 best tactics", "best fm26 tactics", "fm26 top tactics",
        "fm26 meta formations", "best formations fm26", "top fm26 tactics 2026",
      ],
    },
    tr: {
      title: "FM26 En İyi Taktikler 2026: En İyi 8 Meta Diziliş Sıralaması",
      description:
        "Test edilmiş ve sıralanmış en iyi FM26 taktiklerini keşfedin. Gegenpress'ten tiki-taka'ya, Football Manager 2026'da öne çıkan meta dizilişleri — her oyun tarzı için en iyi FM26 taktikleri.",
      keywords: [
        "en iyi fm26 taktikleri", "fm26 meta dizilişleri",
        "fm26 en iyi dizilişler", "football manager 2026 taktikleri",
      ],
    },
  });
}

const rankingOrder = [
  "4-2-3-1-gegenpress", "3-5-2-catenaccio", "4-3-3-tiki-taka", "4-4-2-wing-play",
  "3-4-3-control-possession", "4-1-2-1-2-diamond", "4-3-3-fluid-counter", "3-5-2-counter-attack",
];

interface RankMeta {
  color: string; icon: React.ReactNode; badgeKey: string; reasonKey: string;
  titleKey: string; excerptKey: string; styleKey: string; // home namespace (shared with featured tactics)
}
const rankMeta: Record<string, RankMeta> = {
  "4-2-3-1-gegenpress": { badgeKey: "badge1", color: "text-amber-400 bg-amber-500/10 border-amber-500/30", icon: <Trophy className="w-4 h-4 text-amber-400" />, reasonKey: "reason1", titleKey: "ftGegenpressTitle", excerptKey: "ftGegenpressExcerpt", styleKey: "styleGegenpress" },
  "3-5-2-catenaccio": { badgeKey: "badge2", color: "text-blue-400 bg-blue-500/10 border-blue-500/30", icon: <Shield className="w-4 h-4 text-blue-400" />, reasonKey: "reason2", titleKey: "ftCatenaccioTitle", excerptKey: "ftCatenaccioExcerpt", styleKey: "styleParkTheBus" },
  "4-3-3-tiki-taka": { badgeKey: "badge3", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", icon: <Star className="w-4 h-4 text-emerald-400" />, reasonKey: "reason3", titleKey: "ftTikiTakaTitle", excerptKey: "ftTikiTakaExcerpt", styleKey: "styleTikiTaka" },
  "4-4-2-wing-play": { badgeKey: "badge4", color: "text-orange-400 bg-orange-500/10 border-orange-500/30", icon: <Zap className="w-4 h-4 text-orange-400" />, reasonKey: "reason4", titleKey: "ftWingPlayTitle", excerptKey: "ftWingPlayExcerpt", styleKey: "styleWingPlay" },
  "3-4-3-control-possession": { badgeKey: "badge5", color: "text-purple-400 bg-purple-500/10 border-purple-500/30", icon: <Star className="w-4 h-4 text-purple-400" />, reasonKey: "reason5", titleKey: "ftControlPossessionTitle", excerptKey: "ftControlPossessionExcerpt", styleKey: "styleControlPossession" },
  "4-1-2-1-2-diamond": { badgeKey: "badge6", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30", icon: <Star className="w-4 h-4 text-cyan-400" />, reasonKey: "reason6", titleKey: "ftDiamondTitle", excerptKey: "ftDiamondExcerpt", styleKey: "styleControlPossession" },
  "4-3-3-fluid-counter": { badgeKey: "badge7", color: "text-red-400 bg-red-500/10 border-red-500/30", icon: <Zap className="w-4 h-4 text-red-400" />, reasonKey: "reason7", titleKey: "ftFluidCounterTitle", excerptKey: "ftFluidCounterExcerpt", styleKey: "styleFluidCounter" },
  "3-5-2-counter-attack": { badgeKey: "badge8", color: "text-teal-400 bg-teal-500/10 border-teal-500/30", icon: <Shield className="w-4 h-4 text-teal-400" />, reasonKey: "reason8", titleKey: "ftCounterAttackTitle", excerptKey: "ftCounterAttackExcerpt", styleKey: "styleCounterAttack" },
};

const difficultyConfig: Record<string, { className: string }> = {
  beginner: { className: "bg-green-500/20 text-green-400" },
  intermediate: { className: "bg-amber-500/20 text-amber-400" },
  advanced: { className: "bg-red-500/20 text-red-400" },
};

const faqEn: Array<[string, string]> = [
  ["What are the best FM26 tactics?", "The best FM26 tactics are the 4-2-3-1 Gegenpress (best overall), 3-5-2 Catenaccio (best defensive), and 4-3-3 Tiki-Taka (best possession). The 4-2-3-1 Gegenpress is the most consistent formation, working at every club level with its high-press, quick-transition style."],
  ["What is the strongest formation in FM26?", "The 4-2-3-1 Gegenpress is widely considered the strongest formation in FM26 due to its balance of defensive solidity and attacking threat. It provides two holding midfielders for defensive cover, three attacking midfielders for creativity, and a lone striker who benefits from overloads."],
  ["Which FM26 tactic is best for beginners?", "The 4-4-2 Wing Play and 3-5-2 Catenaccio are the best FM26 tactics for beginners. Both feature simple role assignments, clear tactical instructions, and don't require complex player instructions."],
  ["How do I choose the best FM26 tactic for my team?", "Match your tactic to your squad strength: strong wingers → 4-2-3-1 or 4-4-2, strong midfield → 4-1-2-1-2 Diamond or 4-3-3, strong defense → 3-5-2, underdog team → 3-5-2 Counter-Attack."],
];

const faqTr: Array<[string, string]> = [
  ["En iyi FM26 taktikleri neler?", "En iyi FM26 taktikleri: 4-2-3-1 Gegenpress (genel en iyi), 3-5-2 Catenaccio (en iyi savunma) ve 4-3-3 Tiki-Taka (en iyi topa sahip olma). 4-2-3-1 Gegenpress, yüksek pres ve hızlı geçiş tarzıyla her kulüp seviyesinde işe yarayan en tutarlı diziliştir."],
  ["FM26'da en güçlü diziliş hangisi?", "4-2-3-1 Gegenpress, defansif sağlamlık ile hücum tehdidi dengesi sayesinde FM26'da yaygın olarak en güçlü diziliş kabul ediliyor. Defansif koruma için iki ön libero, yaratıcılık için üç ofansif orta saha ve yoğunlaşmalardan yararlanan tek forvet sağlıyor."],
  ["Hangi FM26 taktiği yeni başlayanlar için en iyisi?", "4-4-2 Kanat Oyunu ve 3-5-2 Catenaccio, yeni başlayanlar için en iyi FM26 taktikleri. İkisi de basit rol atamaları ve net taktik talimatları içerir; karmaşık oyuncu talimatları gerektirmez."],
  ["Takımım için en iyi FM26 taktiğini nasıl seçerim?", "Taktiğinizi kadro gücünüze göre eşleştirin: güçlü kanat oyuncuları → 4-2-3-1 veya 4-4-2, güçlü orta saha → 4-1-2-1-2 Elmas veya 4-3-3, güçlü savunma → 3-5-2, favori olmayan takım → 3-5-2 Kontra Atak."],
];

export default async function BestTacticsPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const b = await getTranslations({ locale, namespace: "best" });
  const h = await getTranslations({ locale, namespace: "home" });
  const f = await getTranslations({ locale, namespace: "filter" });

  const ranked = rankingOrder
    .map((slug) => allTactics.find((t) => t.slug === slug))
    .filter((t) => t != null) as NonNullable<(typeof allTactics)[number]>[];

  const faqs = locale === "tr" ? faqTr : faqEn;
  const faqJsonLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <>
      <Script id="best-tactics-faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <main className="min-h-screen bg-background-primary">
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
              <Trophy className="w-3.5 h-3.5" />
              {b("updatedBadge")}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              <span className="text-text-primary">FM26</span>{" "}
              <span className="gradient-text">{b("title")}</span>{" "}
              <span className="text-text-primary">2026</span>
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              {b("description")}
            </p>
          </div>
        </section>

        <section className="pb-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {ranked.map((tactic, index) => {
              const meta = rankMeta[tactic.slug];
              const diff = difficultyConfig[tactic.difficulty];
              if (!meta) return null;
              return (
                <Link key={tactic.slug} href={`/tactics/${tactic.slug}`} className="block glass-card group hover:border-primary/30 transition-all duration-300">
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${meta.color}`}>{meta.icon}{b(meta.badgeKey)}</span>
                      <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">{tactic.formation}</span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${diff.className}`}>{f(tactic.difficulty)}</span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${styleColors[tactic.style]}`}>{h(meta.styleKey)}</span>
                    </div>
                    <h2 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">{h(meta.titleKey)}</h2>
                    <p className="text-sm text-text-secondary leading-relaxed mb-3">{h(meta.excerptKey)}</p>
                    <p className="text-xs text-text-muted italic mb-3">{b("whyRanks")}{index + 1}: {b(meta.reasonKey)}</p>
                    <div className="flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">{b("viewFullTactic")} <ArrowRight className="w-3 h-3" /></div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="pb-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">{b("howToChooseTitle")}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass-card p-5">
                <h3 className="font-semibold text-text-primary mb-2">{b("strongWingers")}</h3>
                <p className="text-sm text-text-secondary">{b("strongWingersText")}</p>
              </div>
              <div className="glass-card p-5">
                <h3 className="font-semibold text-text-primary mb-2">{b("stackedMidfield")}</h3>
                <p className="text-sm text-text-secondary">{b("stackedMidfieldText")}</p>
              </div>
              <div className="glass-card p-5">
                <h3 className="font-semibold text-text-primary mb-2">{b("defensiveRock")}</h3>
                <p className="text-sm text-text-secondary">{b("defensiveRockText")}</p>
              </div>
              <div className="glass-card p-5">
                <h3 className="font-semibold text-text-primary mb-2">{b("underdog")}</h3>
                <p className="text-sm text-text-secondary">{b("underdogText")}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20 px-4 sm:px-6">
          <div className="max-w-xl mx-auto text-center glass-card p-8">
            <Trophy className="w-10 h-10 text-amber-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-text-primary mb-2">{b("ctaTitle")}</h2>
            <p className="text-sm text-text-secondary mb-6">{b("ctaText")}</p>
            <Link href="/builder" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-background-primary font-semibold text-sm hover:bg-primary-hover transition-all hover:shadow-[0_0_20px_rgba(0,230,118,0.3)]">{b("ctaButton")} <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </section>
      </main>
    </>
  );
}
