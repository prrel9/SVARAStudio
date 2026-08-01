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
          Tarif Pemesanan
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold text-white">
            {formatPrice(studio.pricePerHour)}
          </span>
          <span className="text-sm text-text-secondary">/ jam</span>
        </div>
        <p className="text-xs text-text-secondary">
          Tanpa biaya pendaftaran. Tanpa biaya sewa peralatan tersembunyi.
        </p>
      </div>

      {/* Booking Rules specs checklist */}
      <div className="border-t border-border-custom pt-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Minimal Latihan</span>
          <span className="font-bold text-white">1 Jam</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Batas Pembatalan</span>
          <span className="font-bold text-white">2 Jam sebelumnya</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Ketersediaan</span>
          <span className={`font-bold ${studio.isAvailable ? "text-success-custom" : "text-error-custom"}`}>
            {studio.isAvailable ? "Terbuka untuk pemesanan" : "Penuh untuk hari ini"}
          </span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-3">
        {/* Navigates to the schedule page route */}
        <Link href="/schedule" className="block w-full">
          <Button variant="primary" className="w-full flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4" />
            Cek Ketersediaan
          </Button>
        </Link>
        
        <Link href="/schedule" className="block w-full">
          <Button variant="secondary" className="w-full">
            Pesan Sekarang
          </Button>
        </Link>
      </div>

      {/* Membership discount card teaser */}
      <div className="rounded-xl bg-bg-secondary border border-border-custom p-4 flex items-start gap-3">
        <Ticket className="h-5 w-5 text-accent shrink-0 mt-0.5" />
        <div>
          <h5 className="text-xs font-bold text-white">
            Paket Keanggotaan
          </h5>
          <p className="text-[10px] text-text-secondary mt-1 leading-relaxed">
            Dapatkan diskon hingga 20% untuk pemesanan blok, prioritas reservasi ruangan, dan akses pratinjau lebih awal.
          </p>
        </div>
      </div>
    </div>
  );
}
