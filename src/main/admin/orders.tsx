/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { GlassCard } from "@/src/components/ui/GlassCard";
import { Loader2, FileText, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { getAllOrders, updateOrderStatus } from "@/src/lib/actions/order";
import { formatCurrency } from "@/src/lib/utils";
import Notification from "@/src/components/ui/Notification";
import { useNotification } from "@/src/hooks/useNotification";

import { AdminPageHeader } from "@/src/components/admin/AdminPageHeader";
import { AdminSearchToolbar } from "@/src/components/admin/AdminSearchToolbar";
import { AdminStatusBadge } from "@/src/components/admin/AdminStatusBadge";

import type { OrderItem } from "@/src/types/order";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/src/lib/constants";

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { 
    isOpen: notifOpen, 
    message: notifMessage, 
    type: notifType, 
    showNotification, 
    onClose: hideNotif 
  } = useNotification();

  const fetchOrders = async () => {
    try {
      const ordersRes = await getAllOrders();
      if (Array.isArray(ordersRes)) setOrders(ordersRes as unknown as OrderItem[]);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string, paymentStatus?: string) => {
    if (!confirm(`Apakah Anda yakin ingin mengubah status menjadi ${newStatus}?`)) return;
    
    setUpdatingId(orderId);
    try {
      const res = await updateOrderStatus(orderId, newStatus, paymentStatus);
      if (res.success) {
        showNotification(res.message, "success");
        setOrders(orders.map(o => 
          o.id === orderId 
            ? { ...o, status: newStatus as any, paymentStatus: (paymentStatus || o.paymentStatus) as any } 
            : o
        ));
      } else {
        showNotification(res.message, "error");
      }
    } catch (error) {
      console.error(error);
      showNotification("Terjadi kesalahan sistem.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8 pb-12 reveal active">
        <AdminPageHeader 
          title="List Pesanan" 
          description="Kelola dan perbarui status pesanan pelanggan."
        />

        <AdminSearchToolbar 
          placeholder="Cari ID pesanan atau nama pelanggan..."
          value={searchQuery}
          onChange={setSearchQuery}
        />

        <div className="grid gap-6">
          {loading ? (
            <GlassCard className="flex flex-col items-center justify-center min-h-[300px] text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-slate-800 mx-auto" />
              <p className="text-center">Memuat daftar pesanan...</p>
            </GlassCard>
          ) : filteredOrders.length === 0 ? (
            <GlassCard className="flex flex-col items-center justify-center min-h-[300px] text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FileText className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Tidak ada pesanan ditemukan</h3>
              <p className="text-slate-500">Pencarian tidak cocok dengan pesanan manapun.</p>
            </GlassCard>
          ) : (
            filteredOrders.map(order => (
              <GlassCard key={order.id} className="p-6 overflow-hidden">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold border border-slate-200 bg-slate-50 px-2 py-1 rounded-md text-slate-600">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <AdminStatusBadge status={order.status} size="sm" />
                      <AdminStatusBadge status={order.paymentStatus} type="payment" size="sm" />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Pelanggan</p>
                        <p className="font-semibold text-slate-800 mt-1">{order.user.fullName}</p>
                        <p className="text-xs text-slate-500">{order.user.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Total</p>
                        <p className="font-bold text-slate-800 mt-1">{formatCurrency(order.total)}</p>
                        <p className="text-xs text-slate-500 capitalize">{order.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Tanggal Pesanan</p>
                        <p className="font-medium text-slate-800 mt-1">
                          {new Date(order.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-xs text-slate-500 font-medium uppercase mb-3">Item Pesanan ({order.orderItems.length})</p>
                      <ul className="list-disc list-inside text-sm text-slate-700 pl-4 space-y-1">
                        {order.orderItems.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="truncate">{item.book.title}</li>
                        ))}
                        {order.orderItems.length > 3 && (
                          <li className="text-slate-400 italic">Dan {order.orderItems.length - 3} buku lainnya...</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="lg:w-64 flex flex-col gap-3 lg:border-l lg:border-slate-100 lg:pl-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Aksi Cepat</p>
                    
                    {order.status === ORDER_STATUS.PENDING && (
                      <>
                        <button 
                          disabled={updatingId === order.id}
                          onClick={() => handleUpdateStatus(order.id, ORDER_STATUS.PROCESSING, PAYMENT_STATUS.PAID)}
                          className="flex items-center justify-between w-full p-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200 disabled:opacity-50"
                        >
                          <span className="font-semibold text-sm">Proses Pesanan</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button 
                          disabled={updatingId === order.id}
                          onClick={() => handleUpdateStatus(order.id, ORDER_STATUS.CANCELLED)}
                          className="w-full py-2.5 rounded-xl bg-white text-rose-600 hover:bg-rose-50 transition-colors border border-rose-200 font-medium text-sm disabled:opacity-50"
                        >
                          Batalkan Pesanan
                        </button>
                      </>
                    )}

                    {order.status === ORDER_STATUS.PROCESSING && (
                      <button 
                        disabled={updatingId === order.id}
                        onClick={() => handleUpdateStatus(order.id, ORDER_STATUS.COMPLETED)}
                        className="flex items-center justify-between w-full p-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200 disabled:opacity-50"
                      >
                        <span className="font-semibold text-sm">Selesaikan Pesanan</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}

                    {order.status === ORDER_STATUS.COMPLETED && (
                       <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-emerald-200 rounded-xl bg-emerald-50/50 p-4">
                          <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" />
                          <span className="text-sm font-semibold text-emerald-600 text-center">Pesanan Selesai</span>
                       </div>
                    )}
                    
                    {order.status === ORDER_STATUS.CANCELLED && (
                       <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-rose-200 rounded-xl bg-rose-50/50 p-4">
                          <XCircle className="w-8 h-8 text-rose-400 mb-2" />
                          <span className="text-sm font-semibold text-rose-600 text-center">Pesanan Dibatalkan</span>
                       </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </div>
      <Notification 
        isOpen={notifOpen}
        message={notifMessage}
        type={notifType}
        onClose={hideNotif}
      />
    </AdminLayout>
  );
}
