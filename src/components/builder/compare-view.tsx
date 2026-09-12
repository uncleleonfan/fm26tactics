"use client";

import { useTranslations } from "next-intl";
import { Swords, Shield, ArrowRightLeft } from "lucide-react";
import type { TacticBoardState } from "@/types/tactic";
import type { PhaseAnalysisResult } from "@/hooks/use-phase-analysis";
import { resolvePhasePlayers } from "@/hooks/use-tactic-builder";
import { StaticPhasePitch } from "./static-phase-pitch";

interface CompareViewProps {
  state: TacticBoardState;
  phaseAnalysis: PhaseAnalysisResult;
  playerLabelById: (playerId: string) => string | undefined;
}

const RISK_COLOR = {
  low: "text-primary border-primary/30 bg-primary/5",
  moderate: "text-accent-amber border-accent-amber/30 bg-accent-amber/5",
  high: "text-accent-red border-accent-red/30 bg-accent-red/5",
  "very-high": "text-accent-red border-accent-red/50 bg-accent-red/10",
} as const;

/**
 * Side-by-side read-only view of both designed phases: same player colours
 * and numbers, shape recognition per phase, transition summary and the
 * biggest positional shifts.
 */
export function CompareView({ state, phaseAnalysis, playerLabelById }: CompareViewProps) {
  const t = useTranslations("compareView");
  const tp = useTranslations("phaseAnalysis");

  const inPlayers = resolvePhasePlayers(state, "in-possession");
  const outPlayers = resolvePhasePlayers(state, "out-of-possession");
  const transition = phaseAnalysis.transition;

  const phases = [
    {
      key: "in-possession" as const,
      title: t("inTitle"),
      icon: Swords,
      accent: "text-emerald-300 border-emerald-400/40 bg-emerald-500/5",
      players: inPlayers,
      shape: phaseAnalysis["in-possession"].metrics.shape.label,
    },
    {
      key: "out-of-possession" as const,
      title: t("outTitle"),
      icon: Shield,
      accent: "text-blue-300 border-blue-400/40 bg-blue-500/5",
      players: outPlayers,
      shape: phaseAnalysis["out-of-possession"].metrics.shape.label,
    },
  ];

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4">
      {/* Transition summary bar */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mb-3 text-[11px]">
        <span className="font-semibold text-text-secondary">
          {t("shapeTransition", {
            from: transition.possessionShapeLabel,
            to: transition.defensiveShapeLabel,
          })}
        </span>
        <span className="text-text-muted">·</span>
        <span
          className={`px-2 py-0.5 rounded-full border font-semibold ${RISK_COLOR[transition.riskLevel]}`}
        >
          {t("riskLine", { level: tp(`riskLevel.${transition.riskLevel}`) })}
        </span>
        <span className="text-text-muted font-mono tabular-nums">
          {tp("avgShift")}: {transition.avgShift}
        </span>
      </div>

      {/* Side-by-side pitches (stacked on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {phases.map((phase) => (
          <div
            key={phase.key}
            className={`rounded-xl border p-2.5 ${phase.accent.replace(/text-\S+/, "").trim() || "border-[#1C2436]/60"} border-[#1C2436]/60 bg-surface/30`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`flex items-center gap-1.5 text-xs font-semibold ${phase.accent.split(" ")[0]}`}>
                <phase.icon className="w-3.5 h-3.5" />
                {phase.title}
              </span>
              <span className={`font-mono text-xs font-bold tabular-nums ${phase.accent.split(" ")[0]}`}>
                {phase.shape}
              </span>
            </div>
            <StaticPhasePitch
              players={phase.players}
              phase={phase.key}
              phaseMap={state.phases?.[phase.key]}
              className="w-full aspect-square rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* Biggest shifts */}
      <div className="mt-3 rounded-xl border border-[#1C2436]/60 bg-surface/30 px-3 py-2.5">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold text-text-primary mb-1.5">
          <ArrowRightLeft className="w-3.5 h-3.5 text-primary" />
          {t("movements")}
        </h3>
        <div className="space-y-1">
          {transition.biggestShifts.map((shift) => (
            <div
              key={shift.playerId}
              className="flex items-center justify-between text-[11px]"
            >
              <span className="text-text-secondary truncate">
                {playerLabelById(shift.playerId) ?? shift.playerId}
              </span>
              <span className="font-mono text-text-muted tabular-nums shrink-0 ml-2">
                {shift.distance}
              </span>
            </div>
          ))}
          {transition.biggestShifts.length === 0 && (
            <p className="text-[11px] text-text-muted">{t("noDifferences")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
