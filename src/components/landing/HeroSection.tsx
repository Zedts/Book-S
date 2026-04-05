/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect } from "react";
import { ArrowRight, Sparkles, Star, Award, Heart } from "lucide-react";
import { useAuthNavigation } from "@/src/hooks/useAuthNavigation";
import { useFavorites } from "@/src/hooks/useFavorites";
import type { Book } from "@/src/types/landing";
import { formatCurrency } from "@/src/lib/utils";

const SOCIAL_PROOF_AVATARS = [
  { src: "https://i.pravatar.cc/100?img=1", alt: "User 1" },
  { src: "https://i.pravatar.cc/100?img=2", alt: "User 2" },
  { src: "https://i.pravatar.cc/100?img=3", alt: "User 3" },
];

export function HeroSection({ books }: { books: Book[] }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      document.body.classList.add("is-loaded");
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="container mx-auto px-6 lg:px-12 min-h-[85vh] md:min-h-[80vh] flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12 md:gap-8">
      <HeroText />
      <HeroVisual books={books} />
    </section>
  );
}

function HeroText() {
  const { handleAuthNavigation, isNavigating } = useAuthNavigation();

  return (
    <div className="lg:w-[55%] flex flex-col items-start on-load-reveal delay-100 relative z-20">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/25 backdrop-blur-md border border-white/40 shadow-[0_4px_24px_0_rgba(0,0,0,0.04)] text-[10px] md:text-xs font-bold uppercase tracking-wider mb-5 md:mb-6 text-slate-700">
        <Sparkles className="w-3 h-3 text-slate-800" />
        Koleksi Kurasi 2026
      </div>

      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-extrabold leading-[1.1] mb-6 tracking-tight text-slate-800 drop-shadow-sm">
        Temukan <br />
        <span className="text-gradient relative inline-block">
          Makna Baru
          <svg
            className="absolute w-full h-3 -bottom-1 left-0 text-slate-300/50 -z-10"
            viewBox="0 0 200 12"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            <path d="M0,10 Q100,-5 200,10 L200,12 L0,12 Z" />
          </svg>
        </span>{" "}
        <br />
        di Tiap Lembar.
      </h1>

      <p className="text-base md:text-xl text-slate-600 mb-8 max-w-lg leading-relaxed font-medium">
        Ruang baca eksklusif dengan kurasi literatur terbaik. Rasakan pengalaman
        membaca yang menenangkan, berwawasan, dan tak terlupakan.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-8">
        <button
          onClick={handleAuthNavigation}
          disabled={isNavigating}
          className="w-full sm:w-auto bg-slate-800 text-white px-8 py-3.5 md:py-4 rounded-full font-semibold hover:bg-slate-900 hover:shadow-xl hover:shadow-slate-300 transition-all flex items-center justify-center gap-2 group duration-300 disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isNavigating ? "Memeriksa Sesi..." : "Jelajahi Koleksi"}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <SocialProof />
    </div>
  );
}

function SocialProof() {
  return (
    <div className="flex items-center gap-4 pt-4 border-t border-slate-200/50 w-full sm:w-auto">
      <div className="flex -space-x-3">
        {SOCIAL_PROOF_AVATARS.map(({ src, alt }) => (
          <img
            key={alt}
            src={src}
            alt={alt}
            className="w-10 h-10 rounded-full border-2 border-stone-50 object-cover"
          />
        ))}
        <div className="w-10 h-10 rounded-full border-2 border-stone-50 bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
          +10k
        </div>
      </div>
      <div className="text-xs md:text-sm font-medium text-slate-600">
        Dipercaya oleh{" "}
        <span className="font-bold text-slate-800">10,000+</span>
        <br />
        pembaca aktif.
      </div>
    </div>
  );
}

function HeroVisual({ books }: { books: Book[] }) {
  const mainBook = books.length > 0 ? books[0] : null;
  const secondaryBook = books.length > 1 ? books[1] : null;

  return (
    <div className="lg:w-[45%] relative h-112.5 md:h-137.5 w-full flex items-center justify-center on-load-reveal delay-300 mt-10 lg:mt-0">
      <div className="absolute w-62.5 h-62.5 md:w-80 md:h-80 bg-slate-300 rounded-full filter blur-[70px] opacity-70 translate-x-10 translate-y-10" />
      <div className="absolute w-50 h-50 md:w-62.5 md:h-62.5 bg-stone-300 rounded-full filter blur-[60px] opacity-60 -translate-x-10 -translate-y-10" />

      <div className="relative flex items-center justify-center w-full max-w-[320px] md:max-w-105 mt-8">
        <SecondaryBookCard book={secondaryBook} />
        <MainBookCard book={mainBook} />
        <RatingBadge />
        <CategoryBadge />
      </div>
    </div>
  );
}

