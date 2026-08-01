"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Calendar, Sparkles } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeroReady, setIsHeroReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setIsHeroReady(true);
      return;
    }

    if (sessionStorage.getItem("svara-house-intro-complete") === "true") {
      setIsHeroReady(true);
      return;
    }

    const reveal = () => setIsHeroReady(true);
    window.addEventListener("home-hero-navbar-reveal", reveal);
    return () => window.removeEventListener("home-hero-navbar-reveal", reveal);
  }, [pathname]);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Studio", href: "/studios" },
    { name: "Jadwal", href: "/schedule" },
    { name: "Tentang", href: "/about" },
    { name: "Kontak", href: "/contact" },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 lg:px-8 transition-all duration-500 ${
        isHeroReady ? "pointer-events-auto" : "pointer-events-none"
      }`}
      initial={{ opacity: 0, y: -12 }}
      animate={isHeroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={`mx-auto w-full rounded-full border transition-all duration-500 ease-out ${
          isScrolled
            ? "mt-3 max-w-4xl border-white/18 bg-[#0b1020]/72 px-4 py-2 shadow-[0_14px_45px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:px-5"
            : "mt-4 max-w-7xl border-white/14 bg-[#0b1020]/38 px-5 py-3 shadow-[0_10px_36px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:mt-6 sm:px-7"
        }`}
      >
        <nav className="flex items-center justify-between">
          {/* Logo — IT FEST Style: Bold white brand name */}
          <Link
            href="/"
            className="group flex items-center focus:outline-none"
            aria-label="SVARA STUDIO Home"
          >
            <span className="font-extrabold text-white tracking-widest text-sm sm:text-base uppercase">
              SVARA<span className="text-[#6C63FF]"> STUDIO</span>
            </span>
          </Link>

          {/* Desktop Navigation — IT FEST pill style */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-1.5 text-xs font-bold transition-all duration-200 rounded-full uppercase tracking-wide ${
                    isActive
                      ? "bg-[rgba(108,99,255,0.15)] text-[#6C63FF] border border-[rgba(108,99,255,0.35)] shadow-[0_0_12px_rgba(108,99,255,0.2)]"
                      : "text-[#A7B0C0] hover:text-white hover:bg-[rgba(255,255,255,0.07)]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA — IT FEST "Masuk" button style: white filled pill */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/schedule"
              className="inline-flex items-center justify-center space-x-2 rounded-full bg-white hover:bg-white/90 px-5 py-2 text-xs font-extrabold text-[#050510] transition-all shadow-[0_4px_20px_rgba(255,255,255,0.15)] active:scale-[0.98] uppercase tracking-wide"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Pesan Studio</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] text-[#A7B0C0] hover:text-white md:hidden transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Buka/tutup menu utama"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Menu Drawer — IT FEST style */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-4 top-[76px] z-40 rounded-[28px] border border-[rgba(255,255,255,0.12)] bg-[#0d1122]/95 backdrop-blur-2xl p-6 transition-all duration-300 md:hidden shadow-[0_16px_48px_rgba(0,0,0,0.7)] ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex flex-col space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold transition-all rounded-2xl py-3 px-4 flex items-center justify-between uppercase tracking-wide ${
                  isActive
                    ? "bg-[#6C63FF]/15 text-[#6C63FF] border border-[#6C63FF]/30"
                    : "text-[#A7B0C0] hover:text-white hover:bg-[rgba(255,255,255,0.06)]"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>{link.name}</span>
                {isActive && <Sparkles className="h-4 w-4 text-[#6C63FF]" />}
              </Link>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.10)]">
          <Link
            href="/schedule"
            className="flex items-center justify-center space-x-2 rounded-full bg-white py-3.5 text-sm font-extrabold text-[#050510] transition-transform active:scale-[0.98] shadow-lg uppercase tracking-wide"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Calendar className="h-4 w-4" />
            <span>Pesan Studio</span>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
