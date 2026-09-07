"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  ChevronDown,
  Swords,
  Users,
  Shield,
  Zap,
  ShieldAlert,
  AlertCircle,
} from "lucide-react";
import type {
  AnalysisResult,
  Rating,
  RiskLevel,
} from "@/types/analysis";
import { RATING_THRESHOLDS } from "@/tactics/data/analysis-config";
import { WarningList } from "./warning-list";

interface AnalysisPanelProps {
  analysis: AnalysisResult;
  /** Resolves player ids to short labels for warning detail chips. */
  playerLabelById?: (playerId: string) => string | undefined;
}

const RATING_BAR: Record<Rating, string> = {
  strong: "bg-gradient-to-r from-primary/70 to-primary shadow-[0_0_6px_rgba(0,230,118,0.45)]",
  moderate: "bg-gradient-to-r from-accent-amber/70 to-accent-amber shadow-[0_0_6px_rgba(255,179,0,0.35)]",
  weak: "bg-gradient-to-r from-accent-red/70 to-accent-red shadow-[0_0_6px_rgba(255,82,82,0.35)]",
};

const RATING_TEXT: Record<Rating, string> = {
  strong: "text-primary",
  moderate: "text-accent-amber",
  weak: "text-accent-red",
};

const RISK_STYLE: Record<RiskLevel, string> = {
  low: "bg-primary/10 text-primary border-primary/30 shadow-[0_0_12px_rgba(0,230,118,0.15)]",
  medium: "bg-accent-amber/10 text-accent-amber border-accent-amber/30 shadow-[0_0_12px_rgba(255,179,0,0.15)]",
  high: "bg-accent-red/10 text-accent-red border-accent-red/40 shadow-[0_0_12px_rgba(255,82,82,0.2)]",
  "very-high": "bg-accent-red/15 text-accent-red border-accent-red/60 shadow-[0_0_16px_rgba(255,82,82,0.35)] animate-pulse-glow",
};

const RISK_BAR: Record<RiskLevel, string> = {
  low: "bg-primary",
  medium: "bg-accent-amber",
  high: "bg-accent-red",
  "very-high": "bg-gradient-to-r from-accent-amber to-accent-red",
};

function scoreRating(value: number): Rating {
  if (value >= RATING_THRESHOLDS.strong) return "strong";
  if (value >= RATING_THRESHOLDS.weak) return "moderate";
  return "weak";
}

/** UI-side thresholds mirroring RISK_LEVELS for inverse metric coloring. */
const RISK_LEVELS_UI = { low: 0.35, medium: 0.55 } as const;

