/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Search, Compass } from "lucide-react";
import { Input } from "@/src/components/ui/Input";
import { GlassCard } from "@/src/components/ui/GlassCard";
import UserLayout from "@/src/components/layout/UserLayout";
import BookCard from "@/src/components/user/BookCard";
import { useRequireRole } from "@/src/hooks/useRequireRole";
import { useBookFilters } from "@/src/hooks/useBookFilters";
import { CategoriesSection } from "@/src/components/landing/CategoriesSection";
import type { Book, Category } from "@/src/types/landing";

export default function UserExplore({
  initialCategories,
  initialBooks
}: {
  initialCategories: Category[];
  initialBooks: Book[];
}) {
  const { user } = useRequireRole("users");

  const [categories] = useState<Category[]>([
    { id: "all", name: "Semua Kategori", slug: "all" },
    ...initialCategories
  ]);

  const { 
    searchQuery, 
    setSearchQuery, 
    activeCategory, 
    setActiveCategory, 
    filteredBooks 
  } = useBookFilters(initialBooks);

  if (!user) return null;

  return (
    <UserLayout>
      <div className="space-y-12 pb-16">
        
        {/* Header & Search */}
        <section className="relative rounded-[2.5rem] bg-slate-900 overflow-hidden px-8 py-12 lg:p-16 on-load-reveal">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[80px] animate-blob" />
            <div className="absolute top-1/2 left-1/4 w-[28rem] h-[28rem] bg-emerald-500/20 rounded-full mix-blend-screen filter blur-[80px] animate-blob animation-delay-2000" />
            <img 
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80" 
              alt="Library background" 
              className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay"
            />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <span className="p-3 bg-white/10 text-white rounded-2xl backdrop-blur-md shadow-inner border border-white/10">
                <Compass className="w-8 h-8" />
              </span>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Jelajahi Koleksi
              </h1>
            </div>
            
            <p className="text-lg text-slate-300">
              Temukan buku-buku terbaik dari berbagai kategori yang telah kami kurasi khusus untuk Anda.
            </p>
            
            <GlassCard className="p-2 border-white/10">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul buku, penulis, atau topik spesifik..." 
                  className="w-full pl-12 py-4 bg-transparent border-none text-white placeholder:text-slate-400 focus:ring-0 text-lg"
                />
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Categories (Re-used Component) */}
        {!searchQuery && (
          <div className="reveal stagger-1">
             <CategoriesSection 
               categories={categories} 
               activeCategory={activeCategory}
               onSelectCategory={setActiveCategory}
               variant="dashboard"
             />
          </div>
        )}

        {/* Grid Layout */}
        <section id="results" className="scroll-mt-32 space-y-8 reveal stagger-2">
          {searchQuery && (
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
              <h3 className="text-2xl font-bold text-slate-800">
                Hasil Pencarian: <span className="text-slate-500 font-medium">&quot;{searchQuery}&quot;</span>
              </h3>
              <p className="text-sm font-medium px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
                {filteredBooks.length} buku ditemukan
              </p>
            </div>
          )}

          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10">
              {filteredBooks.map((book, index) => (
                <div key={book.id} className="reveal" style={{ transitionDelay: `${(index % 8) * 100}ms` }}>
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Tidak ditemukan</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Maaf, kami tidak dapat menemukan buku yang cocok dengan pencarian Anda. Coba gunakan kata kunci lain atau telusuri kategori yang tersedia.
              </p>
            </div>
          )}
        </section>

      </div>
    </UserLayout>
  );
}
