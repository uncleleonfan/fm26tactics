import type { Metadata } from "next";

interface SEOProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  tags?: string[];
}

export function generateSEO({
  title,
  description,
  path,
  image = "/images/og/default.jpg",
  type = "website",
  publishedTime,
  tags,
}: SEOProps): Metadata {
  const url = `https://fm26tactics.com${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "FM26 Tactics",
      type,
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
      ...(publishedTime && { publishedTime }),
      ...(tags && { tags }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export const siteConfig = {
  name: "FM26 Tactics",
  url: "https://fm26tactics.com",
  description: "Master Football Manager 2026 tactics with expert guides, player role analysis, and our interactive tactic builder.",
  links: {
    twitter: "https://twitter.com/fm26tactics",
    github: "https://github.com/fm26tactics",
  },
};
