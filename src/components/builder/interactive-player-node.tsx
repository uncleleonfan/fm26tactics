"use client";

import type { PlayerNode as PlayerNodeType } from "@/types/tactic";
import type { LabelPlacement } from "@/tactics/visualization/label-placement";
import { PlayerNode } from "./player-node";

interface InteractivePlayerNodeProps {
  player: PlayerNodeType;
  number: number;
  isGoalkeeper: boolean;
  isSelected: boolean;
  isDragging: boolean;
  labelPlacement?: LabelPlacement;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
}

/**
 * Interactive wrapper around the visual PlayerNode for the tactic
 * builder — adds pointer handlers, cursor feedback and event isolation.
 */
export function InteractivePlayerNode({
  player,
  number,
  isGoalkeeper,
  isSelected,
  isDragging,
  labelPlacement,
  onMouseDown,
  onTouchStart,
}: InteractivePlayerNodeProps) {
  return (
    <g
      style={{ cursor: isDragging ? "grabbing" : "pointer" }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onMouseDown(e);
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
        onTouchStart(e);
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <PlayerNode
        player={player}
        number={number}
        isGoalkeeper={isGoalkeeper}
        isSelected={isSelected}
        isDragging={isDragging}
        labelPlacement={labelPlacement}
      />
    </g>
  );
}
