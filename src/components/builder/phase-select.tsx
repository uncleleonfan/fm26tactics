"use client";

import { useTranslations } from "next-intl";
import { Swords, Shield, LayoutGrid, ChevronDown } from "lucide-react";
import type { PhaseType } from "@/types/tactic";

/** View mode: one of the two phases, or the side-by-side compare view. */
export type PhaseView = PhaseType | "compare";

interface PhaseSelectProps {
  value: PhaseView;
  onChange: (view: PhaseView) => void;
}

const VIEW_META: Record<PhaseView, { icon: typeof Swords; active: string }> = {
  "in-possession": {
    icon: Swords,
    active: "text-emerald-300",
  },
  "out-of-possession": {
    icon: Shield,
    active: "text-blue-300",
  },
  compare: {
    icon: LayoutGrid,
    active: "text-text-primary",
  },
};

/**
 * Compact phase/view dropdown. Renders as a borderless toolbar item meant to
 * sit inside the unified pitch toolbar (together with the Edit/Visualize
 * control). The active option keeps its phase color (emerald = in
 * possession, blue = out of possession) via the trigger's text/icon color.
 */
export function PhaseSelect({ value, onChange }: PhaseSelectProps) {
  const t = useTranslations("builder");

  const options: { key: PhaseView; label: string }[] = [
    { key: "in-possession", label: t("phaseInPossession") },
    { key: "out-of-possession", label: t("phaseOutOfPossession") },
    { key: "compare", label: t("phaseCompare") },
  ];

  const { icon: Icon, active } = VIEW_META[value];

  return (
    <div className="relative shrink-0">
      <Icon
        className={`pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${active}`}
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as PhaseView)}
        aria-label={t("phaseTabAria")}
        className={`appearance-none cursor-pointer bg-transparent rounded-lg pl-7 pr-5 py-1.5 text-xs font-semibold tracking-wide outline-none transition-colors hover:bg-surface-hover ${active}`}
      >
        {options.map(({ key, label }) => (
          <option
            key={key}
            value={key}
            className="bg-background-secondary text-text-primary font-normal"
          >
            {label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
    </div>
  );
}
