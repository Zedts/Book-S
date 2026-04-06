"use client";

import { Heart } from "lucide-react";
import UserLayout from "@/src/components/layout/UserLayout";
import BookCard from "@/src/components/user/BookCard";
import { useRequireRole } from "@/src/hooks/useRequireRole";
import { useFavorites } from "@/src/hooks/useFavorites";
import type { Book } from "@/src/types/landing";

export default function UserFavorites({
  initialBooks
}: {
  initialBooks: Book[];
}) {
  const { user } = useRequireRole("users");
  const { favorites } = useFavorites();

  const favoriteBooks = initialBooks.filter(book => favorites.includes(book.id));

  const displayBooks = favoriteBooks;

  if (!user) return null;

  return (
    <UserLayout>
      <div className="space-y-12 pb-16">
        
        <header className="space-y-2 on-load-reveal">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-rose-100 text-rose-500 rounded-2xl shadow-sm border border-rose-200/50">
              <Heart className="w-8 h-8 fill-current" />
            </span>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-800 tracking-tight">
              Buku Favorit
            </h1>
          </div>
          <p className="text-slate-500 text-lg max-w-2xl mt-4">
            Kumpulan buku-buku spesial yang telah Anda simpan dan paling Anda sukai.
          </p>
        </header>

        <section className="space-y-8 reveal stagger-1">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
            <h2 className="text-xl font-bold text-slate-800">
              Disimpan oleh Anda
            </h2>
            <p className="text-sm font-medium px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
              {displayBooks.length} buku
            </p>
          </div>

          {displayBooks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10">
              {displayBooks.map((book, index) => (
                <div key={book.id} className="reveal relative" style={{ transitionDelay: `${(index % 8) * 100}ms` }}>
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-[2rem]">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-rose-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Belum ada buku favorit</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                Tambahkan buku pertama Anda dengan menekan ikon hati pada kartu buku yang Anda temukan.
              </p>
            </div>
          )}
        </section>

      </div>
    </UserLayout>
  );
}
