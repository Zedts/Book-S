/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { GlassCard } from "@/src/components/ui/GlassCard";
import { Trash2, Loader2, Users, User, Mail, Calendar, Edit2 } from "lucide-react";
import { getAllUsers, deleteUser, createUser, updateUser } from "@/src/lib/actions/user";
import Notification from "@/src/components/ui/Notification";
import { useNotification } from "@/src/hooks/useNotification";

import { AdminPageHeader } from "@/src/components/admin/AdminPageHeader";
import { AdminSearchToolbar } from "@/src/components/admin/AdminSearchToolbar";
import { AdminStatusBadge } from "@/src/components/admin/AdminStatusBadge";
import { AdminDeleteConfirmModal } from "@/src/components/admin/AdminDeleteConfirmModal";
import { UserFormModal } from "@/src/components/admin/UserFormModal";

import type { UserItem } from "@/src/types/user";

export default function AdminUsers() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { 
    isOpen: notifOpen, 
    message: notifMessage, 
    type: notifType, 
    showNotification, 
    onClose: hideNotif 
  } = useNotification();

  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
          fetchUsers();
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
      console.error(error);
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
        <AdminPageHeader 
          title="Kelola Pengguna" 
          description="Daftar pengguna terdaftar di sistem."
          actionLabel="Tambah Pengguna"
          onActionClick={openAddModal}
        />

        <AdminSearchToolbar 
          placeholder="Cari nama atau email pengguna..."
          value={searchQuery}
          onChange={setSearchQuery}
        />

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
                        <AdminStatusBadge status={user.role} type="role" size="sm" />
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        <div className="flex items-center gap-1.5 font-medium">
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
                              onClick={() => { setSelectedUser(user); setIsDeleteModalOpen(true); }}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 bg-white rounded-lg shadow-sm border border-slate-200 transition-colors" 
                              title="Hapus Pengguna"
                            >
                              <Trash2 className="w-4 h-4" />
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

      <UserFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        isEditing={isEditing}
        formData={formData}
        setFormData={setFormData}
        isSubmitting={isSubmitting}
      />

      <AdminDeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Pengguna"
        message="Anda akan menghapus pengguna"
        itemName={selectedUser?.fullName}
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