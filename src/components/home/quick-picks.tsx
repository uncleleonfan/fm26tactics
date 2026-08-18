"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight, Clock, Flame } from "lucide-react";

interface QuickPick {
  slug: string;
  formation: string;
  title: string;
  description: string;
  readTime: number;
  highlight?: boolean;
  href?: string;
}

const quickPicks: QuickPick[] = [
  {
    slug: "3-5-2-catenaccio",
    formation: "3-5-2",
    title: "Catenaccio — Defensive Masterclass",
    description:
      "Build an impregnable fortress. Suffocate attacks, then strike with devastating counter-attacks. Our most in-depth guide.",
    readTime: 11,
    highlight: true,
  },
  {
    slug: "4-3-3-tiki-taka",
    formation: "4-3-3",
    title: "Tiki-Taka — Possession Domination",
    description:
      "Control the game with intricate short passing, intelligent movement, and positional play mastery.",
    readTime: 15,
  },
  {
    slug: "4-2-3-1-gegenpress",
    formation: "4-2-3-1",
    title: "Gegenpress — High-Pressure Blueprint",
    description:
      "Set up an aggressive pressing system that suffocates opponents and creates rapid transitions.",
    readTime: 12,
  },
];

export function QuickPicks() {
  const t = useTranslations("home");
  const cm = useTranslations("common");

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            {t("startHere")}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          {t("mostInDepth")}
        </h2>
        <p className="text-text-secondary text-sm max-w-lg mx-auto">
          {t("quickPicksSubtitle")}
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {quickPicks.map((pick) => (
          <Link
            key={pick.slug}
            href={pick.href || `/tactics/${pick.slug}`}
            className={`relative glass-card p-6 group overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
              pick.highlight
                ? "border-amber-500/30 hover:border-amber-500/50 bg-amber-500/[0.03]"
                : "hover:border-primary/30"
            }`}
          >
            {/* Highlight badge */}
            {pick.highlight && (
              <div className="absolute top-0 right-0">
                <div className="bg-amber-500 text-background-primary text-[10px] font-bold px-3 py-0.5 rounded-bl-lg flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  {t("mostPopular")}
                </div>
              </div>
            )}

            {/* Formation badge */}
            <span
              className={`inline-block text-xs font-mono font-semibold px-2.5 py-1 rounded-md mb-4 ${
                pick.highlight
                  ? "text-amber-400 bg-amber-500/10"
                  : "text-primary bg-primary/10"
              }`}
            >
              {pick.formation}
            </span>

            {/* Title */}
            <h3 className="text-lg font-bold text-text-primary mb-3 group-hover:text-primary transition-colors leading-tight">
              {pick.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-text-secondary leading-relaxed mb-5">
              {pick.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[#1C2436]/50">
              <span className="flex items-center gap-1.5 text-xs text-text-muted">
                <Clock className="w-3.5 h-3.5" />
                {pick.readTime} {cm("minRead")}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-sm font-medium transition-all group-hover:gap-2 ${
                  pick.highlight ? "text-amber-400" : "text-primary"
                }`}
              >
                {cm("readGuide")}
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
