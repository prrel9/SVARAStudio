// Status color and label configuration — single source of truth for the legend
export const SLOT_STATUS_CONFIG = {
  available: {
    label: "Tersedia",
    bg: "bg-success-custom/15",
    border: "border-success-custom/40",
    text: "text-success-custom",
    dot: "bg-success-custom",
    hoverBg: "hover:bg-success-custom/25",
  },
  booked: {
    label: "Dipesan",
    bg: "bg-error-custom/15",
    border: "border-error-custom/40",
    text: "text-error-custom",
    dot: "bg-error-custom",
    hoverBg: "",
  },
  unavailable: {
    label: "Tidak tersedia",
    bg: "bg-surface",
    border: "border-border-custom",
    text: "text-text-secondary",
    dot: "bg-surface-elevated",
    hoverBg: "",
  },
  selected: {
    label: "Dipilih",
    bg: "bg-warning-custom/20",
    border: "border-warning-custom/60",
    text: "text-warning-custom",
    dot: "bg-warning-custom",
    hoverBg: "",
  },
} as const;

export default function ScheduleLegend() {
  const entries = Object.entries(SLOT_STATUS_CONFIG) as [
    keyof typeof SLOT_STATUS_CONFIG,
    (typeof SLOT_STATUS_CONFIG)[keyof typeof SLOT_STATUS_CONFIG]
  ][];

  return (
    <div
      className="flex flex-wrap items-center gap-3"
      role="note"
      aria-label="Schedule slot status legend"
    >
      <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider mr-1">
        Legend:
      </span>
      {entries.map(([key, config]) => (
        <div key={key} className="flex items-center gap-1.5">
          <span
            className={`h-2.5 w-2.5 rounded-full ${config.dot}`}
            aria-hidden="true"
          />
          <span className="text-xs text-text-secondary">{config.label}</span>
        </div>
      ))}
    </div>
  );
}
