import React from "react";
import { Loader2 } from "lucide-react";
import Modal from "@/src/components/ui/Modal";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
  formData: any;
  setFormData: (data: any) => void;
  isSubmitting: boolean;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isEditing,
  formData,
  setFormData,
  isSubmitting
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit Pengguna" : "Tambah Pengguna Baru"}>
      <form onSubmit={onSubmit} className="p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Nama Lengkap</label>
          <input 
            type="text" 
            required
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            placeholder="Masukkan nama pengguna"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Email</label>
          <input 
            type="email" 
            required
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="nama@email.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Role</label>
          <select 
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all bg-white"
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
          >
            <option value="customer">Customer</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        {!isEditing && (
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Password</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Kosongkan untuk default: password123"
            />
            <p className="text-xs text-slate-500">Jika dibiarkan kosong, password otomatis adalah <strong>password123</strong></p>
          </div>
        )}

        <div className="pt-4 flex items-center justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-900 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEditing ? "Simpan Perubahan" : "Tambahkan Pengguna"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
