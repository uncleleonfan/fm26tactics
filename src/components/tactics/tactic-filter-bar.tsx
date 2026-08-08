"use client";

import { useRouter } from "@/i18n/routing"
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { formationPresets, styleLabels } from "@/lib/tactics-data";
import type { FormationType, PlayStyle } from "@/types/tactic";

interface TacticFilterBarProps {
  onFilterChange: (filters: {
    formation?: FormationType;
    style?: PlayStyle;
    difficulty?: string;
  }) => void;
  currentFilters: {
    formation?: FormationType;
    style?: PlayStyle;
    difficulty?: string;
  };
}

export function TacticFilterBar({ onFilterChange, currentFilters }: TacticFilterBarProps) {
  const formations = formationPresets.map((f) => f.formation);
  const styles = Object.entries(styleLabels);
  const difficulties = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  return (
    <div className="glass-panel p-4 mb-8">
      <div className="flex flex-wrap items-center gap-3">
        <SlidersHorizontal className="w-4 h-4 text-text-muted shrink-0" />

        {/* Formation Filter */}
        <select
          value={currentFilters.formation || ""}
          onChange={(e) =>
            onFilterChange({
              ...currentFilters,
              formation: (e.target.value || undefined) as FormationType | undefined,
            })
          }
          className="bg-surface border border-surface-border text-text-primary text-sm rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors"
        >
          <option value="">All Formations</option>
          {formations.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        {/* Style Filter */}
        <select
          value={currentFilters.style || ""}
          onChange={(e) =>
            onFilterChange({
              ...currentFilters,
              style: (e.target.value || undefined) as PlayStyle | undefined,
            })
          }
          className="bg-surface border border-surface-border text-text-primary text-sm rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors"
        >
          <option value="">All Styles</option>
          {styles.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        {/* Difficulty Filter */}
        <select
          value={currentFilters.difficulty || ""}
          onChange={(e) =>
            onFilterChange({
              ...currentFilters,
              difficulty: e.target.value || undefined,
            })
          }
          className="bg-surface border border-surface-border text-text-primary text-sm rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors"
        >
          <option value="">All Levels</option>
          {difficulties.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>

        {/* Active Filters */}
        {(currentFilters.formation || currentFilters.style || currentFilters.difficulty) && (
          <button
            onClick={() => onFilterChange({})}
            className="text-xs text-primary hover:underline ml-auto"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}
