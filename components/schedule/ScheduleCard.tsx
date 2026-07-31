"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Users, Ruler } from "lucide-react";
import Badge from "@/components/ui/Badge";
import TimetableGrid from "./TimetableGrid";
import type { Studio } from "@/lib/types";
import type { TimeSlotData } from "@/lib/data/schedule";
import { formatIDR } from "@/lib/data/schedule";
import { getValidImageSrc } from "@/lib/utils/image";

interface ScheduleCardProps {
  studio: Studio;
  slots: TimeSlotData[];
  selectedHour: number | null;
  onSelectHour: (hour: number) => void;
  hidden?: boolean;
}

function getEquipmentBadgeVariant(
  level: Studio["equipmentLevel"]
): "neutral" | "accent" | "success" | "warning" | "info" {
  switch (level) {
    case "VIP":       return "accent";
    case "Premium":   return "warning";
    case "Professional": return "info";
    case "Standard":  return "success";
    default:          return "neutral";
  }
}

export default function ScheduleCard({
  studio,
  slots,
  selectedHour,
  onSelectHour,
  hidden = false,
}: ScheduleCardProps) {
  if (hidden) return null;

  const availableCount = slots.filter((s) => s.status === "available").length;

  return (
    <article
      className="glass-panel overflow-hidden transition-all duration-300 hover:border-[#6C63FF]/25 hover:shadow-[0_8px_40px_rgba(108,99,255,0.08)]"
      aria-label={`Schedule card for ${studio.name}`}
    >
      {/* Top section — studio info + timeline side by side on desktop */}
      <div className="flex flex-col gap-0 sm:flex-row">
        {/* Studio Info Panel */}
        <div className="flex shrink-0 gap-4 p-5 sm:w-72 sm:flex-col sm:justify-between sm:border-r sm:border-white/10">
          {/* Image + Name row */}
          <div className="flex gap-3 sm:flex-col sm:gap-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/15 sm:h-28 sm:w-full">
              <Image
                src={getValidImageSrc(studio.thumbnail)}
                alt={studio.name}
                fill
                sizes="(max-width: 640px) 64px, 288px"
                className="object-cover"
                loading="lazy"
              />
            </div>

            <div className="flex flex-col justify-center gap-1.5 sm:gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  label={studio.equipmentLevel}
                  variant={getEquipmentBadgeVariant(studio.equipmentLevel)}
                  size="sm"
                />
                {studio.badge && (
                  <Badge label={studio.badge} variant="accent" size="sm" />
                )}
              </div>
              <h3 className="text-sm font-extrabold text-[#F5F7FA] leading-tight sm:text-base">
                {studio.name}
              </h3>
              <p className="text-xs text-[#A7B0C0] hidden sm:block leading-relaxed">
                {studio.shortDescription}
              </p>
            </div>
          </div>

          {/* Quick specs */}
          <div className="hidden sm:flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-xs text-[#A7B0C0]">
              <Users className="h-3.5 w-3.5 text-[#6C63FF]" />
              <span>Up to {studio.capacity} musicians</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#A7B0C0]">
              <Ruler className="h-3.5 w-3.5 text-[#5EA0FF]" />
              <span>{studio.roomSize}</span>
            </div>
            <div className="mt-1">
              <p className="text-xs text-[#A7B0C0]">Starting from</p>
              <p className="text-base font-extrabold text-[#F5F7FA]">
                {formatIDR(studio.pricePerHour)}
                <span className="text-xs font-normal text-[#A7B0C0]"> / hr</span>
              </p>
            </div>
          </div>

          {/* Mobile price + CTA */}
          <div className="flex flex-col items-end justify-center gap-1 sm:hidden">
            <p className="text-xs text-[#A7B0C0]">from</p>
            <p className="text-sm font-extrabold text-[#F5F7FA] whitespace-nowrap">
              {formatIDR(studio.pricePerHour)}
            </p>
          </div>
        </div>

        {/* Timeline Panel */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          {/* Availability summary + link */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#A7B0C0]">
              <span className="font-bold text-[#10B981]">{availableCount}</span> slots available today
            </p>
            <Link
              href={`/studios/${studio.slug}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#6C63FF] hover:underline"
              aria-label={`View ${studio.name} detail`}
            >
              Details <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Timetable Grid — horizontal scroll on mobile */}
          <TimetableGrid
            slots={slots}
            selectedHour={selectedHour}
            onSelectHour={onSelectHour}
          />

          {/* Scroll hint */}
          <p className="text-[10px] text-[#A7B0C0]/50">
            ← Scroll to see all hours (08:00 – 22:00)
          </p>
        </div>
      </div>
    </article>
  );
}
