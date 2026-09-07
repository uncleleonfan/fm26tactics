"use client";

import { useTranslations } from "next-intl";
import { Lightbulb, Lock, Unlock, ArrowRight, X, TrendingUp, TrendingDown } from "lucide-react";
import type { Recommendation } from "@/types/analysis";
import type { PlayerRoleCategory } from "@/types/tactic";
import type { DimensionScores } from "@/lib/tactical-scores";

const CATEGORY_ORDER: PlayerRoleCategory[] = ["goalkeeper", "defender", "midfielder", "forward"];

/** Impact badges: dimension key, plus whether higher is better. */
const IMPACT_FIELDS: Array<{ key: keyof Recommendation["impact"]; higherIsBetter: boolean }> = [
  { key: "attack", higherIsBetter: true },
  { key: "support", higherIsBetter: true },
  { key: "defence", higherIsBetter: true },
  { key: "risk", higherIsBetter: false },
];

function pct(v: number): number {
  return Math.round(v * 100);
}

function signedPct(v: number, higherIsBetter: boolean): { text: string; good: boolean } {
  const rounded = pct(v);
  return {
    text: `${rounded >= 0 ? "+" : ""}${rounded}`,
    good: higherIsBetter ? rounded > 0 : rounded < 0,
  };
}

export interface AppliedChange {
  recId: string;
  label: string;
  scores: DimensionScores;
}

interface RecommendationPanelProps {
  recommendations: Recommendation[];
  lockedCategories: PlayerRoleCategory[];
  onToggleCategoryLock: (category: PlayerRoleCategory) => void;
  onApply: (rec: Recommendation) => void;
  appliedChange: AppliedChange | null;
  onDismissComparison: () => void;
  currentScores: DimensionScores;
}

