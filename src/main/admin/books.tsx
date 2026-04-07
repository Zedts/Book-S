/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { GlassCard } from "@/src/components/ui/GlassCard";
import { Button } from "@/src/components/ui/Button";
import Modal from "@/src/components/ui/Modal";
import Notification from "@/src/components/ui/Notification";
import { Plus, Search, Edit2, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { getBooks, createBook, updateBook, deleteBook } from "@/src/lib/actions/book";
import { getCategories, createCategory } from "@/src/lib/actions/category";
import { formatCurrency } from "@/src/lib/utils";

type BookCategory = { id: string; name: string };
type BookItem = {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  isFeatured: boolean;
  category?: BookCategory | null;
  categoryId?: string;
};

export default function AdminBooks() {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [categories, setCategories] = useState<BookCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);

  const [notif, setNotif] = useState<{ isOpen: boolean; message: string; type: "success" | "error" }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    stock: "",
    categoryName: "",
    isFeatured: false,
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [booksRes, catsRes] = await Promise.all([
        getBooks(),
        getCategories()
      ]);
      setBooks(booksRes as BookItem[]);
      setCategories(catsRes as BookCategory[]);
    } catch (error) {
      console.error("Failed to load data:", error);
      showNotif("Gagal memuat data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showNotif = (message: string, type: "success" | "error") => {
    setNotif({ isOpen: true, message, type });
  };

  const handleOpenModal = (book?: BookItem) => {
    if (book) {
      setSelectedBook(book);
      setFormData({
        title: book.title || "",
        author: book.author || "",
        description: book.description || "",
        price: book.price?.toString() || "",
        stock: book.stock?.toString() || "",
        categoryName: book.category?.name || "",
        isFeatured: book.isFeatured || false,
        imageUrl: book.imageUrl || "",
      });
    } else {
      setSelectedBook(null);
      setFormData({
        title: "",
        author: "",
        description: "",
        price: "",
        stock: "",
        categoryName: "",
        isFeatured: false,
        imageUrl: "",
      });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let finalCategoryId = "";
      const catName = formData.categoryName.trim();

      if (catName) {
        const existingCategory = categories.find((c) => c.name.toLowerCase() === catName.toLowerCase());
        if (existingCategory) {
          finalCategoryId = existingCategory.id;
        } else {
          const catRes = await createCategory(catName);
          if (catRes.success && catRes.data) {
            finalCategoryId = (catRes.data as BookCategory).id;
            // Optimistically update categories
            setCategories((prev) => [...prev, catRes.data as BookCategory]);
          } else {
            showNotif(catRes.message || "Gagal membuat kategori baru", "error");
            setSubmitting(false);
            return;
          }
        }
      } else {
        showNotif("Kategori wajib diisi", "error");
        setSubmitting(false);
        return;
      }

      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("author", formData.author);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price);
      submitData.append("stock", formData.stock);
      submitData.append("categoryId", finalCategoryId);
      submitData.append("isFeatured", formData.isFeatured ? "true" : "false");

      if (imageFile) {
        submitData.append("imageFile", imageFile);
      } else if (formData.imageUrl) {
        submitData.append("imageUrl", formData.imageUrl);
      }

      let res;
      if (selectedBook) {
        res = await updateBook(selectedBook.id, submitData);
      } else {
        res = await createBook(submitData);
      }

      if (res.success) {
        showNotif(res.message, "success");
        handleCloseModal();
        fetchData();
      } else {
        showNotif(res.message, "error");
      }
    } catch (error) {
      console.error(error);
      showNotif("Terjadi kesalahan sistem", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (book: BookItem) => {
    setSelectedBook(book);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedBook) return;
    setSubmitting(true);
    try {
      const res = await deleteBook(selectedBook.id);
      if (res.success) {
        showNotif(res.message, "success");
        setIsDeleteModalOpen(false);
        fetchData();
      } else {
        showNotif(res.message, "error");
      }
    } catch (error) {
      console.error(error);
      showNotif("Gagal menghapus buku", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8 pb-12 reveal active">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Kelola Buku</h1>
            <p className="text-slate-500 mt-1">Atur daftar buku, stok, dan harga.</p>
          </div>
          <Button variant="primary" className="shrink-0 group" onClick={() => handleOpenModal()}>
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span>Tambah Buku</span>
          </Button>
        </div>

        <GlassCard className="p-4 w-full">
          <div className="relative w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul buku atau penulis..."
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </GlassCard>

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
                          <button onClick={() => handleOpenModal(book)} className="p-2 text-slate-400 hover:text-slate-800 bg-white rounded-lg shadow-sm border border-slate-200 transition-colors" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteClick(book)} className="p-2 text-slate-400 hover:text-rose-600 bg-white rounded-lg shadow-sm border border-slate-200 transition-colors" title="Hapus">
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

      <Notification
        isOpen={notif.isOpen}
        message={notif.message}
        type={notif.type}
        onClose={() => setNotif((prev) => ({ ...prev, isOpen: false }))}
      />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedBook ? "Edit Buku" : "Tambah Buku"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Judul Buku</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-slate-800 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Penulis</label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-slate-800 outline-none"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Deskripsi</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-slate-800 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Harga (Rp)</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-slate-800 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Stok</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-slate-800 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Kategori</label>
              <input
                type="text"
                list="category-options"
                required
                placeholder="Pilih atau ketik kategori baru"
                value={formData.categoryName}
                onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-slate-800 outline-none"
              />
              <datalist id="category-options">
                {categories.map((c) => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Upload Gambar (File)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-slate-800 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Atau URL Gambar</label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 inline-flex">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 rounded text-slate-800 focus:ring-slate-800"
            />
            <label htmlFor="isFeatured" className="text-sm font-semibold text-slate-700 cursor-pointer">
              Tandai sebagai Buku Pilihan (Featured)
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleCloseModal} disabled={submitting}>
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Hapus Buku" size="sm">
        <div className="p-4 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus {selectedBook?.title}?</h3>
          <p className="text-slate-500 mb-6">
            Apakah Anda yakin ingin menghapus buku ini? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex items-center gap-3 w-full">
            <Button className="flex-1" variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={submitting}>
              Batal
            </Button>
            <Button className="flex-1 bg-rose-600 hover:bg-rose-700 text-white" onClick={confirmDelete} disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Hapus"}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}

