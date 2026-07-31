import type { Studio } from "@/lib/types";
import { Info, User, Expand } from "lucide-react";

interface StudioInfoProps {
  studio: Studio;
}

export default function StudioInfo({ studio }: StudioInfoProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-border-custom pb-3">
        <Info className="h-4.5 w-4.5 text-accent" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
          About the space
        </h2>
      </div>

      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-text-secondary">
          {studio.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="rounded-xl border border-border-custom bg-surface p-4 flex items-start gap-3">
          <User className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Capacity
            </h4>
            <p className="text-sm font-bold text-white mt-1">
              Up to {studio.capacity} musicians
            </p>
          </div>
        </div>
        
        <div className="rounded-xl border border-border-custom bg-surface p-4 flex items-start gap-3">
          <Expand className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Room Dimensions
            </h4>
            <p className="text-sm font-bold text-white mt-1">
              {studio.roomSize} floor size
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
