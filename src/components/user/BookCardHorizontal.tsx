/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Sparkles, Heart, Star } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import BookDetailModal from "@/src/components/user/BookDetailModal";
import type { Book } from "@/src/types/landing";
import { formatCurrency } from "@/src/lib/utils";
import { useFavorites } from "@/src/hooks/useFavorites";

export default function BookCardHorizontal({
  book,
  progress,
  statusBadge,
  hidePrice,
  actionLabel,
  onActionClick,
  showRating,
  onRatingClick
}: {
  book: Book;
  progress?: number;
  statusBadge?: React.ReactNode;
  hidePrice?: boolean;
  actionLabel?: string;
  onActionClick?: (e: React.MouseEvent) => void;
  showRating?: boolean;
  onRatingClick?: (e: React.MouseEvent) => void;
}) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const favorited = isFavorite(book.id);

  return (
    <>
      <div className="group relative bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl p-4 md:p-5 flex gap-4 md:gap-6 hover:bg-white/60 transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 reveal overflow-hidden">
        <div className="w-24 h-32 md:w-32 md:h-44 rounded-2xl overflow-hidden shadow-2xl shrink-0 group-hover:scale-105 transition-transform duration-500">
          <img
            src={book.imageUrl}
            alt={book.imageAlt}
            className="w-full h-full object-cover object-top"
          />
        </div>

        <div className="flex-1 text-left min-w-0 w-full flex flex-col">
          <div className="flex items-start sm:items-center justify-between gap-2 mb-2 w-full">
            <div className="flex items-center gap-2 truncate pr-2">
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">
                {book.category?.name || 'Uncategorized'}
              </span>
              <div className="hidden sm:flex shrink-0 items-center gap-1 text-amber-500 font-bold text-[10px] bg-amber-50 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" /> New
              </div>
            </div>
            {statusBadge && (
              <div className="shrink-0 flex-none">
                {statusBadge}
              </div>
            )}
          </div>
          <h4 className="text-base sm:text-lg font-extrabold text-slate-800 mb-1 group-hover:text-slate-600 transition-colors truncate">
            {book.title}
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mb-4 truncate">
            {book.author}
          </p>

          {progress !== undefined && (
            <div className="w-full mb-4">
              <div className="flex justify-between text-xs font-semibold mb-1.5 text-slate-500">
                <span>Progress Membaca</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full h-full -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mt-auto pt-2 w-full">
            {!hidePrice && (
              <p className="text-lg xl:text-xl font-black text-slate-900 leading-none">
                {formatCurrency(book.price)}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:justify-end">
              {showRating && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onRatingClick) onRatingClick(e);
                  }}
                  aria-label="Beri rating"
                  className="w-10 h-10 rounded-xl bg-white text-amber-500 border border-slate-200 flex items-center justify-center shadow-md hover:shadow-lg transition-transform hover:scale-105 shrink-0"
                >
                  <Star className="w-5 h-5" strokeWidth={2.5} />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(book.id);
                }}
                aria-label="Toggle favorite"
                className="w-10 h-10 rounded-xl bg-white text-rose-500 border border-slate-200 flex items-center justify-center shadow-md hover:shadow-lg transition-transform hover:scale-105 shrink-0"
              >
                <Heart className={`w-5 h-5 ${favorited ? "fill-rose-500" : ""}`} strokeWidth={favorited ? 0 : 2} />
              </button>
              <Button
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onActionClick) {
                    onActionClick(e);
                  } else {
                    setIsDetailOpen(true);
                  }
                }}
                className="flex-1 sm:flex-none sm:w-auto h-10 px-3 sm:px-6 rounded-xl text-xs sm:text-sm bg-slate-800 text-white shadow-md hover:shadow-lg min-w-[100px] truncate"
              >
                {actionLabel || "Detail Buku"}
              </Button>
            </div>
          </div>
        </div>

        {/* Subtle background glow */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-slate-400/5 rounded-full blur-2xl group-hover:bg-slate-400/10 transition-colors pointer-events-none" />
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
