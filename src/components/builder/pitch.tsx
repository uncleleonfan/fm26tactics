"use client";

import { useRef, useState } from "react";
import { PlayerNode } from "./player-node";
import type { TacticBoardState, FormationType } from "@/types/tactic";

interface PitchProps {
  state: TacticBoardState;
  onMovePlayer: (playerId: string, x: number, y: number, snap?: boolean) => void;
  onSelectPlayer: (playerId: string | null) => void;
  selectedPlayerId: string | null;
  onChangeRole: (playerId: string, roleId: string) => void;
  onChangeDuty: (playerId: string, duty: "defend" | "support" | "attack") => void;
}

export function Pitch({
  state,
  onMovePlayer,
  onSelectPlayer,
  selectedPlayerId,
  onChangeRole,
  onChangeDuty,
}: PitchProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragOffsetRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });

  const toSvgCoords = (e: React.MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  };

  const handlePlayerMouseDown = (playerId: string, e: React.MouseEvent) => {
    const player = state.players.find((p) => p.id === playerId);
    if (!player) return;
    const mouse = toSvgCoords(e);
    dragOffsetRef.current = { dx: player.x - mouse.x, dy: player.y - mouse.y };
    setDraggingId(playerId);
    onSelectPlayer(playerId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId) return;
    const mouse = toSvgCoords(e);
    onMovePlayer(
      draggingId,
      mouse.x + dragOffsetRef.current.dx,
      mouse.y + dragOffsetRef.current.dy
    );
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (draggingId) {
      const mouse = toSvgCoords(e);
      onMovePlayer(
        draggingId,
        mouse.x + dragOffsetRef.current.dx,
        mouse.y + dragOffsetRef.current.dy,
        true
      );
    }
    setDraggingId(null);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-3 min-h-0 min-w-0">
      <svg
        id="tactic-pitch-svg"
        ref={svgRef}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-auto max-w-full aspect-[2/3] cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Pitch outline */}
        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          fill="#0A0E17"
          stroke="#1C2436"
          strokeWidth="0.5"
          rx="1"
        />

        {/* Center line */}
        <line x1="0" y1="50" x2="100" y2="50" stroke="#1C2436" strokeWidth="0.3" />

        {/* Center circle */}
        <circle cx="50" cy="50" r="12" fill="none" stroke="#1C2436" strokeWidth="0.3" />

        {/* Center dot */}
        <circle cx="50" cy="50" r="0.8" fill="#1C2436" />

        {/* Penalty areas */}
        <rect
          x="22"
          y="0"
          width="56"
          height="16"
          fill="none"
          stroke="#1C2436"
          strokeWidth="0.3"
        />
        <rect
          x="22"
          y="84"
          width="56"
          height="16"
          fill="none"
          stroke="#1C2436"
          strokeWidth="0.3"
        />

        {/* Goal areas */}
        <rect
          x="36"
          y="0"
          width="28"
          height="6"
          fill="none"
          stroke="#1C2436"
          strokeWidth="0.3"
        />
        <rect
          x="36"
          y="94"
          width="28"
          height="6"
          fill="none"
          stroke="#1C2436"
          strokeWidth="0.3"
        />

        {/* Goal posts */}
        <rect x="44" y="-0.5" width="12" height="1.5" fill="#1C2436" rx="0.5" />
        <rect x="44" y="99" width="12" height="1.5" fill="#1C2436" rx="0.5" />

        {/* Grid lines */}
        {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((pct) => (
          <line
            key={`h-${pct}`}
            x1="0"
            y1={pct}
            x2="100"
            y2={pct}
            stroke="#1C2436"
            strokeWidth="0.1"
            strokeDasharray="1,2"
            opacity="0.5"
          />
        ))}
        {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((pct) => (
          <line
            key={`v-${pct}`}
            x1={pct}
            y1="0"
            x2={pct}
            y2="100"
            stroke="#1C2436"
            strokeWidth="0.1"
            strokeDasharray="1,2"
            opacity="0.5"
          />
        ))}

        {/* Player nodes */}
        {state.players.map((player, index) => {
          const isGk = index === 0;
          return (
            <PlayerNode
              key={player.id}
              player={player}
              number={index + 1}
              isGoalkeeper={isGk}
              isSelected={player.id === selectedPlayerId}
              isDragging={player.id === draggingId}
              onMouseDown={(e) => handlePlayerMouseDown(player.id, e)}
              onDoubleClick={() => onSelectPlayer(player.id)}
            />
          );
        })}
      </svg>
    </div>
  );
}
