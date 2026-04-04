import { ArrowRight } from "lucide-react";
import type { Category } from "@/src/types/landing";

const CATEGORIES: Category[] = [
  { id: "fiksi", label: "Fiksi Sastra", staggerClass: "stagger-1" },
  { id: "non-fiksi", label: "Non-Fiksi", staggerClass: "stagger-2" },
  { id: "pengembangan-diri", label: "Pengembangan Diri", staggerClass: "stagger-3" },
  { id: "seni-desain", label: "Seni & Desain", staggerClass: "stagger-4" },
  { id: "bisnis", label: "Bisnis Ekonomi", staggerClass: "stagger-1" },
];

export default function CategoriesSection() {
  return (
    <section className="container mx-auto px-6 lg:px-12 mt-20 md:mt-32 reveal">
      <div className="flex items-center justify-between mb-6 md:mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
          Eksplorasi Kategori
        </h2>
        <button className="hidden md:flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors group">
          Lihat Semua{" "}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="flex overflow-x-auto pb-4 pt-2 -mx-6 px-6 lg:mx-0 lg:px-0 lg:flex-wrap gap-3 md:gap-4 no-scrollbar">
        {CATEGORIES.map((category) => (
          <CategoryChip key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}

function CategoryChip({ category }: { category: Category }) {
  return (
    <div
      className={`bg-white/25 backdrop-blur-[12px] border border-white/40 shadow-[0_4px_24px_0_rgba(0,0,0,0.04)] px-5 py-3 md:px-6 md:py-4 rounded-2xl cursor-pointer hover:-translate-y-1 hover:bg-white/50 transition-all flex items-center gap-2 md:gap-3 reveal ${category.staggerClass} whitespace-nowrap`}
    >
      <div className="w-2 h-2 rounded-full bg-slate-800" />
      <span className="text-sm md:text-base font-semibold text-slate-700">
        {category.label}
      </span>
    </div>
  );
}
