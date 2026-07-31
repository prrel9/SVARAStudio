interface BadgeProps {
  label: string;
  variant?: "accent" | "success" | "warning" | "info" | "neutral";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({
  label,
  variant = "neutral",
  size = "sm",
  className = "",
}: BadgeProps) {
  const variants = {
    accent: "bg-[#6C63FF]/15 text-[#6C63FF] border border-[#6C63FF]/30",
    success: "bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30",
    warning: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    info: "bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/30",
    neutral: "bg-white/6 text-[#A7B0C0] border border-white/10",
  };

  const sizes = {
    sm: "text-[10px] px-2.5 py-0.5",
    md: "text-xs px-3 py-1",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold tracking-wider uppercase ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {label}
    </span>
  );
}
