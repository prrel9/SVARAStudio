"use client";

import { Calendar, Filter, MapPin } from "lucide-react";
import { AVAILABLE_DATES } from "@/lib/data/schedule";
import { Studio } from "@/lib/types";

interface ScheduleFilterProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  selectedStudio: string; // "all" or studioId
  onSelectStudio: (studioId: string) => void;
  availabilityFilter: "all" | "available";
  onSelectAvailability: (filter: "all" | "available") => void;
  studios: Studio[];
}

export default function ScheduleFilter({
  selectedDate,
  onSelectDate,
  selectedStudio,
  onSelectStudio,
  availabilityFilter,
  onSelectAvailability,
  studios,
}: ScheduleFilterProps) {
  return (
    <div className="sticky top-20 z-40 mb-8 border-b border-border-custom bg-background/80 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 md:px-8 lg:flex-row lg:items-center lg:justify-between">
        
        {/* Date Selector (Horizontal Scroll on Mobile) */}
        <div className="flex items-center gap-3 w-full lg:w-auto overflow-hidden">
          <Calendar className="hidden h-5 w-5 text-text-secondary sm:block shrink-0" />
          <div className="flex overflow-x-auto pb-2 sm:pb-0 scrollbar-thin gap-2 w-full max-w-full">
            {AVAILABLE_DATES.map((date) => (
              <button
                key={date.value}
                onClick={() => onSelectDate(date.value)}
                className={`flex flex-col items-center justify-center rounded-xl border px-3.5 py-2 min-w-[76px] shrink-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background touch-manipulation ${
                  selectedDate === date.value
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border-custom bg-surface text-text-secondary hover:border-accent/40 hover:text-white"
                }`}
                aria-pressed={selectedDate === date.value}
              >
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                  {date.isToday ? "Today" : date.label.split(",")[0]}
                </span>
                <span className={`text-xs sm:text-sm font-bold ${selectedDate === date.value ? "text-white" : ""}`}>
                  {date.label.split(" ")[1]} {date.label.split(" ")[2]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Studio & Availability Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {/* Studio Selector */}
          <div className="relative flex items-center flex-1 sm:flex-none">
            <MapPin className="absolute left-3 h-4 w-4 text-text-secondary pointer-events-none" />
            <select
              value={selectedStudio}
              onChange={(e) => onSelectStudio(e.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-border-custom bg-surface pl-9 pr-8 text-sm font-medium text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              aria-label="Filter by studio"
            >
              <option value="all">Semua Studio</option>
              {studios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 flex items-center text-text-secondary">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="relative flex items-center flex-1 sm:flex-none">
            <Filter className="absolute left-3 h-4 w-4 text-text-secondary pointer-events-none" />
            <select
              value={availabilityFilter}
              onChange={(e) => onSelectAvailability(e.target.value as "all" | "available")}
              className="h-10 w-full appearance-none rounded-lg border border-border-custom bg-surface pl-9 pr-8 text-sm font-medium text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              aria-label="Filter by availability"
            >
              <option value="all">Semua Ketersediaan</option>
              <option value="available">Memiliki Slot Tersedia</option>
            </select>
            <div className="pointer-events-none absolute right-3 flex items-center text-text-secondary">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
