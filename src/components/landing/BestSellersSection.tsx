import { ArrowRight, ArrowUpRight, Star } from "lucide-react";
import type { Book } from "@/src/types/landing";

const BEST_SELLERS: Book[] = [
  {
    id: "arsitektur-minimalis",
    title: "Arsitektur Minimalis",
    author: "Elena Rostova",
    category: "Desain",
    price: "Rp 185.000",
    rating: 4.8,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400&h=600",
    imageAlt: "Arsitektur Minimalis",
    staggerClass: "stagger-1",
  },
  {
    id: "seni-berpikir-jernih",
    title: "Seni Berpikir Jernih",
    author: "Rolf Dobelli",
    category: "Filosofi",
    price: "Rp 120.000",
    rating: 4.9,
    imageUrl:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400&h=600",
    imageAlt: "Seni Berpikir Jernih",
    staggerClass: "stagger-2",
  },
  {
    id: "filosofi-teras",
    title: "Filosofi Teras",
    author: "Henry Manampiring",
    category: "Gaya Hidup",
    price: "Rp 98.000",
    rating: 4.7,
    imageUrl:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400&h=600",
    imageAlt: "Filosofi Teras",
    staggerClass: "stagger-3",
  },
  {
    id: "ruang-cahaya",
    title: "Ruang & Cahaya",
    author: "Tadao Ando",
    category: "Arsitektur",
    price: "Rp 210.000",
    rating: 5.0,
    imageUrl:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400&h=600",
    imageAlt: "Ruang & Cahaya",
    staggerClass: "stagger-4",
  },
];

export default function BestSellersSection() {
  return (
    <section className="container mx-auto px-6 lg:px-12 mt-24 md:mt-32">
      <SectionHeader />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {BEST_SELLERS.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}

function SectionHeader() {
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
      <button className="hidden md:flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors group mt-4 md:mt-0">
        Lihat Semua{" "}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

function BookCard({ book }: { book: Book }) {
  return (
    <div className={`group cursor-pointer reveal ${book.staggerClass}`}>
      <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full rounded-3xl overflow-hidden bg-white/25 backdrop-blur-[12px] border border-white/40 shadow-[0_4px_24px_0_rgba(0,0,0,0.04)] p-2 md:p-3 mb-4 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2">
        <img
          src={book.imageUrl}
          alt={book.imageAlt}
          className="w-full h-full object-cover rounded-2xl"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl flex items-center justify-center">
          <button className="bg-slate-800 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-full text-sm md:text-base font-semibold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
            Lihat Detail <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Rating badge */}
        <div className="absolute top-4 right-4 md:top-5 md:right-5 bg-white/70 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] md:text-xs font-bold text-slate-800 flex items-center gap-1 shadow-sm">
          <Star className="w-3 h-3 fill-slate-800" /> {book.rating}
        </div>
      </div>

      {/* Book info */}
      <div className="px-2">
        <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest mb-1.5">
          {book.category}
        </p>
        <h3 className="text-base md:text-lg font-bold text-slate-800 mb-1 group-hover:text-slate-600 transition-colors">
          {book.title}
        </h3>
        <p className="text-xs md:text-sm text-slate-500 font-medium mb-2">{book.author}</p>
        <p className="text-sm md:text-base font-extrabold text-slate-800">{book.price}</p>
      </div>
    </div>
  );
}
