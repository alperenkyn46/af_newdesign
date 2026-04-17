import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "gradient" | "muted";
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", hover = false, children, ...props }, ref) => {
    const variants = {
      default: "bg-white border border-line shadow-soft",
      glass: "bg-white border border-line shadow-soft",
      muted: "bg-surface-muted border border-line",
      gradient: "gradient-border bg-white shadow-soft",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl p-6",
          variants[variant],
          hover &&
            "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-pop cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mb-4", className)} {...props} />
  )
);

CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold text-ink", className)}
    {...props}
  />
));

CardTitle.displayName = "CardTitle";

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-ink-muted", className)} {...props} />
  )
);

CardContent.displayName = "CardContent";
