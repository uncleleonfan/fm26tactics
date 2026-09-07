"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Pencil, Radar, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const NUDGE_KEY = "fm26-visualize-nudge-dismissed";

interface PitchModeControlProps {
  visualize: boolean;
  onChange: (visualize: boolean) => void;
}

/**
 * Floating Edit/Visualize mode switch rendered over the pitch canvas.
 * Proximity over the element it controls (spec: mode toggle belongs to the
 * pitch, not the global toolbar). Includes a one-time discoverability nudge.
 */
export function PitchModeControl({ visualize, onChange }: PitchModeControlProps) {
  const t = useTranslations("visualize");
  const [showNudge, setShowNudge] = useState(false);

  // One-time nudge: pulse + tooltip until the user interacts (dismissed forever).
  useEffect(() => {
    if (window.localStorage.getItem(NUDGE_KEY)) return;
    const timer = window.setTimeout(() => {
      setShowNudge(true);
      trackEvent("visualize_nudge_shown");
    }, 800);
    return () => window.clearTimeout(timer);
  }, []);

  const dismissNudge = () => {
    setShowNudge(false);
    window.localStorage.setItem(NUDGE_KEY, "1");
    trackEvent("visualize_nudge_dismiss");
  };

  const select = (next: boolean) => {
    if (showNudge) dismissNudge();
    if (next !== visualize) onChange(next);
  };

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
      {showNudge && (
        <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 w-max max-w-[240px] sm:max-w-[280px]">
          <div className="relative flex items-start gap-2 rounded-xl border border-[#1C2436] bg-background-secondary/95 backdrop-blur-xs shadow-[0_4px_24px_rgba(0,0,0,0.5)] px-3 py-2 animate-slide-up">
            <Radar className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <p className="text-[11px] leading-snug text-text-secondary text-left">
              {t("modeNudge")}
            </p>
            <button
              onClick={dismissNudge}
              className="p-0.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors shrink-0"
              aria-label={t("nudgeDismiss")}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          {/* Caret */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2.5 h-2.5 rotate-45 bg-background-secondary border-r border-b border-[#1C2436]" />
        </div>
      )}

      <div
        role="group"
        aria-label={t("modeGroup")}
        className={`flex items-center gap-0.5 rounded-xl border border-[#1C2436] bg-background-secondary/95 backdrop-blur-xs shadow-[0_4px_24px_rgba(0,0,0,0.5)] p-1 ${
          showNudge ? "animate-pulse-glow" : ""
        }`}
      >
        <button
          onClick={() => select(false)}
          aria-pressed={!visualize}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
            !visualize
              ? "bg-primary/20 text-primary shadow-[0_0_10px_rgba(0,230,118,0.3)]"
              : "text-text-muted hover:text-text-secondary hover:bg-surface-hover"
          }`}
        >
          <Pencil className="w-3.5 h-3.5" />
          {t("modeEdit")}
        </button>
        <button
          onClick={() => select(true)}
          aria-pressed={visualize}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
            visualize
              ? "bg-primary/20 text-primary shadow-[0_0_10px_rgba(0,230,118,0.3)]"
              : "text-text-muted hover:text-text-secondary hover:bg-surface-hover"
          }`}
        >
          <Radar className="w-3.5 h-3.5" />
          {t("modeVisualize")}
        </button>
      </div>
    </div>
  );
}
