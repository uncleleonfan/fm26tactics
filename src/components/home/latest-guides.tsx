import { Link } from "@/i18n/routing";
import { allGuides } from "contentlayer/generated";
import { ArrowRight, BookOpen, FileText, Target, Crosshair, Users, Flame } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  training: <FileText className="w-5 h-5" />,
  "set-pieces": <Target className="w-5 h-5" />,
  scouting: <Crosshair className="w-5 h-5" />,
  "team-management": <Users className="w-5 h-5" />,
  "match-day": <BookOpen className="w-5 h-5" />,
  "youth-development": <Flame className="w-5 h-5" />,
};

export function LatestGuides() {
  // Get the 6 most recently published guides
  const guides = allGuides
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-t border-[#1C2436]/50">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Latest <span className="gradient-text">Guides</span>
          </h2>
          <p className="text-text-secondary text-sm">
            In-depth tutorials to level up your FM26 management
          </p>
        </div>
        <Link
          href="/guides"
          className="hidden sm:inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          All Guides <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="glass-card p-5 group flex gap-4"
          >
            <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
              {iconMap[guide.category] || <FileText className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                  {guide.title}
                </h3>
                <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-surface border border-surface-border text-text-muted capitalize">
                  {guide.difficulty}
                </span>
              </div>
              <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                {guide.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
