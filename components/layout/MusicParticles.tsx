import { Music2 } from "lucide-react";
import type { CSSProperties } from "react";

const NOTES = [
  { className: "left-[4%] top-[14%] hidden sm:block text-[#C4B5FD]", size: "h-5 w-5", delay: "0s", duration: "12s", opacity: "0.18" },
  { className: "left-[10%] top-[42%] text-[#8BE7FF]", size: "h-4 w-4", delay: "1.2s", duration: "10s", opacity: "0.14" },
  { className: "left-[16%] bottom-[20%] hidden md:block text-white/25", size: "h-6 w-6", delay: "2s", duration: "13s", opacity: "0.16" },
  { className: "left-[31%] top-[10%] hidden lg:block text-[#C4B5FD]", size: "h-4 w-4", delay: "0.8s", duration: "11s", opacity: "0.12" },
  { className: "left-[42%] bottom-[12%] text-[#8BE7FF]", size: "h-5 w-5", delay: "2.8s", duration: "14s", opacity: "0.15" },
  { className: "right-[8%] top-[16%] hidden sm:block text-[#C4B5FD]", size: "h-6 w-6", delay: "0.4s", duration: "12s", opacity: "0.2" },
  { className: "right-[14%] top-[46%] text-white/22", size: "h-4 w-4", delay: "1.6s", duration: "9s", opacity: "0.13" },
  { className: "right-[22%] bottom-[18%] hidden md:block text-[#8BE7FF]", size: "h-5 w-5", delay: "3.2s", duration: "13s", opacity: "0.16" },
  { className: "right-[36%] top-[8%] hidden lg:block text-white/20", size: "h-4 w-4", delay: "2.1s", duration: "15s", opacity: "0.11" },
  { className: "right-[44%] bottom-[8%] hidden xl:block text-[#C4B5FD]", size: "h-6 w-6", delay: "1.1s", duration: "16s", opacity: "0.12" },
];

export default function MusicParticles() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(108,99,255,0.06),transparent_30%),radial-gradient(circle_at_85%_18%,rgba(0,212,255,0.05),transparent_24%),radial-gradient(circle_at_15%_80%,rgba(108,99,255,0.04),transparent_26%)]" />

      {NOTES.map((note, index) => (
        <span
          key={`${note.className}-${index}`}
          className={`music-note-particle ${note.className}`}
          style={
            {
              "--duration": note.duration,
              "--delay": note.delay,
              opacity: note.opacity,
            } as CSSProperties
          }
        >
          <Music2 className={note.size} />
        </span>
      ))}
    </div>
  );
}
