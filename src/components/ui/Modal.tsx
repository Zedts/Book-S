"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/src/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
  full: "max-w-[95vw] h-[95vh]",
};

export default function Modal({
  isOpen,
  onClose,
  children,
  className,
  title,
  size = "md",
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto w-full h-full">
      {/* Backdrop overlay */}
      <div  
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div 
        className={cn(
          "relative z-10 w-full rounded-[2rem] bg-white border border-slate-200 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden",
          sizeClasses[size],
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-200 shrink-0 bg-white">
          {title ? (
            <h2 id="modal-title" className="text-xl font-bold text-slate-800 tracking-tight">
              {title}
            </h2>
          ) : <div></div>}
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/50 text-slate-500 hover:text-slate-800 hover:bg-white transition-all shadow-sm shrink-0"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content area that scrolls if content is large */}
        <div className="p-6 overflow-y-auto relative z-10 bg-white">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
