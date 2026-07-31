"use client";

import { formatHour } from "@/lib/data/schedule";
import type { SlotStatus } from "@/lib/data/schedule";
import { SLOT_STATUS_CONFIG } from "./ScheduleLegend";

interface TimeSlotProps {
  hour: number;
  status: SlotStatus;
  isSelected: boolean;
  onSelect: (hour: number) => void;
}

export default function TimeSlot({
  hour,
  status,
  isSelected,
  onSelect,
}: TimeSlotProps) {
  const isSelectable = status === "available";
  const label = formatHour(hour);

  // Determine visual style
  const config = isSelected
    ? SLOT_STATUS_CONFIG.selected
    : SLOT_STATUS_CONFIG[status];

  return (
    <button
      type="button"
      onClick={() => isSelectable && onSelect(hour)}
      disabled={!isSelectable}
      aria-label={`${label} — ${config.label}`}
      aria-pressed={isSelected}
      title={`${label} ${config.label}`}
      className={[
        "relative flex flex-col items-center justify-center gap-0.5",
        "h-14 w-14 shrink-0 rounded-xl border text-center",
        "text-xs font-semibold transition-all duration-150",
        "focus:outline-none focus:ring-2 focus:ring-info-custom focus:ring-offset-2 focus:ring-offset-background",
        config.bg,
        config.border,
        config.text,
        // Selectable hover
        isSelectable && !isSelected
          ? `${config.hoverBg} hover:scale-105 active:scale-95 cursor-pointer`
          : "",
        // Selected state — glowing elevation
        isSelected
          ? "scale-105 shadow-[0_0_12px_rgba(59,130,246,0.4)] cursor-pointer"
          : "",
        // Non-selectable
        !isSelectable ? "cursor-not-allowed opacity-70" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Hour label */}
      <span className="leading-none">{label}</span>
      {/* Status dot */}
      <span
        className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-info-custom" : config.dot}`}
        aria-hidden="true"
      />
    </button>
  );
}