function ImpactBadge({ label, value, good }: { label: string; value: number; good: boolean }) {
  if (value === 0) return null;
  return (
    <span
      className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${
        good
          ? "bg-primary/10 text-primary border-primary/25"
          : "bg-accent-red/10 text-accent-red border-accent-red/25"
      }`}
    >
      {label} {value > 0 ? "+" : ""}
      {value}
    </span>
  );
}

function ComparisonRow({
  label,
  before,
  after,
  higherIsBetter,
}: {
  label: string;
  before: number;
  after: number;
  higherIsBetter: boolean;
}) {
  const diff = pct(after - before);
  const good = higherIsBetter ? diff > 0 : diff < 0;
  const neutral = diff === 0;
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="w-8 shrink-0 font-semibold text-text-secondary">{label}</span>
      <span className="w-8 text-right font-mono text-text-muted">{before}</span>
      <ArrowRight className="w-3 h-3 text-text-muted shrink-0" />
      <span
        className={`w-8 font-mono font-bold ${
          neutral ? "text-text-secondary" : good ? "text-primary" : "text-accent-red"
        }`}
      >
        {after}
      </span>
      <span
        className={`flex items-center gap-0.5 font-mono text-[10px] ${
          neutral ? "text-text-muted" : good ? "text-primary" : "text-accent-red"
        }`}
      >
        {!neutral &&
          (good ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />)}
        {diff > 0 ? `+${diff}` : diff}
      </span>
    </div>
  );
}

export function RecommendationPanel({
  recommendations,
  lockedCategories,
  onToggleCategoryLock,
  onApply,
  appliedChange,
  onDismissComparison,
  currentScores,
}: RecommendationPanelProps) {
  const t = useTranslations("recommendations");

  const allLocked = lockedCategories.length >= CATEGORY_ORDER.length;

  return (
    <div className="rounded-lg border border-[#1C2436]/60 bg-surface/30 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2.5">
        <h3 className="flex items-center gap-2 text-xs font-semibold text-text-primary tracking-wide uppercase">
          <Lightbulb className="w-3.5 h-3.5 text-primary" />
          {t("title")}
        </h3>
        {recommendations.length > 0 && (
          <span className="px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] font-bold">
            {recommendations.length}
          </span>
        )}
      </div>

      <div className="px-3 pb-3 space-y-3">
        {/* Intent locks */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-text-muted">
              <Lock className="w-3 h-3" />
              {t("lockTitle")}
            </span>
            <span className="text-[9px] text-text-muted">{t("lockHint")}</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {CATEGORY_ORDER.map((category) => {
              const locked = lockedCategories.includes(category);
              return (
                <button
                  key={category}
                  onClick={() => onToggleCategoryLock(category)}
                  className={`flex items-center justify-center gap-1 py-1.5 rounded-md border text-[10px] font-semibold transition-all cursor-pointer ${
                    locked
                      ? "bg-primary/10 border-primary/40 text-primary shadow-[0_0_8px_rgba(0,230,118,0.15)]"
                      : "bg-[#0E1625] border-[#1C2436] text-text-muted hover:border-[#2A3550] hover:text-text-secondary"
                  }`}
                >
                  {locked ? (
                    <Lock className="w-2.5 h-2.5" />
                  ) : (
                    <Unlock className="w-2.5 h-2.5 opacity-50" />
                  )}
                  {t(`categories.${category}`)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Before/after comparison card */}
        {appliedChange && (
          <div className="rounded-lg border border-primary/25 bg-primary/5 p-2.5 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">
                {t("appliedTitle")}
              </span>
              <button
                onClick={onDismissComparison}
                className="text-text-muted hover:text-text-secondary cursor-pointer transition-colors"
                aria-label={t("dismiss")}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="font-mono text-[11px] text-text-primary mb-2">{appliedChange.label}</p>
            <div className="space-y-1">
              <ComparisonRow
                label={t("impactLabels.attack")}
                before={pct(appliedChange.scores.attack)}
                after={pct(currentScores.attack)}
                higherIsBetter
              />
              <ComparisonRow
                label={t("impactLabels.support")}
                before={pct(appliedChange.scores.support)}
                after={pct(currentScores.support)}
                higherIsBetter
              />
              <ComparisonRow
                label={t("impactLabels.defence")}
                before={pct(appliedChange.scores.defence)}
                after={pct(currentScores.defence)}
                higherIsBetter
              />
              <ComparisonRow
                label={t("impactLabels.risk")}
                before={pct(appliedChange.scores.risk)}
                after={pct(currentScores.risk)}
                higherIsBetter={false}
              />
            </div>
          </div>
        )}

        {/* Recommendation cards */}
        {recommendations.length === 0 ? (
          <div className="flex items-center gap-2 px-3 py-4 rounded-lg bg-[#0E1625] border border-[#1C2436]/60">
            <span className="text-xs text-text-secondary">
              {allLocked ? t("emptyAllLocked") : t("empty")}
            </span>
          </div>
        ) : (
          <div className="space-y-1.5">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="rounded-lg border border-[#1C2436]/60 bg-[#0E1625] p-2.5 hover:border-[#2A3550] transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-[11px] font-bold text-text-primary">
                    {rec.suggestedChange}
                  </span>
                  <button
                    onClick={() => onApply(rec)}
                    className="px-2.5 py-1 rounded-md bg-primary/15 border border-primary/40 text-primary text-[10px] font-bold hover:bg-primary/25 hover:shadow-[0_0_10px_rgba(0,230,118,0.25)] transition-all cursor-pointer active:scale-95"
                  >
                    {t("apply")}
                  </button>
                </div>
                <p className="text-[11px] text-accent-amber/90 mb-1">
                  {t(`problems.${rec.problemKey}`)}
                </p>
                <p className="text-[10px] text-text-muted leading-relaxed mb-1.5">
                  {t("reasonTemplate", { change: rec.suggestedChange.split(" → ")[1] ?? rec.suggestedChange })}
                </p>
                <div className="flex flex-wrap gap-1">
                  {IMPACT_FIELDS.map(({ key, higherIsBetter }) => {
                    const { text, good } = signedPct(rec.impact[key], higherIsBetter);
                    return (
                      <ImpactBadge
                        key={key}
                        label={t(`impactLabels.${key}`)}
                        value={Number(text)}
                        good={good}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
