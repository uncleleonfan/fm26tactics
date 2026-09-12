import { playerRoles } from "@/lib/tactics-data";
import type { PhasePlayerMap, PhaseType, PlayerNode as PlayerNodeType } from "@/types/tactic";
import { PitchBackground } from "./pitch-background";
import { PlayerNode } from "./player-node";
import { MovementArrow } from "./movement-arrow";

interface StaticPhasePitchProps {
  /** Players already resolved to the phase coordinates. */
  players: PlayerNodeType[];
  phase: PhaseType;
  /** Phase map providing movement arrows. */
  phaseMap?: PhasePlayerMap;
  /** DOM id — used by export pipelines to clone the SVG. */
  svgId?: string;
  className?: string;
  showLabels?: boolean;
}

/**
 * Read-only phase pitch (background + tokens + intent arrows). Shared by the
 * Compare side-by-side view and the both-phases export. Square viewBox with
 * square aspect — no letterboxing bands.
 */
export function StaticPhasePitch({
  players,
  phase,
  phaseMap,
  svgId,
  className = "",
  showLabels = true,
}: StaticPhasePitchProps) {
  return (
    <svg
      id={svgId}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      className={`block select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <PitchBackground />
      {players.map((p) => {
        const movement = phaseMap?.[p.id]?.movement;
        if (!movement) return null;
        return (
          <MovementArrow
            key={`arrow-${p.id}`}
            x={p.x}
            y={p.y}
            movement={movement}
            phase={phase}
          />
        );
      })}
      {players.map((p, i) => {
        const isGoalkeeper =
          playerRoles.find((r) => r.id === p.roleId)?.category === "goalkeeper";
        return (
          <PlayerNode
            key={p.id}
            player={p}
            number={i + 1}
            isGoalkeeper={isGoalkeeper}
            isSelected={false}
            isDragging={false}
            labelPlacement={showLabels ? "above" : undefined}
          />
        );
      })}
    </svg>
  );
}
