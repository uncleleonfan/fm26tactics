import { notFound } from "next/navigation";
import { allTactics } from "contentlayer/generated";
import { TacticDetailPage } from "@/components/tactics/tactic-detail-page";
import { generateSEO } from "@/lib/metadata";
import { JsonLd } from "@/components/shared/json-ld";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return allTactics.map((tactic) => ({
    slug: tactic.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tactic = allTactics.find((t) => t.slug === params.slug);
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
  const tactic = allTactics.find((t) => t.slug === params.slug);

  if (!tactic) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: tactic.title,
          description: tactic.description,
          url: `https://fm26tactics.com/tactics/${tactic.slug}`,
          datePublished: tactic.publishedAt,
          dateModified: tactic.updatedAt || tactic.publishedAt,
          author: {
            "@type": "Person",
            name: tactic.author || "FM26 Tactics",
          },
          publisher: {
            "@type": "Organization",
            name: "FM26 Tactics",
            url: "https://fm26tactics.com",
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://fm26tactics.com/tactics/${tactic.slug}`,
          },
        }}
      />
      <TacticDetailPage tactic={tactic} />
    </>
  );
}
