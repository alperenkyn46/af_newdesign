import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = "text", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            "w-full px-4 py-3 rounded-xl bg-white border border-line text-ink placeholder-ink-faint",
            "focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
            "transition-all duration-200",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
