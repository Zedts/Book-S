"use client";
import { ArrowRight } from "lucide-react";
import { useAuthNavigation } from "@/src/hooks/useAuthNavigation";
import type { Category } from "@/src/types/landing";

import { cn } from "@/src/lib/utils";

export function CategoriesSection({ 
  categories, 
  activeCategory, 
  onSelectCategory,
  variant = 'landing'
}: { 
  categories: Category[]; 
  activeCategory: string; 
  onSelectCategory: (id: string) => void;
  variant?: 'landing' | 'dashboard';
}) {
  const { handleAuthNavigation } = useAuthNavigation();
  const isDashboard = variant === 'dashboard';

  return (
    <section 
      id="kategori" 
      className={cn(
        "container mx-auto reveal",
        isDashboard ? "mb-14 px-0" : "px-6 lg:px-12 mt-20 md:mt-32"
      )}
    >
      <div className="flex items-center justify-between mb-6 md:mb-10">
        <h2 className={cn(
          "text-2xl md:text-3xl font-bold text-slate-800",
          isDashboard && "font-extrabold"
        )}>
          Eksplorasi Kategori
        </h2>
        <button 
          onClick={handleAuthNavigation} 
          className="hidden md:flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors group"
        >
          Lihat Semua{" "}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className={cn(
        "flex overflow-x-auto pb-4 pt-2 -mx-6 px-6 lg:mx-0 lg:px-0 gap-3 md:gap-4 no-scrollbar",
        !isDashboard && "lg:flex-wrap"
      )}>
        {categories.map((category, index) => (
          <CategoryChip 
            key={category.id} 
            category={category} 
            index={index} 
            isActive={activeCategory === category.id}
            variant={variant}
            onClick={() => {
              onSelectCategory(category.id);
              if (!isDashboard) {
                document.getElementById("koleksi")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
          />
        ))}
      </div>
    </section>
  );
}

function CategoryChip({ 
  category, 
  index = 0, 
  isActive = false, 
  variant = 'landing',
  onClick 
}: { 
  category: Category; 
  index?: number; 
  isActive?: boolean; 
  variant?: 'landing' | 'dashboard';
  onClick?: () => void 
}) {
  const isDashboard = variant === 'dashboard';
  const staggerClass = `stagger-${((index % 4) + 1)}`;
  
  return (
    <div
      onClick={onClick}
      className={cn(
        "px-5 py-3 md:px-6 md:py-4 rounded-2xl cursor-pointer transition-all flex items-center gap-2 md:gap-3 reveal whitespace-nowrap border",
        staggerClass,
        isActive 
          ? "bg-slate-800 text-white border-slate-800 shadow-lg shadow-slate-200 -translate-y-1" 
          : "bg-white/25 backdrop-blur-md border-white/40 text-slate-500 shadow-sm hover:-translate-y-1 hover:bg-white/50 hover:text-slate-800"
      )}
    >
      <div className={cn(
        "w-2 h-2 rounded-full transition-colors",
        isActive ? "bg-white" : "bg-slate-800"
      )} />
      <span className="text-sm md:text-base font-semibold">
        {category.name}
      </span>
    </div>
  );
}
