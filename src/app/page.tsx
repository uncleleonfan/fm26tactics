import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero";
import { FeaturedTactics } from "@/components/home/featured-tactics";
import { LatestGuides } from "@/components/home/latest-guides";
import { TacticBuilderCTA } from "@/components/home/cta-section";
import { StatsSection } from "@/components/home/stats-section";
import { CommunityInsights } from "@/components/home/community-insights";
import { JsonLd } from "@/components/shared/json-ld";
import { siteConfig } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "FM26 Tactics — Best Football Manager 2026 Tactics & Formations",
  description:
    "Discover the best FM 26 tactics, formations, and player roles. Community-tested meta tactics, interactive tactic builder, and in-depth guides for Football Manager 2026.",
  keywords: [
    "fm 26 tactics", "fm26 tactics", "fm 2026 tactics",
    "football manager 2026 tactics", "fm26 best tactics",
    "fm26 formations", "fm 26 formations", "fm26 gegenpress",
  ],
  alternates: {
    canonical: "https://fm26tactics.com",
  },
  openGraph: {
    title: "FM26 Tactics — Best Football Manager 2026 Tactics & Formations",
    description:
      "Discover the best FM 26 tactics, formations, and player roles. Community-tested meta tactics, interactive tactic builder, and in-depth guides.",
    url: "https://fm26tactics.com",
    type: "website",
    siteName: "FM26 Tactics",
    locale: "en_US",
    images: [
      {
        url: "/images/og/default.jpg",
        width: 1200,
        height: 630,
        alt: "FM26 Tactics — Football Manager 2026 Tactics Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FM26 Tactics",
    description: "Best Football Manager 2026 tactics, formations & interactive builder.",
    images: ["https://fm26tactics.com/images/og/default.jpg"],
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteConfig.name,
          url: siteConfig.url,
          description: siteConfig.description,
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <HeroSection />
      <CommunityInsights />
      <FeaturedTactics />
      <StatsSection />
      <TacticBuilderCTA />
      <LatestGuides />
    </>
  );
}
