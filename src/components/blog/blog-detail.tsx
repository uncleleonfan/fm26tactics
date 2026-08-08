import { useMDXComponent } from "next-contentlayer/hooks";
import { Callout } from "@/components/shared/callout";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import type { Blog } from "contentlayer/generated";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Clock, Tag } from "lucide-react";

const categoryColors: Record<string, string> = {
  tactics: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  formations: "bg-green-500/10 text-green-400 border-green-500/20",
  "player-roles": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "set-pieces": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  meta: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  beginner: "bg-primary/10 text-primary border-primary/20",
};

const categoryLabels: Record<string, string> = {
  tactics: "Tactics",
  formations: "Formations",
  "player-roles": "Player Roles",
  "set-pieces": "Set Pieces",
  meta: "Meta",
  beginner: "Beginner",
};

const mdxComponents = {
  Callout,
  h2: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h2
      className="text-2xl font-bold text-text-primary mt-12 mb-4 pb-2 border-b border-[#1C2436]/50"
      {...props}
    />
  ),
  h3: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h3 className="text-xl font-semibold text-text-primary mt-8 mb-3" {...props} />
  ),
  p: (props: React.HTMLProps<HTMLParagraphElement>) => (
    <p className="text-base text-text-primary/90 leading-7 mb-5" {...props} />
  ),
  strong: (props: React.HTMLProps<HTMLElement>) => (
    <strong className="text-text-primary font-semibold" {...props} />
  ),
  ul: (props: React.HTMLProps<HTMLUListElement>) => (
    <ul className="space-y-2 mb-5 ml-5" {...props} />
  ),
  li: (props: React.HTMLProps<HTMLLIElement>) => (
    <li className="text-base text-text-primary/90 leading-7 list-disc marker:text-primary/60" {...props} />
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="space-y-2 mb-5 ml-5 list-decimal text-text-primary/90">{children}</ol>
  ),
  code: (props: React.HTMLProps<HTMLElement>) => (
    <code className="px-1.5 py-0.5 rounded bg-surface border border-surface-border text-primary text-sm font-mono" {...props} />
  ),
  blockquote: (props: React.HTMLProps<HTMLQuoteElement>) => (
    <blockquote className="border-l-2 border-primary/40 pl-5 py-3 my-6 bg-primary/5 rounded-r-lg" {...props}>
      <p className="text-base text-text-secondary/90 italic leading-7">{props.children as React.ReactNode}</p>
    </blockquote>
  ),
  table: (props: React.HTMLProps<HTMLTableElement>) => (
    <div className="overflow-x-auto mb-6 rounded-lg border border-[#1C2436]/50">
      <table className="w-full text-sm border-collapse" {...props} />
    </div>
  ),
  th: (props: React.HTMLProps<HTMLTableHeaderCellElement>) => (
    <th className="text-left p-3 bg-surface border-b border-[#1C2436] text-text-primary font-semibold text-xs uppercase tracking-wider" {...props} />
  ),
  td: (props: React.HTMLProps<HTMLTableDataCellElement>) => (
    <td className="p-3 border-b border-[#1C2436]/40 text-text-secondary text-sm leading-relaxed" {...props} />
  ),
  a: (props: React.HTMLProps<HTMLAnchorElement>) => (
    <a className="text-primary hover:underline" {...props} target={props.href?.startsWith("http") ? "_blank" : undefined} rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined} />
  ),
};

interface BlogDetailProps {
  post: Blog;
}

export function BlogDetail({ post }: BlogDetailProps) {
  const MDXContent = useMDXComponent(post.body.code);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <Breadcrumb
        className="mb-8"
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      {/* Category Badge */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-md border ${
            categoryColors[post.category] || "bg-surface text-text-muted border-surface-border"
          }`}
        >
          {categoryLabels[post.category] || post.category}
        </span>
        {post.tags?.slice(0, 3).map((tag: string) => (
          <span key={tag} className="text-xs text-text-muted flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-4 leading-tight">
        {post.title}
      </h1>

      {/* Description */}
      <p className="text-lg text-text-secondary leading-relaxed mb-6">
        {post.description}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-4 pb-8 mb-8 border-b border-[#1C2436]/50">
        <span className="flex items-center gap-1.5 text-sm text-text-muted">
          <Clock className="w-4 h-4" />
          {post.readTime} min read
        </span>
        <span className="text-sm text-text-muted">
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        {post.author && (
          <span className="text-sm text-text-muted">by {post.author}</span>
        )}
      </div>

      {/* Content */}
      <div className="prose-custom">
        <MDXContent components={mdxComponents} />
      </div>

      {/* Related Links */}
      {(post.relatedTactic || post.relatedGuide) && (
        <div className="mt-12 pt-8 border-t border-[#1C2436]/50">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
            Continue Reading
          </h3>
          <div className="space-y-3">
            {post.relatedTactic && (
              <Link
                href={`/tactics/${post.relatedTactic}`}
                className="block glass-card p-4 group hover:border-primary/30 transition-all"
              >
                <span className="text-sm font-medium text-primary group-hover:text-primary/80">
                  📋 Tactical Guide →
                </span>
                <span className="ml-2 text-text-secondary text-sm">
                  View the full {post.relatedTactic.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} breakdown
                </span>
              </Link>
            )}
            {post.relatedGuide && (
              <Link
                href={`/guides/${post.relatedGuide}`}
                className="block glass-card p-4 group hover:border-primary/30 transition-all"
              >
                <span className="text-sm font-medium text-primary group-hover:text-primary/80">
                  📖 Related Guide →
                </span>
                <span className="ml-2 text-text-secondary text-sm">Read the companion strategy guide</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Back to Blog */}
      <div className="mt-12 pt-8 border-t border-[#1C2436]/50">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to all articles
        </Link>
      </div>
    </article>
  );
}
