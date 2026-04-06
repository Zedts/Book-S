"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, X } from "lucide-react";
import { cn } from "@/src/lib/utils";

export interface NotificationProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Notification({
  isOpen,
  message,
  onClose,
  duration = 3000,
}: NotificationProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className={cn(
      "fixed bottom-6 right-6 z-[60] flex items-center justify-between gap-4 px-6 py-4 rounded-2xl shadow-xl transition-all duration-300",
      "bg-slate-800 text-white animate-in slide-in-from-bottom-5 fade-in"
    )}>
      <div className="flex items-center gap-3">
        <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
        <p className="font-medium text-sm sm:text-base">{message}</p>
      </div>
      <button 
        onClick={onClose} 
        className="text-slate-400 hover:text-white transition-colors p-1"
        aria-label="Tutup notifikasi"
      >
        <X className="w-5 h-5" />
      </button>
    </div>,
    document.body
  );
}