/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Star, ArrowUpRight, Heart } from "lucide-react";
import BookDetailModal from "@/src/components/user/BookDetailModal";
import type { Book } from "@/src/types/landing";
import { formatCurrency } from "@/src/lib/utils";
import { useFavorites } from "@/src/hooks/useFavorites";

export default function BookCard({ book, index = 0 }: { book: Book, index?: number }) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const favorited = isFavorite(book.id);
  
  const staggerClass = `stagger-${((index % 4) + 1)}`;
  return (
    <>
      <div className={`group cursor-pointer reveal ${staggerClass}`}>
        <div 
          onClick={() => setIsDetailOpen(true)}
          className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-white/20 backdrop-blur-md border border-white/40 shadow-[0_4px_24px_0_rgba(0,0,0,0.04)] p-2 mb-3.5 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2"
        >
          <img
            src={book.imageUrl}
            alt={book.imageAlt}
            className="w-full h-full object-cover rounded-xl"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex flex-col items-center justify-center p-4">
            <button className="bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold px-5 py-2.5 rounded-full shadow-lg hover:bg-slate-800 hover:text-white transition-all duration-300 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 mb-3 pointer-events-none">
              Lihat Detail <ArrowUpRight className="w-4 h-4" />
            </button>
            <div 
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(book.id);
              }}
              className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-sm p-2 rounded-full cursor-pointer hover:bg-white hover:scale-110 transition-all shadow-sm"
            >
              <Heart className={`w-3.5 h-3.5 text-rose-500 ${favorited ? "fill-rose-500" : ""}`} strokeWidth={favorited ? 0 : 2} />
            </div>
          </div>

        {/* Rating badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-slate-800 flex items-center gap-1 shadow-sm pointer-events-none">
          <Star className="w-3 h-3 fill-slate-800 text-slate-800" /> {book.rating}
        </div>
      </div>

      {/* Book info */}
      <div className="px-1" onClick={() => setIsDetailOpen(true)}>
        <div className="flex justify-between items-start mb-1">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
            {book.category?.name || 'Uncategorized'}
          </p>
        </div>
        <h3 className="text-sm font-extrabold text-slate-800 mb-1 group-hover:text-slate-600 transition-colors truncate">
          {book.title}
        </h3>
        <p className="text-xs text-slate-500 font-medium mb-1.5">{book.author}</p>
        <div className="flex items-center justify-between">
           <p className="text-sm font-bold text-slate-900">{formatCurrency(book.price)}</p>
           <span className="text-[9px] font-extrabold text-white bg-slate-800 px-1.5 py-0.5 rounded uppercase tracking-tighter">New</span>
        </div>
      </div>
    </div>
    
    {isDetailOpen && (
      <BookDetailModal 
        book={book} 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
      />
    )}
  </>
  );
}
