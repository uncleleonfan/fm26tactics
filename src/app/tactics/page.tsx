"use client";

import { useState, useMemo } from "react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { TacticCard } from "@/components/tactics/tactic-card";
import { TacticFilterBar } from "@/components/tactics/tactic-filter-bar";
import { allTactics } from "contentlayer/generated";
import type { FormationType, PlayStyle } from "@/types/tactic";
import type { Tactic } from "contentlayer/generated";

export default function TacticsListPage() {
  const [filters, setFilters] = useState<{
    formation?: FormationType;
    style?: PlayStyle;
    difficulty?: string;
  }>({});

  const filteredTactics = useMemo(() => {
    let result: Tactic[] = allTactics;

    if (filters.formation) {
      result = result.filter((t) => t.formation === filters.formation);
    }
    if (filters.style) {
      result = result.filter((t) => t.style === filters.style);
    }
    if (filters.difficulty) {
      result = result.filter((t) => t.difficulty === filters.difficulty);
    }

    return result.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [filters]);

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
            formation, playing style, and difficulty level to find the perfect setup.
          </p>
        </div>

        <TacticFilterBar
          currentFilters={filters}
          onFilterChange={setFilters}
        />

        {filteredTactics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTactics.map((tactic) => (
              <TacticCard
                key={tactic.slug}
                slug={tactic.slug}
                title={tactic.title}
                description={tactic.description}
                formation={tactic.formation as FormationType}
                style={tactic.style as PlayStyle}
                difficulty={tactic.difficulty as "beginner" | "intermediate" | "advanced"}
                publishedAt={tactic.publishedAt}
                coverImage={tactic.coverImage}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 text-center">
            <p className="text-text-secondary text-lg mb-2">No tactics match your filters</p>
            <p className="text-text-muted text-sm mb-4">Try adjusting or clearing your filter criteria</p>
            <button
              onClick={() => setFilters({})}
              className="text-primary text-sm hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
