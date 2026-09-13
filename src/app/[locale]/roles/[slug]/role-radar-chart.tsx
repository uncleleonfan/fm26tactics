"use client";

import { Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface ChartDatum {
  attribute: string;
  rating: number;
}

interface Props {
  roleName: string;
  data: ChartDatum[];
}

/**
 * Custom angle-axis tick: pushes labels outward so they don't collide with
 * the radius-axis numbers (e.g. "Rushing Out" overlapping "100" at the top).
 */
const ANGLE_TICK_OFFSET = 14;

function renderAngleTick(props: {
  x: number;
  y: number;
  textAnchor: "start" | "middle" | "end";
  payload: { value?: string; coordinate?: number };
}) {
  const { x, y, textAnchor, payload } = props;
  const deg = payload.coordinate ?? 0;
  let dx = 0;
  let dy = 0;
  if (deg > 60 && deg < 120) dy = -ANGLE_TICK_OFFSET; // top label
  else if (deg > 240 && deg < 300) dy = ANGLE_TICK_OFFSET; // bottom label
  else if (textAnchor === "start") dx = ANGLE_TICK_OFFSET; // right side
  else if (textAnchor === "end") dx = -ANGLE_TICK_OFFSET; // left side
  return (
    <text
      x={x + dx}
      y={y + dy}
      textAnchor={textAnchor}
      verticalAnchor="middle"
      fill="#94A3B8"
      fontSize={11}
    >
      {payload.value}
    </text>
  );
}

export function RoleRadarChart({ roleName, data }: Props) {
  const t = useTranslations("roles");

  return (
    <div className="glass-panel p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4 text-primary" />
        {t("attributeImportance")}
      </h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#1C2436" />
            <PolarAngleAxis dataKey="attribute" tick={renderAngleTick} tickLine={false} />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "#7483A0", fontSize: 10 }}
            />
            <Radar
              name={roleName}
              dataKey="rating"
              stroke="#00E676"
              fill="#00E676"
              fillOpacity={0.15}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
