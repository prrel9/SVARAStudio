"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

const INTRO_COMPLETE_KEY = "svara-house-intro-complete";

export default function HeroSection() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(INTRO_COMPLETE_KEY) === "true") {
      setIsIntroComplete(true);
      return;
    }

    const revealHero = () => setIsIntroComplete(true);
    window.addEventListener("home-hero-navbar-reveal", revealHero);
    return () => window.removeEventListener("home-hero-navbar-reveal", revealHero);
  }, []);

  return (
    <section
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#080b14]"
      aria-label="SVARA STUDIO hero"
    >
      <motion.video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ opacity: 0, scale: 1.03 }}
        animate={isIntroComplete ? { opacity: 0.58, scale: 1 } : { opacity: 0, scale: 1.03 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <source src="/heroes.webm" type="video/webm" />
      </motion.video>

      {/* Softly carries the moving hero image into the page background. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-72 bg-gradient-to-b from-transparent via-[#070a16]/18 to-[#070a16] sm:h-96"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-56 left-1/2 z-[2] h-80 w-[150%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(108,99,255,0.11),rgba(108,99,255,0.03)_44%,transparent_78%)] blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-36 left-1/2 z-[2] h-44 w-[88%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.06),transparent_72%)] blur-[120px]"
        aria-hidden="true"
      />
      <motion.div
        className="pointer-events-none absolute left-[8%] top-[24%] h-40 w-40 rounded-full bg-[#6C63FF]/18 blur-[110px] sm:h-64 sm:w-64"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={isIntroComplete ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        aria-hidden="true"
      />
      <motion.div
        className="pointer-events-none absolute right-[12%] top-[38%] h-36 w-36 rounded-full bg-[#00D4FF]/12 blur-[110px] sm:h-56 sm:w-56"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={isIntroComplete ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
        transition={{ duration: 1.2, delay: 0.35 }}
        aria-hidden="true"
      />

      <motion.div
        className="absolute inset-x-0 top-[30%] z-10 px-6 text-center sm:top-[27%] md:px-10"
        initial={{ opacity: 0, y: 32 }}
        animate={isIntroComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          <div className="mb-4 inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#C4B5FD] [text-shadow:0_2px_16px_rgba(0,0,0,0.8)] sm:text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00D4FF] shadow-[0_0_12px_rgba(0,212,255,0.8)]" />
            Svara Studio · Jakarta
          </div>

          <h1 className="max-w-3xl overflow-visible text-2xl font-extrabold tracking-[-0.045em] text-white [text-shadow:0_5px_30px_rgba(0,0,0,0.75)] sm:text-4xl md:text-5xl lg:text-6xl">
            <span className="block leading-[1.1]">Ruang untuk musik</span>
            <span className="mt-2 block whitespace-nowrap leading-[1.1] text-white">
              yang tak terlupakan.
            </span>
          </h1>

          <p className="mt-4 max-w-lg text-xs leading-relaxed text-white/75 [text-shadow:0_2px_14px_rgba(0,0,0,0.85)] sm:text-sm">
            Dari latihan pertama sampai take terakhir, wujudkan sesi terbaikmu bersama SVARA STUDIO.
          </p>

          <div className="mt-6 flex flex-col items-center gap-2.5 sm:flex-row">
            <Link
              href="/schedule"
              className="inline-flex items-center gap-2 rounded-full bg-[#6C63FF] px-5 py-2.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-[0_10px_30px_rgba(108,99,255,0.42)] transition-all hover:-translate-y-0.5 hover:bg-[#8B83FF] hover:shadow-[0_14px_36px_rgba(108,99,255,0.55)]"
            >
              Pesan sesi sekarang <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/studios"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/25 px-5 py-2.5 text-[10px] font-extrabold uppercase tracking-wide text-white backdrop-blur-md transition-all hover:border-[#00D4FF]/60 hover:bg-white/10"
            >
              Lihat studio <MapPin className="h-4 w-4 text-[#00D4FF]" />
            </Link>
          </div>
        </div>
      </motion.div>

    </section>
  );
}
