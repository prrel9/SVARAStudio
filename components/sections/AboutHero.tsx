"use client";

import { motion } from "framer-motion";
import { Music2, Sparkles } from "lucide-react";

interface AboutHeroProps {
  companyName: string;
  logoUrl: string;
}

export default function AboutHero({ companyName, logoUrl }: AboutHeroProps) {
  return (
    <section className="relative isolate overflow-hidden px-6 pb-20 pt-36 sm:px-8 sm:pb-28 sm:pt-44">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_42%,rgba(108,99,255,0.24),transparent_26%),radial-gradient(circle_at_20%_78%,rgba(0,212,255,0.10),transparent_24%),linear-gradient(145deg,#070914_0%,#0d1022_54%,#070914_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-35 [background-image:linear-gradient(rgba(196,181,253,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(196,181,253,0.08)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <motion.div
        className="pointer-events-none absolute right-[8%] top-24 h-72 w-72 rounded-full bg-[#6C63FF]/20 blur-[100px]"
        animate={{ x: [0, 30, -10, 0], y: [0, -20, 15, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_0.92fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -26 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#6C63FF]/35 bg-[#6C63FF]/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C4B5FD]">
            <Sparkles className="h-3.5 w-3.5" />
            Tentang {companyName}
          </div>
          <h1 className="max-w-2xl text-4xl font-black leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Ruang tempat suara Anda <span className="text-[#8B7BFF]">menjadi hidup.</span>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-[#A7B0C0] sm:text-base">
            {companyName} adalah rumah kreatif bagi musisi untuk berlatih, bereksplorasi, dan tampil maksimal. Kami memadukan ruang berakustik nyaman, peralatan andal, serta proses pemesanan yang sederhana.
          </p>
          <div className="mt-9 grid max-w-lg grid-cols-3 gap-3 border-t border-white/10 pt-6">
            {["Ruang berakustik", "Peralatan siap pakai", "Booking praktis"].map((item, index) => (
              <div key={item} className="flex flex-col gap-2 text-xs text-[#A7B0C0]">
                <span className="font-mono text-[#00D4FF]">0{index + 1}</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="relative mx-auto w-full max-w-md [perspective:1200px]"
          initial={{ opacity: 0, scale: 0.88, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="absolute inset-[12%] rounded-full bg-[#6C63FF]/30 blur-[70px]"
            animate={{ scale: [0.85, 1.18, 0.9], opacity: [0.35, 0.8, 0.35] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="relative aspect-square rounded-[2.5rem] border border-white/15 bg-gradient-to-br from-white/[0.10] via-white/[0.03] to-[#6C63FF]/10 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-sm"
            animate={{ y: [-10, 10, -10], rotateZ: [-1, 1, -1] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              className="flex h-full w-full items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[#090b16] shadow-inner [transform-style:preserve-3d]"
              animate={{ rotateX: [2, -3, 2] }}
              transition={{
                rotateX: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`Logo ${companyName}`}
                  className="h-full w-full object-contain p-7 drop-shadow-[0_0_32px_rgba(64,120,255,0.45)]"
                />
              ) : (
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] border border-[#6C63FF]/45 bg-[#6C63FF]/15 text-[#8B7BFF] shadow-[0_0_50px_rgba(108,99,255,0.35)]">
                    <Music2 className="h-14 w-14" />
                  </div>
                  <span className="text-xl font-black tracking-[0.2em] text-white">SVARA</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
