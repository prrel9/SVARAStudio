import Link from "next/link";
import { Calendar, Ticket } from "lucide-react";
import Button from "@/components/ui/Button";
import type { Studio } from "@/lib/types";

interface StudioPricingProps {
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

export default function StudioPricing({ studio }: StudioPricingProps) {
  return (
    <div className="rounded-2xl border border-border-custom bg-surface p-6 shadow-xl space-y-6">
      
      {/* Starting from pricing label */}
      <div className="space-y-1">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Booking Rate
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold text-white">
            {formatPrice(studio.pricePerHour)}
          </span>
          <span className="text-sm text-text-secondary">/ hour</span>
        </div>
        <p className="text-xs text-text-secondary">
          No registration fees. No hidden equipment rental charges.
        </p>
      </div>

      {/* Booking Rules specs checklist */}
      <div className="border-t border-border-custom pt-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Minimum Rehearsal</span>
          <span className="font-bold text-white">1 Hour</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Cancellation Limit</span>
          <span className="font-bold text-white">2 Hours prior</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Availability</span>
          <span className={`font-bold ${studio.isAvailable ? "text-success-custom" : "text-error-custom"}`}>
            {studio.isAvailable ? "Open for bookings" : "Fully Booked Today"}
          </span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-3">
        {/* Navigates to the schedule page route */}
        <Link href="/schedule" className="block w-full">
          <Button variant="primary" className="w-full flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4" />
            Check Availability
          </Button>
        </Link>
        
        {/* Book Now (Disabled / Coming Soon) */}
        <div className="relative">
          <Button
            variant="secondary"
            className="w-full"
            disabled
          >
            Book Now
          </Button>
          <span className="absolute -top-2.5 -right-1.5 inline-flex items-center rounded-full bg-accent/15 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-accent border border-accent/20 backdrop-blur-sm pointer-events-none">
            Coming Soon
          </span>
        </div>
      </div>

      {/* Membership discount card teaser */}
      <div className="rounded-xl bg-bg-secondary border border-border-custom p-4 flex items-start gap-3">
        <Ticket className="h-5 w-5 text-accent shrink-0 mt-0.5" />
        <div>
          <h5 className="text-xs font-bold text-white">
            Membership Packages Teaser
          </h5>
          <p className="text-[10px] text-text-secondary mt-1 leading-relaxed">
            Get up to 20% discount on block-booking rates, priority room reserve slots, and early stage preview access.
          </p>
        </div>
      </div>
    </div>
  );
}
