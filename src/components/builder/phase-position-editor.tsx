"use client";

import { useTranslations } from "next-intl";
import { RotateCcw, ArrowRight } from "lucide-react";
import type { MovementType, PhaseType, PlayerMovement } from "@/types/tactic";
import { MOVEMENT_LABELS } from "./movement-arrow";

interface PhasePositionEditorProps {
  phase: PhaseType;
  playerId: string;
  movement?: PlayerMovement;
  onSetMovement: (playerId: string, movement: PlayerMovement | null) => void;
  onResetPositions: () => void;
}

const MOVEMENT_OPTIONS: MovementType[] = [
  "forward",
  "backward",
  "inside",
  "outside",
  "press",
  "cover",
];

const MOVEMENT_LABEL_KEYS: Record<MovementType, string> = {
  forward: "phaseMovementForward",
  backward: "phaseMovementBackward",
  inside: "phaseMovementInside",
  outside: "phaseMovementOutside",
  press: "phaseMovementPress",
  cover: "phaseMovementCover",
};

/**
 * Per-player phase block shown in the sidebar role tab: current phase name,
 * the player's movement intent arrow and a phase-wide position reset.
 */
export function PhasePositionEditor({
  phase,
  playerId,
  movement,
  onSetMovement,
  onResetPositions,
}: PhasePositionEditorProps) {
  const t = useTranslations("builder");
  const phaseName =
    phase === "in-possession"
      ? t("phaseInPossession")
      : t("phaseOutOfPossession");

  return (
    <div className="mt-5 pt-4 border-t border-[#1C2436]/50">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {t("phaseSectionTitle")}
        </h3>
        <span
          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
            phase === "in-possession"
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-blue-500/15 text-blue-300"
          }`}
        >
          {phaseName}
        </span>
      </div>
      <p className="mt-1 text-[11px] leading-snug text-text-muted">
        {t("phasePositionHint")}
      </p>

      <div className="mt-3">
        <span className="text-[11px] font-medium text-text-secondary">
          {t("phaseMovementLabel")}
        </span>
        <div className="mt-1.5 grid grid-cols-2 gap-1">
          <button
            onClick={() => onSetMovement(playerId, null)}
            className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-md border text-[11px] transition-colors cursor-pointer ${
              !movement
                ? "bg-primary/10 border-primary/50 text-text-primary"
                : "border-[#1C2436] text-text-muted hover:text-text-secondary hover:border-[#2A3752]"
            }`}
          >
            {t("phaseMovementNone")}
          </button>
          {MOVEMENT_OPTIONS.map((type) => {
            const isActive = movement?.type === type;
            return (
              <button
                key={type}
                onClick={() => onSetMovement(playerId, { type })}
                title={MOVEMENT_LABELS[type]}
                className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-md border text-[11px] transition-colors cursor-pointer ${
                  isActive
                    ? phase === "in-possession"
                      ? "bg-emerald-500/15 border-emerald-400/50 text-emerald-300"
                      : "bg-blue-500/15 border-blue-400/50 text-blue-300"
                    : "border-[#1C2436] text-text-muted hover:text-text-secondary hover:border-[#2A3752]"
                }`}
              >
                <ArrowRight className="w-3 h-3 shrink-0" />
                {t(MOVEMENT_LABEL_KEYS[type])}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={onResetPositions}
        className="mt-3 flex items-center gap-1.5 py-1 px-2 rounded-md text-[11px] text-text-muted hover:text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer"
      >
        <RotateCcw className="w-3 h-3" />
        {t("phaseResetPosition")}
      </button>
    </div>
  );
}
