import { notFound, redirect } from "next/navigation";
import { allTactics, allTacticTrs } from "contentlayer/generated";
import { TacticDetailPage } from "@/components/tactics/tactic-detail-page";
import { generateSEO } from "@/lib/metadata";
import { JsonLd } from "@/components/shared/json-ld";
import type { Metadata } from "next";
import type { Tactic } from "contentlayer/generated";

interface Props {
  params: { locale: string; slug: string };
}

const BASE = "https://www.fm26tactics.com";
const trSlugs = new Set(allTacticTrs.map((t) => t.slug));

/**
 * Full param combos including the parent [locale] segment:
 * - en/de/fr: every tactic (English content — locale shells keep self-canonical)
 * - tr: ONLY translated tactics (content/tr/tactics/*)
 */
export async function generateStaticParams() {
  const params: Array<{ locale: string; slug: string }> = [];
  for (const locale of ["en", "de", "fr"]) {
    for (const tactic of allTactics) {
      params.push({ locale, slug: tactic.slug });
    }
  }
  for (const tactic of allTacticTrs) {
    params.push({ locale: "tr", slug: tactic.slug });
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = params;

  if (locale === "tr") {
    const tactic = allTacticTrs.find((t) => t.slug === slug);
    if (!tactic) return {};
    const trUrl = `${BASE}/tr/tactics/${tactic.slug}`;
    const enUrl = `${BASE}/tactics/${tactic.slug}`;
    return generateSEO({
      title: `${tactic.title} — FM26 Tactics`,
      description: tactic.description,
      path: `/tr/tactics/${tactic.slug}`,
      type: "article",
      publishedTime: tactic.publishedAt,
      tags: [...(tactic.tags || []), "fm 26 tactics", "fm26 tactics"],
      keywords: [
        ...(tactic.tags || []),
        "fm 26 taktikleri",
        "fm26 taktik",
        `fm26 ${tactic.title.toLowerCase()}`,
        "football manager 2026",
      ],
      author: "FM26 Tactics",
      ogLocale: "tr_TR",
      languageAlternates: { en: enUrl, tr: trUrl, "x-default": enUrl },
    });
  }

  const tactic = allTactics.find((t) => t.slug === slug);
  if (!tactic) return {};

  // Reverse-declare tr alternate on the English page when a translation exists
  const languageAlternates = trSlugs.has(tactic.slug)
    ? {
        en: `${BASE}/tactics/${tactic.slug}`,
        tr: `${BASE}/tr/tactics/${tactic.slug}`,
        "x-default": `${BASE}/tactics/${tactic.slug}`,
      }
    : undefined;

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
    languageAlternates,
  });
}

export default function TacticPage({ params }: Props) {
  const { locale, slug } = params;
  let tactic: Tactic | undefined;
  if (locale === "tr") {
    tactic = allTacticTrs.find((t) => t.slug === slug) as Tactic | undefined;
    // Turkish pilot: links from home/search/blog may point at untranslated
    // tactics under /tr — fall back to the English page instead of 404.
    if (!tactic && allTactics.some((t) => t.slug === slug)) {
      redirect(`/tactics/${slug}`);
    }
  } else {
    tactic = allTactics.find((t) => t.slug === slug);
  }

  if (!tactic) {
    notFound();
  }

  const pageUrl =
    locale === "tr"
      ? `${BASE}/tr/tactics/${tactic.slug}`
      : `${BASE}/tactics/${tactic.slug}`;

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
