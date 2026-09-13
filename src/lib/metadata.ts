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
  /**
   * Alternate spellings of the brand, in order of preference. Google's site
   * name system falls back to these when the primary `name` is not trusted;
   * the bare domain is listed last as Google's documented last resort.
   */
  alternateNames: ["FM26Tactics", "fm26tactics.com"],
  url: "https://www.fm26tactics.com",
  description: "Master Football Manager 2026 tactics with expert guides, player role analysis, and our interactive tactic builder.",
  links: {
    github: "https://github.com/uncleleonfan/fm26tactics",
  },
};

/**
 * Site-level `WebSite` structured data — the strongest signal Google Search
 * uses to derive the site name shown above a result's title link.
 *
 * Requirements (https://developers.google.com/search/docs/appearance/site-names):
 * - `name` + `url` are required; `alternateName` is recommended.
 * - Markup only needs to live on the home page; it must describe the domain's
 *   canonical home page and must not be blocked by robots.txt or `noindex`.
 * - `name` must stay consistent with `og:site_name`, `<title>` and the visible
 *   header logo, otherwise Google keeps showing the bare URL instead.
 */
export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#website`,
  name: siteConfig.name,
  alternateName: siteConfig.alternateNames,
  url: `${siteConfig.url}/`,
  description: siteConfig.description,
  inLanguage: "en",
  publisher: {
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    alternateName: siteConfig.alternateNames,
    url: `${siteConfig.url}/`,
    sameAs: [siteConfig.links.github],
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
