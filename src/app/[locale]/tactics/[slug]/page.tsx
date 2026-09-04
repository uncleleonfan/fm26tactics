import { notFound } from "next/navigation";
import { allTactics } from "contentlayer/generated";
import { TacticDetailPage } from "@/components/tactics/tactic-detail-page";
import { generateSEO } from "@/lib/metadata";
import { JsonLd } from "@/components/shared/json-ld";
import type { Metadata } from "next";

interface Props {
  params: { locale: string; slug: string };
}

const BASE = "https://www.fm26tactics.com";

/**
 * English-only site: every tactic under the default (prefixless) locale.
 * Old /tr /fr /de URLs permanently redirect here (next.config.mjs).
 */
export async function generateStaticParams() {
  return allTactics.map((tactic) => ({ locale: "en", slug: tactic.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;

  const tactic = allTactics.find((t) => t.slug === slug);
  if (!tactic) return {};

  return generateSEO({
    title: `${tactic.title} — FM26 Tactics`,
    description: tactic.description,
    path: `/tactics/${tactic.slug}`,
    type: "article",
    publishedTime: tactic.publishedAt,
    tags: [...(tactic.tags || []), "fm 26 tactics", "fm26 tactics"],
    keywords: [
      ...(tactic.tags || []),
      "fm 26 tactics",
      "fm26 tactics",
      `fm26 ${tactic.title.toLowerCase()}`,
      "football manager 2026",
    ],
    author: "FM26 Tactics",
  });
}

export default function TacticPage({ params }: Props) {
  const { slug } = params;
  const tactic = allTactics.find((t) => t.slug === slug);

  if (!tactic) {
    notFound();
  }

  const pageUrl = `${BASE}/tactics/${tactic.slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: tactic.title,
          description: tactic.description,
          url: pageUrl,
          datePublished: tactic.publishedAt,
          dateModified: tactic.updatedAt || tactic.publishedAt,
          author: {
            "@type": "Person",
            name: tactic.author || "FM26 Tactics",
          },
          publisher: {
            "@type": "Organization",
            name: "FM26 Tactics",
            url: "https://www.fm26tactics.com",
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": pageUrl,
          },
        }}
      />
      <TacticDetailPage tactic={tactic} />
    </>
  );
}
