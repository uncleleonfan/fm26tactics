"use client";

import { useTranslations } from "next-intl";
import type { AnalysisResult, BallZoneId } from "@/types/analysis";
import { zoneById, ZONE_OCCUPANCY_THRESHOLDS } from "@/tactics/data/zones";
import {
  arrowGeometry,
  MOVEMENT_STYLES,
  RELATION_STYLES,
  RELATION_VISIBILITY_THRESHOLD,
} from "@/tactics/visualization/arrows";

interface VisualizeLayerProps {
  analysis: AnalysisResult;
  ballZone: BallZoneId;
  /** Resolves player ids to role labels for arrow tooltips. */
  playerLabelById?: (playerId: string) => string | undefined;
}

/** Visible zone rectangles — central-build-up shares space with defensive-third. */
const ZONE_RECTS: Array<{
  id: BallZoneId;
  x: number;
  y: number;
  w: number;
  h: number;
}> = [
  { id: "left-build-up", x: 0.6, y: 58.6, w: 32.8, h: 40.8 },
  { id: "defensive-third", x: 34, y: 58.6, w: 32, h: 40.8 },
  { id: "right-build-up", x: 66.6, y: 58.6, w: 32.8, h: 40.8 },
  { id: "left-midfield", x: 0.6, y: 30.6, w: 32.8, h: 27 },
  { id: "central-midfield", x: 34, y: 30.6, w: 32, h: 27 },
  { id: "right-midfield", x: 66.6, y: 30.6, w: 32.8, h: 27 },
  { id: "left-final-third", x: 0.6, y: 0.6, w: 32.8, h: 29 },
  { id: "central-final-third", x: 34, y: 0.6, w: 32, h: 29 },
  { id: "right-final-third", x: 66.6, y: 0.6, w: 32.8, h: 29 },
];

