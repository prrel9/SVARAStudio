"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import Section, { Container, SectionHeader } from "@/components/ui/Section";
import { Equipment } from "@/lib/types";
import { getValidImageSrc } from "@/lib/utils/image";

const CATEGORIES = ["Semua", "Drums", "Mixer", "Microphone", "Amplifier"];

interface EquipmentSectionProps {
  equipments: Equipment[];
}

export default function EquipmentSection({ equipments }: EquipmentSectionProps) {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const sectionRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeCategory === "Semua"
      ? equipments
      : equipments.filter((e) => e.category === activeCategory);

  useEffect(() => {
    async function runAnimation() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      gsap.fromTo(
        sectionRef.current,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    runAnimation();
  }, []);

  return (
    <Section background="default" id="equipment">
      {/* IT FEST UB: Scattered star sparks */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span className="itfest-sparkle text-base top-16 right-12" style={{ animationDelay: "0.6s" }}>✦</span>
        <span className="itfest-sparkle text-xl top-1/3 left-8" style={{ animationDelay: "1.4s" }}>✧</span>
        <span className="itfest-sparkle text-sm bottom-20 right-1/3" style={{ animationDelay: "2.2s" }}>✶</span>
      </div>
      <Container>
        <SectionHeader
          eyebrow="Peralatan Kami"
          title="Perlengkapan Profesional di Setiap Sesi."
          description="We invest in trusted instruments so you can focus on the music. Every piece of equipment is maintained, tuned, and ready."
        />

        {/* Glass Category filter chips */}
        <div className="mb-10 flex flex-wrap justify-center gap-2.5" role="tablist" aria-label="Filter equipment by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-5 py-2 text-xs font-extrabold transition-all duration-300 backdrop-blur-md ${
                activeCategory === cat
                  ? "bg-[#6C63FF] text-[#050510] shadow-[0_4px_20px_rgba(108,99,255,0.35)]"
                  : "border border-white/10 bg-white/5 text-[#A7B0C0] hover:text-white hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Equipment grid */}
        <div ref={sectionRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="glass-card glass-panel-accent-left group overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-black/40">
                <Image
                  src={getValidImageSrc(item.image, "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80")}
                  alt={`${item.brand} ${item.model}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[11px] font-bold text-[#F5F7FA] backdrop-blur-md">
                  {item.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-1 flex-col justify-between space-y-3">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#6C63FF]">
                    {item.brand}
                  </p>
                  <h3 className="mt-0.5 text-base font-extrabold text-[#F5F7FA]">
                    {item.model}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#A7B0C0] line-clamp-2">
                    {item.shortDescription}
                  </p>
                </div>

                {/* Available in */}
                <div className="border-t border-white/10 pt-3 space-y-1.5 mt-auto">
                  <p className="text-[11px] font-bold text-[#A7B0C0]">Tersedia di:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.availableIn.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 rounded-full bg-white/6 border border-white/10 px-2.5 py-0.5 text-[11px] text-[#F5F7FA]"
                      >
                        <CheckCircle2 className="h-3 w-3 text-[#10B981]" aria-hidden="true" />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
