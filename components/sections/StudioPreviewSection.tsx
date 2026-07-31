import { AlertTriangle, Box, Move3d } from "lucide-react";
import Section, { Container } from "@/components/ui/Section";
import StudioPreviewCanvas from "./StudioPreviewCanvas";

export default function StudioPreviewSection() {
  return (
    <Section id="studio-preview" className="overflow-hidden">
      <Container>
        <div className="mb-8 flex items-end justify-between gap-5 sm:mb-10">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#6C63FF]">
              <Move3d className="h-4 w-4 text-[#00D4FF]" />
              Studio virtual experience
            </div>
            <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Jelajahi studio sebelum sesi dimulai.
            </h2>
          </div>
          <div className="hidden shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-[#C4B5FD] sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00D4FF] shadow-[0_0_10px_rgba(0,212,255,0.8)]" />
            3D Interaktif
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-white/12 bg-[#080914] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <div className="relative aspect-[4/3] w-full bg-[#080914] lg:aspect-[21/9]">
            <StudioPreviewCanvas />

            <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#080914]/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
              <Box className="h-3.5 w-3.5 text-[#6C63FF]" />
              Putar · Zoom · Jelajahi
            </div>
          </div>
        </div>

        <div
          className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-center text-xs font-semibold text-amber-100"
          role="alert"
        >
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
          <span>Gambar 3D ini hanya contoh preview.</span>
        </div>

        <p className="mt-4 text-center text-xs leading-relaxed text-[#A7B0C0]">
          Gunakan mouse atau sentuhan untuk memutar dan memperbesar tampilan studio 3D.
        </p>
      </Container>
    </Section>
  );
}
