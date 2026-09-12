"use client";

import { useTranslations } from "next-intl";
import { Swords, Shield, Zap, AlertTriangle, Info, Locate } from "lucide-react";
import type { PhaseType } from "@/types/tactic";
import type { PhaseAnalysisResult } from "@/hooks/use-phase-analysis";
import type { PhaseFinding } from "@/tactics/phases/phase-analysis";

interface PhaseAnalysisSectionProps {
  phaseAnalysis: PhaseAnalysisResult;
  /** Resolves player ids to short labels for finding detail chips. */
  playerLabelById?: (playerId: string) => string | undefined;
  onViewPhase: (phase: PhaseType, playerIds: string[]) => void;
}

const PHASE_RISK_COLOR = {
  low: "text-primary",
  moderate: "text-accent-amber",
  high: "text-accent-red",
  "very-high": "text-accent-red",
} as const;

function StatRow({ items }: { items: Array<[string, string | number]> }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-1">
      {items.map(([label, value]) => (
        <div key={label} className="flex items-baseline justify-between gap-1.5 text-[11px]">
          <span className="text-text-muted truncate">{label}</span>
          <span className="font-mono font-semibold text-text-secondary tabular-nums shrink-0">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

function FindingRow({
  finding,
  labelFor,
  onViewPhase,
}: {
  finding: PhaseFinding;
  labelFor: (id: string) => string | undefined;
  onViewPhase: (phase: PhaseType, playerIds: string[]) => void;
}) {
  const t = useTranslations("phaseAnalysis");
  const names = finding.playerIds
    .map(labelFor)
    .filter(Boolean)
    .slice(0, 3)
    .join(", ");

  return (
    <div className="flex items-start gap-2 rounded-lg border border-[#1C2436]/60 bg-surface/30 px-2.5 py-2">
      {finding.severity === "warning" ? (
        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-accent-amber" />
      ) : (
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-text-muted" />
      )}
      <p className="flex-1 text-[11px] leading-snug text-text-secondary">
        {t(`findings.${finding.messageKey}`, finding.values)}
        {names && (
          <span className="block mt-0.5 text-[10px] text-text-muted truncate">
            {names}
          </span>
        )}
      </p>
      <button
        onClick={() => onViewPhase(finding.phase, finding.playerIds)}
        className="shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-[#1C2436] text-[10px] text-text-muted hover:text-text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
      >
        <Locate className="w-2.5 h-2.5" />
        {t("viewPhase")}
      </button>
    </div>
  );
}

/**
 * Phase-aware analysis block for the right-hand panel: designed shapes,
 * per-phase metrics, transition risk and explainable findings with
 * jump-to-phase actions.
 */
export function PhaseAnalysisSection({
  phaseAnalysis,
  playerLabelById,
  onViewPhase,
}: PhaseAnalysisSectionProps) {
  const t = useTranslations("phaseAnalysis");
  const inPos = phaseAnalysis["in-possession"];
  const outPos = phaseAnalysis["out-of-possession"];
  const transition = phaseAnalysis.transition;

  const blocks: Array<{
    id: PhaseType;
    title: string;
    icon: typeof Swords;
    accent: string;
    metrics: Array<[string, string | number]>;
  }> = [
    {
      id: "in-possession",
      title: t("inPossession"),
      icon: Swords,
      accent: "text-emerald-300",
      metrics: [
        [t("metrics.shape"), inPos.metrics.shape.label],
        [t("metrics.width"), inPos.metrics.shape.width],
        [t("metrics.central"), inPos.metrics.shape.centralPlayers],
        [t("metrics.finalThird"), inPos.metrics.finalThirdCount],
        [t("metrics.restDefence"), inPos.metrics.restDefenceCount],
      ],
    },
    {
      id: "out-of-possession",
      title: t("outOfPossession"),
      icon: Shield,
      accent: "text-blue-300",
      metrics: [
        [t("metrics.shape"), outPos.metrics.shape.label],
        [t("metrics.defensiveWidth"), outPos.metrics.shape.width],
        [t("metrics.pressLine"), outPos.metrics.pressLineCount],
        [t("metrics.lineSpread"), outPos.metrics.avgLineSpread],
      ],
    },
  ];

  return (
    <div className="rounded-lg border border-[#1C2436]/60 bg-surface/30 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <h3 className="flex items-center gap-2 text-xs font-semibold text-text-primary tracking-wide uppercase">
          <Zap className="w-3.5 h-3.5 text-primary" />
          {t("panelTitle")}
        </h3>
      </div>
      <div className="px-3 pb-3 space-y-2.5">
        {blocks.map((block) => (
          <div
            key={block.id}
            className="rounded-lg border border-[#1C2436]/50 bg-surface/40 px-2.5 py-2"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`flex items-center gap-1.5 text-[11px] font-semibold ${block.accent}`}>
                <block.icon className="w-3 h-3" />
                {block.title}
              </span>
              <span className={`font-mono text-xs font-bold tabular-nums ${block.accent}`}>
                {block.metrics[0][1]}
              </span>
            </div>
            <StatRow items={block.metrics.slice(1)} />
          </div>
        ))}

        {/* Transition summary */}
        <div className="rounded-lg border border-[#1C2436]/50 bg-surface/40 px-2.5 py-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-text-secondary">
              <Zap className="w-3 h-3" />
              {t("transition")}
            </span>
            <span className={`text-[11px] font-semibold ${PHASE_RISK_COLOR[transition.riskLevel]}`}>
              {t("transitionRisk")} · {t(`riskLevel.${transition.riskLevel}`)}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-text-muted">
              <span className="text-emerald-300 font-semibold">{transition.possessionShapeLabel}</span>
              <span className="mx-1 text-text-muted">→</span>
              <span className="text-blue-300 font-semibold">{transition.defensiveShapeLabel}</span>
            </span>
            <span className="font-mono text-text-secondary tabular-nums">
              {t("avgShift")}: {transition.avgShift}
            </span>
          </div>
        </div>

        {/* Findings */}
        {(() => {
          const findings = [...inPos.findings, ...outPos.findings, ...transition.findings];
          if (findings.length === 0) return null;
          const labelFor = playerLabelById ?? (() => undefined);
          return (
            <div className="space-y-1.5">
              {findings.slice(0, 6).map((f) => (
                <FindingRow
                  key={`${f.phase}-${f.id}`}
                  finding={f}
                  labelFor={labelFor}
                  onViewPhase={onViewPhase}
                />
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
