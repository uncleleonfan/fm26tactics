"use client";

import { formationPresets } from "@/lib/tactics-data";
import type { FormationType } from "@/types/tactic";

interface FormationPresetsProps {
  currentFormation: FormationType;
  onSelect: (formation: FormationType) => void;
}

export function FormationPresets({ currentFormation, onSelect }: FormationPresetsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {formationPresets.map((preset) => (
        <button
          key={preset.formation}
          onClick={() => onSelect(preset.formation)}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
            currentFormation === preset.formation
              ? "bg-primary/20 text-primary border border-primary/50 shadow-[0_0_10px_rgba(0,230,118,0.1)]"
              : "bg-surface border border-surface-border text-text-muted hover:text-text-secondary hover:border-[#1C2436]"
          }`}
          title={preset.description}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}
