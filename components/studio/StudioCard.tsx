import Image from "next/image";
import Link from "next/link";
import { Users, Ruler, Zap, ArrowRight, Sparkles } from "lucide-react";
import Badge from "@/components/ui/Badge";
import type { Studio } from "@/lib/types";
import { getValidImageSrc } from "@/lib/utils/image";

interface StudioCardProps {
  studio: Studio;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function getEquipmentBadgeVariant(
  level: Studio["equipmentLevel"]
): "neutral" | "accent" | "success" | "warning" | "info" {
  switch (level) {
    case "VIP":
      return "accent";
    case "Premium":
      return "warning";
    case "Professional":
      return "info";
    case "Standard":
      return "success";
    default:
      return "neutral";
  }
}

export default function StudioCard({ studio }: StudioCardProps) {
  return (
    <article className="glass-card glass-panel-accent-left group flex flex-col overflow-hidden relative">
      {/* Subtle Spatial Glow */}
      <div className="pointer-events-none absolute -inset-0.5 rounded-[28px] bg-gradient-to-tr from-[#6C63FF]/20 via-transparent to-[#00D4FF]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Studio Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-black/40">
        <Image
          src={getValidImageSrc(studio.thumbnail)}
          alt={`${studio.name} rehearsal room`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-108"
          loading="lazy"
        />
        {/* Spatial Glass Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent" />

        {/* Studio badge */}
        {studio.badge && (
          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 backdrop-blur-md px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#6C63FF] shadow-md">
              <Sparkles className="h-3 w-3" />
              {studio.badge}
            </span>
          </div>
        )}

        {/* Availability indicator */}
        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 backdrop-blur-md px-3 py-1">
          <span
            className={`h-2 w-2 rounded-full ${studio.isAvailable ? "bg-[#10B981] shadow-[0_0_8px_#10B981]" : "bg-[#EF4444]"}`}
            aria-hidden="true"
          />
          <span className="text-xs font-semibold text-[#F5F7FA]">
            {studio.isAvailable ? "Available" : "Booked"}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col gap-4 p-6 relative z-10">
        {/* Name & equipment level */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-extrabold text-[#F5F7FA] leading-tight group-hover:text-[#6C63FF] transition-colors">
            {studio.name}
          </h3>
          <Badge
            label={studio.equipmentLevel}
            variant={getEquipmentBadgeVariant(studio.equipmentLevel)}
            className="shrink-0"
          />
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed text-[#A7B0C0] line-clamp-2">
          {studio.shortDescription}
        </p>

        {/* Specs */}
        <div className="flex flex-wrap gap-4 border-t border-white/10 pt-4">
          <div className="flex items-center gap-1.5 text-xs text-[#A7B0C0]">
            <Users className="h-3.5 w-3.5 text-[#6C63FF]" aria-hidden="true" />
            <span>Up to {studio.capacity} pax</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#A7B0C0]">
            <Ruler className="h-3.5 w-3.5 text-[#5EA0FF]" aria-hidden="true" />
            <span>{studio.roomSize}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#A7B0C0]">
            <Zap className="h-3.5 w-3.5 text-[#6C63FF]" aria-hidden="true" />
            <span>AC Included</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <div>
            <p className="text-[11px] text-[#A7B0C0]">Starting from</p>
            <p className="text-lg font-extrabold text-[#F5F7FA]">
              {formatPrice(studio.pricePerHour)}
              <span className="text-xs font-normal text-[#A7B0C0]"> / hr</span>
            </p>
          </div>

          <Link
            href={`/studios/${studio.slug}`}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#6C63FF]/40 bg-[#6C63FF]/10 px-4 py-2 text-xs font-extrabold text-[#6C63FF] hover:bg-[#6C63FF] hover:text-[#050510] transition-all duration-300 shadow-[0_4px_16px_rgba(108,99,255,0.15)]"
          >
            <span>View Detail</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
