"use client";

import { Link } from "@/i18n/routing";
import { useFormatter, useTranslations } from "next-intl";
import { useMDXComponent } from "next-contentlayer/hooks";
import { ArrowLeft, Clock, Calendar, Tag, BarChart3, Copy, Check, LayoutTemplate, LayoutGrid, Users, Wrench } from "lucide-react";
import { useState } from "react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Callout } from "@/components/shared/callout";
import { MdxLink } from "@/components/shared/mdx-link";
import { RelatedTactics } from "@/components/shared/related-tactics";
import { styleLabels, styleColors } from "@/lib/tactics-data";
import { tacticCopyTexts } from "@/lib/tactic-copy-texts";
import type { Tactic } from "contentlayer/generated";

const mdxComponents = {
  Callout,
  a: MdxLink,
  h2: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-bold text-text-primary mt-12 mb-4 pb-2 border-b border-[#1C2436]/50" {...props} />
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
  th: (props: React.HTMLProps<HTMLTableHeaderCellElement>) => (
    <th className="text-left p-3 bg-surface border-b border-[#1C2436] text-text-primary font-semibold text-xs uppercase tracking-wider" {...props} />
  ),
  td: (props: React.HTMLProps<HTMLTableDataCellElement>) => (
    <td className="p-3 border-b border-[#1C2436]/40 text-text-secondary text-sm leading-relaxed" {...props} />
  ),
};

const difficultyConfig: Record<string, { className: string }> = {
  beginner: { className: "bg-green-500/20 text-green-400 border-green-500/30" },
  intermediate: { className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  advanced: { className: "bg-red-500/20 text-red-400 border-red-500/30" },
};

interface TacticDetailPageProps {
  tactic: Tactic;
}

export function TacticDetailPage({ tactic }: TacticDetailPageProps) {
  const MDXContent = useMDXComponent(tactic.body.code);
  const diff = difficultyConfig[tactic.difficulty];
  const [copied, setCopied] = useState(false);
  const copyText = tacticCopyTexts[tactic.slug];

  const t = useTranslations("tactics");
  const ft = useTranslations("filter");
  const nav = useTranslations("nav");
  const cm = useTranslations("common");
  const format = useFormatter();

  const localDate = (date: string) =>
    format.dateTime(new Date(date), { year: "numeric", month: "long", day: "numeric" });
  const styleLabel = t.has(`styles.${tactic.style}`)
    ? t(`styles.${tactic.style}`)
    : styleLabels[tactic.style];
  const tagLabel = (tag: string) => (t.has(`tags.${tag}`) ? t(`tags.${tag}`) : tag);

  const handleCopy = async () => {
    if (!copyText) return;
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — fall back to nothing
    }
  };

  return (
    <div className="min-h-screen bg-background-primary pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Breadcrumb
          items={[
            { label: cm("home"), href: "/" },
            { label: nav("tactics"), href: "/tactics" },
            { label: tactic.title },
          ]}
          className="mb-8"
        />

        <div>
          <div className="min-w-0">
            <div className="max-w-4xl">
              {/* Back link */}
              <Link
                href="/tactics"
                data-track="detail_back"
                className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("backToTactics")}
              </Link>

              {/* Header */}
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded-md">
                    {tactic.formation}
                  </span>
                  <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border ${diff.className}`}>
                    {ft(tactic.difficulty)}
                  </span>
                  <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border ${styleColors[tactic.style]}`}>
                    {styleLabel}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
                  {tactic.title}
                </h1>

                <p className="text-lg text-text-secondary mb-6">{tactic.description}</p>

                {copyText && (
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <button
                      onClick={handleCopy}
                      data-track="tactic_copy_setup"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          {t("setupCopied")}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          {t("copySetup")}
                        </>
                      )}
                    </button>
                    <Link
                      href="/builder"
                      data-track="tactic_open_builder"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface border border-surface-border text-text-secondary text-sm font-semibold hover:border-primary/40 hover:text-text-primary transition-colors"
                    >
                      <LayoutTemplate className="w-4 h-4" />
                      {t("openInBuilder")}
                    </Link>
                  </div>
                )}

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted pb-6 border-b border-[#1C2436]/50">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {t("published", { date: localDate(tactic.publishedAt) })}
                  </span>
                  {tactic.updatedAt && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {t("updated", { date: localDate(tactic.updatedAt) })}
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
                        {tagLabel(tag)}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* MDX Content */}
              <article className="prose-custom">
                <MDXContent components={mdxComponents} />
              </article>

              {/* Related Tactics — internal linking for SEO */}
              <RelatedTactics
                currentSlug={tactic.slug}
                tags={tactic.tags || []}
                formation={tactic.formation}
              />

              {/* Topical Graph — Related Guides */}
              <div className="grid sm:grid-cols-3 gap-3 mt-8">
                <Link
                  href={`/formations#${tactic.formation}`}
                  className="glass-card p-4 rounded-xl border border-primary/10 hover:border-primary/40 transition-colors flex items-center gap-3 group"
                >
                  <LayoutGrid className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium">Formation: {tactic.formation}</span>
                </Link>
                <Link
                  href="/roles"
                  className="glass-card p-4 rounded-xl border border-primary/10 hover:border-primary/40 transition-colors flex items-center gap-3 group"
                >
                  <Users className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium">FM26 Player Roles</span>
                </Link>
                <Link
                  href="/builder"
                  className="glass-card p-4 rounded-xl border border-primary/10 hover:border-primary/40 transition-colors flex items-center gap-3 group"
                >
                  <Wrench className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium">Try in Builder</span>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
