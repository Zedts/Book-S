"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import type { Book } from "@/src/types/landing";

export default function BookCardHorizontal({ book }: { book: Book }) {
  return (
    <div className="group relative overflow-hidden flex flex-col sm:flex-row items-center gap-6 p-6 rounded-4xl bg-white/40 backdrop-blur-lg border border-white/60 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="w-32 h-44 sm:w-28 sm:h-36 rounded-2xl overflow-hidden shadow-2xl shrink-0 group-hover:scale-105 transition-transform duration-500">
        <img
          src={book.imageUrl}
          alt={book.imageAlt}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-between mb-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {book.category}
          </span>
          <div className="hidden sm:flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" /> New
          </div>
        </div>
        <h4 className="text-lg font-extrabold text-slate-800 mb-1 group-hover:text-slate-600 transition-colors">
          {book.title}
        </h4>
        <p className="text-sm text-slate-500 font-medium mb-4">
          {book.author}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xl font-black text-slate-900 leading-none">
            {book.price}
          </p>
          <Button
            variant="primary"
            className="w-full sm:w-auto h-10 px-6 rounded-xl text-xs bg-slate-800 text-white shadow-md hover:shadow-lg"
          >
            Detail Buku
          </Button>
        </div>
      </div>

      {/* Subtle background glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-slate-400/5 rounded-full blur-2xl group-hover:bg-slate-400/10 transition-colors" />
    </div>
  );
}
