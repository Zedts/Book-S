/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Loader2 } from "lucide-react";
import Modal from "@/src/components/ui/Modal";

interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
  formData: any;
  setFormData: (data: any) => void;
  isSubmitting: boolean;
  categories: any[];
}

export const BookFormModal: React.FC<BookFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isEditing,
  formData,
  setFormData,
  isSubmitting,
  categories
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit Buku" : "Tambah Buku Baru"} size="lg">
      <form onSubmit={onSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Judul Buku</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Masukkan judul buku"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Penulis</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all"
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                placeholder="Nama penulis"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Kategori</label>
              <select 
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all bg-white"
                value={formData.categoryId}
                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Harga (Rp)</label>
                <input 
                  type="number" 
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Stok</label>
                <input 
                  type="number" 
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">URL Gambar Cover</label>
              <input 
                type="text" 
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Preview Cover</label>
              <div className="aspect-[3/4] rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-6">
                    <p className="text-xs text-slate-400">Preview gambar akan muncul di sini</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="isFeatured"
                className="w-4 h-4 rounded text-slate-800 focus:ring-slate-800"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
              />
              <label htmlFor="isFeatured" className="text-sm font-medium text-slate-700">Tampilkan sebagai yang terpopuler</label>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <label className="text-sm font-bold text-slate-700">Deskripsi / Sinopsis</label>
          <textarea 
            rows={4}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all resize-none"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Masukkan ringkasan cerita buku..."
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-8 py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
            {isEditing ? "Simpan Perubahan" : "Terbitkan Buku"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
