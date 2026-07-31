"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const INTRO_COMPLETE_KEY = "svara-house-intro-complete";
const SPLASH_DURATION = 2200;

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
          className="fixed inset-0 z-[100] overflow-hidden bg-[#050505]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Svara House introduction"
        >
          <video autoPlay muted playsInline preload="auto" className="h-full w-full object-cover">
            <source src="/splashscreen.webm" type="video/webm" />
          </video>

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15),rgba(2,2,4,0.72))]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_45%_68%,rgba(108,99,255,0.28),transparent_32%)]" />

          <motion.div
            className="absolute inset-x-4 bottom-12 text-center sm:bottom-16"
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 1.45, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[#C4B5FD]/70 sm:text-xs">
              Welcome to
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-[0.22em] text-white sm:text-5xl">
              SVARA HOUSE
            </h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