export function VisualizeLayer({ analysis, ballZone, playerLabelById }: VisualizeLayerProps) {
  const t = useTranslations("visualize");
  const { movements, zoneOccupancy } = analysis;
  const ballAnchor = zoneById[ballZone];

  return (
    <g>
      {/* Zone density overlays */}
      {ZONE_RECTS.map((rect) => {
        const count = zoneOccupancy[rect.id] ?? 0;
        const isOverloaded = count >= ZONE_OCCUPANCY_THRESHOLDS.overload;
        const isEmpty = count === ZONE_OCCUPANCY_THRESHOLDS.empty;
        const isBallZone = rect.id === ballZone;
        const zone = zoneById[rect.id];

        return (
          <g key={rect.id} pointerEvents="none">
            {isOverloaded && (
              <rect
                x={rect.x}
                y={rect.y}
                width={rect.w}
                height={rect.h}
                rx="1"
                fill="#FFB300"
                fillOpacity="0.1"
              >
                <animate
                  attributeName="fill-opacity"
                  from="0.1"
                  to="0.18"
                  dur="1.6s"
                  repeatCount="indefinite"
                />
              </rect>
            )}
            {isEmpty && !isBallZone && (
              <rect
                x={rect.x}
                y={rect.y}
                width={rect.w}
                height={rect.h}
                rx="1"
                fill="none"
                stroke="#3A4664"
                strokeWidth="0.25"
                strokeDasharray="1.5,1.5"
                opacity="0.55"
              />
            )}
            {isBallZone && (
              <rect
                x={rect.x}
                y={rect.y}
                width={rect.w}
                height={rect.h}
                rx="1"
                fill="#00E676"
                fillOpacity="0.05"
                stroke="#00E676"
                strokeWidth="0.35"
                strokeOpacity="0.7"
              />
            )}
            {/* Occupancy count chip */}
            {count > 0 && (
              <g
                transform={`translate(${rect.x + rect.w - 2.4}, ${rect.y + 2.4})`}
                opacity="0.85"
              >
                <circle
                  r="1.6"
                  fill={isOverloaded ? "#FFB300" : "#1C2436"}
                  stroke={isOverloaded ? "#FFB300" : "#3A4664"}
                  strokeWidth="0.2"
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isOverloaded ? "#0A0E17" : "#94A3B8"}
                  fontSize="1.7"
                  fontWeight="700"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {count}
                </text>
              </g>
            )}
            <title>{`${zone.label}${count > 0 ? ` — ${count}` : ""}`}</title>
          </g>
        );
      })}

      {/* Relationship links — drawn under movement arrows */}
      {analysis.relationships
        .filter((rel) => rel.strength >= RELATION_VISIBILITY_THRESHOLD)
        .map((rel, i) => {
          const a = movements.find((m) => m.playerId === rel.playerA);
          const b = movements.find((m) => m.playerId === rel.playerB);
          if (!a || !b) return null;
          const style = RELATION_STYLES[rel.type];
          const labelA = playerLabelById?.(rel.playerA) ?? rel.playerA;
          const labelB = playerLabelById?.(rel.playerB) ?? rel.playerB;
          const hostile = rel.type === "space-sharing";

          return (
            <g key={`rel-${i}`} pointerEvents="none">
              <line
                x1={a.basePosition.x}
                y1={a.basePosition.y}
                x2={b.basePosition.x}
                y2={b.basePosition.y}
                stroke={style.stroke}
                strokeWidth={hostile ? 0.5 : 0.35}
                strokeDasharray={style.dash || undefined}
                opacity={hostile ? 0.8 : 0.4}
              />
              <line
                x1={a.basePosition.x}
                y1={a.basePosition.y}
                x2={b.basePosition.x}
                y2={b.basePosition.y}
                stroke="transparent"
                strokeWidth="2"
                style={{ pointerEvents: "stroke" }}
                onClick={(e) => e.stopPropagation()}
              >
                <title>
                  {`${labelA} — ${labelB}: ${t(style.labelKey)} (${Math.round(rel.strength * 100)}%)`}
                </title>
              </line>
            </g>
          );
        })}

      {/* Expected position ghosts + movement arrows */}
      {movements.map((m) => {
        const style = MOVEMENT_STYLES[m.movementType];
        const geo = arrowGeometry(m.basePosition, m.expectedPosition);
        const label = playerLabelById?.(m.playerId) ?? m.roleId;

        return (
          <g key={`mv-${m.playerId}`} pointerEvents="none">
            {/* Ghost marker at expected position */}
            <circle
              cx={m.expectedPosition.x}
              cy={m.expectedPosition.y}
              r="2.2"
              fill="none"
              stroke={style.stroke}
              strokeWidth="0.3"
              strokeDasharray="1,0.8"
              opacity="0.65"
              style={{ transition: "cx 200ms ease-out, cy 200ms ease-out" }}
            />

            {/* Movement arrow */}
            {geo && (
              <g className="animate-fade-in">
                <line
                  x1={geo.x1}
                  y1={geo.y1}
                  x2={geo.x2}
                  y2={geo.y2}
                  stroke={style.stroke}
                  strokeWidth="0.55"
                  strokeDasharray={style.dash || undefined}
                  strokeLinecap="round"
                  opacity="0.9"
                  style={{
                    transition:
                      "x1 200ms ease-out, y1 200ms ease-out, x2 200ms ease-out, y2 200ms ease-out",
                  }}
                />
                {/* Arrowhead */}
                <polygon
                  points="0,-1.1 2.2,0 0,1.1"
                  fill={style.stroke}
                  transform={`translate(${geo.x2}, ${geo.y2}) rotate(${geo.angleDeg})`}
                  opacity="0.9"
                  style={{ transition: "transform 200ms ease-out" }}
                >
                  <title>{`${label} — ${t(style.labelKey)}`}</title>
                </polygon>
                <line
                  x1={geo.x1}
                  y1={geo.y1}
                  x2={geo.x2}
                  y2={geo.y2}
                  stroke="transparent"
                  strokeWidth="2.5"
                  style={{ pointerEvents: "stroke" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <title>{`${label} — ${t(style.labelKey)}`}</title>
                </line>
              </g>
            )}
          </g>
        );
      })}

      {/* The ball */}
      <g transform={`translate(${ballAnchor.x}, ${ballAnchor.y})`} pointerEvents="none">
        <circle r="4" fill="#00E676" opacity="0.15">
          <animate attributeName="r" from="3.2" to="5" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.25" to="0" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle r="1.9" fill="#F1F5F9" stroke="#0A0E17" strokeWidth="0.3" />
        <circle r="0.7" fill="#0A0E17" opacity="0.4" />
      </g>
    </g>
  );
}
