import { cn } from "@/src/lib/utils";
import React, { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", fullWidth, children, ...props }, ref) => {
    const baseStyles = "font-bold rounded-full transition-all outline-none flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-transform duration-300";
    
    // Adjusted styles to match existing app look and feel
    const variants = {
      primary: "bg-slate-800 hover:bg-slate-700 text-white shadow-lg shadow-slate-300 focus:ring-4 focus:ring-slate-200 hover:-translate-y-0.5",
      // secondary maps to the "Lihat Detail" button styling
      secondary: "bg-white/60 backdrop-blur-sm border border-white text-slate-800 hover:bg-white focus:ring-4 focus:ring-slate-200",
      outline: "border border-slate-200 text-slate-700 hover:bg-slate-50",
      ghost: "text-slate-600 hover:text-slate-900 bg-transparent hover:bg-slate-100",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          fullWidth ? "w-full" : "",
          "px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
