"use client";

import { BookOpen, CheckCircle, Clock } from "lucide-react";
import UserLayout from "@/src/components/layout/UserLayout";
import BookCardHorizontal from "@/src/components/user/BookCardHorizontal";
import { useRequireRole } from "@/src/hooks/useRequireRole";
import type { Book } from "@/src/types/landing";

export default function UserMyBooks({
  initialBooks
}: {
  initialBooks: Book[];
}) {
  const { user } = useRequireRole("users");

  if (!user) return null;

  // Deriving reading and completed books from user data (none available yet)
  const readingBooks: (Book & { progress?: number })[] = [];
  const completedBooks: (Book & { progress?: number })[] = [];

  return (
    <UserLayout>
      <div className="space-y-12 pb-16">
        
        <header className="space-y-2 on-load-reveal">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-800 tracking-tight">
            Progress
          </h1>
          <p className="text-slate-500 text-lg">
            Lacak buku yang sedang Anda baca dan yang telah diselesaikan.
          </p>
        </header>

        {/* Currently Reading */}
        <section className="space-y-6 reveal stagger-1">
          <div className="flex items-center gap-2 text-indigo-600">
            <Clock className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Sedang Dibaca</h2>
          </div>
          
          {readingBooks.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {readingBooks.map((book) => (
                <div key={book.id} className="relative group">
                  <BookCardHorizontal 
                    book={book} 
                    progress={book.progress}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700">Belum Ada Buku</h3>
              <p className="text-slate-500">Anda belum mulai membaca buku apa pun.</p>
            </div>
          )}
        </section>

        {/* Completed */}
        <section className="space-y-6 reveal stagger-2">
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Selesai Dibaca</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedBooks.map((book) => (
              <div key={book.id} className="relative group opacity-90 hover:opacity-100 transition-opacity">
                <BookCardHorizontal 
                  book={book} 
                  statusBadge={
                    <div className="bg-emerald-500 text-white p-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  }
                />
              </div>
            ))}
          </div>
        </section>

      </div>
    </UserLayout>
  );
}
