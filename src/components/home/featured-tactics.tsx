import Link from "next/link";
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
    slug: "4-2-3-1-gegenpress",
    title: "4-2-3-1 Gegenpress: The Modern High-Pressure Blueprint",
    formation: "4-2-3-1",
    style: "gegenpress",
    difficulty: "intermediate",
    excerpt: "Learn how to set up an aggressive pressing system that suffocates opponents and creates rapid transitions.",
    readTime: 12,
    rating: 4.8,
  },
  {
    slug: "4-3-3-tiki-taka",
    title: "4-3-3 Tiki-Taka: Possession Domination Guide",
    formation: "4-3-3",
    style: "tiki-taka",
    difficulty: "advanced",
    excerpt: "Control the game with intricate short passing, intelligent movement, and positional play mastery.",
    readTime: 15,
    rating: 4.6,
  },
  {
    slug: "3-5-2-counter-attack",
    title: "3-5-2 Counter-Attack: The Underdog's Weapon",
    formation: "3-5-2",
    style: "counter-attack",
    difficulty: "intermediate",
    excerpt: "A devastating counter-attacking setup that exploits space behind aggressive opponents.",
    readTime: 10,
    rating: 4.7,
  },
];

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-500/20 text-green-400",
  intermediate: "bg-amber-500/20 text-amber-400",
  advanced: "bg-red-500/20 text-red-400",
};

export function FeaturedTactics() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            <span className="gradient-text">Featured</span> Tactics
          </h2>
          <p className="text-text-secondary text-sm">
            Top-rated formations and play styles analyzed by the community
          </p>
        </div>
        <Link
          href="/tactics"
          className="hidden sm:inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          View all <ArrowRight className="w-3 h-3" />
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
                  {tactic.readTime} min read
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  {tactic.rating}
                </span>
              </div>
              <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                Read <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/tactics"
        className="sm:hidden mt-6 flex items-center justify-center gap-1 text-sm text-primary"
      >
        View all tactics <ArrowRight className="w-3 h-3" />
      </Link>
    </section>
  );
}
