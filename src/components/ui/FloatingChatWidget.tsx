"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

interface FloatingChatWidgetProps {
  children: React.ReactNode;
  hasUnread?: boolean;
  title?: string;
  onOpenStateChange?: (isOpen: boolean) => void;
}

export function FloatingChatWidget({
  children,
  hasUnread = false,
  title = "Chat Support",
  onOpenStateChange,
}: FloatingChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [internalHasUnread, setInternalHasUnread] = useState(hasUnread);

  useEffect(() => {
    setInternalHasUnread(hasUnread);
  }, [hasUnread]);

  // Mount logic & rehydrate local storage
  useEffect(() => {
    setIsMounted(true);
    const savedState = localStorage.getItem("chatWidgetOpen");
    if (savedState !== null) {
      try {
        const parsedState = JSON.parse(savedState);
        setIsOpen(parsedState);
        if (onOpenStateChange) onOpenStateChange(parsedState);
      } catch (error) {
        console.error("Failed to parse chatWidgetOpen from localStorage", error);
      }
    }
  }, [onOpenStateChange]);

  const toggleWidget = () => {
    setIsOpen((prev) => {
      const newState = !prev;
      localStorage.setItem("chatWidgetOpen", JSON.stringify(newState));
      if (onOpenStateChange) onOpenStateChange(newState);
      if (newState) {
        setInternalHasUnread(false);
      }
      return newState;
    });
  };

  // Avoid hydration mismatch by waiting for client mount
  if (!isMounted) return null;

  const clonedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        isWidgetOpen: isOpen,
        onUnreadChange: setInternalHasUnread,
      });
    }
    return child;
  });

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Container */}
      <div
        className={`transition-all duration-300 transform origin-bottom-right mb-4 flex flex-col ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0 pointer-events-auto"
            : "scale-0 opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden w-[22rem] h-[32rem] sm:w-[24rem] border border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 p-4 shrink-0 flex justify-between items-center text-white">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              {title}
            </h3>
            <button
              onClick={toggleWidget}
              className="hover:bg-blue-700 p-1.5 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body content (Specific content either from Admin or User chat logic will sit here) */}
          <div className="flex-1 overflow-hidden flex flex-col relative bg-gray-50 dark:bg-gray-900">
            {clonedChildren}
          </div>
        </div>
      </div>

      {/* Floating Badge/Button Target */}
      <button
        onClick={toggleWidget}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-xl transition-transform hover:scale-105 active:scale-95 relative flex items-center justify-center transform-gpu pointer-events-auto"
        aria-label="Toggle chat"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}

        {/* Red Dot Badge (Hanya tampil jika tertutup dan ada pesan baru) */}
        {!isOpen && internalHasUnread && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
        )}
      </button>
    </div>
  );
}
