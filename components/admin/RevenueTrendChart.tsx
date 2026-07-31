"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatIDR } from "@/lib/data/schedule";
import type { RevenueTrendData } from "@/lib/services/analytics";

interface RevenueTrendChartProps {
  data: RevenueTrendData[];
}

export default function RevenueTrendChart({ data }: RevenueTrendChartProps) {
  const isEmpty = !data || data.every((d) => d.revenue === 0);

  const formatShortIDR = (value: number) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
    return `${value}`;
  };

  return (
    <div className="glass-panel p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-[#F5F7FA] tracking-tight">Revenue Growth</h3>
          <p className="text-xs text-[#A7B0C0]">Monthly confirmed revenue (Last 6 Months)</p>
        </div>
        <span className="text-xs font-mono font-bold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 px-3 py-1 rounded-full">
          IDR Revenue
        </span>
      </div>

      {isEmpty ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/4 text-center p-6 space-y-2">
          <p className="text-sm font-semibold text-[#A7B0C0]">No confirmed revenue recorded yet</p>
          <p className="text-xs text-[#A7B0C0]/60">
            Revenue trends will display as bookings are confirmed.
          </p>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#6C63FF" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#A7B0C0"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#A7B0C0"
                fontSize={12}
                tickFormatter={formatShortIDR}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#050505",
                  borderColor: "rgba(255,255,255,0.15)",
                  borderRadius: "16px",
                  color: "#F5F7FA",
                  fontSize: "12px",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
                  backdropFilter: "blur(12px)",
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [formatIDR(Number(value || 0)), "Revenue"]}
                labelStyle={{ fontWeight: "bold", color: "#F5F7FA" }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#6C63FF"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
