import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { allGuides } from "contentlayer/generated";
import { BookOpen, BarChart3, ClipboardCheck, Crosshair, Flame, Target, Users, ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import type { Metadata } from "next";
import { generateSEO } from "@/lib/metadata";

export const metadata: Metadata = generateSEO({
  title: "FM26 Guides — Training, Tactics & Strategy Tutorials",
  description: "Comprehensive Football Manager 2026 guides. Learn tactics, training, scouting, youth development, and match day preparation.",
  path: "/guides",
  keywords: [
    "fm26 guides", "football manager 2026 guides", "fm26 training guide",
    "fm26 tactics tutorial", "fm26 scouting guide", "fm26 youth development",
    "fm26 match preparation", "fm26 strategy tutorial",
  ],
});

const categoryIcons: Record<string, React.ReactNode> = {
  training: <ClipboardCheck className="w-4 h-4" />,
  "set-pieces": <Target className="w-4 h-4" />,
  scouting: <Crosshair className="w-4 h-4" />,
  "team-management": <Users className="w-4 h-4" />,
  "match-day": <BookOpen className="w-4 h-4" />,
  "youth-development": <Flame className="w-4 h-4" />,
  tactics: <BarChart3 className="w-4 h-4" />,
};

const categoryColors: Record<string, string> = {
  training: "text-accent-blue",
  "set-pieces": "text-primary",
  scouting: "text-amber-400",
  "team-management": "text-purple-400",
  "match-day": "text-red-400",
  "youth-development": "text-orange-400",
  tactics: "text-primary",
};

const difficultyBadge: Record<string, string> = {
  beginner: "bg-green-500/20 text-green-400 border-green-500/30",
  intermediate: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  advanced: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default async function GuidesPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const gd = await getTranslations({ locale, namespace: "guides" });
  const cm = await getTranslations({ locale, namespace: "common" });

  const categoryKeys: Record<string, string> = {
    training: "training",
    "set-pieces": "setPieces",
    scouting: "scouting",
    "team-management": "teamManagement",
    "match-day": "matchDay",
    "youth-development": "youthDevelopment",
    tactics: "tactics",
  };

  const allCategories = ["tactics", "team-management", "match-day", "training", "set-pieces", "scouting", "youth-development"] as const;

  // Group guides by category
  const guidesByCategory: Record<string, typeof allGuides> = {};
  allGuides.forEach((g) => {
    if (!guidesByCategory[g.category]) guidesByCategory[g.category] = [];
    guidesByCategory[g.category].push(g);
  });

  return (
    <div className="min-h-screen bg-background-primary pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Breadcrumb
          items={[{ label: cm("home"), href: "/" }, { label: gd("title") }]}
          className="mb-6"
        />

        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">
            FM26 <span className="gradient-text">Guides</span>
          </h1>
          <p className="text-text-secondary max-w-2xl">
            {gd("description")}
          </p>
        </div>

        <div>
          <div className="min-w-0 space-y-10">
            {allCategories.map((cat) => {
              const catGuides = guidesByCategory[cat] || [];
              return (
                <section key={cat}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={categoryColors[cat]}>
                      {categoryIcons[cat]}
                    </div>
                    <h2 className="text-lg font-bold text-text-primary">
                      {gd(categoryKeys[cat] as any)}
                    </h2>
                    <span className="text-xs text-text-muted">
                      {catGuides.length} {catGuides.length === 1 ? gd("guidesCount_one") : gd("guidesCount_other")}
                    </span>
                  </div>

                  {catGuides.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {catGuides.map((guide) => (
                        <Link
                          key={guide.slug}
                          href={`/guides/${guide.slug}`}
                          data-track="card_guide_list"
                          data-track-label={guide.slug}
                          className="glass-card p-5 group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-2 pr-4">
                              {guide.title}
                            </h3>
                            <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border ${difficultyBadge[guide.difficulty ?? "beginner"] || difficultyBadge.beginner}`}>
                              {guide.difficulty}
                            </span>
                          </div>
                          <p className="text-xs text-text-secondary line-clamp-2 mb-3 leading-relaxed">
                            {guide.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex flex-wrap gap-1">
                              {guide.tags?.slice(0, 3).map((tag) => (
                                <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-surface border border-surface-border text-text-muted">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <span className="ml-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs">
                              {gd("read")} <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="glass-card p-5 border-dashed">
                      <p className="text-sm text-text-muted">{gd("comingSoon")}</p>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
