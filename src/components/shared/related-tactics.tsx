"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { allTactics, allTacticTrs } from "contentlayer/generated";

interface RelatedTacticsProps {
  currentSlug: string;
  tags: string[];
  formation: string;
}

export function RelatedTactics({ currentSlug, tags, formation }: RelatedTacticsProps) {
  const locale = useLocale();
  const nav = useTranslations("nav");
  const t = useTranslations("tactics");

  // Turkish pages link to translated tactic content when available
  const pool = locale === "tr" ? allTacticTrs : allTactics;

  // Find related tactics by matching tags and formation styles
  const related = pool
    .filter((tactic) => tactic.slug !== currentSlug)
    .map((tactic) => {
      let score = 0;
      // Same formation = high relevance
      if (tactic.formation === formation) score += 3;
      // Shared tags
      if (tactic.tags) {
        const sharedTags = tactic.tags.filter((tag) => tags.includes(tag));
        score += sharedTags.length * 2;
      }
      // Same style = complementary
      if (tactic.style) score += 1;
      return { tactic, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .filter((item) => item.score > 0);

  if (related.length === 0) return null;

  return (
    <section className="mt-16 pt-8 border-t border-[#1C2436]/50">
      <h2 className="text-lg font-bold text-text-primary mb-5">
        {nav("relatedTactics")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {related.map(({ tactic }) => (
          <Link
            key={tactic.slug}
            href={`/tactics/${tactic.slug}`}
            data-track="card_related_tactic"
            data-track-label={tactic.slug}
            className="glass-card p-4 group hover:border-primary/30 transition-all duration-200"
          >
            <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded mb-2 inline-block">
              {tactic.formation}
            </span>
            <h3 className="text-sm font-semibold text-text-primary mb-1.5 group-hover:text-primary transition-colors leading-snug line-clamp-2">
              {tactic.title}
            </h3>
            <p className="text-xs text-text-muted leading-relaxed line-clamp-2 mb-2">
              {tactic.description}
            </p>
            <span className="inline-flex items-center gap-1 text-xs text-primary font-medium group-hover:gap-1.5 transition-all">
              {t("readGuide")}
              <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
