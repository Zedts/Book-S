"use client";

import { BookOpen, Search, ShoppingBag, Menu } from "lucide-react";
import { useNavbarScroll } from "@/src/hooks/useNavbarScroll";

const NAV_LINKS = [
  { label: "Beranda", href: "#", active: true },
  { label: "Koleksi", href: "#" },
  { label: "Kategori", href: "#" },
  { label: "Tentang Kami", href: "#" },
];

export default function Navbar() {
  const isScrolled = useNavbarScroll();

  const paddingClass = isScrolled ? "py-3 md:py-4" : "py-5 md:py-6";

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${paddingClass}`}>
      <div className="container mx-auto px-5 lg:px-12">
        <div className="bg-white/40 backdrop-blur-[16px] border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-full px-5 py-3 md:px-6 flex items-center justify-between on-load-reveal">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-slate-700 group-hover:text-slate-900 transition-colors" />
            <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-800">
              Book&apos;S
            </span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            {NAV_LINKS.map(({ label, href, active }) => (
              <a
                key={label}
                href={href}
                className={
                  active
                    ? "text-slate-900 transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-slate-800 after:rounded-full"
                    : "hover:text-slate-900 transition-colors"
                }
              >
                {label}
              </a>
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
