import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    text: string;
    isPositive?: boolean;
  };
  accentColor?: "purple" | "amber" | "green" | "blue";
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = "purple",
}: StatCardProps) {
  const accentStyles = {
    purple: "border-[#6C63FF]/30 text-[#6C63FF] bg-[#6C63FF]/10 group-hover:bg-[#6C63FF]/20",
    amber: "border-amber-500/30 text-amber-400 bg-amber-500/10 group-hover:bg-amber-500/20",
    green: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 group-hover:bg-emerald-500/20",
    blue: "border-[#5EA0FF]/30 text-[#5EA0FF] bg-[#5EA0FF]/10 group-hover:bg-[#5EA0FF]/20",
  };

  return (
    <article
      className="glass-card group relative p-5 hover:border-[#6C63FF]/40 transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#A7B0C0]">
            {title}
          </p>
          <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#F5F7FA] tracking-tight font-mono">
            {value}
          </h3>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border backdrop-blur-md transition-all ${accentStyles[accentColor]}`}
        >
          {icon}
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
          {subtitle && (
            <span className="text-[#A7B0C0] truncate">{subtitle}</span>
          )}
          {trend && (
            <span
              className={`font-bold ${
                trend.isPositive !== false ? "text-[#10B981]" : "text-[#EF4444]"
              }`}
            >
              {trend.text}
            </span>
          )}
        </div>
      )}
    </article>
  );
}
