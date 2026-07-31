"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Receipt, ArrowRight, Timer } from "lucide-react";
import Button from "@/components/ui/Button";
import type { SelectedSlot } from "@/lib/data/schedule";
import { formatHour, formatIDR, calculatePrice } from "@/lib/data/schedule";
import { CLOSING_HOUR } from "@/lib/data/schedule";

interface BookingSummaryProps {
  selectedSlot: SelectedSlot | null;
  selectedDate: string;
  onContinue?: (duration: number) => void;
}

const DURATION_OPTIONS = [1, 2, 3, 4] as const;

export default function BookingSummary({
  selectedSlot,
  selectedDate,
  onContinue,
}: BookingSummaryProps) {
  const isSelected = selectedSlot !== null;
  const [duration, setDuration] = useState<number>(1);

  // Reset duration when slot changes
  useEffect(() => {
    setDuration(1);
  }, [selectedSlot?.studioId, selectedSlot?.hour]);

  // Format date for display
  const displayDate = new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Compute max selectable duration based on closing hour
  const maxDuration = isSelected
    ? Math.min(4, CLOSING_HOUR - selectedSlot!.hour)
    : 4;

  const endHour = isSelected ? selectedSlot!.hour + duration : null;
  const totalPrice = isSelected
    ? calculatePrice(selectedSlot!.pricePerHour, duration)
    : 0;

  return (
    <div className="glass-panel flex flex-col overflow-hidden shadow-2xl sm:sticky sm:top-48">
      {/* Header */}
      <div className="bg-white/4 p-5 border-b border-white/10">
        <h3 className="text-base font-extrabold text-[#F5F7FA] flex items-center gap-2">
          <Receipt className="h-5 w-5 text-[#6C63FF]" />
          Booking Summary
        </h3>
      </div>

      {/* Content */}
      <div className="p-5 space-y-6 flex-1">
        {!isSelected ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#A7B0C0]">
              <Calendar className="h-6 w-6" />
            </div>
            <p className="text-xs text-[#A7B0C0] max-w-[200px]">
              Select an available time slot from the schedule to continue.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Selected Details */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin className="h-4.5 w-4.5 text-[#A7B0C0] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-extrabold text-[#A7B0C0] uppercase tracking-wider">Studio</p>
                  <p className="text-sm font-extrabold text-[#F5F7FA]">{selectedSlot.studioName}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Calendar className="h-4.5 w-4.5 text-[#A7B0C0] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-extrabold text-[#A7B0C0] uppercase tracking-wider">Date</p>
                  <p className="text-sm font-extrabold text-[#F5F7FA]">{displayDate}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="h-4.5 w-4.5 text-[#A7B0C0] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-extrabold text-[#A7B0C0] uppercase tracking-wider">Time</p>
                  <p className="text-sm font-extrabold text-[#F5F7FA]">
                    {formatHour(selectedSlot.hour)} &ndash; {endHour !== null ? formatHour(endHour) : "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Duration Picker */}
            <div className="rounded-2xl border border-white/10 bg-white/4 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-[#6C63FF]" />
                <p className="text-[10px] font-extrabold text-[#A7B0C0] uppercase tracking-wider">Duration</p>
              </div>
              <div className="flex gap-2">
                {DURATION_OPTIONS.map((d) => {
                  const disabled = d > maxDuration;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => !disabled && setDuration(d)}
                      disabled={disabled}
                      aria-pressed={duration === d}
                      className={[
                        "flex-1 rounded-xl border py-2 text-xs font-extrabold transition-all duration-200",
                        duration === d
                          ? "border-[#6C63FF] bg-[#6C63FF]/20 text-[#6C63FF] shadow-[0_0_12px_rgba(108,99,255,0.2)]"
                          : disabled
                          ? "border-white/5 bg-white/2 text-[#A7B0C0]/30 cursor-not-allowed opacity-40"
                          : "border-white/10 bg-white/5 text-[#A7B0C0] hover:border-[#6C63FF]/40 hover:text-white cursor-pointer",
                      ].join(" ")}
                    >
                      {d}h
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#A7B0C0]">
                  {formatIDR(selectedSlot.pricePerHour)} &times; {duration}h
                </span>
                <span className="text-lg font-extrabold text-[#F5F7FA]">
                  {formatIDR(totalPrice)}
                </span>
              </div>
              <p className="text-[10px] text-[#A7B0C0]/60 text-right mt-1">Taxes included</p>
            </div>
          </div>
        )}
      </div>

      {/* Action */}
      <div className="p-5 bg-white/4 border-t border-white/10">
        <Button
          variant="primary"
          className="w-full flex items-center justify-center gap-2"
          disabled={!isSelected}
          onClick={() => isSelected && onContinue?.(duration)}
        >
          Continue Booking
          <ArrowRight className="h-4 w-4" />
        </Button>
        {!isSelected && (
          <p className="text-center text-[11px] text-[#A7B0C0]/60 mt-2">
            Select a slot to continue
          </p>
        )}
      </div>
    </div>
  );
}
