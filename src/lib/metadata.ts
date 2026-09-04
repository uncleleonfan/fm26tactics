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
   * hreflang alternates for fully translated pages, e.g.
   * { en: "https://.../tactics/x", "x-default": "https://.../tactics/x" }
   * Currently unused — English-only site (LOCALE_REMOVAL_AUDIT.md).
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
  /** Unused since the tr locale was removed — kept so existing callers type-check. */
  tr?: LocaleSEOContent;
}

/**
 * English-only SEO. The site dropped its /tr /fr /de locales; old URLs
 * permanently redirect (next.config.mjs), so pages emit a plain English
 * canonical with no hreflang alternates (LOCALE_REMOVAL_AUDIT.md §7).
 */
export function generateLocaleSEO({ en, path }: LocaleSEOProps): Metadata {
  return generateSEO({
    title: en.title,
    description: en.description,
    keywords: en.keywords,
    path,
  });
}
