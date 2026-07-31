"use client";

import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";

interface StudioGalleryProps {
  studioId: string;
  studioName: string;
}

// Map of high-quality rehearsal/music images for each studio ID to construct dynamic galleries
const GALLERY_IMGS: Record<string, string[]> = {
  "1": [ // Studio Echo
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80",
  ],
  "2": [ // Studio Pulse
    "https://images.unsplash.com/photo-1621784562807-cb6a34ca7342?w=600&q=80",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80",
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=80",
  ],
  "3": [ // Studio Nova
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80",
    "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&q=80",
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=80",
  ],
  "4": [ // Studio Resonance
    "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&q=80",
    "https://images.unsplash.com/photo-1598488035149-1808b8b8b8b8?w=600&q=80",
    "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&q=80",
  ],
  "5": [ // Studio Horizon
    "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=600&q=80",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
  ],
  "6": [ // Studio Legacy
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80",
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80",
  ],
};

export default function StudioGallery({ studioId, studioName }: StudioGalleryProps) {
  const images = GALLERY_IMGS[studioId] || GALLERY_IMGS["1"];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-border-custom pb-3">
        <ImageIcon className="h-4.5 w-4.5 text-accent" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
          Studio Gallery
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {images.map((url, i) => (
          <div
            key={i}
            className="relative h-48 rounded-xl overflow-hidden border border-border-custom bg-surface group"
          >
            <Image
              src={url}
              alt={`${studioName} gallery image ${i + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              loading="lazy"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
              <span className="text-xs font-semibold text-white tracking-wide uppercase">
                Expand View
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
