/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/src/lib/utils";

interface CartItemCardProps {
  id: string; // CartItem ID
  bookTitle: string;
  bookAuthor: string;
  bookCategory: string;
  price: number;
  imageUrl: string;
  imageAlt: string;
  quantity: number;
  stock: number;
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  isUpdating?: boolean;
}

export function CartItemCard({
  id,
  bookTitle,
  bookAuthor,
  bookCategory,
  price,
  imageUrl,
  imageAlt,
  quantity,
  stock,
  onUpdateQuantity,
  onRemove,
  isSelected,
  onToggleSelect,
  isUpdating
}: CartItemCardProps) {
  return (
    <div className="group relative bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl p-4 md:p-5 flex gap-4 md:gap-6 hover:bg-white/60 transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1">
      {/* Checkbox */}
      {onToggleSelect && (
        <div className="flex items-center justify-center shrink-0">
          <input 
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(id)}
            className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer shadow-sm"
          />
        </div>
      )}

      {/* Image */}
      <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-2xl overflow-hidden shadow-md shrink-0 group-hover:scale-105 transition-transform duration-500">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col min-w-0 w-full">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">
            {bookCategory || 'Uncategorized'}
          </span>
          <button 
            onClick={() => onRemove(id)}
            disabled={isUpdating}
            className="text-red-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors disabled:opacity-50"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        
        <h4 className="text-base sm:text-lg font-extrabold text-slate-800 mb-1 group-hover:text-slate-600 transition-colors truncate">
          {bookTitle}
        </h4>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mb-3 truncate">
          {bookAuthor}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-auto gap-3">
          <p className="text-lg xl:text-xl font-black text-slate-900 leading-none">
            {formatCurrency(price)}
          </p>

          <div className="flex items-center justify-between gap-3">
            {/* Quantity Controller */}
            <div className="flex items-center bg-slate-100/50 rounded-xl p-1 border border-slate-200">
              <button 
                onClick={() => onUpdateQuantity(id, quantity - 1)}
                disabled={quantity <= 1 || isUpdating}
                className="p-1 sm:p-2 bg-white rounded-lg shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600"
              >
                <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              
              <span className="w-10 sm:w-12 text-center text-sm font-bold text-slate-800">
                {quantity}
              </span>
              
              <button 
                onClick={() => onUpdateQuantity(id, quantity + 1)}
                disabled={quantity >= stock || isUpdating}
                className="p-1 sm:p-2 bg-white rounded-lg shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
            
            {(quantity >= stock) && (
              <span className="text-[10px] sm:text-xs font-bold text-amber-500 max-w-[80px] leading-tight">
                Max stok tercapai
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
