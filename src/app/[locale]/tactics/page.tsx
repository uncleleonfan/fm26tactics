import { Breadcrumb } from "@/components/shared/breadcrumb";
import { TacticsList } from "@/components/tactics/tactics-list";
import { allTactics } from "contentlayer/generated";

export default function TacticsListPage() {
  return (
    <div className="min-h-screen bg-background-primary pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Tactics" }]}
          className="mb-6"
        />

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Tactics</span> Library
          </h1>
          <p className="text-text-secondary max-w-2xl">
            Explore our collection of in-depth FM26 tactic guides. Filter by
            formation, playing style, and difficulty level to find the perfect
            setup.
          </p>
        </div>

        <TacticsList tactics={allTactics} />
      </div>
    </div>
  );
}
