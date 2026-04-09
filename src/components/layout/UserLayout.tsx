"use client";

import { useState, useEffect } from "react";
import { Menu, BookOpen } from "lucide-react";
import UserSidebar from "./UserSidebar";
import { useScrollReveal } from "@/src/hooks/useScrollReveal";
import { useRequireRole } from "@/src/hooks/useRequireRole";
import { FloatingChatWidget } from "@/src/components/ui/FloatingChatWidget";
import { UserChat } from "@/src/components/user/UserChat";
import { cn } from "@/src/lib/utils";

export default function UserLayout({ 
  children,
  headerActions
}: { 
  children: React.ReactNode;
  headerActions?: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { user } = useRequireRole("users");

  useScrollReveal();

  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    if (savedState !== null) {
      setIsCollapsed(savedState === "true");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", String(newState));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!mounted) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden">
      {/* Background blobs for glassmorphism effect */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[35vw] h-[35vw] rounded-full bg-slate-200 mix-blend-multiply filter blur-[100px] opacity-60 animate-blob" />
        <div className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-stone-200 mix-blend-multiply filter blur-[120px] opacity-70 animate-blob animation-delay-2000" />
      </div>

      {/* Sidebar for Desktop */}
      <div className="hidden lg:block">
        <UserSidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      </div>

      {/* Sidebar for Mobile */}
      <UserSidebar isCollapsed={!isMobileMenuOpen} isMobile onToggle={toggleMobileMenu} />

      {/* Main Content Area */}
      <main 
        className={cn(
          "relative z-10 p-6 lg:p-8 pt-24 lg:pt-10 transition-all duration-500 ease-in-out min-h-screen",
          isCollapsed ? "lg:ml-24" : "lg:ml-72"
        )}
      >
        {/* Mobile Header */}
        <nav className="lg:hidden fixed top-0 inset-x-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button 
               onClick={toggleMobileMenu}
               className="-ml-2 p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-700"
               aria-label="Toggle Menu"
             >
               <Menu className="w-6 h-6" />
             </button>
             <div className="flex items-center gap-2 cursor-pointer relative z-40">
                <BookOpen className="w-6 h-6 text-slate-800" />
                <span className="text-xl font-black tracking-tighter text-slate-800">Book&apos;S</span>
             </div>
          </div>          
          {headerActions && (
            <div className="flex items-center gap-2">
              {headerActions}
            </div>
          )}        </nav>

        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Floating Chat Integration */}
      {user && (
        <FloatingChatWidget title="Customer Service">
          <UserChat userId={user.id} />
        </FloatingChatWidget>
      )}
    </div>
  );
}
