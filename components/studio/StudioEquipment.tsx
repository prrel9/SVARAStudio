import { CheckCircle2, Speaker } from "lucide-react";
import type { Studio } from "@/lib/types";

interface StudioEquipmentProps {
  studio: Studio;
}

interface GearItem {
  category: string;
  name: string;
  brand: string;
  spec: string;
}

// Gear specifications by equipment level
const GEAR_SPECS: Record<Studio["equipmentLevel"], GearItem[]> = {
  Starter: [
    { category: "Drums", name: "Roadshow Series", brand: "Pearl", spec: "5-piece Poplar shell kit with Sabian Solar brass cymbals" },
    { category: "Guitar Amp", name: "Champion 40", brand: "Fender", spec: "40W solid-state combo amp with onboard effects" },
    { category: "Bass Amp", name: "Rumble 40", brand: "Fender", spec: "40W bass combo amp, compact and clean" },
    { category: "Vocal Mic", name: "PGA58", brand: "Shure", spec: "Cardioid dynamic vocal microphone with stand" },
    { category: "Mixer", name: "802-VLZ4", brand: "Mackie", spec: "8-channel ultra-compact analog mixer with high-headroom preamps" }
  ],
  Standard: [
    { category: "Drums", name: "Export Series", brand: "Pearl", spec: "5-piece Poplar/Mahogany shells with Sabian SBR cymbal set" },
    { category: "Guitar Amp", name: "MG100HGFX", brand: "Marshall", spec: "100W head with 4x12 angled cabinet and digital effects" },
    { category: "Bass Amp", name: "Rumble 100", brand: "Fender", spec: "100W 1x12 bass combo, lightweight and punchy" },
    { category: "Vocal Mic", name: "SM58", brand: "Shure", spec: "Industry standard dynamic vocal microphone with high-quality XLR line" },
    { category: "Keyboard", name: "MX49", brand: "Yamaha", spec: "49-key synthesizer keyboard with MOTIF sound engine" },
    { category: "Mixer", name: "1202-VLZ4", brand: "Mackie", spec: "12-channel analog mixer with custom reference routing" }
  ],
  Professional: [
    { category: "Drums", name: "Export Series", brand: "Pearl", spec: "5-piece Mahogany shell package with Zildjian Planet Z cymbal pack" },
    { category: "Guitar Amp", name: "DSL40CR", brand: "Marshall", spec: "40W valve combo amp with Celestion V-Type speaker" },
    { category: "Guitar Amp 2", name: "Katana-100 MkII", brand: "Boss", spec: "100W stage-ready combo with custom effect configurations" },
    { category: "Bass Amp", name: "Rumble 200", brand: "Fender", spec: "200W 1x15 bass combo with rich vintage voice options" },
    { category: "Vocal Mic", name: "SM58", brand: "Shure", spec: "Cardioid dynamic vocal microphones (3 included) on heavy-duty stands" },
    { category: "Keyboard", name: "MX88", brand: "Yamaha", spec: "88-key weighted action synthesizer with standard stand" },
    { category: "Mixer", name: "XR18", brand: "Behringer", spec: "18-channel digital mixer with iPad control support & digital FX racks" }
  ],
  Premium: [
    { category: "Drums", name: "Decade Maple", brand: "Pearl", spec: "6-piece 100% Maple shells with Sabian Xs20 B20 bronze cymbals" },
    { category: "Guitar Amp", name: "DSL100HR", brand: "Marshall", spec: "100W valve head with 1960A 4x12 cabinet for classic rock voice" },
    { category: "Guitar Amp 2", name: "Twin Reverb", brand: "Fender", spec: "85W all-tube classic combo, crystal clean sound" },
    { category: "Bass Amp", name: "Ampeg SVT-CL", brand: "Ampeg", spec: "300W all-tube bass head with SVT-410HLF cabinet" },
    { category: "Vocal Mic", name: "Beta 58A", brand: "Shure", spec: "Supercardioid dynamic vocal microphones (4 included) with low-noise lines" },
    { category: "Keyboard", name: "MODX8", brand: "Yamaha", spec: "88-key weighted keyboard synthesizer with touch panel control" },
    { category: "Mixer & P.A.", name: "X32 Producer", brand: "Behringer", spec: "32-channel digital console with active Turbosound P.A. monitors" }
  ],
  VIP: [
    { category: "Drums", name: "Masterworks Series", brand: "Pearl", spec: "6-piece custom hand-crafted Maple/Birch/Gum shells with Zildjian A-Custom cymbals" },
    { category: "Guitar Amp", name: "JCM800 2203", brand: "Marshall", spec: "100W all-tube head reissue with Marshall 1960AX 4x12 greenback cabinet" },
    { category: "Guitar Amp 2", name: "Twin Reverb '65 Reissue", brand: "Fender", spec: "85W vintage reissue all-tube combo, absolute benchmark clean tone" },
    { category: "Bass Amp", name: "SVT-Classic & 8x10 Cab", brand: "Ampeg", spec: "300W vintage tube warmth with SVT-810E cabinet" },
    { category: "Vocal Mic", name: "Beta 58A / SM58", brand: "Shure", spec: "Beta 58A (4 included) & SM57 instrument mics on premium K&M stands" },
    { category: "Keyboard", name: "Montage 8", brand: "Yamaha", spec: "88-key flagship synthesizer keyboard with balanced hammer action" },
    { category: "Digital Console", name: "Midas M32 Live", brand: "Midas", spec: "40-input digital recording console with active Electro-Voice stage monitors" },
    { category: "Studio Monitors", name: "HS8", brand: "Yamaha", spec: "8-inch active nearfield reference monitors for tracking verification" }
  ]
};

export default function StudioEquipment({ studio }: StudioEquipmentProps) {
  const gearList = GEAR_SPECS[studio.equipmentLevel] || GEAR_SPECS.Starter;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-border-custom pb-3">
        <Speaker className="h-4.5 w-4.5 text-accent" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
          Equipment & Instrument Specifications
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gearList.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-4 rounded-xl border border-border-custom bg-surface p-4 transition-smooth hover:border-accent/10"
          >
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            
            <div className="space-y-1">
              <span className="inline-block rounded-full bg-background px-2 py-0.5 text-[10px] font-semibold text-text-secondary">
                {item.category}
              </span>
              <h4 className="text-sm font-bold text-white leading-tight mt-1">
                {item.brand} {item.name}
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                {item.spec}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
