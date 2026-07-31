"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const INTRO_COMPLETE_KEY = "svara-house-intro-complete";
const SPLASH_DURATION = 2600;

export default function IntroSplash() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(INTRO_COMPLETE_KEY) === "true") {
      window.dispatchEvent(new Event("home-hero-navbar-reveal"));
      return;
    }

    setIsVisible(true);
    const timeoutId = window.setTimeout(() => setIsVisible(false), SPLASH_DURATION);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(timeoutId);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const completeIntro = () => {
    sessionStorage.setItem(INTRO_COMPLETE_KEY, "true");
    document.body.style.overflow = "";
    window.dispatchEvent(new Event("home-hero-navbar-reveal"));
  };

  return (
    <AnimatePresence onExitComplete={completeIntro}>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] isolate overflow-hidden bg-[#05060f]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Svara House introduction"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(108,99,255,0.24),transparent_17%),radial-gradient(circle_at_15%_80%,rgba(0,212,255,0.12),transparent_25%),linear-gradient(135deg,#04050c_0%,#111027_52%,#050711_100%)]" />
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(196,181,253,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(196,181,253,0.10)_1px,transparent_1px)] [background-size:54px_54px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_74%)]" />

          <motion.div
            className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#A78BFA]/20"
            initial={{ opacity: 0, scale: 0.55 }}
            animate={{ opacity: [0, 0.85, 0.28], scale: [0.55, 1.05, 1.34] }}
            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00D4FF]/25"
            initial={{ opacity: 0, rotate: -70, scale: 0.6 }}
            animate={{ opacity: [0, 0.7, 0.15], rotate: 70, scale: [0.6, 1.15, 1.45] }}
            transition={{ duration: 2.35, ease: "easeOut" }}
          />

          <div className="absolute left-6 top-6 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.28em] text-[#C4B5FD]/70 sm:left-10 sm:top-9">
            <span className="h-2 w-2 rounded-full bg-[#00D4FF] shadow-[0_0_18px_#00D4FF]" />
            Audio / Visual Experience
          </div>
          <div className="absolute right-6 top-6 font-mono text-[10px] tracking-[0.18em] text-white/35 sm:right-10 sm:top-9">EST. 2025</div>

          <motion.div
            className="absolute left-1/2 top-1/2 flex w-full max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col items-center px-6 text-center"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
          >
            <motion.div
              className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] shadow-[0_0_80px_rgba(108,99,255,0.45)] backdrop-blur-md"
              variants={{ hidden: { opacity: 0, scale: 0.4 }, visible: { opacity: 1, scale: 1 } }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex h-10 items-center gap-1">
                {[16, 29, 40, 24, 34, 18, 31].map((height, index) => (
                  <motion.span
                    key={height}
                    className="w-1 rounded-full bg-gradient-to-t from-[#6C63FF] to-[#00D4FF]"
                    style={{ height }}
                    animate={{ scaleY: [0.45, 1, 0.58, 0.9, 0.45] }}
                    transition={{ duration: 0.75 + index * 0.08, repeat: Infinity, ease: "easeInOut" }}
                  />
                ))}
              </div>
            </motion.div>

            <motion.p
              className="mb-3 text-[10px] font-bold uppercase tracking-[0.52em] text-[#C4B5FD] sm:text-xs"
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            >
              Tune into your sound
            </motion.p>
            <motion.h1
              className="text-4xl font-black tracking-[0.16em] text-white sm:text-6xl"
              variants={{ hidden: { opacity: 0, y: 18, filter: "blur(10px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)" } }}
              transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            >
              SVARA<span className="text-[#8B7BFF]">.</span>
            </motion.h1>
            <motion.div
              className="mt-5 h-px w-32 bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent"
              variants={{ hidden: { scaleX: 0, opacity: 0 }, visible: { scaleX: 1, opacity: 1 } }}
              transition={{ duration: 0.65 }}
            />
          </motion.div>

          <motion.div
            className="absolute inset-x-6 bottom-9 mx-auto max-w-xs sm:bottom-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 0.5 }}
          >
            <div className="mb-2 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.2em] text-white/45">
              <span>Loading studio</span>
              <span>01 / 01</span>
            </div>
            <div className="h-px overflow-hidden bg-white/15">
              <motion.div
                className="h-full bg-gradient-to-r from-[#6C63FF] via-[#C4B5FD] to-[#00D4FF] shadow-[0_0_12px_#00D4FF]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.35, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
