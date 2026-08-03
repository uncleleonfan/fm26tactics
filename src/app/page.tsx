import { HeroSection } from "@/components/home/hero";
import { FeaturedTactics } from "@/components/home/featured-tactics";
import { LatestGuides } from "@/components/home/latest-guides";
import { TacticBuilderCTA } from "@/components/home/cta-section";
import { StatsSection } from "@/components/home/stats-section";
import { CommunityInsights } from "@/components/home/community-insights";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CommunityInsights />
      <FeaturedTactics />
      <StatsSection />
      <TacticBuilderCTA />
      <LatestGuides />
    </>
  );
}
