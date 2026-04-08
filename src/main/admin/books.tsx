/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { GlassCard } from "@/src/components/ui/GlassCard";
import { Trash2, Edit2, Loader2, Book, Info } from "lucide-react";
import { getBooks, createBook, updateBook, deleteBook } from "@/src/lib/actions/book";
import { getCategories } from "@/src/lib/actions/category";
import Notification from "@/src/components/ui/Notification";
import { useNotification } from "@/src/hooks/useNotification";
import { formatCurrency } from "@/src/lib/utils";

import { AdminPageHeader } from "@/src/components/admin/AdminPageHeader";
import { AdminSearchToolbar } from "@/src/components/admin/AdminSearchToolbar";
import { AdminDeleteConfirmModal } from "@/src/components/admin/AdminDeleteConfirmModal";
import { BookFormModal } from "@/src/components/admin/BookFormModal";

import type { Book as BookType, Category } from "@/src/types/landing";

export default function AdminBooks() {
  const [books, setBooks] = useState<BookType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { 
    isOpen: notifOpen, 
    message: notifMessage, 
    type: notifType, 
    showNotification, 
    onClose: hideNotif 
  } = useNotification();

  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: 0,
    stock: 0,
    imageUrl: "",
    categoryId: "",
    isFeatured: false
  });

  const fetchData = async () => {
    try {
      const [booksRes, catsRes] = await Promise.all([
        getBooks(),
        getCategories()
      ]);
      if (Array.isArray(booksRes)) setBooks(booksRes as BookType[]);
      if (Array.isArray(catsRes)) setCategories(catsRes);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ title: "", author: "", description: "", price: 0, stock: 0, imageUrl: "", categoryId: "", isFeatured: false });
    setIsModalOpen(true);
  };

  const openEditModal = (book: BookType) => {
    setIsEditing(true);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description || "",
      price: book.price || 0,
      stock: book.stock || 0,
      imageUrl: book.imageUrl || "",
      categoryId: book.categoryId || "",
      isFeatured: book.isFeatured || false
    });
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("author", formData.author);
      data.append("description", formData.description);
      data.append("price", formData.price.toString());
      data.append("stock", formData.stock.toString());
      data.append("categoryId", formData.categoryId);
      data.append("imageUrl", formData.imageUrl);
      data.append("isFeatured", formData.isFeatured.toString());

      if (isEditing && selectedBook) {
        const res = await updateBook(selectedBook.id, data);
        if (res.success) {
          showNotification(res.message, "success");
          fetchData();
          setIsModalOpen(false);
        } else {
          showNotification(res.message, "error");
        }
      } else {
        const res = await createBook(data);
        if (res.success) {
          showNotification(res.message, "success");
          fetchData();
          setIsModalOpen(false);
        } else {
          showNotification(res.message, "error");
        }
      }
    } catch (error) {
      console.error(error);
      showNotification("Terjadi kesalahan sistem.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedBook) return;
    setIsDeleting(true);
    try {
      const res = await deleteBook(selectedBook.id);
      if (res.success) {
        setBooks(books.filter(b => b.id !== selectedBook.id));
        showNotification(res.message, "success");
        setIsDeleteModalOpen(false);
      } else {
        showNotification(res.message, "error");
      }
    } catch (error) {
      console.error(error);
      showNotification("Terjadi kesalahan saat menghapus buku.", "error");
    } finally {
      setIsDeleting(false);
      setSelectedBook(null);
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8 pb-12 reveal active">
        <AdminPageHeader 
          title="Katalog Buku" 
          description="Kelola koleksi buku, harga, dan ketersediaan stok."
          actionLabel="Tambah Buku"
          onActionClick={openAddModal}
        />

        <AdminSearchToolbar 
          placeholder="Cari judul atau penulis buku..."
          value={searchQuery}
          onChange={setSearchQuery}
        />

        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-slate-800" />
                <p>Memuat katalog buku...</p>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Book className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Tidak ada buku ditemukan</h3>
                <p className="text-slate-500">Pencarian tidak cocok dengan buku manapun.</p>
              </div>
            ) : (
              <table className="w-full text-left whitespace-nowrap min-w-[1000px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Informasi Buku</th>
                    <th className="px-6 py-4">Kategori</th>
                    <th className="px-6 py-4">Harga</th>
                    <th className="px-6 py-4">Stok</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-16 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0 border border-slate-200 shadow-sm transition-transform group-hover:scale-105">
                            {book.imageUrl ? (
                              <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                <Book className="w-5 h-5 text-slate-400" />
                              </div>
                            )}
                          </div>
                          <div className="max-w-[300px]">
                            <div className="font-bold text-slate-800 truncate" title={book.title}>{book.title}</div>
                            <div className="text-sm text-slate-500 mt-1">{book.author}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200/50">
                          {book.category?.name || "Uncategorized"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{formatCurrency(book.price)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 font-medium ${(book.stock || 0) <= 5 ? "text-rose-600" : "text-slate-700"}`}>
                          {(book.stock || 0) <= 5 && <Info className="w-4 h-4" />}
                          {book.stock || 0} unit
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 transition-opacity">
                          <button 
                            onClick={() => openEditModal(book)}
                            className="p-2 text-slate-400 hover:text-slate-800 bg-white rounded-lg shadow-sm border border-slate-200 transition-colors" 
                            title="Edit Buku"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { setSelectedBook(book); setIsDeleteModalOpen(true); }}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 bg-white rounded-lg shadow-sm border border-slate-200 transition-colors" 
                            title="Hapus Buku"
                          >
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

      <BookFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        isEditing={isEditing}
        formData={formData}
        setFormData={setFormData}
        isSubmitting={isSubmitting}
        categories={categories}
      />

      <AdminDeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Buku"
        message="Anda akan menghapus buku"
        itemName={selectedBook?.title}
        isDeleting={isDeleting}
      />

      <Notification 
        isOpen={notifOpen}
        message={notifMessage}
        type={notifType}
        onClose={hideNotif}
      />
    </AdminLayout>
  );
}
