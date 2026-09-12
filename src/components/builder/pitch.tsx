"use client";

import { useMemo, useRef, useState } from "react";
import { InteractivePlayerNode } from "./interactive-player-node";
import { PitchBackground } from "./pitch-background";
import { VisualizeLayer } from "./visualize-layer";
import { BallPositionControl } from "./ball-position-control";
import { PitchModeControl } from "./pitch-mode-control";
import { zoneAtPoint } from "@/tactics/data/zones";
import { MIN_MOVEMENT_DIST } from "@/tactics/visualization/arrows";
import { computeLabelPlacements, roleLabelWidth } from "@/tactics/visualization/label-placement";
import { resolvePhasePlayers } from "@/hooks/use-tactic-builder";
import { playerRoles } from "@/lib/tactics-data";
import { MovementArrow } from "./movement-arrow";
import type { AnalysisResult, BallZoneId } from "@/types/analysis";
import type { PhaseType, TacticBoardState } from "@/types/tactic";

interface PitchProps {
  state: TacticBoardState;
  /** Phase whose positions are displayed & edited (defaults to in-possession). */
  phase?: PhaseType;
  onMovePlayer: (playerId: string, x: number, y: number, snap?: boolean) => void;
  onSelectPlayer: (playerId: string | null) => void;
  onTapPlayer: (playerId: string) => void;
  selectedPlayerId: string | null;
  onChangeRole: (playerId: string, roleId: string) => void;
  onChangeDuty: (playerId: string, duty: "defend" | "support" | "attack") => void;
  /** Visualize overlay mode: expected positions, arrows, zone density, ball. */
  visualize?: boolean;
  /** Toggles pitch mode via the floating Edit/Visualize switch. */
  onToggleVisualize?: (visualize: boolean) => void;
  analysis?: AnalysisResult | null;
  ballZone?: BallZoneId;
  onBallZoneChange?: (zone: BallZoneId) => void;
  /** Resolves player ids to role labels for tooltips. */
  playerLabelById?: (playerId: string) => string | undefined;
}

const TAP_THRESHOLD_PX = 8; // Max screen-pixel movement to count as a tap

