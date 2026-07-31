"use client";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { StatusDistributionData } from "@/lib/services/analytics";

interface StatusDistributionChartProps {
  data: StatusDistributionData[];
}

export default function StatusDistributionChart({ data }: StatusDistributionChartProps) {
  const isEmpty = !data || data.every((d) => d.count === 0);

  return (
    <div className="rounded-2xl border border-border-custom bg-surface p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Booking Statuses</h3>
          <p className="text-xs text-text-secondary">Current distribution by status stage</p>
        </div>
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Lifecycle Breakdown
        </span>
      </div>

      {isEmpty ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border-custom bg-bg-secondary/50 text-center p-6 space-y-2">
          <p className="text-sm font-semibold text-text-secondary">No status data available</p>
          <p className="text-xs text-text-secondary/60">
            Booking statuses will populate as bookings are created.
          </p>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" vertical={false} />
              <XAxis
                dataKey="status"
                stroke="#a1a1aa"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                interval={0}
              />
              <YAxis
                stroke="#a1a1aa"
                fontSize={12}
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
              />
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
                formatter={(value: any) => [`${value || 0} bookings`, "Count"]}
                labelStyle={{ fontWeight: "bold", color: "#ffffff" }}
              />
              <Bar dataKey="count" name="Bookings" radius={[6, 6, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`bar-cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
