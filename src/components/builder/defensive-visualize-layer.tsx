"use client";

import { useTranslations } from "next-intl";
import type { BallZoneId } from "@/types/analysis";
import type {
  DefensiveAction,
  DefensiveResult,
} from "@/tactics/engine/defensive-engine";
import { arrowGeometry, GHOST_RADIUS } from "@/tactics/visualization/arrows";
import { ZONE_RECTS } from "./visualize-layer";

/**
 * Out-of-possession Visualize overlay — the defensive mirror of
 * VisualizeLayer. The opponent has the ball (red), our phase-XI responds:
 * press arrows, ghost positions, the instruction-adjusted defensive line
 * and the press ring around the ball.
 */

const ACTION_STYLES: Record<DefensiveAction, { stroke: string; dash: string }> = {
  press: { stroke: "#FF5252", dash: "" },
  "press-support": { stroke: "#FF784E", dash: "1.6,1.2" },
  cover: { stroke: "#448AFF", dash: "1.6,1.2" },
  hold: { stroke: "#448AFF", dash: "1.6,1.2" },
  drop: { stroke: "#448AFF", dash: "2,1.4" },
};

/** Space-in-behind fill only appears when the line is genuinely exposed. */
const RISK_FILL_THRESHOLD = 0.35;

interface DefensiveVisualizeLayerProps {
  result: DefensiveResult;
  oppBallZone: BallZoneId;
  /** Resolves player ids to role labels for arrow tooltips. */
  playerLabelById?: (playerId: string) => string | undefined;
}

export function DefensiveVisualizeLayer({
  result,
  oppBallZone,
  playerLabelById,
}: DefensiveVisualizeLayerProps) {
  const t = useTranslations("visualize");
  const { movements, metrics, ball } = result;
  const lineY = metrics.defensiveLineY;

  return (
    <g>
      {/* Opponent ball zone highlight (red counterpart of the green one) */}
      {ZONE_RECTS.map((rect) => {
        const isBallZone =
          rect.id === oppBallZone ||
          (rect.id === "defensive-third" && oppBallZone === "central-build-up");
        if (!isBallZone) return null;
        return (
          <rect
            key={rect.id}
            x={rect.x}
            y={rect.y}
            width={rect.w}
            height={rect.h}
            rx="1"
            fill="#FF5252"
            fillOpacity="0.05"
            stroke="#FF5252"
            strokeWidth="0.35"
            strokeOpacity="0.7"
            pointerEvents="none"
          />
        );
      })}

      {/* Space in behind the defensive line (danger gradient) */}
      {metrics.spaceInBehind > RISK_FILL_THRESHOLD && (
        <rect
          x="1"
          y={lineY}
          width="98"
          height={Math.max(100 - lineY - 1, 0)}
          fill="url(#defensive-space-behind)"
          pointerEvents="none"
        />
      )}
      <defs>
        <linearGradient id="defensive-space-behind" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#FF5252" stopOpacity="0" />
          <stop offset="100%" stopColor="#FF5252" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Press ring around the opponent ball — intensity = pressureOnBall */}
      <g pointerEvents="none" opacity={0.25 + metrics.pressureOnBall * 0.75}>
        <circle cx={ball.x} cy={ball.y} r="5.5" fill="none" stroke="#FF5252" strokeWidth="0.25" strokeOpacity="0.35" />
        <circle cx={ball.x} cy={ball.y} r="9" fill="none" stroke="#FF5252" strokeWidth="0.2" strokeOpacity="0.2" />
        <circle cx={ball.x} cy={ball.y} r="12.5" fill="none" stroke="#FF5252" strokeWidth="0.18" strokeOpacity="0.1" />
      </g>

      {/* Defensive response: ghost positions + action arrows */}
      {movements.map((m) => {
        const style = ACTION_STYLES[m.action];
        const geo = arrowGeometry(m.basePosition, m.expectedPosition);
        const label = playerLabelById?.(m.playerId) ?? m.roleId;
        return (
          <g key={`d-${m.playerId}`} pointerEvents="none">
            <circle
              cx={m.expectedPosition.x}
              cy={m.expectedPosition.y}
              r={GHOST_RADIUS}
              fill="none"
              stroke={style.stroke}
              strokeWidth="0.3"
              strokeDasharray="1,0.8"
              opacity="0.65"
            >
              <title>{`${label} — ${t(`defensiveActions.${m.action}`)}`}</title>
            </circle>
            {geo && (
              <>
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
                />
                <polygon
                  points={`0,${-geo.headLen / 2} ${geo.headLen},0 0,${geo.headLen / 2}`}
                  fill={style.stroke}
                  transform={`translate(${geo.x2}, ${geo.y2}) rotate(${geo.angleDeg})`}
                  opacity="0.9"
                >
                  <title>{`${label} — ${t(`defensiveActions.${m.action}`)}`}</title>
                </polygon>
              </>
            )}
          </g>
        );
      })}

      {/* Defensive line — the instruction-adjusted offside line */}
      <g pointerEvents="none">
        <line
          x1="3"
          y1={lineY}
          x2="97"
          y2={lineY}
          stroke="#FF5252"
          strokeWidth="0.45"
          strokeOpacity="0.55"
          strokeDasharray="3,2"
        />
        <line
          x1="3"
          y1={lineY}
          x2="97"
          y2={lineY}
          stroke="transparent"
          strokeWidth="2.5"
          style={{ pointerEvents: "stroke" }}
          onClick={(e) => e.stopPropagation()}
        >
          <title>{t("defensiveLineTooltip", { y: Math.round(lineY) })}</title>
        </line>
      </g>

      {/* The opponent ball — red counterpart of the in-possession ball */}
      <g transform={`translate(${ball.x}, ${ball.y})`} pointerEvents="none">
        <circle r="4" fill="#FF5252" opacity="0.15">
          <animate attributeName="r" from="3.2" to="5" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.25" to="0" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle r="1.9" fill="#F8FAFC" stroke="#0A0E17" strokeWidth="0.3" />
        <path d="M0,-0.85 L0.81,-0.26 L0.5,0.69 L-0.5,0.69 L-0.81,-0.26 Z" fill="#0A0E17" />
        <g stroke="#0A0E17" strokeWidth="0.22" strokeLinecap="round">
          <line x1="0" y1="-0.85" x2="0" y2="-1.9" />
          <line x1="0.81" y1="-0.26" x2="1.81" y2="-0.59" />
          <line x1="0.5" y1="0.69" x2="1.12" y2="1.54" />
          <line x1="-0.5" y1="0.69" x2="-1.12" y2="1.54" />
          <line x1="-0.81" y1="-0.26" x2="-1.81" y2="-0.59" />
        </g>
      </g>
    </g>
  );
}

