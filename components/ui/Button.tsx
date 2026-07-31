import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-extrabold transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

    const variants = {
      primary:
        "glass-button",
      secondary:
        "glass-button-secondary",
      ghost:
        "bg-transparent text-[#A7B0C0] hover:text-white hover:bg-white/8 rounded-2xl active:scale-[0.98]",
      outline:
        "bg-transparent text-[#F5F7FA] border border-white/12 hover:border-[#6C63FF]/50 hover:text-[#6C63FF] rounded-2xl active:scale-[0.98]",
    };

    const sizes = {
      sm: "text-xs px-4 py-2 gap-1.5",
      md: "text-sm px-5 py-2.5 gap-2",
      lg: "text-sm px-7 py-3.5 gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
