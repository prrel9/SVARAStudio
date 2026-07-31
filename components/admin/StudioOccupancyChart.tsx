"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { StudioOccupancyData } from "@/lib/services/analytics";

interface StudioOccupancyChartProps {
  data: StudioOccupancyData[];
}

export default function StudioOccupancyChart({ data }: StudioOccupancyChartProps) {
  const totalCount = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="rounded-2xl border border-border-custom bg-surface p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Studio Occupancy</h3>
          <p className="text-xs text-text-secondary">Distribution of bookings per room</p>
        </div>
        <span className="text-xs font-mono font-bold text-accent bg-accent/10 border border-accent/30 px-2.5 py-1 rounded-full">
          {totalCount} Total Sessions
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Donut Chart */}
        <div className="relative h-56 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="count"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#171717" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#171717",
                  borderColor: "#333333",
                  borderRadius: "12px",
                  color: "#ffffff",
                  fontSize: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any, name: any) => [
                  `${value || 0} sessions`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-extrabold text-white font-mono">{totalCount}</span>
            <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">
              Bookings
            </span>
          </div>
        </div>

        {/* Legend / Breakdown */}
        <div className="space-y-3">
          {data.map((item) => (
            <div
              key={item.studioId}
              className="flex items-center justify-between p-2.5 rounded-xl bg-bg-secondary border border-border-custom/50 hover:border-border-custom transition-all"
            >
              <div className="flex items-center space-x-2.5">
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs font-mono">
                <span className="text-text-secondary">{item.count} bks</span>
                <span className="font-bold text-white bg-surface px-2 py-0.5 rounded-md border border-border-custom">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
