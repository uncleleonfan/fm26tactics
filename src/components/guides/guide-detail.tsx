"use client";

import { Link } from "@/i18n/routing";
import { useMDXComponent } from "next-contentlayer/hooks";
import { ArrowLeft, Clock, Calendar, Tag, BookOpen, BarChart3, Flame, Target, Users, ClipboardCheck, Crosshair } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Callout } from "@/components/shared/callout";
import { RelatedGuides } from "@/components/shared/related-guides";
import { formatDate } from "@/lib/utils";
import type { Guide } from "contentlayer/generated";

const categoryConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  training: { label: "Training", icon: <ClipboardCheck className="w-3.5 h-3.5" />, color: "text-accent-blue" },
  "set-pieces": { label: "Set Pieces", icon: <Target className="w-3.5 h-3.5" />, color: "text-primary" },
  scouting: { label: "Scouting", icon: <Crosshair className="w-3.5 h-3.5" />, color: "text-amber-400" },
  "team-management": { label: "Team Management", icon: <Users className="w-3.5 h-3.5" />, color: "text-purple-400" },
  "match-day": { label: "Match Day", icon: <BookOpen className="w-3.5 h-3.5" />, color: "text-red-400" },
  "youth-development": { label: "Youth Development", icon: <Flame className="w-3.5 h-3.5" />, color: "text-orange-400" },
  tactics: { label: "Tactics", icon: <BarChart3 className="w-3.5 h-3.5" />, color: "text-primary" },
};

const difficultyConfig: Record<string, { label: string; className: string }> = {
  beginner: { label: "Beginner", className: "bg-green-500/20 text-green-400 border-green-500/30" },
  intermediate: { label: "Intermediate", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  advanced: { label: "Advanced", className: "bg-red-500/20 text-red-400 border-red-500/30" },
};

const mdxComponents = {
  Callout,
  h2: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-bold text-text-primary mt-12 mb-4 pb-2 border-b border-[#1C2436]/50" {...props} />
  ),
  h3: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h3 className="text-xl font-semibold text-text-primary mt-8 mb-3" {...props} />
  ),
  p: (props: React.HTMLProps<HTMLParagraphElement>) => (
    <p className="text-base text-text-primary/90 leading-7 mb-5" {...props} />
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
  strong: (props: React.HTMLProps<HTMLElement>) => (
    <strong className="text-text-primary font-semibold" {...props} />
  ),
  code: (props: React.HTMLProps<HTMLElement>) => (
    <code className="px-1.5 py-0.5 rounded bg-surface border border-surface-border text-primary text-sm font-mono" {...props} />
  ),
  blockquote: (props: React.HTMLProps<HTMLQuoteElement>) => (
    <blockquote className="border-l-2 border-primary/40 pl-5 py-3 my-6 bg-primary/5 rounded-r-lg" {...props}>
      <p className="text-base text-text-secondary/90 italic leading-7">{props.children}</p>
    </blockquote>
  ),
  table: (props: React.HTMLProps<HTMLTableElement>) => (
    <div className="overflow-x-auto mb-6 rounded-lg border border-[#1C2436]/50">
      <table className="w-full text-sm border-collapse" {...props} />
    </div>
  ),
  thead: (props: React.HTMLProps<HTMLTableSectionElement>) => (
    <thead className="bg-[#141A26]/80" {...props} />
  ),
  tbody: (props: React.HTMLProps<HTMLTableSectionElement>) => (
    <tbody {...props} />
  ),
  tr: (props: React.HTMLProps<HTMLTableRowElement>) => (
    <tr className="border-b border-[#1C2436]/40 last:border-b-0 even:bg-[#111827]/40 hover:bg-[#141A26]/80 transition-colors" {...props} />
  ),
  th: (props: React.HTMLProps<HTMLTableHeaderCellElement>) => (
    <th className="text-left p-3.5 text-text-primary font-semibold text-xs uppercase tracking-wider border-b border-[#1C2436]" {...props} />
  ),
  td: (props: React.HTMLProps<HTMLTableDataCellElement>) => (
    <td className="p-3.5 text-text-secondary text-sm leading-relaxed" {...props} />
  ),
};

interface GuideDetailProps {
  guide: Guide;
}

export function GuideDetail({ guide }: GuideDetailProps) {
  const MDXContent = useMDXComponent(guide.body.code);
  const cat = categoryConfig[guide.category] || categoryConfig["team-management"];
  const diff = difficultyConfig[guide.difficulty ?? "beginner"] || difficultyConfig["beginner"];

  return (
    <div className="min-h-screen bg-background-primary pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Guides", href: "/guides" },
            { label: guide.title },
          ]}
          className="mb-8"
        />

        <div>
          <div className="min-w-0">
            <div className="max-w-4xl">
              <Link
                href="/guides"
                className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Guides
              </Link>

              {/* Header */}
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border ${cat.color} bg-surface border-surface-border`}>
                    {cat.icon}
                    {cat.label}
                  </span>
                  <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border ${diff.className}`}>
                    {diff.label}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
                  {guide.title}
                </h1>

                <p className="text-lg text-text-secondary mb-6">{guide.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted pb-6 border-b border-[#1C2436]/50">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Published {formatDate(guide.publishedAt)}
                  </span>
                  {guide.updatedAt && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Updated {formatDate(guide.updatedAt)}
                    </span>
                  )}
                  {guide.author && (
                    <span className="text-text-muted">by {guide.author}</span>
                  )}
                </div>

                {guide.tags && guide.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-4">
                    <Tag className="w-3.5 h-3.5 text-text-muted" />
                    {guide.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-0.5 rounded-full bg-surface border border-surface-border text-text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* MDX Content */}
              <article className="prose-custom">
                <MDXContent components={mdxComponents} />
              </article>

              {/* Related Guides — internal linking for SEO */}
              <RelatedGuides
                currentSlug={guide.slug}
                tags={guide.tags || []}
                category={guide.category}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
