"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { BookingTrendData } from "@/lib/services/analytics";

interface BookingTrendChartProps {
  data: BookingTrendData[];
}

export default function BookingTrendChart({ data }: BookingTrendChartProps) {
  const isEmpty = !data || data.every((d) => d.total === 0);

  return (
    <div className="glass-panel p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-[#F5F7FA] tracking-tight">Booking Trend</h3>
          <p className="text-xs text-[#A7B0C0]">Daily bookings count (Last 7 Days)</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#6C63FF]/30 bg-[#6C63FF]/10 px-3 py-1 text-[11px] font-bold text-[#6C63FF]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#6C63FF] animate-pulse" />
          Live Trend
        </span>
      </div>

      {isEmpty ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/4 text-center p-6 space-y-2">
          <p className="text-sm font-semibold text-[#A7B0C0]">No recent bookings recorded</p>
          <p className="text-xs text-[#A7B0C0]/60">
            Bookings in the last 7 days will appear here.
          </p>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis
                dataKey="displayDate"
                stroke="#A7B0C0"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#A7B0C0"
                fontSize={12}
                allowDecimals={false}
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
                itemStyle={{ color: "#6C63FF" }}
                labelStyle={{ fontWeight: "bold", color: "#F5F7FA" }}
              />
              <Line
                type="monotone"
                dataKey="total"
                name="Total Bookings"
                stroke="#6C63FF"
                strokeWidth={3}
                dot={{ fill: "#6C63FF", r: 4, strokeWidth: 2, stroke: "#050510" }}
                activeDot={{ r: 6, fill: "#6C63FF", stroke: "#FFFFFF", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="confirmed"
                name="Confirmed"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ fill: "#10B981", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
