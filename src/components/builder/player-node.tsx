"use client";

import { playerRoles } from "@/lib/tactics-data";
import type { PlayerNode as PlayerNodeType } from "@/types/tactic";

interface PlayerNodeProps {
  player: PlayerNodeType;
  number: number;
  isGoalkeeper: boolean;
  isSelected: boolean;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTap: () => void;
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
  onMouseDown,
  onTouchStart,
  onTap,
}: PlayerNodeProps) {
  const role = playerRoles.find((r) => r.id === player.roleId);
  const color = dutyColors[player.duty] || "#00E676";
  const radius = isGoalkeeper ? 3.6 : 3.2;

  const abbr = role
    ? role.name.split(" ").map((w) => w[0]).join("").slice(0, 3).toUpperCase()
    : "";
  const labelWidth = Math.max(abbr.length * 1.5 + 2, 5);
  const labelOffsetY = player.y < 12 ? radius + 1.5 : -(radius + 1.5);

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
      onClick={(e) => {
        e.stopPropagation();
        onTap();
      }}
    >
      {/* Invisible touch target — larger hit area */}
      <circle
        r={touchRadius}
        fill="transparent"
        stroke="none"
        pointerEvents="all"
      />

      {/* Glow */}
      {(isSelected || isDragging) && (
        <circle r={radius + 1.2} fill="none" stroke={color} strokeWidth="0.4" opacity="0.4">
          {isDragging && (
            <>
              <animate attributeName="r" from={radius + 1.2} to={radius + 2.4} dur="0.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.4" to="0" dur="0.8s" repeatCount="indefinite" />
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
      <circle
        r={radius - 0.9}
        fill={color}
        opacity="0.9"
        pointerEvents="none"
      />

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

      {/* Role label */}
      {isSelected && role && (
        <g transform={`translate(0, ${labelOffsetY})`} pointerEvents="none">
          <rect
            x={-labelWidth / 2}
            y={-2.2}
            width={labelWidth}
            height={4.4}
            rx={1}
            fill="#141A26"
            stroke={color}
            strokeWidth="0.25"
            opacity="0.95"
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
          >
            {abbr}
          </text>
        </g>
      )}
    </g>
  );
}
