"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { TacticCard } from "@/components/tactics/tactic-card";
import { TacticFilterBar } from "@/components/tactics/tactic-filter-bar";
import type { FormationType, PlayStyle } from "@/types/tactic";
import type { Tactic } from "contentlayer/generated";

interface Props {
  tactics: Tactic[];
}

export function TacticsList({ tactics }: Props) {
  const t = useTranslations("tactics");
  const ft = useTranslations("filter");
  const [filters, setFilters] = useState<{
    formation?: FormationType;
    style?: PlayStyle;
    difficulty?: string;
  }>({});

  const filteredTactics = useMemo(() => {
    let result: Tactic[] = tactics;

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
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [filters, tactics]);

  return (
    <div>
      <div className="min-w-0">
        <TacticFilterBar
          currentFilters={filters}
          onFilterChange={setFilters}
        />

        {filteredTactics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredTactics.map((tactic) => (
              <TacticCard
                key={tactic.slug}
                slug={tactic.slug}
                title={tactic.title}
                description={tactic.description}
                formation={tactic.formation as FormationType}
                style={tactic.style as PlayStyle}
                difficulty={
                  tactic.difficulty as "beginner" | "intermediate" | "advanced"
                }
                publishedAt={tactic.publishedAt}
                coverImage={tactic.coverImage}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 text-center">
            <p className="text-text-secondary text-lg mb-2">
              {t("noTactics")}
            </p>
            <p className="text-text-muted text-sm mb-4">
              {t("noTacticsHint")}
            </p>
            <button
              onClick={() => setFilters({})}
              className="text-primary text-sm hover:underline"
            >
              {ft("clearAll")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
