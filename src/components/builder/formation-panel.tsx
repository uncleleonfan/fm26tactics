"use client";

import { useTranslations } from "next-intl";
import { Check, ChevronDown, LayoutGrid, Flame, BookOpen } from "lucide-react";
import { Link } from "@/i18n/routing";
import { formationPresets } from "@/lib/tactics-data";
import { trackEvent } from "@/lib/analytics";
import { tacticTemplates } from "@/lib/tactic-templates";
import { formationGuideSlugs } from "@/lib/formation-guide-slugs";
import { findAppliedTemplate, matchesPresetXI } from "@/hooks/use-tactic-builder";
import type { TacticTemplate } from "@/lib/tactic-templates";
import type { FormationType, PlayerNode } from "@/types/tactic";

interface FormationPanelProps {
  currentFormation: FormationType;
  /** The live XI — decides whether a formation preset is actually loaded. */
  players: PlayerNode[];
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
export function FormationPanel({ currentFormation, players, onSelect, onApplyTemplate }: FormationPanelProps) {
  const b = useTranslations("builder");
  const st = useTranslations("tactics");
  // The XI decides what the cards may honestly claim: a loaded preset, the meta
  // template it came from, or neither.
  const appliedTemplate = findAppliedTemplate(players);
  return (
    <div className="space-y-4">
      {/* Meta templates — one-click apply */}
      <div>
        <div className="flex items-center gap-2 mb-2 px-1">
          <Flame className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-text-primary">{b("metaTemplates")}</h3>
          <span className="text-[10px] text-text-muted ml-auto">{b("oneClickApply")}</span>
        </div>
        <div className="space-y-1.5">
          {tacticTemplates.map((t) => {
            const applied = appliedTemplate?.id === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  onApplyTemplate(t);
                  trackEvent("builder_apply_template", { label: t.id });
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-gradient-to-r from-[#0E1625] to-[#111B2A] border transition-all text-left group ${
                  applied
                    ? "border-primary/40 ring-1 ring-primary/20"
                    : "border-[#1C2436]/50 hover:border-primary/40 hover:shadow-[0_0_15px_rgba(0,230,118,0.08)]"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-text-primary truncate">
                      {t.name}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-semibold uppercase tracking-wide shrink-0">
                      {st.has(`styles.${t.style}`) ? st(`styles.${t.style}`) : formatStyle(t.style)}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-muted mt-0.5 line-clamp-1">{t.description}</p>
                </div>
                {applied ? (
                  <span className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-primary shrink-0">
                    <Check className="w-3 h-3" />
                    {b("appliedBadge")}
                  </span>
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-text-muted group-hover:text-primary shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-[#1C2436]/60" />

      {/* Choose formation */}
      <div>
        <div className="flex items-center gap-2 mb-2 px-1">
          <LayoutGrid className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-text-primary">{b("chooseFormation")}</h3>
          <span className="text-xs text-text-muted ml-auto">
            {b("formationsCount", { count: formationPresets.length })}
          </span>
        </div>
        <div className="space-y-1.5">
          {formationPresets.map((preset) => {
            const active = preset.formation === currentFormation;
            // Only a full preset XI earns the check mark. A meta template (or a
            // manual role edit) leaves the formation name matching while the XI is
            // custom — and selecting the card would silently replace all 11 roles.
            const defaultXI = active && matchesPresetXI(players, preset);
            const customised = active && !defaultXI;
            // Name the deviation instead of a vague "custom": the template's style
            // when the XI is one of them, a plain marker otherwise.
            const customLabel = appliedTemplate
              ? st.has(`styles.${appliedTemplate.style}`)
                ? st(`styles.${appliedTemplate.style}`)
                : formatStyle(appliedTemplate.style)
              : b("customBadge");
            const guideSlug = formationGuideSlugs[preset.formation];
            return (
              <div
                key={preset.formation}
                className={`w-full flex items-center gap-1 pl-2.5 pr-1 py-2 rounded-lg text-left transition-all ${
                  active
                    ? "bg-primary/10 border border-primary/30 ring-1 ring-primary/20"
                    : "bg-[#0E1625] border border-[#1C2436]/50 hover:border-[#1C2436] hover:bg-[#111B2A]"
                }`}
              >
                <button
                  onClick={() => {
                    onSelect(preset.formation);
                    trackEvent("builder_select_formation", { label: preset.formation });
                  }}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left"
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
                      {defaultXI && (
                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                      )}
                      {customised && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-300 font-semibold uppercase tracking-wide shrink-0">
                          {customLabel}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted mt-0.5 line-clamp-2 leading-snug pr-1">
                      {preset.description}
                    </p>
                    {customised && (
                      <p className="text-[10px] text-amber-300/90 mt-1 leading-snug pr-1">
                        {b("customNote")}
                      </p>
                    )}
                  </div>
                </button>
                {guideSlug && (
                  <Link
                    href={`/tactics/${guideSlug}`}
                    onClick={() =>
                      trackEvent("builder_formation_guide_click", { label: preset.formation })
                    }
                    aria-label={b("formationGuideLink")}
                    title={b("formationGuideLink")}
                    className="shrink-0 self-start p-1.5 rounded-md text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
