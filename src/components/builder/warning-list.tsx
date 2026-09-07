"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  User,
} from "lucide-react";
import type { TacticalWarning } from "@/types/analysis";

interface WarningListProps {
  warnings: TacticalWarning[];
  /** Resolves player ids to short labels (e.g. "RB — WB(S)") for the detail view. */
  playerLabelById?: (playerId: string) => string | undefined;
}

const SEVERITY_ICON = {
  critical: { Icon: AlertTriangle, className: "text-accent-red" },
  warning: { Icon: AlertCircle, className: "text-accent-amber" },
  positive: { Icon: CheckCircle2, className: "text-primary" },
} as const;

export function WarningList({ warnings, playerLabelById }: WarningListProps) {
  const t = useTranslations("analysis");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (warnings.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-4 rounded-lg bg-primary/5 border border-primary/10">
        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
        <p className="text-xs text-text-secondary">{t("warningsEmpty")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {warnings.map((warning) => {
        const { Icon, className } = SEVERITY_ICON[warning.severity];
        const isExpanded = expandedId === warning.id;
        const namedPlayers = warning.playerIds
          .map((id) => playerLabelById?.(id))
          .filter((label): label is string => Boolean(label));

        return (
          <div
            key={warning.id}
            className={`rounded-lg border transition-colors ${
              isExpanded
                ? "bg-surface/60 border-[#2A3550]"
                : "bg-surface/30 border-[#1C2436]/60 hover:border-[#2A3550]/70"
            }`}
          >
            <button
              onClick={() => setExpandedId(isExpanded ? null : warning.id)}
              className="w-full flex items-start gap-2.5 px-3 py-2.5 text-left cursor-pointer"
            >
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${className}`} />
              <span className="flex-1 min-w-0 text-xs text-text-primary leading-relaxed">
                {t(`warnings.${warning.key}`, warning.params ?? {})}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 mt-0.5 shrink-0 text-text-muted transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {isExpanded && (
              <div className="px-3 pb-3 pt-0 space-y-2 animate-fade-in">
                <div className="pl-6.5 border-l-2 border-[#2A3550] ml-3">
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {warning.reason}
                  </p>
                </div>
                {namedPlayers.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pl-6.5 ml-3">
                    <span className="text-[10px] uppercase tracking-wider text-text-muted flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {t("implicatedPlayers")}:
                    </span>
                    {namedPlayers.map((label) => (
                      <span
                        key={label}
                        className="px-1.5 py-0.5 rounded bg-[#0E1625] border border-[#1C2436] text-[10px] font-mono text-text-secondary"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
