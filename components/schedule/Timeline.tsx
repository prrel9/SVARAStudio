"use client";

import { useEffect, useRef } from "react";
import TimeSlot from "./TimeSlot";
import type { TimeSlotData } from "@/lib/data/schedule";

interface TimelineProps {
  slots: TimeSlotData[];
  selectedHour: number | null;
  onSelectHour: (hour: number) => void;
}

export default function Timeline({
  slots,
  selectedHour,
  onSelectHour,
}: TimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Enable shift+scroll for horizontal scrolling on desktop
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.shiftKey) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="overflow-x-auto scrollbar-thin scrollbar-thumb-surface-elevated scrollbar-track-transparent"
      style={{ scrollbarWidth: "thin" }}
      aria-label="Hourly booking timeline — scroll horizontally to view all slots"
      role="group"
    >
      <div className="flex gap-2 pb-2 pt-1 px-1 min-w-max">
        {slots.map((slot) => (
          <TimeSlot
            key={slot.hour}
            hour={slot.hour}
            status={slot.status}
            isSelected={selectedHour === slot.hour}
            onSelect={onSelectHour}
          />
        ))}
      </div>
    </div>
  );
}
