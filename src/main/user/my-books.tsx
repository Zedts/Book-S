/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, CheckCircle, Clock, ShoppingBag } from "lucide-react";
import UserLayout from "@/src/components/layout/UserLayout";
import BookCardHorizontal from "@/src/components/user/BookCardHorizontal";      
import { useUserOrders } from "@/src/hooks/useUserOrders";
import { formatCurrency } from "@/src/lib/utils";
import Modal from "@/src/components/ui/Modal";
import { Button } from "@/src/components/ui/Button";
import { ProgressModal } from "@/src/components/user/ProgressModal";
import { RatingModal } from "@/src/components/user/RatingModal";
import type { Book } from "@/src/types/landing";
import type { OrderItem } from "@/src/types/order";

type UserBookProgressData = {
  id: string;
  status: "reading" | "completed";
  progress: number;
  book: Book;
};

export default function UserMyBooks() {
  const router = useRouter();
  const { 
    user,
    orders,
    progresses,
    loading: isLoading,
    refreshData
  } = useUserOrders();

  const [selectedProgress, setSelectedProgress] = useState<UserBookProgressData | null>(null);
  const [selectedRatingBook, setSelectedRatingBook] = useState<{ id: string; title: string } | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  if (!user) return null;

  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing');

  // Filter buku yang sedang pending / processing
  const pendingBookIds = new Set(
    pendingOrders.flatMap(order => order.orderItems.map(item => item.book.id))
  );

  const readingBooks = (progresses as UserBookProgressData[]).filter((p) => p.status === "reading" && !pendingBookIds.has(p.book.id));        
  const completedBooks = (progresses as UserBookProgressData[]).filter((p) => p.status === "completed" && !pendingBookIds.has(p.book.id));    

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
            {/* Menunggu Konfirmasi */}
            <section className="space-y-6 reveal">
              <div className="flex items-center gap-2 text-amber-600">
                <ShoppingBag className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Menunggu Konfirmasi</h2>
              </div>

              {pendingOrders.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {pendingOrders.map((order) => (
                    <div 
                      key={order.id} 
                      className="bg-white rounded-2xl border border-slate-200/60 p-6 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm hover:border-amber-300 transition-colors gap-4"
                    >
                      <div>
                        <span className="inline-block px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full uppercase mb-2">
                          {order.status}
                        </span>
                        <h3 className="font-bold text-slate-800 text-lg">Pesanan {order.id.slice(0, 8).toUpperCase()}</h3>
                        <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</p>
                        <p className="text-slate-700 font-semibold mt-1 text-sm">{order.orderItems.length} Buku &bull; {formatCurrency(order.total)}</p>
                      </div>
                      
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="px-5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold rounded-xl transition-colors w-full md:w-auto"
                      >
                        Lihat Detail
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                  <p className="text-slate-500 font-medium">Tidak ada pesanan yang sedang menunggu konfirmasi.</p>
                </div>
              )}
            </section>

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

      {selectedOrder && (
        <Modal 
          isOpen={true} 
          onClose={() => setSelectedOrder(null)}
          title="Detail Pesanan (Invoice)"
          size="md"
        >
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">ID Pesanan</p>
                <p className="font-mono font-bold text-slate-800 text-lg">{selectedOrder.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Status</p>
                <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-3 mb-4">Daftar Buku</h4>
              <ul className="space-y-4">
                {selectedOrder.orderItems.map((item, idx) => (
                  <li key={idx} className="flex gap-4">
                    <img 
                      src={item.book.imageUrl || '/placeholder-book.jpg'} 
                      alt={item.book.title} 
                      className="w-12 h-16 object-cover rounded-md border border-slate-200/60" 
                    />
                    <div className="flex-1">
                      <p className="font-bold text-slate-800">{item.book.title}</p>
                      <p className="text-xs text-slate-500 mb-1">{item.book.author}</p>
                      <p className="font-semibold text-slate-700"><span className="text-slate-400">1x</span> {formatCurrency(item.price)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-600 mb-2">
                <span>Metode Pembayaran</span>
                <span>{selectedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold text-slate-600 mb-4">
                <span>Status Pembayaran</span>
                <span className={selectedOrder.paymentStatus === 'paid' ? "text-emerald-600 uppercase" : "text-amber-600 uppercase"}>
                  {selectedOrder.paymentStatus}
                </span>
              </div>
              <div className="flex flex-col gap-2 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-indigo-900">Total Harga</span>
                  <span className="text-xl font-black text-indigo-700">{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
              <Button 
                variant="primary" 
                className="w-full mt-4 justify-center" 
                onClick={() => {
                  setSelectedOrder(null);
                  router.push('/user/cart');
                }}
              >
                Lihat Pesanan
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {selectedProgress && (
        <ProgressModal
          isOpen={true}
          onClose={() => setSelectedProgress(null)}
          bookId={selectedProgress.book.id}
          bookTitle={selectedProgress.book.title}
          initialStatus={selectedProgress.status}
          initialProgress={selectedProgress.progress}
          onUpdateSuccess={refreshData}
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