"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Pencil, Radar } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useOneTimeBanner } from "@/hooks/use-one-time-banner";

const NUDGE_KEY = "fm26-visualize-nudge-dismissed";

/** How long the one-time attention pulse runs before fading out on its own. */
const NUDGE_PULSE_MS = 4000;

interface PitchModeControlProps {
  visualize: boolean;
  onChange: (visualize: boolean) => void;
}

/**
 * Floating Edit/Visualize mode switch rendered over the pitch canvas.
 * Proximity over the element it controls (spec: mode toggle belongs to the
 * pitch, not the global toolbar).
 *
 * Discoverability: a one-time pulse on the switch. The earlier version also
 * opened a text tooltip with a dismiss button — the event analysis showed
 * 68.5% of the users who saw it closed it immediately while 59.6% went on to
 * use the feature anyway, so the interruption was pure friction. The pulse
 * still draws the eye and the button labels explain themselves; the longer
 * sentence is kept as a native `title` tooltip, which costs nothing.
 */
export function PitchModeControl({ visualize, onChange }: PitchModeControlProps) {
  const t = useTranslations("visualize");

  const nudge = useOneTimeBanner(NUDGE_KEY, { delayMs: 800, durationMs: NUDGE_PULSE_MS });

  useEffect(() => {
    if (nudge.visible) trackEvent("visualize_nudge_shown");
  }, [nudge.visible]);

  const select = (next: boolean) => {
    // Clicked (within the delay or during the pulse) — the feature is already
    // discovered, so cancel the cue silently and without an event.
    nudge.dismiss();
    if (next !== visualize) onChange(next);
  };

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
      <div
        role="group"
        aria-label={t("modeGroup")}
        title={t("modeNudge")}
        className={`flex items-center gap-0.5 rounded-xl border border-[#1C2436] bg-background-secondary/95 backdrop-blur-xs shadow-[0_4px_24px_rgba(0,0,0,0.5)] p-1 ${
          nudge.visible ? "animate-pulse-glow" : ""
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
