"use client";

import { BookOpen, Search, ShoppingBag, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useNavbarScroll } from "@/src/hooks/useNavbarScroll";
import { useActiveSection } from "@/src/hooks/useActiveSection";
import { useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabase";

type NavLink = {
  label: string;
  href: string;
  sectionId?: string;
};

const NAV_LINKS: NavLink[] = [
  { label: "Beranda", href: "/" },
  { label: "Kategori", href: "/#kategori", sectionId: "kategori" },
  { label: "Koleksi", href: "/#koleksi", sectionId: "koleksi" },
  { label: "Tentang Kami", href: "/about-us" },
];

export default function Navbar() {
  const isScrolled = useNavbarScroll();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentView = searchParams.get("view");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  
  // Track which section is active via scroll position
  const activeSection = useActiveSection(["koleksi", "kategori"], 150);

  const isLandingPage = pathname === "/" && !currentView;
  const isNotLandingPage = !isLandingPage;

  const paddingClass = isScrolled ? "py-3 md:py-4" : "py-5 md:py-6";

  // Check user session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();
          if (userData) {
            setUserRole(userData.role);
          }
        }
      } catch (err) {
        console.error("Session check error", err);
      } finally {
        setIsCheckingSession(false);
      }
    };
    checkSession();
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (link: NavLink) => {
    if (link.href === "/about-us") return pathname === "/about-us" || currentView === "about-us";
    if (isNotLandingPage) return false;
    if (link.sectionId) return activeSection === link.sectionId;
    if (link.href === "/") return activeSection === "";
    return false;
  };

  const handleSectionLink = (e: React.MouseEvent<HTMLAnchorElement>, link: NavLink) => {
    setIsMobileMenuOpen(false); // Ensure menu closes
    
    if (!link.sectionId) return;

    if (isNotLandingPage) {
      e.preventDefault();
      router.push(`/#${link.sectionId}`);
      return;
    }

    e.preventDefault();
    const target = document.getElementById(link.sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${paddingClass}`}>
        <div className="container mx-auto px-5 lg:px-12 relative z-50">
          <div className="bg-white/40 backdrop-blur-[16px] border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-full px-5 py-3 md:px-6 flex items-center justify-between on-load-reveal relative z-50">
            {/* Logo */}
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 cursor-pointer group">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-slate-700 group-hover:text-slate-900 transition-colors" />
              <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-800">
                Book&apos;S
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleSectionLink(e, link)}
                  className={
                    isActive(link)
                      ? "text-slate-900 transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-slate-800 after:rounded-full"
                      : "hover:text-slate-900 transition-colors"
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop & Mobile action buttons */}
            <div className="flex items-center gap-1.5 md:gap-4 text-slate-600">
              <button className="p-1.5 md:p-2 hover:bg-white/50 rounded-full transition-colors" aria-label="Search">
                <Search className="w-[18px] h-[18px] md:w-5 md:h-5" />
              </button>
              <button className="p-1.5 md:p-2 hover:bg-white/50 rounded-full transition-colors relative" aria-label="Cart">
                <ShoppingBag className="w-[18px] h-[18px] md:w-5 md:h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-slate-800 rounded-full border border-white" />
              </button>
              
              <Link
                href={userRole === "admin" ? "/admin/home" : (userRole === "users" ? "/user/home" : "/auth")}
                className="hidden md:flex items-center justify-center px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors shadow-sm ml-2 w-[100px]"
              >
                {isCheckingSession ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  userRole ? "Dashboard" : "Masuk"
                )}
              </Link>
              
              <button 
                className="md:hidden p-1.5 hover:bg-white/50 rounded-full transition-colors" 
                aria-label="Menu"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-white/95 backdrop-blur-xl z-40 md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col h-full pt-32 px-8 pb-12 overflow-y-auto">
          <div className="flex flex-col gap-8 flex-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => handleSectionLink(e, link)}
                className={`text-2xl font-bold tracking-tight transition-colors ${
                  isActive(link) ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-slate-200">

            <Link
              href={userRole === "admin" ? "/admin/home" : (userRole === "users" ? "/user/home" : "/auth")}
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-center transition-colors shadow-lg flex justify-center items-center"
            >
              {isCheckingSession ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  userRole ? "Dashboard" : "Masuk"
              )}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
