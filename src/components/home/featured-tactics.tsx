"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Star, Clock, ArrowRight } from "lucide-react";
import { styleLabels, styleColors } from "@/lib/tactics-data";
import type { FormationType, PlayStyle } from "@/types/tactic";

interface FeaturedTactic {
  slug: string;
  title: string;
  formation: FormationType;
  style: PlayStyle;
  difficulty: "beginner" | "intermediate" | "advanced";
  excerpt: string;
  readTime: number;
  rating: number;
}

const featuredTactics: FeaturedTactic[] = [
  {
    slug: "3-5-2-catenaccio", title: "3-5-2 Catenaccio: The Art of Defensive Solidity",
    formation: "3-5-2", style: "park-the-bus", difficulty: "beginner",
    excerpt: "Build an impregnable defensive fortress — suffocate attacks and strike with devastating counter-attacks.",
    readTime: 11, rating: 4.4,
  },
  {
    slug: "4-3-3-tiki-taka", title: "4-3-3 Tiki-Taka: Possession Domination Guide",
    formation: "4-3-3", style: "tiki-taka", difficulty: "advanced",
    excerpt: "Control the game with intricate short passing, intelligent movement, and positional play mastery.",
    readTime: 15, rating: 4.6,
  },
  {
    slug: "4-2-3-1-gegenpress", title: "4-2-3-1 Gegenpress: The Modern High-Pressure Blueprint",
    formation: "4-2-3-1", style: "gegenpress", difficulty: "intermediate",
    excerpt: "Learn how to set up an aggressive pressing system that suffocates opponents and creates rapid transitions.",
    readTime: 12, rating: 4.8,
  },
  {
    slug: "3-5-2-counter-attack", title: "3-5-2 Counter-Attack: The Underdog's Weapon",
    formation: "3-5-2", style: "counter-attack", difficulty: "intermediate",
    excerpt: "A devastating counter-attacking setup that exploits space behind aggressive opponents.",
    readTime: 10, rating: 4.7,
  },
  {
    slug: "4-4-2-wing-play", title: "4-4-2 Wing Play: Classic English Domination",
    formation: "4-4-2", style: "wing-play", difficulty: "beginner",
    excerpt: "Master the classic 4-4-2 with wing play — stretch defenses wide, whip in crosses, and unleash your strike partnership.",
    readTime: 10, rating: 4.5,
  },
  {
    slug: "4-3-3-fluid-counter", title: "4-3-3 Fluid Counter: Lightning-Fast Transitions",
    formation: "4-3-3", style: "fluid-counter-attack", difficulty: "advanced",
    excerpt: "Exploit space behind high defensive lines with a ruthless counter-attacking system built on speed and verticality.",
    readTime: 13, rating: 4.6,
  },
  {
    slug: "3-4-3-control-possession", title: "3-4-3 Control Possession: Total Football Mastery",
    formation: "3-4-3", style: "control-possession", difficulty: "advanced",
    excerpt: "Dominate possession and control the game with a modern 3-4-3 system creating overloads in every phase of play.",
    readTime: 14, rating: 4.5,
  },
  {
    slug: "4-1-2-1-2-diamond", title: "4-1-2-1-2 Diamond Narrow: Midfield Dominance",
    formation: "4-1-2-1-2", style: "control-possession", difficulty: "intermediate",
    excerpt: "Overwhelm opponents through the middle with the diamond — control the center and unleash your attacking midfielder.",
    readTime: 11, rating: 4.3,
  },
];

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-500/20 text-green-400",
  intermediate: "bg-amber-500/20 text-amber-400",
  advanced: "bg-red-500/20 text-red-400",
};

export function FeaturedTactics() {
  const t = useTranslations("home");
  const cm = useTranslations("common");

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            <span className="gradient-text">{t("featuredTactics").split(" ")[0]}</span>{" "}
            {t("featuredTactics").split(" ").slice(1).join(" ")}
          </h2>
          <p className="text-text-secondary text-sm">
            Top-rated formations and play styles analyzed by the community
          </p>
        </div>
        <Link
          href="/tactics"
          className="hidden sm:inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          {t("viewAll")} <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {featuredTactics.map((tactic) => (
          <Link
            key={tactic.slug}
            href={`/tactics/${tactic.slug}`}
            className="glass-card p-6 group"
          >
            {/* Formation Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                {tactic.formation}
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${difficultyColors[tactic.difficulty]}`}>
                  {tactic.difficulty}
                </span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-base font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {tactic.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-text-secondary mb-4 line-clamp-2 leading-relaxed">
              {tactic.excerpt}
            </p>

            {/* Style Tag */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${styleColors[tactic.style]}`}>
                {styleLabels[tactic.style]}
              </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-text-muted pt-4 border-t border-[#1C2436]/50">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {tactic.readTime} {cm("minRead")}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  {tactic.rating}
                </span>
              </div>
              <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                {cm("readMore")} <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/tactics"
        className="sm:hidden mt-6 flex items-center justify-center gap-1 text-sm text-primary"
      >
        {t("viewAll")} <ArrowRight className="w-3 h-3" />
      </Link>
    </section>
  );
}
