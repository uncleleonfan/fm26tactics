"use client";

import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Clock, Star, ArrowRight } from "lucide-react";
import { styleLabels, styleColors } from "@/lib/tactics-data";
import type { FormationType, PlayStyle } from "@/types/tactic";

interface TacticCardProps {
  slug: string;
  title: string;
  description: string;
  formation: FormationType;
  style: PlayStyle;
  difficulty: "beginner" | "intermediate" | "advanced";
  publishedAt: string;
  coverImage?: string;
}

const difficultyClasses: Record<string, string> = {
  beginner: "bg-green-500/20 text-green-400",
  intermediate: "bg-amber-500/20 text-amber-400",
  advanced: "bg-red-500/20 text-red-400",
};

export function TacticCard({
  slug,
  title,
  description,
  formation,
  style,
  difficulty,
  publishedAt,
}: TacticCardProps) {
  const t = useTranslations("tactics");
  const ft = useTranslations("filter");
  const format = useFormatter();

  const styleLabel = t.has(`styles.${style}`) ? t(`styles.${style}`) : styleLabels[style];

  return (
    <Link
      href={`/tactics/${slug}`}
      data-track="card_tactic"
      data-track-label={slug}
      className="glass-card overflow-hidden group"
    >
      {/* Header with formation */}
      <div className="p-5 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
              {formation}
            </span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${difficultyClasses[difficulty]}`}>
              {ft(difficulty)}
            </span>
          </div>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${styleColors[style]}`}>
            {styleLabel}
          </span>
        </div>

        <h3 className="text-base font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>

        <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed mb-4">
          {description}
        </p>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[#1C2436]/50 flex items-center justify-between text-xs text-text-muted">
        <span>
          {format.dateTime(new Date(publishedAt), {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          {t("read")} <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
}