function MetricBar({
  label,
  value,
  inverse = false,
}: {
  label: string;
  value: number;
  /** Inverse metrics (e.g. risk score) read low = strong. */
  inverse?: boolean;
}) {
  const rating: Rating = inverse
    ? value < RISK_LEVELS_UI.low
      ? "strong"
      : value < RISK_LEVELS_UI.medium
        ? "moderate"
        : "weak"
    : scoreRating(value);

  return (
    <div className="flex items-center gap-2.5">
      <span className="w-[104px] shrink-0 text-[11px] text-text-secondary truncate" title={label}>
        {label}
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-[#0E1625] overflow-hidden">
        <div
          className={`h-full rounded-full transition-[width] duration-300 ease-out ${RATING_BAR[rating]}`}
          style={{ width: `${Math.round(Math.min(1, Math.max(0, value)) * 100)}%` }}
        />
      </div>
      <span className={`w-8 shrink-0 text-right font-mono text-[10px] ${RATING_TEXT[rating]}`}>
        {Math.round(value * 100)}
      </span>
    </div>
  );
}

interface SectionDef {
  id: "attack" | "support" | "defence" | "transition";
  icon: typeof Swords;
  rating: Rating;
  metrics: Array<{ key: string; value: number; inverse?: boolean }>;
}

function Section({
  title,
  icon: Icon,
  rating,
  defaultOpen,
  children,
}: {
  title: string;
  icon: typeof Swords;
  rating: Rating;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? true);

  return (
    <div className="rounded-lg border border-[#1C2436]/60 bg-surface/30 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-surface-hover/40 transition-colors"
      >
        <Icon className={`w-3.5 h-3.5 shrink-0 ${RATING_TEXT[rating]}`} />
        <span className="flex-1 text-left text-xs font-semibold text-text-primary tracking-wide uppercase">
          {title}
        </span>
        <span
          className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
            rating === "strong"
              ? "bg-primary/10 text-primary"
              : rating === "moderate"
                ? "bg-accent-amber/10 text-accent-amber"
                : "bg-accent-red/10 text-accent-red"
          }`}
        >
          {rating}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 text-text-muted transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2 animate-fade-in">{children}</div>
      )}
    </div>
  );
}

export function AnalysisPanel({ analysis, playerLabelById }: AnalysisPanelProps) {
  const t = useTranslations("analysis");
  const { attack, support, defence, transition } = analysis;

  const sections: SectionDef[] = [
    {
      id: "attack",
      icon: Swords,
      rating: attack.rating,
      metrics: [
        { key: "width", value: attack.width },
        { key: "penetration", value: attack.penetration },
        { key: "chanceCreation", value: attack.chanceCreation },
        { key: "finishing", value: attack.finishing },
        { key: "centralPresence", value: attack.centralPresence },
        { key: "finalThirdPresence", value: attack.finalThirdPresence },
      ],
    },
    {
      id: "support",
      icon: Users,
      rating: support.rating,
      metrics: [
        { key: "buildUp", value: support.buildUp },
        { key: "midfield", value: support.midfield },
        { key: "wideSupport", value: support.wide },
        { key: "centralSupport", value: support.central },
      ],
    },
    {
      id: "defence",
      icon: Shield,
      rating: defence.rating,
      metrics: [
        { key: "coverage", value: defence.coverage },
        { key: "centralProtection", value: defence.centralProtection },
        { key: "wideProtection", value: defence.wideProtection },
        { key: "restDefence", value: defence.restDefence },
        { key: "defensiveDepth", value: defence.defensiveDepth },
      ],
    },
    {
      id: "transition",
      icon: Zap,
      rating: scoreRating((transition.counterPressing + transition.recoveryStructure) / 2),
      metrics: [
        { key: "counterPressing", value: transition.counterPressing },
        { key: "recoveryStructure", value: transition.recoveryStructure },
        { key: "riskScore", value: transition.riskScore, inverse: true },
      ],
    },
  ];

  const issueCount = analysis.warnings.filter(
    (w) => w.severity === "critical" || w.severity === "warning"
  ).length;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="shrink-0 px-4 pt-4 pb-3 border-b border-[#1C2436]/50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="flex items-center gap-2 text-sm font-bold text-text-primary">
            <ShieldAlert className="w-4 h-4 text-primary" />
            {t("panelTitle")}
          </h2>
          <span className="flex items-center gap-1.5 text-[10px] text-text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {t("liveBadge")}
          </span>
        </div>

        {/* Risk overview */}
        <div className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 ${RISK_STYLE[transition.riskLevel]}`}>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider opacity-70">
              {t("riskTitle")}
            </p>
            <p className="text-sm font-bold leading-tight">
              {t(`riskLevel.${transition.riskLevel}`)}
            </p>
          </div>
          <p className="font-mono text-lg font-bold tabular-nums">
            {Math.round(transition.riskScore * 100)}
            <span className="text-[10px] opacity-60">/100</span>
          </p>
        </div>
        <div className="mt-2 h-1 rounded-full bg-[#0E1625] overflow-hidden">
          <div
            className={`h-full rounded-full transition-[width] duration-300 ease-out ${RISK_BAR[transition.riskLevel]}`}
            style={{ width: `${Math.round(transition.riskScore * 100)}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-text-muted leading-relaxed">
          {t(`riskSummary.${transition.riskLevel}`)}
        </p>
      </div>

      {/* Dimension sections */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2.5">
        {sections.map((section) => (
          <Section
            key={section.id}
            title={t(`sections.${section.id}`)}
            icon={section.icon}
            rating={section.rating}
          >
            {section.metrics.map((metric) => (
              <MetricBar
                key={metric.key}
                label={t(`metrics.${metric.key}`)}
                value={metric.value}
                inverse={metric.inverse}
              />
            ))}
          </Section>
        ))}

        {/* Warnings */}
        <div className="rounded-lg border border-[#1C2436]/60 bg-surface/30 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2.5">
            <h3 className="flex items-center gap-2 text-xs font-semibold text-text-primary tracking-wide uppercase">
              <AlertCircle className="w-3.5 h-3.5 text-accent-amber" />
              {t("warningsTitle")}
            </h3>
            {issueCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-accent-amber/10 border border-accent-amber/30 text-accent-amber text-[10px] font-bold">
                {issueCount}
              </span>
            )}
          </div>
          <div className="px-3 pb-3">
            <WarningList warnings={analysis.warnings} playerLabelById={playerLabelById} />
          </div>
        </div>
      </div>
    </div>
  );
}
