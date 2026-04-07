/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { GlassCard } from "@/src/components/ui/GlassCard";
import { Button } from "@/src/components/ui/Button";
import { Plus, Search, Edit2, Trash2, Filter, Loader2 } from "lucide-react";
import { getBooks } from "@/src/lib/actions/book";
import { formatCurrency } from "@/src/lib/utils";

type BookCategory = { id: string; name: string };
type BookItem = {
  id: string;
  title: string;
  author: string;
  price: number;
  stock: number;
  imageUrl: string;
  category?: BookCategory | null;
};

export default function AdminBooks() {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchAllBooks = async () => {
      try {
        const res = await getBooks();
        if (mounted && Array.isArray(res)) {
          setBooks(res as BookItem[]);
        }
      } catch (error) {
        console.error("Failed to load books:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchAllBooks();
    return () => { mounted = false; };
  }, []);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8 pb-12 reveal active">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Kelola Buku</h1>
            <p className="text-slate-500 mt-1">Atur daftar buku, stok, dan harga.</p>
          </div>
          <Button variant="primary" className="shrink-0 group">
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span>Tambah Buku</span>
          </Button>
        </div>

        {/* Toolbar */}
        <GlassCard className="p-4 flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul buku atau penulis..."
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="hidden sm:flex px-4 py-2 text-slate-600 font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 !shadow-none gap-2 items-center">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </GlassCard>

        {/* Content */}
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-slate-800" />
                <p>Memuat data buku...</p>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Tidak ada buku ditemukan</h3>
                <p className="text-slate-500">Coba kata kunci lain atau tambahkan buku baru.</p>
              </div>
            ) : (
              <table className="w-full text-left whitespace-nowrap min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Info Buku</th>
                    <th className="px-6 py-4">Kategori</th>
                    <th className="px-6 py-4">Harga</th>
                    <th className="px-6 py-4 text-center">Stok</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-16 bg-slate-200 rounded shrink-0 overflow-hidden shadow-sm">
                            {book.imageUrl && (
                              <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{book.title}</p>
                            <p className="text-sm text-slate-500">{book.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200/50">
                          {book.category?.name || "Tidak ada"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700">
                        {formatCurrency(book.price)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center justify-center min-w-[2rem] h-8 px-2 rounded-full text-sm font-bold ${
                            book.stock > 10 ? "bg-emerald-100 text-emerald-700" : book.stock > 0 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                          }`}>
                          {book.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 transition-opacity">
                          <button className="p-2 text-slate-400 hover:text-slate-800 bg-white rounded-lg shadow-sm border border-slate-200 transition-colors" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-rose-600 bg-white rounded-lg shadow-sm border border-slate-200 transition-colors" title="Hapus">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </GlassCard>
      </div>
    </AdminLayout>
  );
}
