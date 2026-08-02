"use client";

import { playerRoles } from "@/lib/tactics-data";
import type { PlayerNode as PlayerNodeType } from "@/types/tactic";

interface PlayerNodeProps {
  player: PlayerNodeType;
  isGoalkeeper: boolean;
  isSelected: boolean;
  isDragging: boolean;
  onMouseDown: () => void;
  onDoubleClick: () => void;
}

const dutyColors: Record<string, string> = {
  defend: "#448AFF",
  support: "#FFB300",
  attack: "#FF5252",
};

export function PlayerNode({
  player,
  isGoalkeeper,
  isSelected,
  isDragging,
  onMouseDown,
  onDoubleClick,
}: PlayerNodeProps) {
  const role = playerRoles.find((r) => r.id === player.roleId);
  const color = dutyColors[player.duty] || "#00E676";
  const radius = isGoalkeeper ? 3 : 2.2;

  return (
    <g
      transform={`translate(${player.x}, ${player.y})`}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onMouseDown();
      }}
      onDoubleClick={onDoubleClick}
    >
      {/* Glow */}
      {(isSelected || isDragging) && (
        <circle r={radius + 1.5} fill="none" stroke={color} strokeWidth="0.3" opacity="0.3">
          {isDragging && (
            <>
              <animate attributeName="r" from={radius + 1.5} to={radius + 2.5} dur="0.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.3" to="0" dur="0.8s" repeatCount="indefinite" />
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
      />

      {/* Duty indicator */}
      <circle
        r={radius - 0.7}
        fill={color}
        opacity="0.8"
      />

      {/* Role label */}
      {isSelected && role && (
        <g transform="translate(0, -4)">
          <rect
            x={-10}
            y={-3}
            width={20}
            height={5}
            rx={0.5}
            fill="#141A26"
            stroke={color}
            strokeWidth="0.15"
            opacity="0.95"
          />
          <text
            y={0.8}
            textAnchor="middle"
            fill={color}
            fontSize="1.2"
            fontWeight="600"
            fontFamily="Inter, sans-serif"
          >
            {role.name.split(" ").map((w) => w[0]).join("").slice(0, 3)}
          </text>
        </g>
      )}

      {/* Jersey number */}
      {!isSelected && (
        <text
          y={0.6}
          textAnchor="middle"
          fill={color}
          fontSize="1"
          fontFamily="Inter, sans-serif"
          fontWeight="600"
          opacity="0.7"
        >
          {player.id.split("-")[1]}
        </text>
      )}
    </g>
  );
}
