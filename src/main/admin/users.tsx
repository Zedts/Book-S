"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { GlassCard } from "@/src/components/ui/GlassCard";
import { Search, Trash2, Loader2, Users, User, Mail, Calendar, ShieldCheck, Edit2 } from "lucide-react";
import { getAllUsers, deleteUser } from "@/src/lib/actions/user";
import Image from "next/image";


import type { UserItem } from "@/src/types/user";

export default function AdminUsers() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleDelete = async (id: string, role: string) => {
    if (role === "admin") {
      alert("Anda tidak dapat menghapus sesama admin.");
      return;
    }
    if (!confirm("Apakah Anda yakin ingin menghapus pengguna ini? Semua data terkait (pesanan, dll) mungkin akan terpengaruh.")) return;
    
    setDeletingId(id);
    try {
      const res = await deleteUser(id);
      if (res.success) {
        setUsers(users.filter(u => u.id !== id));
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setDeletingId(null);
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
        </div>

        {/* Toolbar */}
        <GlassCard className="p-4 flex gap-4">
          <div className="flex-1 relative">
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
                          <button className="p-2 text-slate-400 hover:text-slate-800 bg-white rounded-lg shadow-sm border border-slate-200 transition-colors" title="Edit Pengguna">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {user.role !== "admin" && (
                            <button 
                              onClick={() => handleDelete(user.id, user.role)}
                              disabled={deletingId === user.id}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 bg-white rounded-lg shadow-sm border border-slate-200 transition-colors disabled:opacity-50" 
                              title="Hapus Pengguna"
                            >
                              {deletingId === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
    </AdminLayout>
  );
}

