"use client";

import { playerRoles } from "@/lib/tactics-data";
import type { PlayerNode as PlayerNodeType } from "@/types/tactic";
import {
  LABEL_H_GAP,
  LABEL_HEIGHT,
  LABEL_V_GAP,
  roleLabelWidth,
  type LabelPlacement,
} from "@/tactics/visualization/label-placement";

interface PlayerNodeProps {
  player: PlayerNodeType;
  number: number;
  isGoalkeeper: boolean;
  isSelected: boolean;
  isDragging: boolean;
  /** Auto-computed label position (collision-avoided by pitch.tsx); defaults to "above". */
  labelPlacement?: LabelPlacement;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
}

const dutyColors: Record<string, string> = {
  defend: "#448AFF",
  support: "#FFB300",
  attack: "#FF5252",
};

export function PlayerNode({
  player,
  number,
  isGoalkeeper,
  isSelected,
  isDragging,
  labelPlacement,
  onMouseDown,
  onTouchStart,
}: PlayerNodeProps) {
  const role = playerRoles.find((r) => r.id === player.roleId);
  const color = dutyColors[player.duty] || "#00E676";
  const radius = isGoalkeeper ? 3.6 : 3.2;

  const abbr = role?.abbr ?? "";
  const labelWidth = roleLabelWidth(abbr);
  // Label offset per placement — computed by the auto-avoidance layout in pitch.tsx.
  const halfW = labelWidth / 2;
  const placement: LabelPlacement = labelPlacement ?? "above";
  const labelTransform =
    placement === "above"
      ? `translate(0, ${-(radius + LABEL_V_GAP)})`
      : placement === "below"
        ? `translate(0, ${radius + LABEL_V_GAP})`
        : placement === "left"
          ? `translate(${-(radius + LABEL_H_GAP + halfW)}, 0)`
          : `translate(${radius + LABEL_H_GAP + halfW}, 0)`;

  // Larger touch target on mobile
  const touchRadius = radius + 2.5;

  return (
    <g
      transform={`translate(${player.x}, ${player.y})`}
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
      {/* Invisible touch target — larger hit area */}
      <circle r={touchRadius} fill="transparent" stroke="none" pointerEvents="all" />

      {/* Glow — selected or dragging */}
      {(isSelected || isDragging) && (
        <circle
          r={radius + 1.2}
          fill="none"
          stroke={color}
          strokeWidth="0.4"
          opacity="0.4"
        >
          {isDragging && (
            <>
              <animate
                attributeName="r"
                from={radius + 1.2}
                to={radius + 2.4}
                dur="0.8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                from="0.4"
                to="0"
                dur="0.8s"
                repeatCount="indefinite"
              />
            </>
          )}
        </circle>
      )}

      {/* Player circle */}
      <circle
        r={radius}
        fill={isGoalkeeper ? "#1C2436" : "#0A0E17"}
        stroke={color}
        strokeWidth={isSelected ? "0.5" : "0.3"}
        className="transition-all duration-150"
        pointerEvents="none"
      />

      {/* Duty indicator */}
      <circle r={radius - 0.9} fill={color} opacity="0.9" pointerEvents="none" />

      {/* Jersey number */}
      <text
        y={0}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#0A0E17"
        fontSize={isGoalkeeper ? "2.3" : "2.1"}
        fontFamily="Inter, sans-serif"
        fontWeight="700"
        pointerEvents="none"
      >
        {number}
      </text>

      {/* Role label — always visible */}
      {role && (
        <g transform={labelTransform} pointerEvents="none">
          <rect
            x={-halfW}
            y={-LABEL_HEIGHT / 2}
            width={labelWidth}
            height={LABEL_HEIGHT}
            rx={1}
            fill="#141A26"
            stroke={color}
            strokeWidth="0.25"
            opacity={isSelected ? 0.95 : 0.8}
          />
          <text
            y={0}
            textAnchor="middle"
            dominantBaseline="central"
            fill={color}
            fontSize="2"
            fontWeight="700"
            fontFamily="Inter, sans-serif"
            pointerEvents="none"
            opacity={isSelected ? 1 : 0.8}
          >
            {abbr}
          </text>
        </g>
      )}
    </g>
  );
}
