import type { Metadata } from "next";
import { generateSEO } from "@/lib/metadata";
import { formationPresets } from "@/lib/tactics-data";
import { allTactics } from "contentlayer/generated";
import { JsonLd } from "@/components/shared/json-ld";
import { Link } from "@/i18n/routing";
import { ArrowRight, LayoutGrid, Wrench } from "lucide-react";

export const metadata: Metadata = generateSEO({
  title: "FM26 Formations — Complete Football Manager 2026 Formation Guide",
  description:
    "Complete guide to Football Manager 2026 formations. Each formation includes strengths, weaknesses, recommended roles, tactical styles, and when to use it. Browse 4-3-3, 4-2-3-1, 4-4-2, 3-5-2, 3-4-3 and more.",
  path: "/formations",
  keywords: [
    "fm26 formations",
    "football manager 2026 formations",
    "fm 26 formations",
    "best fm26 formation",
    "4-3-3 fm26",
    "4-2-3-1 fm26",
    "4-4-2 fm26",
    "3-5-2 fm26",
    "3-4-3 fm26",
    "football manager 2026 best formation",
  ],
});

// SEO enrichment data per formation
const formationSeoData: Record<
  string,
  { bestFor: string; strengths: string[]; weaknesses: string[]; recommendedRoles: string[] }
> = {
  "4-2-3-1": {
    bestFor: "Balanced attacking play with a strong defensive shield",
    strengths: ["Two DMs provide defensive stability", "AM #10 creates between the lines", "Wingers stretch the pitch", "Great for gegenpress"],
    weaknesses: ["Can be overrun in midfield against 4-3-3", "Wingers can be isolated defensively", "Requires a creative #10"],
    recommendedRoles: ["Deep-Lying Playmaker", "Ball-Winning Midfielder", "Advanced Playmaker (AM)", "Inside Forward", "Advanced Forward"],
  },
  "4-3-3": {
    bestFor: "Possession and high-pressing football (Tiki-Taka, Gegenpress)",
    strengths: ["Three midfielders dominate possession", "Wide forwards stretch defense", "Natural pressing shape", "Very flexible tactically"],
    weaknesses: ["Can be exposed on the counter", "Requires athletic midfielders", "Wide forwards must track back"],
    recommendedRoles: ["Deep-Lying Playmaker", "Box-to-Box Midfielder", "Mezzala", "Winger", "Pressing Forward"],
  },
  "4-4-2": {
    bestFor: "Direct, counter-attacking and wing play",
    strengths: ["Two banks of four = solid defense", "Two strikers press CBs", "Simple and easy to organize", "Excellent for underdogs"],
    weaknesses: ["Lacks a #10 creator", "Midfield can be outnumbered", "Less possession control"],
    recommendedRoles: ["Ball-Winning Midfielder", "Box-to-Box Midfielder", "Winger", "Target Forward", "Pressing Forward"],
  },
  "3-5-2": {
    bestFor: "Counter-attacking with defensive solidity (Catenaccio, Low Block)",
    strengths: ["Three CBs dominate the box", "Wing-backs provide width", "Two strikers for counter-attacks", "Great for defensive teams"],
    weaknesses: ["Vulnerable out wide if wing-backs caught up", "Requires athletic wing-backs", "Can struggle in possession"],
    recommendedRoles: ["Ball-Playing Defender", "Ball-Winning Midfielder", "Deep-Lying Playmaker", "Carrilero", "Target Forward"],
  },
  "5-3-2": {
    bestFor: "Ultra-defensive counter-attack strategies",
    strengths: ["Five defenders = very hard to break down", "Compact shape", "Counter-attack specialist", "Great for minnows"],
    weaknesses: ["Very limited going forward", "No natural width", "Can invite too much pressure"],
    recommendedRoles: ["Ball-Playing Defender", "No-Nonsense Centre-Back", "Ball-Winning Midfielder", "Target Forward"],
  },
  "3-4-3": {
    bestFor: "Aggressive attacking football with high wing-backs",
    strengths: ["Three forwards press relentlessly", "Wing-backs provide width", "Overloads in attack", "Modern pressing shape"],
    weaknesses: ["Very vulnerable on counter", "Requires elite wing-backs", "High risk, high reward"],
    recommendedRoles: ["Ball-Playing Defender", "Mezzala", "Winger", "Advanced Forward", "Pressing Forward"],
  },
  "4-2-2-2": {
    bestFor: "Box midfield control and attacking flair",
    strengths: ["Compact midfield box", "Two strikers and two AMs", "Great for vertical tiki-taka", "Attacking overloads"],
    weaknesses: ["No natural wide players", "Vulnerable out wide", "Can be predictable through the middle"],
    recommendedRoles: ["Deep-Lying Playmaker", "Ball-Winning Midfielder", "Advanced Playmaker", "Advanced Forward"],
  },
  "4-1-4-1": {
    bestFor: "Defensive stability with a dedicated DM shield",
    strengths: ["DM protects the back four", "Four midfielders offer width", "Solid defensive shape", "Good for possession"],
    weaknesses: ["Lone striker can be isolated", "Gap between DM and AM", "Requires a dominant striker"],
    recommendedRoles: ["Deep-Lying Playmaker (DM)", "Box-to-Box Midfielder", "Winger", "Target Forward"],
  },
  "4-4-1-1": {
    bestFor: "Counter-attacking with a #10 behind a target man",
    strengths: ["Second striker creates between lines", "Solid two banks of four", "Great for Mourinho-style football", "Defensive solidity"],
    weaknesses: ["Limited width in attack", "#10 needs to be elite", "Can be too conservative"],
    recommendedRoles: ["Ball-Winning Midfielder", "Advanced Playmaker (#10)", "Winger", "Target Forward"],
  },
};

