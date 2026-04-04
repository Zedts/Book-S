"use client";

import { BookOpen, Search, ShoppingBag, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useNavbarScroll } from "@/src/hooks/useNavbarScroll";
import { useActiveSection } from "@/src/hooks/useActiveSection";

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
  
  // Track which section is active via scroll position
  const activeSection = useActiveSection(["koleksi", "kategori"], 150);

  const isAboutPage = pathname === "/about-us" || currentView === "about-us";

  const paddingClass = isScrolled ? "py-3 md:py-4" : "py-5 md:py-6";

  const isActive = (link: NavLink) => {
    if (link.href === "/about-us") return isAboutPage;
    
    if (isAboutPage) return false;

    // For landing page
    if (link.sectionId) {
      return activeSection === link.sectionId;
    }
    
    // Beranda is active if no other section is active
    if (link.href === "/") {
      return activeSection === "";
    }
    
    return false;
  };

  const handleSectionLink = (e: React.MouseEvent<HTMLAnchorElement>, link: NavLink) => {
    if (!link.sectionId) return;

    if (isAboutPage) {
      e.preventDefault();
      // Route to "/" first, then set hash.
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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${paddingClass}`}>
      <div className="container mx-auto px-5 lg:px-12">
        <div className="bg-white/40 backdrop-blur-[16px] border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-full px-5 py-3 md:px-6 flex items-center justify-between on-load-reveal">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer group">
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

          {/* Action buttons */}
          <div className="flex items-center gap-2 md:gap-4 text-slate-600">
            <button className="p-2 hover:bg-white/50 rounded-full transition-colors" aria-label="Search">
              <Search className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button className="p-2 hover:bg-white/50 rounded-full transition-colors relative" aria-label="Cart">
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-slate-800 rounded-full border border-white" />
            </button>
            <button className="md:hidden p-2 hover:bg-white/50 rounded-full transition-colors" aria-label="Menu">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
