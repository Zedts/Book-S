import { cn } from "@/src/lib/utils";
import React from "react";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  as?: React.ElementType;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glow, as: Component = "div", children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "bg-white/25 backdrop-blur-[12px] border border-white/40 shadow-[0_4px_24px_0_rgba(0,0,0,0.04)]",
          glow && "relative overflow-hidden",
          className
        )}
        {...props}
      >
        {glow && (
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-200 rounded-full blur-[40px] opacity-50 pointer-events-none z-0" />
        )}
        <div className="relative z-10">{children}</div>
      </Component>
    );
  }
);
GlassCard.displayName = "GlassCard";
