import { Link } from "@/i18n/routing";
import { ArrowRight, Clock, Tag } from "lucide-react";
import type { Blog } from "contentlayer/generated";

const categoryColors: Record<string, string> = {
  tactics: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  formations: "bg-green-500/10 text-green-400 border-green-500/20",
  "player-roles": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "set-pieces": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  meta: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  beginner: "bg-primary/10 text-primary border-primary/20",
  wonderkids: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const categoryLabels: Record<string, string> = {
  tactics: "Tactics",
  formations: "Formations",
  "player-roles": "Player Roles",
  "set-pieces": "Set Pieces",
  meta: "Meta",
  beginner: "Beginner",
  wonderkids: "Wonderkids",
};

interface BlogListProps {
  posts: Blog[];
}

export function BlogList({ posts }: BlogListProps) {
  const sorted = [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  if (sorted.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-text-muted">No blog posts yet. Stay tuned!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sorted.map((post, i) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className={`glass-card p-6 group hover:border-primary/30 transition-all duration-300 ${
            i === 0 ? "md:col-span-2" : ""
          }`}
        >
          {/* Tags */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                categoryColors[post.category ?? ""] || "bg-surface text-text-muted border-surface-border"
              }`}
            >
              {categoryLabels[post.category ?? ""] || post.category}
            </span>
            {post.tags?.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="text-[11px] text-text-muted flex items-center gap-0.5"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h2
            className={`font-bold text-text-primary group-hover:text-primary transition-colors mb-2 leading-tight ${
              i === 0 ? "text-2xl" : "text-xl"
            }`}
          >
            {post.title}
          </h2>

          {/* Description */}
          <p
            className={`text-text-secondary leading-relaxed mb-4 ${
              i === 0 ? "text-base" : "text-sm"
            }`}
          >
            {post.description}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between pt-4 border-t border-[#1C2436]/50">
            <div className="flex items-center gap-3 text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime} min read
              </span>
              <span>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-1.5 transition-all">
              Read more
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
