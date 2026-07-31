import { Wifi, Wind, Lock, Video, Volume2, ShieldCheck, Coffee } from "lucide-react";
import type { Studio } from "@/lib/types";

interface StudioFacilitiesProps {
  studio: Studio;
}

const ALL_FACILITIES = [
  { name: "Air Conditioning", icon: Wind, desc: "Silent split AC unit to maintain a comfortable temperature" },
  { name: "WiFi", icon: Wifi, desc: "High-speed wireless internet connection for streaming and tabs" },
  { name: "Locker Storage", icon: Lock, desc: "Secure keylock lockers to store instrument bags and cases" },
  { name: "Monitor Mix", icon: Volume2, desc: "Dedicated stage monitor wedges for vocal/instrument amplification" },
  { name: "Live Recording", icon: Video, desc: "Direct multi-track output options (bring your flashdrive / laptop)" },
  { name: "Isolation Booth", icon: ShieldCheck, desc: "Acoustically isolated vocal/instrument tracking booth" },
  { name: "Stage Lighting", icon: ShieldCheck, desc: "Configurable color ambiance stage lighting for live rehearsals" },
  { name: "Premium Console", icon: ShieldCheck, desc: "Midas or Behringer digital console for high-fidelity mixing" },
  { name: "Artist Lounge", icon: Coffee, desc: "Comfortable seating lounge with free hot drinks & mineral water" },
  { name: "Projector", icon: ShieldCheck, desc: "Full HD presentation projection screen for alignment" },
];

export default function StudioFacilities({ studio }: StudioFacilitiesProps) {
  // Filter facilities based on the studio's configured features list
  const activeFacilities = ALL_FACILITIES.filter((fac) => 
    studio.features.includes(fac.name) || 
    // Fallback default facilities for all rooms
    ["Air Conditioning", "WiFi"].includes(fac.name)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-border-custom pb-3">
        <ShieldCheck className="h-4.5 w-4.5 text-accent" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
          Facilities & Amenities
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {activeFacilities.map((fac, i) => {
          const Icon = fac.icon;
          return (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border border-border-custom bg-surface p-4 transition-smooth hover:border-accent/10"
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Icon className="h-4 w-4" />
              </div>
              
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-white leading-tight">
                  {fac.name}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {fac.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
