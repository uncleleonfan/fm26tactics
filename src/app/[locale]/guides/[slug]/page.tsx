import { notFound } from "next/navigation";
import { allGuides } from "contentlayer/generated";
import { GuideDetail } from "@/components/guides/guide-detail";
import { generateSEO } from "@/lib/metadata";
import { JsonLd } from "@/components/shared/json-ld";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return allGuides.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = allGuides.find((g) => g.slug === params.slug);
  if (!guide) return {};

  return generateSEO({
    title: `${guide.title} — FM26 Tactics Guide`,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    type: "article",
    publishedTime: guide.publishedAt,
    tags: [...(guide.tags || []), "fm 26 tactics", "fm26 tactics guide"],
    keywords: [
      ...(guide.tags || []),
      "fm 26 tactics",
      "fm26 tactics",
      "fm26 guide",
      `fm26 ${guide.title.toLowerCase()}`,
      "football manager 2026",
    ],
    author: "FM26 Tactics",
  });
}

export default function GuidePage({ params }: Props) {
  const guide = allGuides.find((g) => g.slug === params.slug);

  if (!guide) {
    notFound();
  }

  const faqItems = (guide.faq ?? []) as Array<{
    question: string;
    answer: string;
  }>;

  const faqJsonLd = faqItems.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.description,
          url: `https://www.fm26tactics.com/guides/${guide.slug}`,
          datePublished: guide.publishedAt,
          dateModified: guide.updatedAt || guide.publishedAt,
          author: {
            "@type": "Person",
            name: guide.author || "FM26 Tactics",
          },
          publisher: {
            "@type": "Organization",
            name: "FM26 Tactics",
            url: "https://www.fm26tactics.com",
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://www.fm26tactics.com/guides/${guide.slug}`,
          },
          image: "https://www.fm26tactics.com/images/og/default.jpg",
          articleSection: guide.category,
          keywords: guide.tags?.join(", "),
        }}
      />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <GuideDetail guide={guide} />
    </>
  );
}
