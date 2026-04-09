import React from "react";
import { GlassCard } from "@/src/components/ui/GlassCard";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/src/lib/utils";

type StatColor = "emerald" | "indigo" | "amber" | "rose" | "blue" | "slate";

interface AdminStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: StatColor;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = "slate",
  trend,
  className
}) => {
  const colorClasses: Record<StatColor, string> = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    slate: "bg-slate-50 text-slate-600 border-slate-100",
  };

  const blurClasses: Record<StatColor, string> = {
    emerald: "bg-emerald-500/10",
    indigo: "bg-indigo-500/10",
    amber: "bg-amber-500/10",
    rose: "bg-rose-500/10",
    blue: "bg-blue-500/10",
    slate: "bg-slate-500/10",
  };

  const trendClasses = trend 
    ? (trend.isPositive ? "bg-emerald-100/50 text-emerald-700" : "bg-rose-100/50 text-rose-700")
    : "";

  return (
    <GlassCard className={cn("p-6 relative overflow-hidden group hover:border-slate-300 transition-colors", className)}>
      <div className={cn(
        "absolute -right-6 -top-6 w-24 h-24 rounded-full group-hover:scale-150 transition-transform duration-500 blur-2xl",
        blurClasses[color]
      )} />
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border", colorClasses[color])}>
          {icon}
        </div>
        
        {trend && (
          <span className={cn("flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-full", trendClasses)}>
            {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.value}
          </span>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</p>
        {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
      </div>
    </GlassCard>
  );
};