const faqData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the best formation in FM26?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The best FM26 formation depends on your play style. The 4-2-3-1 is the most balanced and great for gegenpress, the 4-3-3 is ideal for tiki-taka and possession, the 4-4-2 is excellent for counter-attacking and wing play, and the 3-5-2 is perfect for defensive/counter-attacking teams.",
      },
    },
    {
      "@type": "Question",
      name: "How do I choose the right formation in Football Manager 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Consider your squad's strengths: if you have strong wingers, use 4-3-3 or 4-2-3-1; if you have dominant CBs and athletic wing-backs, try 3-5-2; for counter-attacking with limited players, 4-4-2 or 5-3-2 work best. Always match the formation to your players' attributes.",
      },
    },
    {
      "@type": "Question",
      name: "What formation is best for underdogs in FM26?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The 4-4-2 and 5-3-2 are the best formations for underdogs and smaller clubs in FM26. They provide solid defensive structures with two banks of players, making them hard to break down while still offering counter-attacking threat through two strikers.",
      },
    },
  ],
};

export default function FormationsPage() {
  return (
    <div className="min-h-screen -mt-16 pt-16">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        {/* Hero */}
        <section className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold">FM26 Formations</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Complete guide to Football Manager 2026 formations. Each formation is broken down with
            strengths, weaknesses, recommended roles, and the best tactical styles — so you can pick
            the right shape for your squad.
          </p>
        </section>

        {/* Formation Cards */}
        <section className="space-y-6">
          {formationPresets.map((formation) => {
            const seo = formationSeoData[formation.formation];
            const relatedTactics = allTactics.filter(
              (t) => t.formation === formation.formation
            );

            return (
              <div
                key={formation.formation}
                id={formation.formation}
                className="glass-card rounded-2xl p-6 space-y-4 scroll-mt-20"
              >
                {/* Formation Header */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-2xl font-bold text-primary">
                    {formation.label}
                  </span>
                  <span className="text-text-secondary text-sm">
                    {formation.description}
                  </span>
                </div>

                {seo && (
                  <>
                    {/* Best For */}
                    <div className="text-sm">
                      <span className="font-semibold text-primary">Best for:</span>{" "}
                      <span className="text-text-secondary">{seo.bestFor}</span>
                    </div>

                    {/* Strengths & Weaknesses */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-semibold mb-2 text-green-500">Strengths</h3>
                        <ul className="space-y-1">
                          {seo.strengths.map((s) => (
                            <li key={s} className="text-xs text-text-secondary flex gap-2">
                              <span className="text-green-500 shrink-0">+</span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold mb-2 text-red-400">Weaknesses</h3>
                        <ul className="space-y-1">
                          {seo.weaknesses.map((w) => (
                            <li key={w} className="text-xs text-text-secondary flex gap-2">
                              <span className="text-red-400 shrink-0">-</span>
                              {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Recommended Roles */}
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Recommended FM26 Roles</h3>
                      <div className="flex flex-wrap gap-2">
                        {seo.recommendedRoles.map((role) => (
                          <Link
                            key={role}
                            href="/roles"
                            className="inline-flex px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                          >
                            {role}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Links: Related Tactics + Builder */}
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-primary/10">
                  {relatedTactics.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {relatedTactics.map((tactic) => (
                        <Link
                          key={tactic.slug}
                          href={`/tactics/${tactic.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                          {tactic.title}
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      ))}
                    </div>
                  )}
                  <Link
                    href="/builder"
                    className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors ml-auto"
                  >
                    <Wrench className="w-3 h-3" />
                    Try in Builder
                  </Link>
                </div>
              </div>
            );
          })}
        </section>

        {/* Tactics Guide Links */}
        <section className="grid sm:grid-cols-3 gap-3 pt-4">
          {[
            { label: "FM26 Tactics Library", href: "/tactics", icon: LayoutGrid },
            { label: "FM26 Best Tactics 2026", href: "/best", icon: ArrowRight },
            { label: "FM26 Player Roles", href: "/roles", icon: ArrowRight },
          ].map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="glass-card p-4 rounded-xl border border-primary/10 hover:border-primary/40 transition-colors flex items-center gap-3 group"
              >
                <Icon className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium">{link.label}</span>
                <ArrowRight className="w-4 h-4 text-primary shrink-0 ml-auto group-hover:translate-x-1 transition-transform" />
              </Link>
            );
          })}
        </section>
      </div>

      <JsonLd data={faqData} />
    </div>
  );
}