function SecondaryBookCard({ book }: { book: Book | null }) {
  if (!book) return null;

  return (
    <div className="absolute -left-6 md:-left-12 top-4 md:top-8 w-50 md:w-60 bg-white/65 backdrop-blur-[32px] backdrop-saturate-200 border border-white/80 shadow-[0_8px_32px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] p-2 rounded-2xl transform -rotate-12 opacity-90 animate-float-delayed z-10 scale-90">
      <div className="w-full aspect-3/4 rounded-xl overflow-hidden relative shadow-inner">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] z-10" />
        <img
          src={book.imageUrl}
          alt={book.imageAlt}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

function MainBookCard({ book }: { book: Book | null }) {
  const { handleAuthNavigation } = useAuthNavigation();
  const { toggleFavorite, isFavorite } = useFavorites();

  if (!book) return null;

  const favorited = isFavorite(book.id);

  return (
    <div className="relative w-60 md:w-70 bg-white/50 backdrop-blur-2xl p-4 rounded-3xl border-2 border-white/80 shadow-[0_20px_50px_rgba(15,23,42,0.15)] flex flex-col items-center z-20 animate-float transform translate-x-6 md:translate-x-12">
      <div className="w-full aspect-3/4 rounded-2xl overflow-hidden mb-4 relative group shadow-md">
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10" />

        <img
          src={book.imageUrl}
          alt={book.imageAlt}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        <div 
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(book.id);
          }}
          className="absolute top-3 right-3 z-20 bg-white/80 backdrop-blur-sm p-2 rounded-full cursor-pointer hover:bg-white hover:scale-110 transition-all shadow-sm"
        >
          <Heart className={`w-4 h-4 text-rose-500 ${favorited ? "fill-rose-500" : ""}`} strokeWidth={favorited ? 0 : 2} />
        </div>

        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 group-hover:bottom-4 transition-all duration-500 z-20 opacity-0 group-hover:opacity-100 w-[80%]">
          <button onClick={handleAuthNavigation} className="w-full bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold px-4 py-2.5 rounded-full shadow-lg hover:bg-slate-800 hover:text-white transition-colors">
            Lihat Pratinjau
          </button>
        </div>
      </div>

      <div className="w-full px-1 pb-1">
        <div className="flex justify-between items-start mb-2">
          <div className="truncate pr-2">
            <p className="text-[10px] md:text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1 truncate">
              {book.category?.name || "Kategori"}
            </p>
            <h3 className="text-lg md:text-xl font-extrabold text-slate-800 leading-tight truncate">
              {book.title}
            </h3>
          </div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm md:text-base text-slate-700 font-bold">{formatCurrency(book.price)}</p>
          <div className="bg-slate-800 text-white px-2 py-1 rounded-md text-[10px] font-bold tracking-wider">
            NEW
          </div>
        </div>
      </div>
    </div>
  );
}

function RatingBadge() {
  return (
    <div
      className="absolute -right-4 md:-right-8 top-1/4 bg-white/65 backdrop-blur-[32px] backdrop-saturate-200 border border-white/80 shadow-[0_8px_32px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] pl-2 pr-4 py-2 rounded-full flex items-center gap-3 z-30 animate-float"
      style={{ animationDelay: "1.5s" }}
    >
      <div className="w-10 h-10 rounded-full bg-white/90 shadow-sm flex items-center justify-center relative">
        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
      </div>
      <div className="flex flex-col justify-center">
        <span className="text-sm font-extrabold text-slate-800 leading-none mb-0.5">4.9 / 5.0</span>
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Top Rating</span>
      </div>
    </div>
  );
}

function CategoryBadge() {
  return (
    <div
      className="absolute -left-2 md:-left-8 bottom-[20%] bg-white/65 backdrop-blur-[32px] backdrop-saturate-200 border border-white/80 shadow-[0_8px_32px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] px-4 py-3 rounded-2xl flex items-center gap-3 z-30 animate-float"
      style={{ animationDelay: "0.5s" }}
    >
      <div className="bg-slate-800 text-white p-2.5 rounded-xl shadow-inner">
        <Award className="w-4 h-4" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
          Kategori
        </span>
        <span className="text-xs font-extrabold text-slate-800">Best Seller</span>
      </div>
    </div>
  );
}
