"use client";
import { ArrowRight } from "lucide-react";
import { useAuthNavigation } from "@/src/hooks/useAuthNavigation";
import type { Book } from "@/src/types/landing";
import BookCard from "@/src/components/user/BookCard";

export function BestSellersSection({ 
  books, 
  searchQuery 
}: { 
  books: Book[], 
  searchQuery: string 
}) {
  return (
    <section id="koleksi" className="container mx-auto px-6 lg:px-12 mt-24 md:mt-32 scroll-mt-24">
      <SectionHeader />
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {books.map((book, index) => (
          <BookCard key={book.id} book={book} index={index} />
        ))}
      </div>
      {books.length === 0 && (
        <div className="text-center py-12 text-slate-500 font-medium">
          Tidak ada buku yang cocok dengan {searchQuery ? `pencarian "${searchQuery}"` : "kategori ini"}.
        </div>
      )}
    </section>
  );
}

function SectionHeader() {
  const { handleAuthNavigation } = useAuthNavigation();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 reveal">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          Buku Paling Diminati
        </h2>
        <p className="text-sm md:text-base font-medium text-slate-600">
          Karya yang sedang hangat diperbincangkan komunitas.
        </p>
      </div>
      <button onClick={handleAuthNavigation} className="hidden md:flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors group mt-4 md:mt-0">
        Lihat Semua{" "}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
