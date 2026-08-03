"use client";

import { Zap } from "lucide-react";
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

export function RoleRadarChart({ roleName, data }: Props) {
  return (
    <div className="glass-panel p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4 text-primary" />
        Attribute Importance
      </h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#1C2436" />
            <PolarAngleAxis
              dataKey="attribute"
              tick={{ fill: "#94A3B8", fontSize: 11 }}
            />
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
