import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "gold" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30";

    const variants = {
      primary:
        "bg-primary-600 text-white hover:bg-primary-700 shadow-brand-sm hover:shadow-brand",
      secondary:
        "bg-white text-ink border border-line hover:border-primary-300 hover:text-primary-700 shadow-soft",
      outline:
        "bg-transparent text-primary-700 border border-primary-200 hover:bg-primary-50",
      ghost:
        "text-ink-muted hover:text-primary-700 hover:bg-primary-50",
      danger:
        "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100",
      gold:
        "bg-gradient-accent text-white hover:brightness-[1.05] shadow-accent",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
