/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { 
  Search, 
  Bell, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles
} from "lucide-react";
import { Input } from "@/src/components/ui/Input";
import { GlassCard } from "@/src/components/ui/GlassCard";
import { Button } from "@/src/components/ui/Button";
import UserLayout from "@/src/components/layout/UserLayout";
import BookCard from "@/src/components/user/BookCard";
import BookCardHorizontal from "@/src/components/user/BookCardHorizontal";

import { useRequireRole } from "@/src/hooks/useRequireRole";
import { useBookFilters } from "@/src/hooks/useBookFilters";
import { useUserOrders } from "@/src/hooks/useUserOrders";
import { CategoriesSection } from "@/src/components/landing/CategoriesSection";
import type { Book, Category } from "@/src/types/landing";
import { OrderNotificationModal } from "@/src/components/user/OrderNotificationModal";
import { CartOrdersSummaryModal } from "@/src/components/user/CartOrdersSummaryModal";

export default function UserHome({
  initialCategories,
  initialBooks
}: {
  initialCategories: Category[];
  initialBooks: Book[];
}) {
  const { 
    searchQuery, 
    setSearchQuery, 
    activeCategory, 
    setActiveCategory, 
    filteredBooks 
  } = useBookFilters(initialBooks);

  const [categories] = useState<Category[]>([
    { id: "all", name: "Semua Koleksi", slug: "all" },
    ...initialCategories
  ]);
  
  const featuredBooks = initialBooks.filter(b => b.isFeatured).slice(0, 4);

  const { 
    user,
    notifications,
    visibleCartItems,
    visibleOrders,
    activeOrdersCount,
    clearNotifications,
    clearCartBag,
    clearOrdersBag
  } = useUserOrders();

  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const unreadCount = notifications.length;
  const totalCartCount = visibleCartItems.length;

  const isSearching = searchQuery.trim().length > 0 || activeCategory !== "all";

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
            <button 
              onClick={() => setIsNotificationModalOpen(true)}
              className="w-11 h-11 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-white transition-all shadow-sm"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full" />
              )}
            </button>
          </div>
          <div className="relative group">
            <button 
              onClick={() => setIsCartModalOpen(true)}
              className="w-11 h-11 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-white transition-all shadow-sm"
              aria-label="Keranjang dan Pesanan"
            >
              <ShoppingBag className="w-5 h-5" />
              {(totalCartCount > 0 || activeOrdersCount > 0) && (
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="flex flex-col md:flex-row gap-4 mb-10 stagger-1"
      >
        <div className="flex-1">
          <Input 
            placeholder="Cari judul buku, penulis, atau kategori..." 
            icon={<Search className="w-5 h-5 text-slate-400" />}
            className="shadow-sm border-white/40 h-14 text-base rounded-2xl bg-white/60 focus:bg-white transition-colors"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
        </div>
        <Button type="submit" variant="primary" className="h-14 px-8 rounded-2xl gap-2 shadow-md hover:shadow-lg transition-all">
          <Search className="w-5 h-5 text-white" />
          Cari
        </Button>
      </form>

      {!isSearching && (
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
             <div className="absolute inset-0 flex items-center justify-center p-6">
                {featuredBooks[0] && (
                  <div className="relative w-32 h-44 bg-white rounded-xl shadow-2xl transform -rotate-12 translate-x-4 group-hover/banner:-rotate-6 transition-transform duration-500">
                     <img src={featuredBooks[0].imageUrl || ''} alt={"featured book 1"} className="w-full h-full object-cover rounded-xl" />
                  </div>
                )}
                {featuredBooks[1] && (
                  <div className="relative w-32 h-44 bg-white rounded-xl shadow-2xl transform rotate-12 -translate-x-4 z-10 group-hover/banner:rotate-6 transition-transform duration-500">
                     <img src={featuredBooks[1].imageUrl || ''} alt={"featured book 2"} className="w-full h-full object-cover rounded-xl" />
                  </div>
                )}
             </div>
          </div>

          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 left-1/3 w-40 h-40 bg-slate-400/20 rounded-full blur-3xl" />
        </GlassCard>
        </section>
      )}

      {/* Categories Horizontal Scroll */}
      <CategoriesSection 
        categories={categories} 
        activeCategory={activeCategory} 
        onSelectCategory={setActiveCategory} 
        variant="dashboard"
      />

      {/* Books Grid - Featured */}
      {!isSearching && (
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
            {featuredBooks.map((book, index) => (
              <BookCard key={book.id} book={book} index={index} />
            ))}
          </div>
        </section>
      )}

      {/* Secondary Section - Baru Rilis / Hasil Pencarian */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-8 reveal">
          <div>
            <h3 className="text-2xl font-extrabold text-slate-800 mb-1">
              {isSearching ? "Hasil Pencarian & Filter" : "Baru Saja Rilis"}
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              {isSearching ? `Menampilkan ${filteredBooks.length} buku` : "Koleksi terbaru minggu ini"}
            </p>
          </div>
          {!isSearching && (
            <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors group">
              Lihat semua{" "}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {filteredBooks.map((book: Book) => (
            <BookCardHorizontal key={book.id} book={book} />
          ))}
          {filteredBooks.length === 0 && (
            <div className="col-span-full py-10 text-center">
              <p className="text-slate-500 font-medium">Tidak ada buku yang cocok dengan pencarian atau kategori ini.</p>
            </div>
          )}
        </div>
      </section>

      <OrderNotificationModal 
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notifications={notifications}
        onClear={clearNotifications}
      />

      <CartOrdersSummaryModal 
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        visibleCartItems={visibleCartItems}
        visibleOrders={visibleOrders}
        activeOrdersCount={activeOrdersCount}
        totalCartCount={totalCartCount}
        onClearCartBag={clearCartBag}
        onClearOrdersBag={clearOrdersBag}
      />
    </UserLayout>
  );
}
