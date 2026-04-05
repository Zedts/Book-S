/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { 
  Search, 
  Bell, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles,
  Filter
} from "lucide-react";
import { Input } from "@/src/components/ui/Input";
import { GlassCard } from "@/src/components/ui/GlassCard";
import { Button } from "@/src/components/ui/Button";
import { cn } from "@/src/lib/utils";
import UserLayout from "@/src/components/layout/UserLayout";
import BookCard from "@/src/components/user/BookCard";
import BookCardHorizontal from "@/src/components/user/BookCardHorizontal";
import { FEATURED_BOOKS, USER_CATEGORIES, RECENT_BOOKS } from "@/src/lib/mock-data";

import { useRequireRole } from "@/src/hooks/useRequireRole";

export default function UserHome() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { user } = useRequireRole("users");

  return (
    <UserLayout>
      {/* Top Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex-1 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2">
            Selamat Datang, <span className="text-gradient">{user?.fullName?.split(" ")[0] || "Pembaca"}</span>!
          </h1>
          <p className="text-slate-500 font-medium">Buku apa yang ingin anda baca hari ini?</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="w-11 h-11 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-white transition-all shadow-sm">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full" />
            </button>
          </div>
          <button className="w-11 h-11 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-white transition-all shadow-sm">
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 stagger-1">
        <div className="flex-1">
          <Input 
            placeholder="Cari judul buku, penulis, atau kategori..." 
            icon={<Search className="w-5 h-5 text-slate-400" />}
            className="shadow-sm border-white/40 h-14 text-base rounded-2xl"
          />
        </div>
        <Button variant="outline" className="h-14 px-6 rounded-2xl gap-2 border-white/40 bg-white/40 backdrop-blur-md hover:bg-white/60 transition-all">
          <Filter className="w-5 h-5" />
          Filter
        </Button>
      </div>

      {/* Featured Banner */}
      <section className="mb-14 reveal stagger-2">
        <GlassCard className="relative overflow-hidden p-0 rounded-[2.5rem] border-white/60 shadow-xl min-h-60 flex flex-col md:flex-row group/banner">
          <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/10 text-slate-800 text-[10px] font-bold uppercase tracking-widest mb-4">
              <Sparkles className="w-3 h-3 animate-pulse" /> Rekomendasi Terbatas
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4 leading-tight">
              Dapatkan Diskon 30% <br /> untuk Koleksi Desain
            </h2>
            <p className="text-slate-600 font-medium mb-6 max-w-sm">
              Perluas wawasan kreatif anda dengan koleksi buku seni & desain terbaik dari kami.
            </p>
            <Button variant="primary" className="rounded-full px-8 py-6 h-auto shadow-lg shadow-slate-200 gap-2 group/btn">
              Belanja Sekarang
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <div className="w-full md:w-1/3 bg-slate-200/30 relative min-h-45 md:min-h-0 overflow-hidden">
             {/* Decorative images or elements */}
             <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="relative w-32 h-44 bg-white rounded-xl shadow-2xl transform -rotate-12 translate-x-4 group-hover/banner:-rotate-6 transition-transform duration-500">
                   <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format" alt="Book Cover 1" className="w-full h-full object-cover rounded-xl" />
                </div>
                <div className="relative w-32 h-44 bg-white rounded-xl shadow-2xl transform rotate-12 -translate-x-4 z-10 group-hover/banner:rotate-6 transition-transform duration-500">
                   <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format" alt="Book Cover 2" className="w-full h-full object-cover rounded-xl" />
                </div>
             </div>
          </div>

          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 left-1/3 w-40 h-40 bg-slate-400/20 rounded-full blur-3xl" />
        </GlassCard>
      </section>

      {/* Categories Horizontal Scroll */}
      <section className="mb-14 reveal stagger-3">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-extrabold text-slate-800">Eksplorasi Kategori</h3>
          <button className="hidden md:flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors group">
            Lihat semua{" "}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="flex overflow-x-auto pb-4 pt-2 -mx-6 px-6 lg:mx-0 lg:px-0 gap-3 md:gap-4 no-scrollbar">
          {USER_CATEGORIES.map((category) => (
             <div
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "px-5 py-3 md:px-6 md:py-4 rounded-2xl cursor-pointer transition-all flex items-center gap-2 md:gap-3 whitespace-nowrap border reveal",
                category.staggerClass,
                activeCategory === category.id 
                   ? "bg-slate-800 text-white border-slate-800 shadow-lg shadow-slate-200 -translate-y-1" 
                   : "bg-white/25 backdrop-blur-md border-white/40 text-slate-500 shadow-sm hover:-translate-y-1 hover:bg-white/50 hover:text-slate-800"
              )}
            >
              <div className={cn("w-2 h-2 rounded-full transition-colors", activeCategory === category.id ? "bg-white" : "bg-slate-800")} />
              <span className="text-sm md:text-base font-semibold">
                {category.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Books Grid - Featured */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8 reveal stagger-4">
          <div>
            <h3 className="text-2xl font-extrabold text-slate-800 mb-1">Buku Terpopuler</h3>
            <p className="text-sm text-slate-500 font-medium">Banyak peminat, jangan sampai ketinggalan!</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors group">
            Lihat semua{" "}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {FEATURED_BOOKS.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Secondary Section - Baru Rilis */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-8 reveal">
          <div>
            <h3 className="text-2xl font-extrabold text-slate-800 mb-1">Baru Saja Rilis</h3>
            <p className="text-sm text-slate-500 font-medium">Koleksi terbaru minggu ini</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors group">
            Lihat semua{" "}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {RECENT_BOOKS.map((book) => (
            <BookCardHorizontal key={book.id} book={book} />
          ))}
        </div>
      </section>
    </UserLayout>
  );
}
