"use client";

import { useTranslations } from "next-intl";
import { Circle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import type { BallZoneId } from "@/types/analysis";
import type { DefensiveFinding } from "@/tactics/engine/defensive-engine";
import { ballZones } from "@/tactics/data/zones";

/** Only the top findings are surfaced — the panel must stay compact. */
const MAX_FINDINGS = 2;

interface BallPositionControlProps {
  ballZone: BallZoneId;
  onChange: (zone: BallZoneId) => void;
  /**
   * "ours" — the green in-possession ball; "opponent" — the red ball for
   * the out-of-possession defensive scenario (defensive scene shortcuts).
   */
  variant?: "ours" | "opponent";
  /**
   * Defensive findings for the current opponent-ball scenario. Rendered
   * inside this panel instead of a separate floating layer, which would
   * compete with the Edit/Visualize switch for the pitch's top centre.
   */
  findings?: DefensiveFinding[];
}

const ZONE_ABBR: Record<BallZoneId, string> = {
  "defensive-third": "DEF",
  "left-build-up": "LB",
  "central-build-up": "CB",
  "right-build-up": "RB",
  "left-midfield": "LM",
  "central-midfield": "CM",
  "right-midfield": "RM",
  "left-final-third": "LF",
  "central-final-third": "CF",
  "right-final-third": "RF",
};

/** One-tap scenario shortcuts mapped to representative zones. */
const SCENES: Array<{ key: string; zone: BallZoneId }> = [
  { key: "buildUp", zone: "central-build-up" },
  { key: "midfield", zone: "central-midfield" },
  { key: "finalThird", zone: "central-final-third" },
  { key: "defensive", zone: "defensive-third" },
];

/**
 * Defensive scenario shortcuts — where the OPPONENT has the ball. Zone
 * names stay in our attacking/defending orientation: a high press means
 * the ball is trapped in the opponent's build-up area (our final third).
 */
const DEFENSIVE_SCENES: Array<{ key: string; zone: BallZoneId }> = [
  { key: "highPress", zone: "central-final-third" },
  { key: "midBlock", zone: "central-midfield" },
  { key: "lowBlock", zone: "defensive-third" },
  { key: "wideRight", zone: "right-midfield" },
];

const ACTIVE_CLASS = {
  ours: "bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(0,230,118,0.3)]",
  opponent:
    "bg-[#FF5252]/20 border-[#FF5252] text-[#FF5252] shadow-[0_0_10px_rgba(255,82,82,0.3)]",
} as const;

export function BallPositionControl({
  ballZone,
  onChange,
  variant = "ours",
  findings,
}: BallPositionControlProps) {
  const t = useTranslations("visualize");
  const opponent = variant === "opponent";
  const scenes = opponent ? DEFENSIVE_SCENES : SCENES;
  const labelPrefix = opponent ? "oop:" : "";

  return (
    // Outer wrapper owns the centering — the slideUp keyframe animates
    // `transform`, which would override the Tailwind -translate-x-1/2
    // centering on the same element while the animation runs.
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 w-max max-w-[calc(100%-1.5rem)]">
      <div className="rounded-xl border border-[#1C2436] bg-background-secondary/95 backdrop-blur-xs shadow-[0_4px_24px_rgba(0,0,0,0.5)] px-2.5 py-2 animate-slide-up">
        {/* Scenario shortcuts */}
        <div className="flex items-center gap-1 mb-1.5">
          {scenes.map((scene) => (
            <button
              key={scene.key}
              onClick={() => {
                onChange(scene.zone);
                trackEvent("builder_ball_zone", { label: `${labelPrefix}scene:${scene.key}` });
              }}
              className={`px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wide transition-colors cursor-pointer ${
                opponent
                  ? "text-text-muted hover:text-[#FF5252] hover:bg-[#FF5252]/10"
                  : "text-text-muted hover:text-primary hover:bg-primary/10"
              }`}
            >
              {t(opponent ? `defensiveScenes.${scene.key}` : `scenes.${scene.key}`)}
            </button>
          ))}
        </div>

        {/* Zone buttons — grouped by third, matching pitch layout */}
        <div className="flex items-center gap-1">
          <Circle
            className={`w-2.5 h-2.5 shrink-0 mr-0.5 ${
              opponent ? "text-[#FF5252]" : "text-primary"
            }`}
            fill="currentColor"
          />
          {ballZones.map((zone) => {
            const active = zone.id === ballZone;
            return (
              <button
                key={zone.id}
                onClick={() => {
                  onChange(zone.id);
                  trackEvent("builder_ball_zone", { label: `${labelPrefix}zone:${zone.id}` });
                }}
                title={zone.label}
                aria-pressed={active}
                className={`px-1.5 py-1 rounded-md font-mono text-[10px] font-bold border transition-all cursor-pointer active:scale-95 ${
                  active
                    ? ACTIVE_CLASS[variant]
                    : "bg-[#0E1625] border-[#1C2436] text-text-muted hover:border-[#2A3550] hover:text-text-secondary"
                }`}
              >
                {ZONE_ABBR[zone.id]}
              </button>
            );
          })}
        </div>

        <p className="mt-1 text-[9px] text-text-muted text-center">
          {t(opponent ? "defensiveBallHint" : "ballHint")}
        </p>
        {!opponent && (
          <p className="mt-0.5 text-[9px] text-text-muted text-center">{t("occupancyHint")}</p>
        )}
        {opponent && findings && findings.length > 0 && (
          <ul className="mt-1 space-y-0.5 border-t border-[#1C2436] pt-1">
            {findings.slice(0, MAX_FINDINGS).map((f) => (
              <li key={f.id} className="flex items-start gap-1 text-[9px] leading-snug">
                <span
                  aria-hidden
                  className="mt-[3px] w-1 h-1 rounded-full shrink-0"
                  style={{ backgroundColor: f.severity === "warning" ? "#FFB300" : "#448AFF" }}
                />
                <span className={f.severity === "warning" ? "text-accent-amber" : "text-[#448AFF]"}>
                  {t(`defensiveFindings.${f.messageKey}`, f.values)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