export function Pitch({
  state,
  phase = "in-possession",
  onMovePlayer,
  onSelectPlayer,
  onTapPlayer,
  selectedPlayerId,
  onChangeRole,
  onChangeDuty,
  visualize = false,
  onToggleVisualize,
  analysis = null,
  ballZone,
  onBallZoneChange,
  playerLabelById,
}: PitchProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragOffsetRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Players as displayed in the current phase — phase coordinates override
  // the base formation positions; identities/roles come from the base XI.
  const players = useMemo(
    () => resolvePhasePlayers(state, phase),
    [state, phase]
  );

  // Shared coordinate conversion — works for both mouse and touch
  const toSvgCoords = (clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    };
  };

  const startDrag = (playerId: string, clientX: number, clientY: number) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;
    const coords = toSvgCoords(clientX, clientY);
    dragOffsetRef.current = { dx: player.x - coords.x, dy: player.y - coords.y };
    touchStartRef.current = { x: clientX, y: clientY };
    setDraggingId(playerId);
    // Highlight the player during drag, but don't open any panel
    onSelectPlayer(playerId);
  };

  const doDrag = (clientX: number, clientY: number) => {
    if (!draggingId) return;
    const coords = toSvgCoords(clientX, clientY);
    onMovePlayer(
      draggingId,
      coords.x + dragOffsetRef.current.dx,
      coords.y + dragOffsetRef.current.dy
    );
  };

  const endDrag = (clientX: number, clientY: number) => {
    if (!draggingId) return;

    // Touch: detect tap vs drag
    const dx = clientX - touchStartRef.current.x;
    const dy = clientY - touchStartRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < TAP_THRESHOLD_PX) {
      // Minimal movement → treat as a tap, open settings panel
      onTapPlayer(draggingId);
    } else {
      // Significant movement → snap to nearest grid position
      const coords = toSvgCoords(clientX, clientY);
      onMovePlayer(
        draggingId,
        coords.x + dragOffsetRef.current.dx,
        coords.y + dragOffsetRef.current.dy,
        true
      );
    }
    setDraggingId(null);
  };

  // Mouse handlers
  const handlePlayerMouseDown = (playerId: string, e: React.MouseEvent) => {
    startDrag(playerId, e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    doDrag(e.clientX, e.clientY);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    endDrag(e.clientX, e.clientY);
  };

  // Touch handlers
  const handlePlayerTouchStart = (playerId: string, e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) startDrag(playerId, touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggingId) return;
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) doDrag(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    if (touch) endDrag(touch.clientX, touch.clientY);
  };

  // Visualize mode: clicking open grass moves the ball to that zone.
  const handleSvgClick = (e: React.MouseEvent) => {
    if (!visualize || !onBallZoneChange) return;
    const coords = toSvgCoords(e.clientX, e.clientY);
    onBallZoneChange(zoneAtPoint(coords.x, coords.y));
  };

  // Visualize mode: prefer the label below the node when the movement arrow
  // points up (toward the opponent goal) so its opaque box never covers the
  // arrow. Holds (no rendered arrow) keep the default preference.
  const arrowUpById = useMemo(
    () =>
      visualize && analysis
        ? new Map(
            analysis.movements.map((m) => [
              m.playerId,
              Math.hypot(m.movementVector.dx, m.movementVector.dy) >=
                MIN_MOVEMENT_DIST &&
                m.movementVector.dy < 0,
            ])
          )
        : undefined,
    [visualize, analysis]
  );

  // Auto label placement: default above; dodge other player nodes and label
  // boxes via below → left → right. Pure layout math, re-runs as players move.
  const labelPlacements = useMemo(
    () =>
      computeLabelPlacements(
        players.map((player, index) => {
          const role = playerRoles.find((r) => r.id === player.roleId);
          return {
            id: player.id,
            x: player.x,
            y: player.y,
            radius: index === 0 ? 3.6 : 3.2,
            labelWidth: roleLabelWidth(role?.abbr ?? ""),
            preferBelow: arrowUpById?.get(player.id) ?? false,
          };
        })
      ),
    [players, arrowUpById]
  );

  // Tactical-intent arrows for the current phase
  const phaseMap = state.phases?.[phase];

  return (
    <div className="relative flex-1 flex items-center justify-center p-3 min-h-0 min-w-0">
      <svg
        id="tactic-pitch-svg"
        ref={svgRef}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-auto max-w-full aspect-[2/3] touch-none select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleSvgClick}
      >
        {/* Static pitch markings — shared with article formation diagrams */}
        <PitchBackground />

        {/* Visualize overlay: zones, ghosts, arrows, ball */}
        {visualize && analysis && ballZone && (
          <VisualizeLayer
            analysis={analysis}
            ballZone={ballZone}
            playerLabelById={playerLabelById}
          />
        )}

        {/* Tactical-intent movement arrows for the active phase */}
        {players.map((player) => {
          const movement = phaseMap?.[player.id]?.movement;
          if (!movement) return null;
          return (
            <MovementArrow
              key={`arrow-${player.id}`}
              x={player.x}
              y={player.y}
              movement={movement}
              phase={phase}
            />
          );
        })}

        {/* Player nodes */}
        {players.map((player, index) => {
          const isGk = index === 0;
          return (
            <InteractivePlayerNode
              key={player.id}
              player={player}
              number={index + 1}
              isGoalkeeper={isGk}
              isSelected={player.id === selectedPlayerId}
              isDragging={player.id === draggingId}
              labelPlacement={labelPlacements.get(player.id)}
              onMouseDown={(e) => handlePlayerMouseDown(player.id, e)}
              onTouchStart={(e) => handlePlayerTouchStart(player.id, e)}
            />
          );
        })}
      </svg>

      {onToggleVisualize && (
        <PitchModeControl visualize={visualize} onChange={onToggleVisualize} />
      )}

      {visualize && ballZone && onBallZoneChange && (
        <BallPositionControl ballZone={ballZone} onChange={onBallZoneChange} />
      )}
    </div>
  );
}
