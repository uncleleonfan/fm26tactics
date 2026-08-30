import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Star, Clock, ArrowRight } from "lucide-react";
import { styleColors } from "@/lib/tactics-data";
import type { FormationType, PlayStyle } from "@/types/tactic";

interface FeaturedTactic {
  slug: string;
  titleKey: string;
  excerptKey: string;
  formation: FormationType;
  style: PlayStyle;
  styleKey: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  readTime: number;
  rating: number;
}

const featuredTactics: FeaturedTactic[] = [
  {
    slug: "3-5-2-catenaccio", titleKey: "ftCatenaccioTitle", excerptKey: "ftCatenaccioExcerpt",
    formation: "3-5-2", style: "park-the-bus", styleKey: "styleParkTheBus", difficulty: "beginner",
    readTime: 11, rating: 4.4,
  },
  {
    slug: "4-3-3-tiki-taka", titleKey: "ftTikiTakaTitle", excerptKey: "ftTikiTakaExcerpt",
    formation: "4-3-3", style: "tiki-taka", styleKey: "styleTikiTaka", difficulty: "advanced",
    readTime: 15, rating: 4.6,
  },
  {
    slug: "4-2-3-1-gegenpress", titleKey: "ftGegenpressTitle", excerptKey: "ftGegenpressExcerpt",
    formation: "4-2-3-1", style: "gegenpress", styleKey: "styleGegenpress", difficulty: "intermediate",
    readTime: 12, rating: 4.8,
  },
  {
    slug: "3-5-2-counter-attack", titleKey: "ftCounterAttackTitle", excerptKey: "ftCounterAttackExcerpt",
    formation: "3-5-2", style: "counter-attack", styleKey: "styleCounterAttack", difficulty: "intermediate",
    readTime: 10, rating: 4.7,
  },
  {
    slug: "4-4-2-wing-play", titleKey: "ftWingPlayTitle", excerptKey: "ftWingPlayExcerpt",
    formation: "4-4-2", style: "wing-play", styleKey: "styleWingPlay", difficulty: "beginner",
    readTime: 10, rating: 4.5,
  },
  {
    slug: "4-3-3-fluid-counter", titleKey: "ftFluidCounterTitle", excerptKey: "ftFluidCounterExcerpt",
    formation: "4-3-3", style: "fluid-counter-attack", styleKey: "styleFluidCounter", difficulty: "advanced",
    readTime: 13, rating: 4.6,
  },
  {
    slug: "3-4-3-control-possession", titleKey: "ftControlPossessionTitle", excerptKey: "ftControlPossessionExcerpt",
    formation: "3-4-3", style: "control-possession", styleKey: "styleControlPossession", difficulty: "advanced",
    readTime: 14, rating: 4.5,
  },
  {
    slug: "4-1-2-1-2-diamond", titleKey: "ftDiamondTitle", excerptKey: "ftDiamondExcerpt",
    formation: "4-1-2-1-2", style: "control-possession", styleKey: "styleControlPossession", difficulty: "intermediate",
    readTime: 11, rating: 4.3,
  },
  {
    slug: "5-2-3-gegenpress", titleKey: "ft523GegenpressTitle", excerptKey: "ft523GegenpressExcerpt",
    formation: "5-2-3", style: "gegenpress", styleKey: "styleGegenpress", difficulty: "advanced",
    readTime: 14, rating: 4.5,
  },
  {
    slug: "3-4-2-1-counter-attack", titleKey: "ft3421CounterTitle", excerptKey: "ft3421CounterExcerpt",
    formation: "3-4-2-1", style: "counter-attack", styleKey: "styleCounterAttack", difficulty: "intermediate",
    readTime: 12, rating: 4.6,
  },
];

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-500/20 text-green-400",
  intermediate: "bg-amber-500/20 text-amber-400",
  advanced: "bg-red-500/20 text-red-400",
};

const difficultyKey: Record<string, string> = {
  beginner: "difficultyBeginner",
  intermediate: "difficultyIntermediate",
  advanced: "difficultyAdvanced",
};

interface FeaturedTacticsProps {
  locale: string;
}

export async function FeaturedTactics({ locale }: FeaturedTacticsProps) {
  const t = await getTranslations({ locale, namespace: "home" });
  const cm = await getTranslations({ locale, namespace: "common" });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            <span className="gradient-text">{t("featuredTactics").split(" ")[0]}</span>{" "}
            {t("featuredTactics").split(" ").slice(1).join(" ")}
          </h2>
          <p className="text-text-secondary text-sm">
            {t("featuredTacticsSubtitle")}
          </p>
        </div>
        <Link
          href="/tactics"
          data-track="cta_view_all_tactics"
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
            data-track="card_featured_tactic"
            data-track-label={tactic.slug}
            className="glass-card p-6 group"
          >
            {/* Formation Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                {tactic.formation}
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${difficultyColors[tactic.difficulty]}`}>
                  {t(difficultyKey[tactic.difficulty] as Parameters<typeof t>[0])}
                </span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-base font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {t(tactic.titleKey)}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-text-secondary mb-4 line-clamp-2 leading-relaxed">
              {t(tactic.excerptKey)}
            </p>

            {/* Style Tag */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${styleColors[tactic.style]}`}>
                {t(tactic.styleKey)}
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
        data-track="cta_view_all_tactics"
        className="sm:hidden mt-6 flex items-center justify-center gap-1 text-sm text-primary"
      >
        {t("viewAll")} <ArrowRight className="w-3 h-3" />
      </Link>
    </section>
  );
}
