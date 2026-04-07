"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { GlassCard } from "@/src/components/ui/GlassCard";
import { Button } from "@/src/components/ui/Button";
import { Plus, Search, Edit2, Trash2, Loader2, Tags } from "lucide-react";
import { getCategories } from "@/src/lib/actions/category";

type CategoryItem = {
  id: string;
  slug: string;
  name: string;
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchAllCategories = async () => {
      try {
        const res = await getCategories();
        if (mounted && Array.isArray(res)) {
          setCategories(res as CategoryItem[]);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchAllCategories();
    return () => { mounted = false; };
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8 pb-12 reveal active">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Kelola Kategori</h1>
            <p className="text-slate-500 mt-1">Daftar kategori buku yang tersedia di toko.</p>
          </div>
          <Button variant="primary" className="shrink-0 group">
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 mr-2" />
            <span>Tambah Kategori</span>
          </Button>
        </div>

        {/* Toolbar */}
        <GlassCard className="p-4 flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama kategori..."
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </GlassCard>

        {/* Content */}
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-slate-800" />
                <p>Memuat daftar kategori...</p>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Tags className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Tidak ada kategori ditemukan</h3>
                <p className="text-slate-500">Coba kata kunci lain atau tambahkan kategori baru.</p>
              </div>
            ) : (
              <table className="w-full text-left whitespace-nowrap min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4 w-16">No</th>
                    <th className="px-6 py-4">Nama Kategori</th>
                    <th className="px-6 py-4">Slug</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCategories.map((category, index) => (
                    <tr key={category.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 text-slate-500 font-semibold">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                            <Tags className="w-5 h-5 opacity-70" />
                          </div>
                          <span className="font-bold text-slate-800">{category.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-500 border border-slate-200/50 font-mono">
                          /{category.slug}
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
