"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Section, { Container, SectionHeader } from "@/components/ui/Section";
import { FAQS } from "@/lib/data/mock";

function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof FAQS)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-white/8 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-bold text-[#F5F7FA] transition-colors duration-200 hover:text-[#6C63FF] focus:outline-none cursor-pointer"
      >
        <span>{faq.question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-[#6C63FF] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? contentRef.current?.scrollHeight + "px" : "0px",
          opacity: isOpen ? 1 : 0,
        }}
        aria-hidden={!isOpen}
      >
        <p className="pb-5 text-xs leading-relaxed text-[#A7B0C0]">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

const CATEGORIES = ["All", "Booking", "Facilities", "Equipment", "Cancellation", "Payment"];

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id);
  const [activeCategory, setActiveCategory] = useState("All");
  const sectionRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeCategory === "All"
      ? FAQS
      : FAQS.filter((f) => f.category === activeCategory);

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
    <Section id="faq">
      {/* IT FEST UB: Scattered star sparks */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span className="itfest-sparkle text-lg top-10 left-10" style={{ animationDelay: "0.4s" }}>✦</span>
        <span className="itfest-sparkle text-sm top-1/2 right-8" style={{ animationDelay: "1.6s" }}>✧</span>
        <span className="itfest-sparkle text-xl bottom-10 left-1/4" style={{ animationDelay: "2.3s" }}>✶</span>
      </div>
      <Container>
        <SectionHeader
          eyebrow="FAQ"
          title="Ada Pertanyaan? Kami Punya Jawabannya."
          description="Everything you need to know before booking your first session."
        />

        {/* Category chips */}
        <div className="mb-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter FAQ by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenId(null);
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-extrabold transition-all duration-300 backdrop-blur-md cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#6C63FF] text-[#050510] shadow-[0_4px_20px_rgba(108,99,255,0.35)]"
                  : "border border-white/10 bg-white/5 text-[#A7B0C0] hover:text-white hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div
          ref={sectionRef}
          className="mx-auto max-w-3xl glass-panel px-6 md:px-10"
        >
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#A7B0C0]">
              Belum ada pertanyaan di kategori ini.
            </p>
          ) : (
            filtered.map((faq) => (
              <FAQItem
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() =>
                  setOpenId(openId === faq.id ? null : faq.id)
                }
              />
            ))
          )}
        </div>
      </Container>
    </Section>
  );
}
