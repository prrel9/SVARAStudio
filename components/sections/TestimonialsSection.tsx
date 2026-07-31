"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import Section, { Container, SectionHeader } from "@/components/ui/Section";
import { Testimonial } from "@/lib/types";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-[#6C63FF] text-[#6C63FF]" : "text-white/10"}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
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
    <Section id="testimonials">
      {/* IT FEST UB: Scattered star sparks */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span className="itfest-sparkle text-lg top-10 left-6" style={{ animationDelay: "0.7s" }}>✦</span>
        <span className="itfest-sparkle text-sm top-1/4 right-10" style={{ animationDelay: "1.8s" }}>✧</span>
        <span className="itfest-sparkle text-xl bottom-16 left-1/3" style={{ animationDelay: "1.1s" }}>✶</span>
        <span className="itfest-sparkle text-base bottom-10 right-1/4" style={{ animationDelay: "2.4s" }}>✦</span>
      </div>
      <Container>
        <SectionHeader
          eyebrow="Testimonials"
          title="Trusted by Musicians."
          description="Hundreds of bands and solo artists have made SVARA STUDIO their creative home. Here is what they say."
        />

        <div className="grid gap-6 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="glass-card glass-panel-accent-left p-7 flex flex-col justify-between relative overflow-hidden"
            >
              <Quote className="absolute top-4 right-4 h-12 w-12 text-white/5 pointer-events-none" />

              <div>
                <StarRating rating={t.rating} />
                <blockquote className="mt-4 text-xs leading-relaxed text-[#A7B0C0] relative z-10 italic">
                  &ldquo;{t.comment}&rdquo;
                </blockquote>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[#6C63FF]/30 shrink-0">
                  <Image
                    src={t.avatar}
                    alt={`Photo of ${t.name}`}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-extrabold text-[#F5F7FA] uppercase tracking-wide truncate">{t.name}</h3>
                  <p className="text-[10px] text-[#A7B0C0] truncate">{t.role}</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6C63FF] bg-[#6C63FF]/10 border border-[#6C63FF]/20 px-2 py-0.5 rounded-full shrink-0">
                  {t.studioUsed}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Overall stats */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            { value: "4.9/5", label: "Average Rating" },
            { value: "1,000+", label: "Sessions Completed" },
            { value: "95%", label: "Return Customers" },
          ].map((s) => (
            <div key={s.label} className="glass-panel p-4 text-center">
              <p className="text-2xl font-extrabold text-[#6C63FF]">{s.value}</p>
              <p className="mt-1 text-xs text-[#A7B0C0]">{s.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
