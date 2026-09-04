import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home/hero";
import { QuickPicks } from "@/components/home/quick-picks";
import { FeaturedTactics } from "@/components/home/featured-tactics";
import { LatestGuides } from "@/components/home/latest-guides";
import { FaqSection } from "@/components/home/faq-section";
import { ExploreSection } from "@/components/home/explore-section";
import { JsonLd } from "@/components/shared/json-ld";
import { generateLocaleSEO } from "@/lib/metadata";

// ssr: false — eliminates preload links for chunks, preventing bandwidth competition
// on mobile. Content loads instantly after hydration via local JS chunks.
const CommunityInsights = dynamic(
  () => import("@/components/home/community-insights").then((m) => ({ default: m.CommunityInsights })),
  { ssr: false, loading: () => <SectionPlaceholder /> }
);
const StatsSection = dynamic(
  () => import("@/components/home/stats-section").then((m) => ({ default: m.StatsSection })),
  { ssr: false, loading: () => <SectionPlaceholder /> }
);
const TacticBuilderCTA = dynamic(
  () => import("@/components/home/cta-section").then((m) => ({ default: m.TacticBuilderCTA })),
  { ssr: false, loading: () => <SectionPlaceholderTall /> }
);

// Placeholder skeletons with matching approx height — prevents CLS
function SectionPlaceholder() {
  return <div className="py-16" />;
}
function SectionPlaceholderTall() {
  return <div className="py-24" />;
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return generateLocaleSEO({
    locale: params.locale,
    path: "/",
    en: {
      title: "FM26Tactics: Football Manager 2026 Tactics, Guides & Builder",
      description:
        "FM26Tactics: community-tested Football Manager 2026 tactics, formation guides, player role breakdowns, and a free interactive tactic builder. Win more in FM26.",
      keywords: [
        "fm26tactics", "football manager 2026 tactics",
        "fm26 tactics website", "fm26 builder", "fm26 guides",
      ],
    },
  });
}

const faqEn: Array<[string, string]> = [
  [
    "What is FM26Tactics?",
    "FM26Tactics is a free resource hub for Football Manager 2026 players. It offers a community-tested tactics library, an interactive tactic builder, formation guides, player role breakdowns, and in-depth strategy guides — all designed to help you win more matches. Browse the full tactics library at fm26tactics.com/tactics.",
  ],
  [
    "Which formation is most effective in Football Manager 2026?",
    "The 4-2-3-1 is the most popular and effective formation in Football Manager 2026. It offers a balanced shape with double pivot protection, an attacking midfielder for creativity, and flexibility to switch between possession-based and counter-attacking styles. Other strong formations include 4-3-3, 4-4-2, 5-2-3, and 3-4-2-1.",
  ],
  [
    "How do I create a successful tactic in FM26?",
    "To create a successful tactic in FM26: 1) Choose a formation that fits your squad's strengths, 2) Assign roles and duties that create passing triangles, 3) Set team instructions (mentality, passing style, pressing intensity) that match your playing philosophy, 4) Test and adjust based on match performance. Use our interactive Tactic Builder to visualize and experiment before implementing in-game.",
  ],
  [
    "What are the best player roles for gegenpress in FM26?",
    "For an effective gegenpress in FM26, use: Sweeper Keeper (Attack) in goal, Ball Playing Defenders, Wing Backs (Support), a Segundo Volante or Ball Winning Midfielder paired with a Deep Lying Playmaker in midfield, Inside Forwards or Inverted Wingers on the flanks, and a Pressing Forward leading the line. High stamina, work rate, and determination are essential attributes.",
  ],
  [
    "How does the FM26 Tactic Builder work?",
    "The FM26 Tactic Builder is a free interactive tool that lets you drag and drop 11 players on a pitch, assign player roles and duties (from all FM26 options), configure team instructions (mentality, passing, pressing, etc.), and export or share your tactic. It works directly in your browser with no download required. Note: the Builder cannot export .fmf files — Football Manager's proprietary format is not supported by any third-party tool. Use the exported SVG/PNG image or TXT/JSON file as a reference to manually recreate your tactic in-game. Access it at fm26tactics.com/builder.",
  ],
];

export default function HomePage({ params }: { params: { locale: string } }) {
  const faqs = faqEn;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map(([question, answer]) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: {
              "@type": "Answer",
              text: answer,
            },
          })),
        }}
      />
      <HeroSection />
      <QuickPicks />
      <CommunityInsights />
      <FeaturedTactics locale={params.locale} />
      <StatsSection />
      <TacticBuilderCTA />
      <LatestGuides locale={params.locale} />
      <ExploreSection locale={params.locale} />
      <FaqSection faqs={faqs} locale={params.locale} />
    </>
  );
}
