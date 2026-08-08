import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { allTactics } from "contentlayer/generated";
import { ArrowRight, Trophy, Star, Zap, Shield } from "lucide-react";
import { styleLabels, styleColors } from "@/lib/tactics-data";
import Script from "next/script";

export const metadata: Metadata = {
  title: "FM26 Best Tactics 2026: Top 8 Meta Formations Ranked",
  description:
    "Discover the best FM26 tactics ranked and tested. From gegenpress to tiki-taka, find the top meta formations that dominate Football Manager 2026 — best fm26 tactics for every playstyle.",
  keywords: [
    "fm26 best tactics",
    "best fm26 tactics",
    "fm26 top tactics",
    "fm26 meta formations",
    "best formations fm26",
    "top fm26 tactics 2026",
  ],
  alternates: {
    canonical: "https://fm26tactics.com/best",
  },
  openGraph: {
    title: "FM26 Best Tactics 2026: Top 8 Meta Formations Ranked",
    description:
      "Discover the best FM26 tactics ranked and tested. Top meta formations that dominate Football Manager 2026 — for every playstyle.",
    url: "https://fm26tactics.com/best",
    type: "website",
    siteName: "FM26 Tactics",
    locale: "en_US",
    images: [
      {
        url: "/images/og/default.jpg",
        width: 1200,
        height: 630,
        alt: "FM26 Best Tactics 2026 — Top 8 Meta Formations Ranked",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FM26 Best Tactics 2026: Top 8 Meta Formations Ranked",
    description:
      "The best FM26 tactics ranked. Top meta formations that dominate Football Manager 2026.",
    images: ["https://fm26tactics.com/images/og/default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

// Ranked ordering for the best tactics page
const rankingOrder = [
  "4-2-3-1-gegenpress",
  "3-5-2-catenaccio",
  "4-3-3-tiki-taka",
  "4-4-2-wing-play",
  "3-4-3-control-possession",
  "4-1-2-1-2-diamond",
  "4-3-3-fluid-counter",
  "3-5-2-counter-attack",
];

interface RankMeta {
  badge: string;
  color: string;
  icon: React.ReactNode;
  reason: string;
}

const rankMeta: Record<string, RankMeta> = {
  "4-2-3-1-gegenpress": {
    badge: "#1 Meta Pick",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    icon: <Trophy className="w-4 h-4 text-amber-400" />,
    reason: "The most consistent FM26 formation. High press, quick transitions, works at every level.",
  },
  "3-5-2-catenaccio": {
    badge: "#2 Defensive King",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    icon: <Shield className="w-4 h-4 text-blue-400" />,
    reason: "Most-read tactic on our site. Impregnable defense that still scores on the counter.",
  },
  "4-3-3-tiki-taka": {
    badge: "#3 Possession Master",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    icon: <Star className="w-4 h-4 text-emerald-400" />,
    reason: "Total control. 65%+ possession with elite teams. Beautiful football.",
  },
  "4-4-2-wing-play": {
    badge: "#4 Classic Power",
    color: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    icon: <Zap className="w-4 h-4 text-orange-400" />,
    reason: "Old-school 4-4-2 updated for FM26. Devastating wing play and strike partnerships.",
  },
  "3-4-3-control-possession": {
    badge: "#5 Modern Hybrid",
    color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    icon: <Star className="w-4 h-4 text-purple-400" />,
    reason: "Total football reimagined. Overloads everywhere, perfect for squad depth.",
  },
  "4-1-2-1-2-diamond": {
    badge: "#6 Midfield Overload",
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    icon: <Star className="w-4 h-4 text-cyan-400" />,
    reason: "Dominate the center. Perfect when you have a world-class attacking midfielder.",
  },
  "4-3-3-fluid-counter": {
    badge: "#7 Speed Demon",
    color: "text-red-400 bg-red-500/10 border-red-500/30",
    icon: <Zap className="w-4 h-4 text-red-400" />,
    reason: "Lightning transitions. Best counter-attacking 4-3-3 for pace-based squads.",
  },
  "3-5-2-counter-attack": {
    badge: "#8 Underdog Special",
    color: "text-teal-400 bg-teal-500/10 border-teal-500/30",
    icon: <Shield className="w-4 h-4 text-teal-400" />,
    reason: "The ultimate small-club tactic. Hit bigger teams where it hurts.",
  },
};

const difficultyConfig: Record<string, { label: string; className: string }> = {
  beginner: { label: "Beginner", className: "bg-green-500/20 text-green-400" },
  intermediate: { label: "Intermediate", className: "bg-amber-500/20 text-amber-400" },
  advanced: { label: "Advanced", className: "bg-red-500/20 text-red-400" },
};

export default function BestTacticsPage() {
  const ranked = rankingOrder
    .map((slug) => allTactics.find((t) => t.slug === slug))
    .filter((t) => t != null) as NonNullable<(typeof allTactics)[number]>[];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What are the best FM26 tactics?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The best FM26 tactics are the 4-2-3-1 Gegenpress (best overall), 3-5-2 Catenaccio (best defensive), and 4-3-3 Tiki-Taka (best possession). The 4-2-3-1 Gegenpress is the most consistent formation, working at every club level with its high-press, quick-transition style.",
        },
      },
      {
        "@type": "Question",
        name: "What is the strongest formation in FM26?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The 4-2-3-1 Gegenpress is widely considered the strongest formation in FM26 due to its balance of defensive solidity and attacking threat. It provides two holding midfielders for defensive cover, three attacking midfielders for creativity, and a lone striker who benefits from overloads.",
        },
      },
      {
        "@type": "Question",
        name: "Which FM26 tactic is best for beginners?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The 4-4-2 Wing Play and 3-5-2 Catenaccio are the best FM26 tactics for beginners. Both feature simple role assignments, clear tactical instructions, and don't require complex player instructions. They're forgiving while still being effective at most levels.",
        },
      },
      {
        "@type": "Question",
        name: "How do I choose the best FM26 tactic for my team?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Match your tactic to your squad strength: strong wingers → 4-2-3-1 or 4-4-2, strong midfield → 4-1-2-1-2 Diamond or 4-3-3, strong defense → 3-5-2, underdog team → 3-5-2 Counter-Attack. Always prioritize your best players' natural positions and attributes over forcing a 'meta' formation.",
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="best-tactics-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="min-h-screen bg-background-primary">
        {/* Hero */}
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
              <Trophy className="w-3.5 h-3.5" />
              Updated August 2026
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              <span className="text-text-primary">FM26</span>{" "}
              <span className="gradient-text">Best Tactics</span>{" "}
              <span className="text-text-primary">2026</span>
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              The best FM26 tactics ranked and battle-tested. From the dominant 4-2-3-1 Gegenpress
              to the unbreakable 3-5-2 Catenaccio — find the meta formation that fits your squad
              and playstyle.
            </p>
          </div>
        </section>

        {/* Ranked List */}
        <section className="pb-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {ranked.map((tactic, index) => {
              const meta = rankMeta[tactic.slug];
              const diff = difficultyConfig[tactic.difficulty];

              if (!meta) return null;

              return (
                <Link
                  key={tactic.slug}
                  href={`/tactics/${tactic.slug}`}
                  className="block glass-card group hover:border-primary/30 transition-all duration-300"
                >
                  <div className="p-5 sm:p-6">
                    {/* Rank badge row */}
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${meta.color}`}
                      >
                        {meta.icon}
                        {meta.badge}
                      </span>
                      <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                        {tactic.formation}
                      </span>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${diff.className}`}
                      >
                        {diff.label}
                      </span>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${styleColors[tactic.style]}`}
                      >
                        {styleLabels[tactic.style]}
                      </span>
                    </div>

                    {/* Title and description */}
                    <h2 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
                      {tactic.title}
                    </h2>
                    <p className="text-sm text-text-secondary leading-relaxed mb-3">
                      {tactic.description}
                    </p>

                    {/* Ranking reason */}
                    <p className="text-xs text-text-muted italic mb-3">
                      Why it ranks #{index + 1}: {meta.reason}
                    </p>

                    {/* Read more */}
                    <div className="flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      View full tactic <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* How to Choose */}
        <section className="pb-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
              How to Choose the Best FM26 Tactic for YOUR Team
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass-card p-5">
                <h3 className="font-semibold text-text-primary mb-2">Strong Wingers?</h3>
                <p className="text-sm text-text-secondary">
                  Use <strong className="text-primary">4-2-3-1 Gegenpress</strong> or{" "}
                  <strong className="text-primary">4-4-2 Wing Play</strong>. Both formations
                  maximize wide threat and create crossing opportunities for your strikers.
                </p>
              </div>
              <div className="glass-card p-5">
                <h3 className="font-semibold text-text-primary mb-2">Stacked Midfield?</h3>
                <p className="text-sm text-text-secondary">
                  Use <strong className="text-primary">4-1-2-1-2 Diamond</strong> or{" "}
                  <strong className="text-primary">4-3-3 Tiki-Taka</strong>. Control the center
                  and suffocate opponents through possession dominance.
                </p>
              </div>
              <div className="glass-card p-5">
                <h3 className="font-semibold text-text-primary mb-2">Defensive Rock?</h3>
                <p className="text-sm text-text-secondary">
                  Use <strong className="text-primary">3-5-2 Catenaccio</strong>. Five defenders
                  plus two holding midfielders create a fortress. Perfect for surviving tough
                  leagues.
                </p>
              </div>
              <div className="glass-card p-5">
                <h3 className="font-semibold text-text-primary mb-2">Underdog / Small Club?</h3>
                <p className="text-sm text-text-secondary">
                  Use <strong className="text-primary">3-5-2 Counter-Attack</strong>. Absorb
                  pressure, then hit bigger teams with pace and direct balls into space.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-20 px-4 sm:px-6">
          <div className="max-w-xl mx-auto text-center glass-card p-8">
            <Trophy className="w-10 h-10 text-amber-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-text-primary mb-2">
              Build Your Own Best FM26 Tactic
            </h2>
            <p className="text-sm text-text-secondary mb-6">
              Use our interactive tactic builder to create a custom formation that maximizes your
              squad&apos;s strengths.
            </p>
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-background-primary font-semibold text-sm hover:bg-primary-hover transition-all hover:shadow-[0_0_20px_rgba(0,230,118,0.3)]"
            >
              Open Tactic Builder <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
