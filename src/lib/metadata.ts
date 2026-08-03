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
}: SEOProps): Metadata {
  const url = `https://fm26tactics.com${path}`;
  const fullTitle = type === "article" ? title : undefined;

  return {
    title: fullTitle,
    description,
    keywords: keywords || undefined,
    alternates: { canonical: url },
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
      locale: "en_US",
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
      images: [image],
    },
  };
}

export const siteConfig = {
  name: "FM26 Tactics",
  url: "https://fm26tactics.com",
  description: "Master Football Manager 2026 tactics with expert guides, player role analysis, and our interactive tactic builder.",
  links: {
    github: "https://github.com/uncleleonfan/fm26tactics",
  },
};
