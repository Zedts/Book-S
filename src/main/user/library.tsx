"use client";

import { Library, ArrowDownUp } from "lucide-react";
import UserLayout from "@/src/components/layout/UserLayout";
import BookCardHorizontal from "@/src/components/user/BookCardHorizontal";
import { useRequireRole } from "@/src/hooks/useRequireRole";
import type { Book, Category } from "@/src/types/landing";

export default function UserLibrary({
  initialCategories,
  initialBooks
}: {
  initialCategories: Category[];
  initialBooks: Book[];
}) {
  const { user } = useRequireRole("users");

  if (!user) return null;

  return (
    <UserLayout>
      <div className="space-y-12 pb-16">
        
        <header className="on-load-reveal flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-200/60 pb-8">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
              <span className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm border border-indigo-100">
                <Library className="w-6 h-6" />
              </span>
              Perpustakaan Saya
            </h1>
            <p className="text-slate-500 text-lg">
              Semua buku yang ada di daftar bacaan, wishlist, dan riwayat pesanan Anda.
            </p>
          </div>
          
          <div className="flex gap-2">
             <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors shadow-sm">
                <ArrowDownUp className="w-4 h-4" />
                Urutkan
             </button>
          </div>
        </header>

        {/* Collections Overview */}
        <section className="reveal stagger-1">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Total Koleksi", count: initialBooks.length },
              { label: "Selesai Dibaca", count: 0 },
              { label: "Wishlist", count: 0 },
              { label: "Menunggu Acc", count: 0 },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
                <div className="text-3xl font-extrabold text-slate-800 mb-1">{stat.count}</div>
                <div className="text-sm font-medium text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-6">List Lengkap</h2>
          
          {initialBooks.length > 0 ? (
            <div className="space-y-4">
              {initialBooks.map((book, index) => {
                const isSelesai = index % 3 === 0;
                return (
                  <div key={book.id} className="reveal relative opacity-95 group hover:opacity-100" style={{ transitionDelay: `${Math.min(index * 50, 500)}ms` }}>
                    <BookCardHorizontal 
                      book={book} 
                      statusBadge={
                        <span className={`px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded-lg border uppercase tracking-wider ${isSelesai ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-indigo-50 text-indigo-600 border-indigo-100"}`}>
                          {isSelesai ? "SELESAI" : "BACA NANTI"}
                        </span>
                      }
                    />
                  </div>
                );
              })}
            </div>
          ) : (
             <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-[2rem]">
               <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Library className="w-8 h-8 text-indigo-300" />
               </div>
               <h3 className="text-xl font-bold text-slate-700 mb-2">Koleksi Kosong</h3>
               <p className="text-slate-500 max-w-sm mx-auto">
                 Perpustakaan pribadi Anda belum memiliki buku. Silahkan jelajahi katalog kami.
               </p>
             </div>
          )}
        </section>

      </div>
    </UserLayout>
  );
}
