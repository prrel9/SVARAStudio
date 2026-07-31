"use client";

import { useEffect, useRef } from "react";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";
import Section, { Container, SectionHeader } from "@/components/ui/Section";
import Button from "@/components/ui/Button";

const CONTACT_ITEMS = [
  {
    icon: MapPin,
    label: "Address",
    value: "Jl. Studio Musik No. 42, Kebayoran Baru, Jakarta Selatan 12180",
    link: "https://maps.google.com",
    linkLabel: "Open in Maps",
  },
  {
    icon: Phone,
    label: "WhatsApp",
    value: "+62 812-3456-7890",
    link: "https://wa.me/6281234567890",
    linkLabel: "Chat on WhatsApp",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@faulshousestudio.com",
    link: "mailto:info@faulshousestudio.com",
    linkLabel: "Send Email",
  },
  {
    icon: Clock,
    label: "Operating Hours",
    value: "Daily 08:00 – 22:00 WIB",
    link: null,
    linkLabel: null,
  },
];

export default function ContactSection() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function runAnimation() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!contentRef.current) return;
      gsap.fromTo(
        contentRef.current,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }
    runAnimation();
  }, []);

  return (
    <Section id="contact">
      {/* IT FEST UB: Scattered star sparks */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span className="itfest-sparkle text-xl top-12 right-16" style={{ animationDelay: "0.9s" }}>✦</span>
        <span className="itfest-sparkle text-base top-1/3 left-6" style={{ animationDelay: "2.1s" }}>✧</span>
        <span className="itfest-sparkle text-lg bottom-14 right-1/4" style={{ animationDelay: "1.3s" }}>✶</span>
      </div>
      <Container>
        <SectionHeader
          eyebrow="Contact & Location"
          title="Come Visit Us."
          description="Our team is ready to help you find the right studio. Drop by or reach out anytime during operating hours."
        />

        <div ref={contentRef} className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Contact information */}
          <div className="space-y-4">
            {CONTACT_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="glass-card flex items-start gap-4 p-5"
                >
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#6C63FF]/10 border border-[#6C63FF]/25 text-[#6C63FF]">
                    <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="mb-0.5 text-[10px] font-extrabold uppercase tracking-widest text-[#A7B0C0]">
                      {item.label}
                    </p>
                    <p className="text-sm font-bold text-[#F5F7FA] break-words">
                      {item.value}
                    </p>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-[#6C63FF] hover:text-[#8B83FF] transition-colors"
                      >
                        {item.linkLabel}
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
                aria-label="Chat with us on WhatsApp"
              >
                <Button variant="primary" className="w-full">
                  Chat on WhatsApp
                </Button>
              </a>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
                aria-label="Get directions on Google Maps"
              >
                <Button variant="secondary" className="w-full">
                  Get Directions
                </Button>
              </a>
            </div>
          </div>

          {/* Map embed placeholder */}
          <div className="glass-panel overflow-hidden">
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-4 p-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/25">
                <MapPin className="h-8 w-8 text-[#6C63FF]" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <p className="font-extrabold text-[#F5F7FA]">SVARA STUDIO</p>
                <p className="text-xs text-[#A7B0C0]">
                  Jl. Studio Musik No. 42, Jakarta Selatan
                </p>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#6C63FF]/10 border border-[#6C63FF]/30 px-5 py-2.5 text-xs font-extrabold text-[#6C63FF] transition-all hover:bg-[#6C63FF] hover:text-[#050510]"
              >
                Open in Google Maps
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
              <p className="text-[10px] text-[#A7B0C0] italic">
                Interactive map embed available with Google Maps API key.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
