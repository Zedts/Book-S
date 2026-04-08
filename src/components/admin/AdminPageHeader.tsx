import React from "react";
import { Plus } from "lucide-react";

interface AdminPageHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
  onActionClick?: () => void;
  actionIcon?: React.ReactNode;
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  description,
  actionLabel,
  onActionClick,
  actionIcon = <Plus className="w-5 h-5" />
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{title}</h1>
        <p className="text-slate-500 mt-1">{description}</p>
      </div>
      {actionLabel && onActionClick && (
        <button 
          onClick={onActionClick}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-900 transition-colors shadow-sm"
        >
          {actionIcon}
          {actionLabel}
        </button>
      )}
    </div>
  );
};
