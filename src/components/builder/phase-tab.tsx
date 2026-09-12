"use client";

import { useTranslations } from "next-intl";
import { Swords, Shield, LayoutGrid } from "lucide-react";
import type { PhaseType } from "@/types/tactic";

/** View mode: one of the two phases, or the side-by-side compare view. */
export type PhaseView = PhaseType | "compare";

interface PhaseTabProps {
  value: PhaseView;
  onChange: (view: PhaseView) => void;
}

const TAB_STYLES: Record<PhaseView, { active: string; icon: typeof Swords }> = {
  "in-possession": {
    active:
      "bg-emerald-500/15 border-emerald-400/60 text-emerald-300 shadow-[0_0_12px_rgba(0,230,118,0.2)]",
    icon: Swords,
  },
  "out-of-possession": {
    active:
      "bg-blue-500/15 border-blue-400/60 text-blue-300 shadow-[0_0_12px_rgba(68,138,255,0.2)]",
    icon: Shield,
  },
  compare: {
    active:
      "bg-surface border-primary/40 text-text-primary shadow-[0_0_12px_rgba(148,163,184,0.15)]",
    icon: LayoutGrid,
  },
};

/**
 * Segmented phase switcher above the pitch — In Possession (attacking
 * structure), Out of Possession (defensive structure) and the Compare
 * side-by-side view.
 */
export function PhaseTab({ value, onChange }: PhaseTabProps) {
  const t = useTranslations("builder");

  const tabs: { key: PhaseView; label: string }[] = [
    { key: "in-possession", label: t("phaseInPossession") },
    { key: "out-of-possession", label: t("phaseOutOfPossession") },
    { key: "compare", label: t("phaseCompare") },
  ];

  return (
    <div
      className="flex items-center gap-1 p-1 rounded-xl bg-surface/60 border border-[#1C2436]/60"
      role="tablist"
      aria-label={t("phaseTabAria")}
    >
      {tabs.map(({ key, label }) => {
        const Icon = TAB_STYLES[key].icon;
        const isActive = value === key;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border text-[11px] font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              isActive
                ? TAB_STYLES[key].active
                : "border-transparent text-text-muted hover:text-text-secondary hover:bg-surface-hover"
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
