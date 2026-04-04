import { cn } from "@/src/lib/utils";
import React, { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, icon, endAdornment, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full py-3 bg-white/60 border border-slate-200 rounded-2xl",
              "focus:ring-4 focus:ring-slate-100 focus:border-slate-400 focus:bg-white",
              "transition-all outline-none text-slate-800 font-medium placeholder-slate-400",
              icon ? "pl-11" : "pl-4",
              endAdornment ? "pr-12" : "pr-4",
              className
            )}
            {...props}
          />
          {endAdornment && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              {endAdornment}
            </div>
          )}
        </div>
      </div>
    );
  }
);
Input.displayName = "Input";
