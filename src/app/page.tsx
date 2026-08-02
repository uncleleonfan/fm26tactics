import { HeroSection } from "@/components/home/hero";
import { FeaturedTactics } from "@/components/home/featured-tactics";
import { LatestGuides } from "@/components/home/latest-guides";
import { TacticBuilderCTA } from "@/components/home/cta-section";
import { StatsSection } from "@/components/home/stats-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedTactics />
      <TacticBuilderCTA />
      <LatestGuides />
    </>
  );
}
