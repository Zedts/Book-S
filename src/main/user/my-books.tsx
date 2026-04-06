"use client";

import { useEffect, useState } from "react";
import { BookOpen, CheckCircle, Clock } from "lucide-react";
import UserLayout from "@/src/components/layout/UserLayout";
import BookCardHorizontal from "@/src/components/user/BookCardHorizontal";      
import { useRequireRole } from "@/src/hooks/useRequireRole";
import { getUserProgress } from "@/src/lib/actions/progress";
import { ProgressModal } from "@/src/components/user/ProgressModal";
import { RatingModal } from "@/src/components/user/RatingModal";
import type { Book } from "@/src/types/landing";

type UserBookProgressData = {
  id: string;
  status: "reading" | "completed";
  progress: number;
  book: Book;
};

export default function UserMyBooks() {
  const { user } = useRequireRole("users");
  const [progresses, setProgresses] = useState<UserBookProgressData[]>([]);     
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProgress, setSelectedProgress] = useState<UserBookProgressData | null>(null);
  const [selectedRatingBook, setSelectedRatingBook] = useState<{ id: string; title: string } | null>(null);

  const fetchProgresses = async () => {
    setIsLoading(true);
    const res = await getUserProgress();
    if (res.success && res.data) {
      setProgresses(res.data as UserBookProgressData[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user) fetchProgresses();
  }, [user]);

  if (!user) return null;

  const readingBooks = progresses.filter((p) => p.status === "reading");        
  const completedBooks = progresses.filter((p) => p.status === "completed");    

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="space-y-4 reveal">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full font-semibold">
            <BookOpen className="w-5 h-5" />
            <span>Koleksi Buku</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900">
            Progress
          </h1>
          <p className="text-slate-500 text-lg">
            Lacak buku yang sedang Anda baca dan yang telah diselesaikan.       
          </p>
        </header>

        {isLoading ? (
           <div className="py-24 text-center">
             <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
             <p className="text-slate-500 font-medium animate-pulse">Memuat progress membaca Anda...</p>
           </div>
        ) : (
          <>
            {/* Currently Reading */}
            <section className="space-y-6 reveal stagger-1">
              <div className="flex items-center gap-2 text-indigo-600">
                <Clock className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Sedang Dibaca</h2>
              </div>

              {readingBooks.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {readingBooks.map((prog) => (
                    <div key={prog.book.id} className="relative group">
                      <BookCardHorizontal
                        book={prog.book}
                        progress={prog.progress}
                        hidePrice={true}
                        actionLabel="Edit Progress"
                        onActionClick={() => setSelectedProgress(prog)}
                        showRating={true}
                        onRatingClick={() => setSelectedRatingBook({ id: prog.book.id, title: prog.book.title })}
                        statusBadge={
                          <div className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold border border-indigo-200 shadow-sm pointer-events-none">
                            Update
                          </div>
                        }
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

              {completedBooks.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {completedBooks.map((prog) => (
                    <div key={prog.book.id} className="relative group opacity-90 hover:opacity-100 transition-opacity">
                      <BookCardHorizontal
                        book={prog.book}
                        hidePrice={true}
                        actionLabel="Edit Progress"
                        onActionClick={() => setSelectedProgress(prog)}
                        showRating={true}
                        onRatingClick={() => setSelectedRatingBook({ id: prog.book.id, title: prog.book.title })}
                        statusBadge={
                          <div className="bg-emerald-500 text-white p-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)] pointer-events-none">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                        }
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                  <p className="text-slate-500 font-medium">Buku yang selesai dibaca akan tampil di sini.</p>
                </div>
              )}
            </section>
          </>
        )}

      </div>

      {selectedProgress && (
        <ProgressModal
          isOpen={true}
          onClose={() => setSelectedProgress(null)}
          bookId={selectedProgress.book.id}
          bookTitle={selectedProgress.book.title}
          initialStatus={selectedProgress.status}
          initialProgress={selectedProgress.progress}
          onUpdateSuccess={fetchProgresses}
        />
      )}
      {selectedRatingBook && (
        <RatingModal
          isOpen={true}
          onClose={() => setSelectedRatingBook(null)}
          bookId={selectedRatingBook.id}
          bookTitle={selectedRatingBook.title}
        />
      )}
    </UserLayout>
  );
}