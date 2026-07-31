"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Users, Ruler } from "lucide-react";
import Badge from "@/components/ui/Badge";
import type { Studio } from "@/lib/types";
import { getValidImageSrc } from "@/lib/utils/image";

interface StudioHeroProps {
  studio: Studio;
}

export default function StudioHero({ studio }: StudioHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function runAnimation() {
      const { gsap } = await import("gsap");
      if (!heroRef.current) return;

      gsap.fromTo(
        heroRef.current.querySelectorAll(".animate-hero-item"),
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
        }
      );
    }
    runAnimation();
  }, []);

  return (
    <div ref={heroRef} className="relative w-full overflow-hidden bg-background pt-24 pb-12">
      {/* Background gradient blur */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,rgba(255,140,66,0.08),rgba(0,0,0,0))]" />

      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="animate-hero-item inline-flex items-center gap-2 mb-8 text-sm font-semibold text-text-secondary transition-smooth hover:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background rounded px-1.5 py-1"
          aria-label="Back to landing page"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Studio Info Header */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-end">
          <div className="lg:col-span-2 space-y-4">
            <div className="animate-hero-item flex flex-wrap items-center gap-3">
              {studio.badge && (
                <Badge label={studio.badge} variant="accent" />
              )}
              <Badge label={`${studio.equipmentLevel} Tier`} variant="neutral" />
            </div>
            
            <h1 className="animate-hero-item text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {studio.name}
            </h1>
            
            <p className="animate-hero-item text-lg text-text-secondary max-w-3xl leading-relaxed">
              {studio.shortDescription}
            </p>
          </div>

          {/* Quick Specs Column */}
          <div className="animate-hero-item flex flex-wrap gap-4 lg:justify-end">
            <div className="flex items-center gap-2 rounded-xl border border-border-custom bg-surface px-4 py-3 text-sm text-text-secondary">
              <Users className="h-4 w-4 text-accent" />
              <span>Up to {studio.capacity} Musicians</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border-custom bg-surface px-4 py-3 text-sm text-text-secondary">
              <Ruler className="h-4 w-4 text-accent" />
              <span>{studio.roomSize} Size</span>
            </div>
          </div>
        </div>

        {/* Hero Banner Image */}
        <div className="animate-hero-item mt-10 relative h-[320px] sm:h-[450px] w-full overflow-hidden rounded-2xl border border-border-custom shadow-2xl">
          <Image
            src={getValidImageSrc(studio.thumbnail)}
            alt={`${studio.name} main cover`}
            fill
            priority
            sizes="100vw"
            className="object-cover transition-transform duration-700 hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        </div>
      </div>
    </div>
  );
}
