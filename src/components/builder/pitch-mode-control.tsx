"use client";

import { useTranslations } from "next-intl";
import { Pencil, Radar, ChevronDown } from "lucide-react";

interface PitchModeControlProps {
  visualize: boolean;
  onChange: (visualize: boolean) => void;
}

/**
 * Edit/Visualize mode dropdown in the pitch toolbar, in the same row as the
 * phase selector. Visualize overlays expected positions, runs and zone
 * occupancy for any ball zone; Edit returns to drag-and-drop editing.
 */
export function PitchModeControl({ visualize, onChange }: PitchModeControlProps) {
  const t = useTranslations("visualize");

  const Icon = visualize ? Radar : Pencil;
  const active = visualize ? "text-primary" : "text-text-secondary";

  return (
    <div className="relative shrink-0">
      <Icon
        className={`pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${active}`}
      />
      <select
        value={visualize ? "visualize" : "edit"}
        onChange={(e) => onChange(e.target.value === "visualize")}
        aria-label={t("modeGroup")}
        className={`appearance-none cursor-pointer bg-transparent rounded-lg pl-7 pr-5 py-1.5 text-xs font-semibold tracking-wide outline-none transition-colors hover:bg-surface-hover ${active}`}
      >
        <option
          value="edit"
          className="bg-background-secondary text-text-primary font-normal"
        >
          {t("modeEdit")}
        </option>
        <option
          value="visualize"
          className="bg-background-secondary text-text-primary font-normal"
        >
          {t("modeVisualize")}
        </option>
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
    </div>
  );
}
