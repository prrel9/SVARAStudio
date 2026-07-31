"use client";

import { OPENING_HOUR, CLOSING_HOUR, formatHour } from "@/lib/data/schedule";
import type { TimeSlotData } from "@/lib/data/schedule";

const HOURS = Array.from(
  { length: CLOSING_HOUR - OPENING_HOUR + 1 },
  (_, i) => OPENING_HOUR + i
);

interface TimetableGridProps {
  /** One row of slots for a single studio */
  slots: TimeSlotData[];
  selectedHour: number | null;
  onSelectHour: (hour: number) => void;
}

function getCellStyle(
  status: TimeSlotData["status"],
  isSelected: boolean
): string {
  if (isSelected) {
    return "bg-warning-custom/25 border-warning-custom/70 text-warning-custom shadow-[0_0_10px_rgba(245,158,11,0.35)] scale-[1.04] cursor-pointer";
  }
  switch (status) {
    case "available":
      return "bg-success-custom/10 border-success-custom/35 text-success-custom hover:bg-success-custom/25 hover:border-success-custom/60 hover:scale-[1.04] cursor-pointer";
    case "booked":
      return "bg-error-custom/10 border-error-custom/30 text-error-custom/60 cursor-not-allowed opacity-70";
    case "unavailable":
    default:
      return "bg-surface border-border-custom text-text-secondary/40 cursor-not-allowed opacity-50";
  }
}

export default function TimetableGrid({
  slots,
  selectedHour,
  onSelectHour,
}: TimetableGridProps) {
  return (
    <div
      className="overflow-x-auto scrollbar-thin"
      style={{ scrollbarWidth: "thin" }}
      aria-label="Timetable — scroll horizontally on mobile"
    >
      <div className="min-w-max">
        {/* Hour header row */}
        <div className="flex gap-1 pb-1">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="w-[52px] shrink-0 text-center text-[10px] font-semibold text-text-secondary/60 tracking-wide"
            >
              {formatHour(hour)}
            </div>
          ))}
        </div>

        {/* Slot cells row */}
        <div className="flex gap-1">
          {slots.map((slot) => {
            const isSelected = selectedHour === slot.hour;
            const isSelectable = slot.status === "available";
            return (
              <button
                key={slot.hour}
                type="button"
                onClick={() => isSelectable && onSelectHour(slot.hour)}
                disabled={!isSelectable}
                aria-pressed={isSelected}
                aria-label={`${formatHour(slot.hour)} — ${slot.status}`}
                title={`${formatHour(slot.hour)}  ${slot.status}`}
                className={[
                  "w-[54px] sm:w-[52px] h-11 sm:h-9 shrink-0 rounded-lg border text-xs sm:text-[10px] font-bold",
                  "transition-all duration-150 focus:outline-none focus:ring-2 active:scale-95 touch-manipulation",
                  "focus:ring-accent focus:ring-offset-1 focus:ring-offset-background",
                  getCellStyle(slot.status, isSelected),
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {isSelected ? "✓" : slot.status === "booked" ? "×" : ""}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
