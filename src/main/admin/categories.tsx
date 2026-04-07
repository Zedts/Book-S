"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { GlassCard } from "@/src/components/ui/GlassCard";
import { Button } from "@/src/components/ui/Button";
import Modal from "@/src/components/ui/Modal";
import Notification from "@/src/components/ui/Notification";
import { Plus, Search, Edit2, Trash2, Loader2, AlertTriangle, Hash, LayoutGrid } from "lucide-react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/src/lib/actions/category";

type CategoryItem = {
  id: string;
  slug: string;
  name: string;
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<CategoryItem | null>(null);
  const [catName, setCatName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [notif, setNotif] = useState<{ isOpen: boolean; message: string; type: "success" | "error" }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const fetchAllCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories();
      if (Array.isArray(res)) setCategories(res as CategoryItem[]);
    } catch (error) {
      console.error("Failed to load categories:", error);
      showNotif("Gagal mengambil data kategori", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showNotif = (message: string, type: "success" | "error") => {
    setNotif({ isOpen: true, message, type });
  };

  const handleOpenAdd = () => {
    setSelectedCat(null);
    setCatName("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setSelectedCat(cat);
    setCatName(cat.name);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (cat: CategoryItem) => {
    setSelectedCat(cat);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      showNotif("Nama kategori tidak boleh kosong", "error");
      return;
    }

    setSubmitting(true);
    try {
      let res;
      if (selectedCat) {
        res = await updateCategory(selectedCat.id, catName.trim());
      } else {
        res = await createCategory(catName.trim());
      }

      if (res?.success) {
        showNotif(res.message, "success");
        setIsModalOpen(false);
        fetchAllCategories();
      } else {
        showNotif(res?.message || "Terjadi kesalahan", "error");
      }
    } catch (error) {
      console.error(error);
      showNotif("Terjadi kesalahan sistem", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedCat) return;
    setSubmitting(true);
    try {
      const res = await deleteCategory(selectedCat.id);
      if (res?.success) {
        showNotif(res.message, "success");
        setIsDeleteModalOpen(false);
        fetchAllCategories();
      } else {
        showNotif(res?.message || "Gagal menghapus kategori", "error");
      }
    } catch (error) {
      console.error(error);
      showNotif("Gagal menghapus kategori", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6 pb-12 reveal active">
        {/* Header Kategori */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              <LayoutGrid className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Kategori</h1>
              <p className="text-slate-500 font-medium">Klasifikasikan buku dan atur genre pustaka.</p>
            </div>
          </div>
          <Button variant="primary" onClick={handleOpenAdd}>
            <Plus className="w-5 h-5 mr-2" />
            <span>Kategori Baru</span>
          </Button>
        </div>

        {/* Pencarian Kategori */}
        <div className="relative w-full shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="w-6 h-6 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Ketik untuk mencari kategori..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl text-slate-700 font-medium transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tampilan Grid Kartu Kategori */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
            <p className="text-slate-500 font-medium">Memuat data kategori...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <GlassCard className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <LayoutGrid className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Tidak Ada Kategori</h3>
            <p className="text-slate-500 max-w-md">Data tidak ditemukan atau belum ada kategori yang ditambahkan.</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <div 
                key={category.id} 
                className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-300 transition-all flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-indigo-50 group-hover:text-indigo-600 text-slate-400 flex items-center justify-center transition-colors">
                    <Hash className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenEdit(category)} className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleOpenDelete(category)} className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1 truncate">{category.name}</h3>
                <p className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded w-fit truncate">/{category.slug}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedCat ? "Edit Kategori" : "Tambah Kategori"} size="sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Nama Kategori</label>
            <input
              type="text"
              required
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700"
              placeholder="cth. Fiksi Ilmiah"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="w-full py-3" disabled={submitting}>
              Batal
            </Button>
            <Button type="submit" variant="primary" className="w-full py-3" disabled={submitting}>
              {submitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Simpan"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => !submitting && setIsDeleteModalOpen(false)} title="" size="sm">
        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Hapus Kategori?</h3>
          <p className="text-slate-500 mb-6">Kategori <span className="font-bold text-rose-600">{selectedCat?.name}</span> akan dihapus. Pastikan tidak ada buku terkait.</p>
          <div className="flex gap-3 w-full">
            <Button className="flex-1 py-3" variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={submitting}>Batal</Button>
            <button onClick={confirmDelete} disabled={submitting} className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
              {submitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Hapus"}
            </button>
          </div>
        </div>
      </Modal>

      <Notification isOpen={notif.isOpen} message={notif.message} type={notif.type} onClose={() => setNotif(prev => ({ ...prev, isOpen: false }))} />
    </AdminLayout>
  );
}

