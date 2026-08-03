import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home/hero";
import { JsonLd } from "@/components/shared/json-ld";
import { siteConfig } from "@/lib/metadata";

// Lazy-load below-fold sections — code-split to reduce initial JS bundle
const CommunityInsights = dynamic(
  () => import("@/components/home/community-insights").then((m) => ({ default: m.CommunityInsights })),
  { ssr: true }
);
const FeaturedTactics = dynamic(
  () => import("@/components/home/featured-tactics").then((m) => ({ default: m.FeaturedTactics })),
  { ssr: true }
);
const StatsSection = dynamic(
  () => import("@/components/home/stats-section").then((m) => ({ default: m.StatsSection })),
  { ssr: true }
);
const TacticBuilderCTA = dynamic(
  () => import("@/components/home/cta-section").then((m) => ({ default: m.TacticBuilderCTA })),
  { ssr: true }
);
const LatestGuides = dynamic(
  () => import("@/components/home/latest-guides").then((m) => ({ default: m.LatestGuides })),
  { ssr: true }
);

export const metadata: Metadata = {
  title: "FM26 Tactics — Best Football Manager 2026 Tactics & Formations",
  description:
    "Discover the best FM 26 tactics and meta formations. Community-tested strategies, interactive builder, and in-depth guides for Football Manager 2026.",
  keywords: [
    "fm 26 tactics", "fm26 best tactics", "fm 26 formations",
    "football manager 2026", "fm26 gegenpress",
  ],
  alternates: {
    canonical: "https://fm26tactics.com",
  },
  openGraph: {
    title: "FM26 Tactics — Best Football Manager 2026 Tactics & Formations",
    description:
      "Discover the best FM 26 tactics and meta formations. Community-tested strategies, interactive builder, and in-depth guides.",
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
    description: "Best FM 26 tactics, meta formations & interactive builder for Football Manager 2026.",
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
          author: {
            "@type": "Person",
            name: "FM26 Tactics",
            url: siteConfig.url,
          },
          sameAs: [siteConfig.links.github],
          dateModified: "2026-08-03",
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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What are the best FM 26 tactics?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The best FM 26 tactics include gegenpress (4-2-3-1), tiki-taka (4-3-3), and wing play (4-4-2). Community-tested meta tactics from FM-Arena and FM Scout show gegenpress as the most consistent performer across multiple game saves, with 4-2-3-1 and 4-3-3 formations leading the meta rankings.",
              },
            },
            {
              "@type": "Question",
              name: "Which formation is most effective in Football Manager 2026?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The 4-2-3-1 is the most popular and effective formation in Football Manager 2026. It offers a balanced shape with double pivot protection, an attacking midfielder for creativity, and flexibility to switch between possession-based and counter-attacking styles. Other strong formations include 4-3-3, 4-4-2, 5-2-3, and 3-4-2-1.",
              },
            },
            {
              "@type": "Question",
              name: "How do I create a successful tactic in FM26?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "To create a successful tactic in FM26: 1) Choose a formation that fits your squad's strengths, 2) Assign roles and duties that create passing triangles, 3) Set team instructions (mentality, passing style, pressing intensity) that match your playing philosophy, 4) Test and adjust based on match performance. Use our interactive Tactic Builder to visualize and experiment before implementing in-game.",
              },
            },
            {
              "@type": "Question",
              name: "What are the best player roles for gegenpress in FM26?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "For an effective gegenpress in FM26, use: Sweeper Keeper (Attack) in goal, Ball Playing Defenders, Wing Backs (Support), a Segundo Volante or Ball Winning Midfielder paired with a Deep Lying Playmaker in midfield, Inside Forwards or Inverted Wingers on the flanks, and a Pressing Forward leading the line. High stamina, work rate, and determination are essential attributes.",
              },
            },
            {
              "@type": "Question",
              name: "How does the FM26 Tactic Builder work?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The FM26 Tactic Builder is a free interactive tool that lets you drag and drop 11 players on a pitch, assign player roles and duties (from all FM26 options), configure team instructions (mentality, passing, pressing, etc.), and export or share your tactic. It works directly in your browser with no download required. Access it at fm26tactics.com/builder.",
              },
            },
          ],
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
