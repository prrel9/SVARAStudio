import Link from "next/link";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    navigation: [
      { name: "Home", href: "/" },
      { name: "Studios", href: "/studios" },
      { name: "Schedule", href: "/schedule" },
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
    ],
    studios: [
      { name: "Studio Echo", href: "/studios/echo" },
      { name: "Studio Pulse", href: "/studios/pulse" },
      { name: "Studio Nova", href: "/studios/nova" },
      { name: "Studio Resonance", href: "/studios/resonance" },
      { name: "Studio Horizon", href: "/studios/horizon" },
      { name: "Studio Legacy", href: "/studios/legacy" },
    ],
  };

  return (
    <footer className="relative border-t border-white/10 bg-[#070913] text-[#A7B0C0] py-16 md:py-20 overflow-hidden">
      {/* Subtle ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-full max-w-7xl bg-[radial-gradient(circle_at_top,rgba(108,99,255,0.12),transparent_70%)] blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link
              href="/"
              className="flex items-center text-xl font-bold tracking-tight text-white focus:outline-none"
            >
              <span className="font-extrabold text-[#F5F7FA] tracking-wide text-lg">
                SVARA<span className="text-[#6C63FF]"> STUDIO</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed max-w-xs text-[#A7B0C0]">
              Professional music rehearsal spaces with premium equipment, acoustically treated rooms, and an effortless online booking experience.
            </p>
          </div>

          {/* Navigation Link Col */}
          <div className="space-y-4">
            <h3 className="text-[#F5F7FA] text-xs font-extrabold tracking-wider uppercase">Navigation</h3>
            <ul className="space-y-2.5">
              {links.navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-xs text-[#A7B0C0] hover:text-[#6C63FF] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Studios Link Col */}
          <div className="space-y-4">
            <h3 className="text-[#F5F7FA] text-xs font-extrabold tracking-wider uppercase">Our Studios</h3>
            <ul className="space-y-2.5">
              {links.studios.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-xs text-[#A7B0C0] hover:text-[#6C63FF] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-4">
            <h3 className="text-[#F5F7FA] text-xs font-extrabold tracking-wider uppercase">Contact & Visit</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-[#6C63FF] shrink-0 mt-0.5" />
                <span>Jl. Studio Musik No. 42, Jakarta Selatan</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-[#6C63FF] shrink-0" />
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  +62 812-3456-7890 (WhatsApp)
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-[#6C63FF] shrink-0" />
                <a
                  href="mailto:info@faulshousestudio.com"
                  className="hover:text-white transition-colors"
                >
                  info@faulshousestudio.com
                </a>
              </li>
              <li className="flex items-start space-x-3 pt-2">
                <Clock className="h-4 w-4 text-[#00D4FF] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="block font-medium text-[#F5F7FA]">Daily: 08:00 - 22:00</span>
                  <span className="block text-[11px] text-[#A7B0C0]">Closed on public holidays</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom details */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-[#A7B0C0] space-y-3 md:space-y-0">
          <p>&copy; {currentYear} SVARA STUDIO. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
