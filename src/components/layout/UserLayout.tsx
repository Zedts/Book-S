import { useState, useEffect } from "react";
import { Menu, X, BookOpen } from "lucide-react";
import UserSidebar from "./UserSidebar";
import { useScrollReveal } from "@/src/hooks/useScrollReveal";
import { cn } from "@/src/lib/utils";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useScrollReveal();

  useEffect(() => {
    setMounted(true);
    const savedState = localStorage.getItem("sidebar-collapsed");
    if (savedState !== null) {
      setIsCollapsed(savedState === "true");
    }
  }, []);

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
    <div className="flex min-h-screen bg-slate-50 relative">
      {/* Background blobs for glassmorphism effect */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[35vw] h-[35vw] rounded-full bg-slate-200 mix-blend-multiply filter blur-[100px] opacity-60 animate-blob" />
        <div className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-stone-200 mix-blend-multiply filter blur-[120px] opacity-70 animate-blob animation-delay-2000" />
      </div>

      {/* Sidebar for Desktop */}
      <div className="hidden md:block">
        <UserSidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      </div>

      {/* Sidebar for Mobile */}
      <div className="md:hidden">
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[45]" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        <UserSidebar isCollapsed={!isMobileMenuOpen} isMobile onToggle={toggleMobileMenu} />
      </div>

      {/* Main Content Area */}
      <main 
        className={cn(
          "flex-1 relative z-10 p-6 md:p-8 pt-20 md:pt-10 transition-all duration-500 ease-in-out",
          isCollapsed ? "md:ml-24" : "md:ml-72"
        )}
      >
        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/30 backdrop-blur-md border-b border-white/40 flex items-center justify-between px-6 z-[60]">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shadow-lg shadow-slate-200">
                 <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-slate-800 tracking-tight">Book'S</span>
           </div>
           <button 
             onClick={toggleMobileMenu}
             className="w-10 h-10 rounded-xl bg-white/80 border border-white/80 flex items-center justify-center text-slate-600 shadow-sm hover:text-slate-900 active:scale-95 transition-all"
             aria-label="Toggle Menu"
           >
             {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
           </button>
        </div>

        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
