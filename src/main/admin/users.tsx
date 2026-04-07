/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { GlassCard } from "@/src/components/ui/GlassCard";
import { Search, Trash2, Loader2, Users, User, Mail, Calendar, ShieldCheck, Edit2, Plus, AlertCircle } from "lucide-react";
import { getAllUsers, deleteUser, createUser, updateUser } from "@/src/lib/actions/user";
import Modal from "@/src/components/ui/Modal";
import Notification from "@/src/components/ui/Notification";

import type { UserItem } from "@/src/types/user";

export default function AdminUsers() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Notification State
  const [notification, setNotification] = useState<{ isOpen: boolean; message: string; type: "success" | "error" }>({
    isOpen: false,
    message: "",
    type: "success"
  });

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ isOpen: true, message, type });
  };

  // Select User for Edit/Delete
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  // Add/Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "customer",
    password: ""
  });

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      if (Array.isArray(res)) {
        setUsers(res);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ fullName: "", email: "", role: "customer", password: "" });
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserItem) => {
    setIsEditing(true);
    setFormData({ fullName: user.fullName, email: user.email, role: user.role, password: "" });
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const openDeleteModal = (user: UserItem) => {
    if (user.role === "admin") {
      showNotification("Anda tidak dapat menghapus sesama admin.", "error");
      return;
    }
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing && selectedUser) {
        const res = await updateUser(selectedUser.id, {
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role
        });
        
        if (res.success) {
          showNotification(res.message, "success");
          setUsers(users.map(u => u.id === selectedUser.id ? { ...u, fullName: formData.fullName, email: formData.email, role: formData.role } : u));
          setIsModalOpen(false);
        } else {
          showNotification(res.message, "error");
        }
      } else {
        const res = await createUser({
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
          password: formData.password
        });

        if (res.success) {
          showNotification(res.message, "success");
          fetchUsers(); // Re-fetch to get new user with correct ID and dates
          setIsModalOpen(false);
        } else {
          showNotification(res.message, "error");
        }
      }
    } catch (error) {
      console.error("Submit Error:", error);
      showNotification("Terjadi kesalahan sistem.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    setIsDeleting(true);

    try {
      const res = await deleteUser(selectedUser.id);
      if (res.success) {
        setUsers(users.filter(u => u.id !== selectedUser.id));
        showNotification(res.message, "success");
        setIsDeleteModalOpen(false);
      } else {
        showNotification(res.message, "error");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      showNotification("Terjadi kesalahan sistem saat menghapus pengguna.", "error");
    } finally {
      setIsDeleting(false);
      setSelectedUser(null);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8 pb-12 reveal active">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Kelola Pengguna</h1>
            <p className="text-slate-500 mt-1">Daftar pengguna terdaftar di sistem.</p>
          </div>
          <button 
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-900 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Tambah Pengguna
          </button>
        </div>

        {/* Toolbar */}
        <GlassCard className="p-4">
          <div className="w-full relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama atau email pengguna..."
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
                <p>Memuat daftar pengguna...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Tidak ada pengguna ditemukan</h3>
                <p className="text-slate-500">Pencarian tidak cocok dengan pengguna manapun.</p>
              </div>
            ) : (
              <table className="w-full text-left whitespace-nowrap min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Pengguna</th>
                    <th className="px-6 py-4">Role & Hak Akses</th>
                    <th className="px-6 py-4">Bergabung Pada</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{user.fullName}</div>
                            <div className="flex items-center text-sm text-slate-500 gap-1.5 mt-0.5">
                              <Mail className="w-3.5 h-3.5" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.role === "admin" ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200/50">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Administrator
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200/50">
                            <User className="w-3.5 h-3.5" />
                            Customer
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 opacity-70" />
                          {new Date(user.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 transition-opacity">
                          <button 
                            onClick={() => openEditModal(user)}
                            className="p-2 text-slate-400 hover:text-slate-800 bg-white rounded-lg shadow-sm border border-slate-200 transition-colors" 
                            title="Edit Pengguna"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {user.role !== "admin" && (
                            <button 
                              onClick={() => openDeleteModal(user)}
                              disabled={isDeleting && selectedUser?.id === user.id}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 bg-white rounded-lg shadow-sm border border-slate-200 transition-colors disabled:opacity-50" 
                              title="Hapus Pengguna"
                            >
                              {isDeleting && selectedUser?.id === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                          )}
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

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit Pengguna" : "Tambah Pengguna Baru"}>
        <form onSubmit={handleModalSubmit} className="p-6 space-y-4">
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
              onClick={() => setIsModalOpen(false)}
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

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Hapus Pengguna" size="sm">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 text-rose-600 mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Apakah Anda yakin?</h3>
          <p className="text-slate-600">
            Anda akan menghapus pengguna <span className="font-semibold text-slate-800">{selectedUser?.fullName}</span>. 
            Semua data terkait pengguna tersebut mungkin akan terpengaruh.
            Tindakan ini tidak dapat dibatalkan.
          </p>

          <div className="pt-4 flex items-center justify-end gap-3 mt-6">
            <button 
              type="button" 
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button 
              type="button" 
              onClick={confirmDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white font-medium rounded-xl hover:bg-rose-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Ya, Hapus Pengguna"
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Notification Toast */}
      <Notification 
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, isOpen: false })}
      />
    </AdminLayout>
  );
}