import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { allGuides } from "contentlayer/generated";

interface RelatedGuidesProps {
  currentSlug: string;
  tags: string[];
  category: string;
}

export function RelatedGuides({ currentSlug, tags, category }: RelatedGuidesProps) {
  const related = allGuides
    .filter((g) => g.slug !== currentSlug)
    .map((g) => {
      let score = 0;
      if (g.category === category) score += 3;
      if (g.tags) {
        const sharedTags = g.tags.filter((tag: string) => tags.includes(tag));
        score += sharedTags.length * 2;
      }
      return { guide: g, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .filter((item) => item.score > 0);

  if (related.length === 0) return null;

  return (
    <section className="mt-16 pt-8 border-t border-[#1C2436]/50">
      <h2 className="text-lg font-bold text-text-primary mb-5">
        Related Guides
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {related.map(({ guide }) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="glass-card p-4 group hover:border-primary/30 transition-all duration-200"
          >
            <h3 className="text-sm font-semibold text-text-primary mb-1.5 group-hover:text-primary transition-colors leading-snug line-clamp-2">
              {guide.title}
            </h3>
            <p className="text-xs text-text-muted leading-relaxed line-clamp-2 mb-2">
              {guide.description}
            </p>
            <span className="inline-flex items-center gap-1 text-xs text-primary font-medium group-hover:gap-1.5 transition-all">
              Read guide
              <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
