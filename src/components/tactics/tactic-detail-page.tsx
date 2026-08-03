"use client";

import Link from "next/link";
import { useMDXComponent } from "next-contentlayer/hooks";
import { ArrowLeft, Clock, Calendar, Tag, BarChart3 } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Callout } from "@/components/shared/callout";
import { NativeAd } from "@/components/shared/native-ad";
import { SkyscraperAd } from "@/components/shared/skyscraper-ad";
import { styleLabels, styleColors } from "@/lib/tactics-data";
import { formatDate } from "@/lib/utils";
import type { Tactic } from "contentlayer/generated";

const mdxComponents = {
  Callout,
  h2: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h2 className="text-xl font-bold text-text-primary mt-10 mb-4 pb-2 border-b border-[#1C2436]/50" {...props} />
  ),
  h3: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h3 className="text-lg font-semibold text-text-primary mt-8 mb-3" {...props} />
  ),
  p: (props: React.HTMLProps<HTMLParagraphElement>) => (
    <p className="text-sm text-text-secondary leading-7 mb-4" {...props} />
  ),
  ul: (props: React.HTMLProps<HTMLUListElement>) => (
    <ul className="space-y-2 mb-4 ml-4" {...props} />
  ),
  li: (props: React.HTMLProps<HTMLLIElement>) => (
    <li className="text-sm text-text-secondary leading-7 list-disc marker:text-primary" {...props} />
  ),
  code: (props: React.HTMLProps<HTMLElement>) => (
    <code className="px-1.5 py-0.5 rounded bg-surface border border-surface-border text-primary text-xs font-mono" {...props} />
  ),
  blockquote: (props: React.HTMLProps<HTMLQuoteElement>) => (
    <blockquote className="border-l-2 border-primary/50 pl-4 py-3 my-4 bg-primary/5 rounded-r-lg" {...props}>
      <p className="text-sm text-text-secondary italic">{props.children}</p>
    </blockquote>
  ),
  table: (props: React.HTMLProps<HTMLTableElement>) => (
    <div className="overflow-x-auto mb-6">
      <table className="w-full text-sm border-collapse" {...props} />
    </div>
  ),
  th: (props: React.HTMLProps<HTMLTableHeaderCellElement>) => (
    <th className="text-left p-3 bg-surface border border-[#1C2436] text-text-primary font-semibold" {...props} />
  ),
  td: (props: React.HTMLProps<HTMLTableDataCellElement>) => (
    <td className="p-3 border border-[#1C2436] text-text-secondary" {...props} />
  ),
};

const difficultyConfig: Record<string, { label: string; className: string }> = {
  beginner: { label: "Beginner", className: "bg-green-500/20 text-green-400 border-green-500/30" },
  intermediate: { label: "Intermediate", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  advanced: { label: "Advanced", className: "bg-red-500/20 text-red-400 border-red-500/30" },
};

interface TacticDetailPageProps {
  tactic: Tactic;
}

export function TacticDetailPage({ tactic }: TacticDetailPageProps) {
  const MDXContent = useMDXComponent(tactic.body.code);
  const diff = difficultyConfig[tactic.difficulty];

  return (
    <div className="min-h-screen bg-background-primary pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Tactics", href: "/tactics" },
            { label: tactic.title },
          ]}
          className="mb-8"
        />

        <div className="lg:grid lg:grid-cols-[200px_1fr_200px] lg:gap-8">
          {/* Left skyscraper ad */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <SkyscraperAd />
            </div>
          </aside>

          <div className="min-w-0">
            <div className="max-w-4xl">
              {/* Back link */}
              <Link
                href="/tactics"
                className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Tactics
              </Link>

              {/* Header */}
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded-md">
                    {tactic.formation}
                  </span>
                  <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border ${diff.className}`}>
                    {diff.label}
                  </span>
                  <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border ${styleColors[tactic.style]}`}>
                    {styleLabels[tactic.style]}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
                  {tactic.title}
                </h1>

                <p className="text-lg text-text-secondary mb-6">{tactic.description}</p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted pb-6 border-b border-[#1C2436]/50">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Published {formatDate(tactic.publishedAt)}
                  </span>
                  {tactic.updatedAt && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Updated {formatDate(tactic.updatedAt)}
                    </span>
                  )}
                </div>

                {/* Tags */}
                {tactic.tags && tactic.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-4">
                    <Tag className="w-3.5 h-3.5 text-text-muted" />
                    {tactic.tags.map((tag) => (
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

              {/* Native Ad */}
              <NativeAd />
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <SkyscraperAd />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
