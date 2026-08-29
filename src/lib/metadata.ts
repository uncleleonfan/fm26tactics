import type { Metadata } from "next";

interface SEOProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  tags?: string[];
  keywords?: string[];
  author?: string;
  ogLocale?: string;
  /**
   * hreflang alternates for FULLY translated pages only, e.g.
   * { en: "https://.../tactics/x", tr: "https://.../tr/tactics/x", "x-default": "https://.../tactics/x" }
   * Omit for untranslated locale shells (they stay plain self-canonical).
   */
  languageAlternates?: Record<string, string>;
}

export function generateSEO({
  title,
  description,
  path,
  image = "/images/og/default.jpg",
  type = "website",
  publishedTime,
  tags,
  keywords,
  author,
  ogLocale = "en_US",
  languageAlternates,
}: SEOProps): Metadata {
  const url = `https://www.fm26tactics.com${path}`;
  const fullTitle = title;

  return {
    title: { absolute: fullTitle },
    description,
    keywords: keywords || undefined,
    alternates: {
      canonical: url,
      ...(languageAlternates && { languages: languageAlternates }),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: `${title}`,
      description,
      url,
      siteName: "FM26 Tactics",
      locale: ogLocale,
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(tags && { tags }),
      ...(author && type === "article" && { article: { authors: [author], publishedTime } }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title}`,
      description,
      images: [image.startsWith("http") ? image : `https://www.fm26tactics.com${image}`],
    },
  };
}

export const siteConfig = {
  name: "FM26 Tactics",
  url: "https://www.fm26tactics.com",
  description: "Master Football Manager 2026 tactics with expert guides, player role analysis, and our interactive tactic builder.",
  links: {
    github: "https://github.com/uncleleonfan/fm26tactics",
  },
};

interface LocaleSEOContent {
  title: string;
  description: string;
  keywords?: string[];
}

interface LocaleSEOProps {
  locale: string;
  /** Canonical en path, e.g. "/" or "/tactics" */
  path: string;
  en: LocaleSEOContent;
  tr: LocaleSEOContent;
}

/**
 * Locale-aware SEO for the Turkish pilot's minimal indexable set
 * (home + core list pages — docs/optimization-plan-2026-09.md §2b L1).
 * en → canonical at `path`; tr → canonical at the /tr prefix. Both declare
 * the en↔tr hreflang pair. Other locales (de/fr shells) keep the en canonical.
 */
export function generateLocaleSEO({ locale, path, en, tr }: LocaleSEOProps): Metadata {
  const isTr = locale === "tr";
  const suffix = path === "/" ? "" : path;
  const content = isTr ? tr : en;
  return generateSEO({
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    path: isTr ? `/tr${suffix}` : path,
    ogLocale: isTr ? "tr_TR" : "en_US",
    languageAlternates: {
      en: `https://www.fm26tactics.com${suffix}`,
      tr: `https://www.fm26tactics.com/tr${suffix}`,
      "x-default": `https://www.fm26tactics.com${suffix}`,
    },
  });
}
