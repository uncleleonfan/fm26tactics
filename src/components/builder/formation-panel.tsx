"use client";

import { Check, ChevronDown, LayoutGrid, Flame } from "lucide-react";
import { formationPresets } from "@/lib/tactics-data";
import { tacticTemplates } from "@/lib/tactic-templates";
import type { TacticTemplate } from "@/lib/tactic-templates";
import type { FormationType } from "@/types/tactic";

interface FormationPanelProps {
  currentFormation: FormationType;
  onSelect: (formation: FormationType) => void;
  onApplyTemplate: (template: TacticTemplate) => void;
}

function formatStyle(style: string) {
  return style.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

/** Mini pitch visualization for each formation card */
function MiniPitch({ positions }: { positions: { x: number; y: number }[] }) {
  return (
    <div className="relative w-14 h-[70px] shrink-0 rounded-md overflow-hidden bg-[#0E1625] border border-[#1C2436]/60">
      {/* pitch markings */}
      <div className="absolute inset-[6%] border border-[#1C2436]/40 rounded-sm" />
      <div className="absolute left-[6%] right-[6%] top-[46%] h-px bg-[#1C2436]/30" />
      <div className="absolute left-[40%] right-[40%] top-[6%] bottom-[6%] border border-[#1C2436]/20 rounded-sm" />
      {/* players */}
      {positions.slice(1).map((pos, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-primary/50 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        />
      ))}
    </div>
  );
}

/**
 * Content panel for Meta Templates + Choose Formation.
 * Rendered inside the builder sidebar (desktop) / bottom drawer (mobile),
 * so it inherits the page-height scroll container — no overflow issues.
 */
export function FormationPanel({ currentFormation, onSelect, onApplyTemplate }: FormationPanelProps) {
  return (
    <div className="space-y-4">
      {/* Meta templates — one-click apply */}
      <div>
        <div className="flex items-center gap-2 mb-2 px-1">
          <Flame className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-text-primary">Meta Templates</h3>
          <span className="text-[10px] text-text-muted ml-auto">One-click apply</span>
        </div>
        <div className="space-y-1.5">
          {tacticTemplates.map((t) => (
            <button
              key={t.id}
              onClick={() => onApplyTemplate(t)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-gradient-to-r from-[#0E1625] to-[#111B2A] border border-[#1C2436]/50 hover:border-primary/40 hover:shadow-[0_0_15px_rgba(0,230,118,0.08)] transition-all text-left group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-text-primary truncate">
                    {t.name}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-semibold uppercase tracking-wide shrink-0">
                    {formatStyle(t.style)}
                  </span>
                </div>
                <p className="text-[10px] text-text-muted mt-0.5 line-clamp-1">{t.description}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-text-muted group-hover:text-primary shrink-0" />
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-[#1C2436]/60" />

      {/* Choose formation */}
      <div>
        <div className="flex items-center gap-2 mb-2 px-1">
          <LayoutGrid className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-text-primary">Choose Formation</h3>
          <span className="text-xs text-text-muted ml-auto">
            {formationPresets.length} formations
          </span>
        </div>
        <div className="space-y-1.5">
          {formationPresets.map((preset) => {
            const active = preset.formation === currentFormation;
            return (
              <button
                key={preset.formation}
                onClick={() => onSelect(preset.formation)}
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-all ${
                  active
                    ? "bg-primary/10 border border-primary/30 ring-1 ring-primary/20"
                    : "bg-[#0E1625] border border-[#1C2436]/50 hover:border-[#1C2436] hover:bg-[#111B2A]"
                }`}
              >
                <MiniPitch positions={preset.positions} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-sm font-bold ${
                        active ? "text-primary" : "text-text-primary"
                      }`}
                    >
                      {preset.label}
                    </span>
                    {active && (
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-0.5 line-clamp-2 leading-snug">
                    {preset.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
