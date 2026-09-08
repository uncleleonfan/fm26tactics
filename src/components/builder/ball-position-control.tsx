"use client";

import { useTranslations } from "next-intl";
import { Circle } from "lucide-react";
import type { BallZoneId } from "@/types/analysis";
import { ballZones } from "@/tactics/data/zones";

interface BallPositionControlProps {
  ballZone: BallZoneId;
  onChange: (zone: BallZoneId) => void;
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

export function BallPositionControl({ ballZone, onChange }: BallPositionControlProps) {
  const t = useTranslations("visualize");

  return (
    // Outer wrapper owns the centering — the slideUp keyframe animates
    // `transform`, which would override the Tailwind -translate-x-1/2
    // centering on the same element while the animation runs.
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 w-max max-w-[calc(100%-1.5rem)]">
      <div className="rounded-xl border border-[#1C2436] bg-background-secondary/95 backdrop-blur-xs shadow-[0_4px_24px_rgba(0,0,0,0.5)] px-2.5 py-2 animate-slide-up">
        {/* Scenario shortcuts */}
        <div className="flex items-center gap-1 mb-1.5">
          {SCENES.map((scene) => (
            <button
              key={scene.key}
              onClick={() => onChange(scene.zone)}
              className="px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wide text-text-muted hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            >
              {t(`scenes.${scene.key}`)}
            </button>
          ))}
        </div>

        {/* Zone buttons — grouped by third, matching pitch layout */}
        <div className="flex items-center gap-1">
          <Circle className="w-2.5 h-2.5 text-primary shrink-0 mr-0.5" fill="currentColor" />
          {ballZones.map((zone) => {
            const active = zone.id === ballZone;
            return (
              <button
                key={zone.id}
                onClick={() => onChange(zone.id)}
                title={zone.label}
                aria-pressed={active}
                className={`px-1.5 py-1 rounded-md font-mono text-[10px] font-bold border transition-all cursor-pointer active:scale-95 ${
                  active
                    ? "bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(0,230,118,0.3)]"
                    : "bg-[#0E1625] border-[#1C2436] text-text-muted hover:border-[#2A3550] hover:text-text-secondary"
                }`}
              >
                {ZONE_ABBR[zone.id]}
              </button>
            );
          })}
        </div>

        <p className="mt-1 text-[9px] text-text-muted text-center">{t("ballHint")}</p>
        <p className="mt-0.5 text-[9px] text-text-muted text-center">{t("occupancyHint")}</p>
      </div>
    </div>
  );
}
