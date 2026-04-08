import React from "react";
import { Search } from "lucide-react";
import { GlassCard } from "@/src/components/ui/GlassCard";

interface AdminSearchToolbarProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const AdminSearchToolbar: React.FC<AdminSearchToolbarProps> = ({
  placeholder,
  value,
  onChange,
  className = ""
}) => {
  return (
    <GlassCard className={`p-4 ${className}`}>
      <div className="relative w-full">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </GlassCard>
  );
};
