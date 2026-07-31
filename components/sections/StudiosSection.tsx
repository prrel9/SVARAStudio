"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Section, { Container, SectionHeader } from "@/components/ui/Section";
import StudioCard from "@/components/studio/StudioCard";
import { Studio } from "@/lib/types";

interface StudiosSectionProps {
  studios: Studio[];
}

export default function StudiosSection({ studios }: StudiosSectionProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function runAnimation() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!gridRef.current) return;
      const cards = gridRef.current.querySelectorAll("article");

      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 50 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    runAnimation();
  }, []);

  return (
    <Section id="studios">
      <Container>
        <SectionHeader
          eyebrow="Our Studios"
          title="Find Your Perfect Creative Space."
          description="Choose the rehearsal room that fits your band, your budget, and your sound. Six unique studios, each with its own personality."
        />

        <div
          ref={gridRef}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {studios.map((studio) => (
            <StudioCard key={studio.id} studio={studio} />
          ))}
        </div>

        {/* CTA to view all */}
        <div className="mt-14 flex justify-center">
          <Link
            href="/studios"
            className="inline-flex items-center gap-2 glass-button-secondary px-6 py-3 text-sm"
          >
            View All Studios
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
