interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: "default" | "secondary";
}

export default function Section({
  children,
  className = "",
  id,
  background = "default",
}: SectionProps) {
  const backgrounds = {
    default: "bg-transparent",
    secondary: "bg-transparent",
  };

  return (
    <section
      id={id}
      className={`relative py-20 md:py-28 ${backgrounds[background]} ${className}`}
    >
      {children}
    </section>
  );
}

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto max-w-7xl px-6 md:px-8 ${className}`}>
      {children}
    </div>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto items-center" : "text-left items-start";

  return (
    <div className={`max-w-2xl mb-14 md:mb-20 flex flex-col ${alignClass} ${className}`}>
      {eyebrow && (
        <div className="mb-3 inline-flex items-center gap-2">
          <span className="h-[2px] w-8 bg-gradient-to-r from-[#6C63FF] to-[#00D4FF]" />
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#6C63FF]">
            {eyebrow}
          </p>
          {align === "center" && <span className="h-[2px] w-8 bg-gradient-to-r from-[#00D4FF] to-[#6C63FF]" />}
        </div>
      )}
      <h2 className="mb-4 text-3xl font-extrabold text-[#F5F7FA] md:text-4xl lg:text-5xl leading-tight tracking-tight uppercase">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-[#A7B0C0] leading-relaxed md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
