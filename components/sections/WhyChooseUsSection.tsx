"use client";

import { useEffect, useRef } from "react";
import { Mic2, Sofa, CalendarCheck } from "lucide-react";
import Section, { Container, SectionHeader } from "@/components/ui/Section";

const FEATURES = [
  {
    icon: Mic2,
    title: "Premium Equipment",
    description:
      "Every room is outfitted with professional-grade instruments — Pearl drums, Marshall amplifiers, Shure microphones — maintained to performance standard.",
    accentColor: "#6C63FF",
  },
  {
    icon: Sofa,
    title: "Comfortable Environment",
    description:
      "Acoustically treated walls, silent air conditioning, and a clean, organized layout ensure every session is distraction-free and enjoyable.",
    accentColor: "#5EA0FF",
  },
  {
    icon: CalendarCheck,
    title: "Effortless Booking",
    description:
      "Transparent live schedules, instant confirmation, and a clear pricing structure — no phone calls, no hidden fees, no friction.",
    accentColor: "#6C63FF",
  },
];

// IT FEST UB style: sparkle positions per feature card
const CARD_SPARKS = [
  [{ s: "✦", t: "8px", l: "12px", d: "0s" }, { s: "✧", t: "auto", b: "16px", r: "24px", d: "1.2s" }],
  [{ s: "✶", t: "12px", r: "16px", d: "0.5s" }, { s: "✦", t: "auto", b: "10px", l: "20px", d: "2s" }],
  [{ s: "✧", t: "10px", l: "16px", d: "1.5s" }, { s: "✶", t: "auto", b: "14px", r: "18px", d: "0.8s" }],
];

export default function WhyChooseUsSection() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    async function runAnimation() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            delay: i * 0.12,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }

    runAnimation();
  }, []);

  return (
    <Section
      background="default"
      id="why-choose-us"
      className="relative z-10 -mt-20 pt-32 md:-mt-24 md:pt-40"
    >
      {/* Continuation of the hero's sound-wave transition. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,rgba(108,99,255,0.08),rgba(108,99,255,0.03)_26%,transparent_72%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.05),transparent_68%)] blur-2xl"
        aria-hidden="true"
      />
      {/* IT FEST: scatter stars across section */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span className="itfest-sparkle text-base top-12 left-8" style={{ animationDelay: "0.3s" }}>✦</span>
        <span className="itfest-sparkle text-xl top-1/3 right-12" style={{ animationDelay: "1.5s" }}>✧</span>
        <span className="itfest-sparkle text-lg bottom-12 left-1/4" style={{ animationDelay: "0.9s" }}>✶</span>
        <span className="itfest-sparkle text-sm top-2/3 right-1/3" style={{ animationDelay: "2.1s" }}>✦</span>
      </div>

      <Container className="relative z-10">
        <SectionHeader
          eyebrow="Why Svara Studio"
          title="Everything You Need to Create."
          description="We built SVARA STUDIO around one principle — musicians deserve a space that respects their craft."
        />

        <div className="grid gap-6 sm:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                ref={(el) => { cardsRef.current[i] = el; }}
                className="glass-card glass-panel-accent-left p-8 space-y-4 group relative overflow-hidden"
              >
                {/* IT FEST: background glow blob */}
                <div
                  className="absolute top-0 right-0 h-32 w-32 rounded-full pointer-events-none blur-2xl opacity-40 group-hover:opacity-80 transition-opacity"
                  style={{ background: `radial-gradient(circle, ${feature.accentColor}33, transparent)` }}
                />

                {/* IT FEST: floating star sparks inside card */}
                {CARD_SPARKS[i]?.map((spark, si) => (
                  <span
                    key={si}
                    className="itfest-sparkle text-xs"
                    style={{
                      top: "t" in spark ? spark.t : "auto",
                      bottom: "b" in spark ? spark.b : "auto",
                      left: "l" in spark ? spark.l : "auto",
                      right: "r" in spark ? spark.r : "auto",
                      animationDelay: spark.d,
                      color: `${feature.accentColor}55`,
                    }}
                  >
                    {spark.s}
                  </span>
                ))}

                <div
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${feature.accentColor}18`,
                    border: `1px solid ${feature.accentColor}40`,
                    boxShadow: `0 0 16px ${feature.accentColor}25`,
                    color: feature.accentColor,
                  }}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-extrabold text-[#F5F7FA] uppercase tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed text-[#A7B0C0]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
