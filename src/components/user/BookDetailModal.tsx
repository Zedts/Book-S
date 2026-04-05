/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import Modal from "@/src/components/ui/Modal";
import Notification from "@/src/components/ui/Notification";
import type { Book } from "@/src/types/landing";
import { formatCurrency } from "@/src/lib/utils";
import { useFavorites } from "@/src/hooks/useFavorites";
import { useAuthNavigation } from "@/src/hooks/useAuthNavigation";

export interface BookDetailModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookDetailModal({ book, isOpen, onClose }: BookDetailModalProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { userRole, handleAuthNavigation, isNavigating } = useAuthNavigation();
  const [showToast, setShowToast] = useState(false);

  const favorited = isFavorite(book.id);

  const handleAddToCart = () => {
    if (userRole) {
      setShowToast(true);
    } else {
      handleAuthNavigation();
    }
  };

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title="Detail Buku" 
        size="lg"
      >
        <div className="flex flex-col md:flex-row gap-8 relative z-10 p-2 md:p-4">
          <div className="w-48 h-72 md:w-64 md:h-96 mx-auto rounded-3xl overflow-hidden shadow-2xl shrink-0">
            <img
              src={book.imageUrl}
              alt={book.imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  {book.category?.name || 'Uncategorized'}
                </span>
                <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-2 py-1 rounded-full font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-500" />
                  {book.rating.toFixed(1)}
                </div>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2">
                {book.title}
              </h2>
              <p className="text-base text-slate-600 font-medium mb-6">
                Oleh <span className="font-bold text-slate-700">{book.author}</span>
              </p>
              
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                  Sinopsis
                </h4>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
                  {book.description}
                </p>
              </div>

              <div className="flex flex-col gap-1 mb-8 text-sm font-medium text-slate-500">
                <p>Tersedia: <span className="text-slate-800 font-bold">{book.stock} stok</span></p>
                <p className="flex items-center gap-2">
                  Harga: <span className="text-xl md:text-2xl font-black text-rose-500">{formatCurrency(book.price)}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button 
                variant="primary" 
                className="w-full sm:flex-1 h-14 rounded-2xl gap-3 shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 bg-slate-800 text-white disabled:opacity-70"
                onClick={handleAddToCart}
                disabled={isNavigating}
              >
                <ShoppingCart className="w-5 h-5 text-white" /> 
                <span className="font-bold text-base">
                  {isNavigating ? "Memproses..." : "Tambah ke Keranjang"}
                </span>
              </Button>
              <button
                onClick={() => toggleFavorite(book.id)}
                className="w-full sm:w-14 h-14 rounded-2xl bg-slate-100 text-rose-500 flex items-center justify-center hover:bg-slate-200 transition-colors shadow-sm"
                aria-label="Tambah ke favorit"
              >
                <Heart className={`w-6 h-6 ${favorited ? "fill-rose-500" : ""}`} strokeWidth={favorited ? 0 : 2} />
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Notification 
        isOpen={showToast}
        message={`Buku "${book.title}" berhasil dimasukkan ke keranjang!`}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
