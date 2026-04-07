"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { GlassCard } from "@/src/components/ui/GlassCard";
import { Search, Loader2, FileText, CheckCircle2, Clock, XCircle, ArrowRight } from "lucide-react";
import { getAllOrders, updateOrderStatus } from "@/src/lib/actions/order";

type OrderItem = {
  id: string;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: Date;
  user: {
    fullName: string;
    email: string;
  };
  orderItems: {
    book: { title: string };
  }[];
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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
        setOrders(orders.map(o => 
          o.id === orderId 
            ? { ...o, status: newStatus, paymentStatus: paymentStatus || o.paymentStatus } 
            : o
        ));
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "processing": return "bg-blue-50 text-blue-600 border-blue-200";
      case "cancelled": return "bg-rose-50 text-rose-600 border-rose-200";
      default: return "bg-amber-50 text-amber-600 border-amber-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-3.5 h-3.5" />;
      case "cancelled": return <XCircle className="w-3.5 h-3.5" />;
      case "processing": return <Loader2 className="w-3.5 h-3.5 animate-spin" />;
      default: return <Clock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 pb-12 reveal active">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">List Pesanan</h1>
            <p className="text-slate-500 mt-1">Kelola dan perbarui status pesanan pelanggan.</p>
          </div>
        </div>

        {/* Toolbar */}
        <GlassCard className="p-4 flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari ID pesanan atau nama pelanggan..."
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </GlassCard>

        {/* Content */}
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
                  {/* Order Details Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold border border-slate-200 bg-slate-50 px-2 py-1 rounded-md text-slate-600">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                      {order.paymentStatus === "paid" ? (
                        <span className="inline-flex px-2 py-1 text-[10px] font-bold rounded bg-emerald-100 text-emerald-700 uppercase">Paid</span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-[10px] font-bold rounded bg-slate-100 text-slate-600 uppercase">Unpaid</span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Pelanggan</p>
                        <p className="font-semibold text-slate-800 mt-1">{order.user.fullName}</p>
                        <p className="text-xs text-slate-500">{order.user.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Total</p>
                        <p className="font-bold text-slate-800 mt-1">
                          {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(order.total)}
                        </p>
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

                  {/* Actions Panel */}
                  <div className="lg:w-64 flex flex-col gap-3 lg:border-l lg:border-slate-100 lg:pl-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Aksi Cepat</p>
                    
                    {order.status === "pending" && (
                      <>
                        <button 
                          disabled={updatingId === order.id}
                          onClick={() => handleUpdateStatus(order.id, "processing", "paid")}
                          className="flex items-center justify-between w-full p-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200 disabled:opacity-50"
                        >
                          <span className="font-semibold text-sm">Proses Pesanan</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button 
                          disabled={updatingId === order.id}
                          onClick={() => handleUpdateStatus(order.id, "cancelled")}
                          className="w-full py-2.5 rounded-xl bg-white text-rose-600 hover:bg-rose-50 transition-colors border border-rose-200 font-medium text-sm disabled:opacity-50"
                        >
                          Batalkan Pesanan
                        </button>
                      </>
                    )}

                    {order.status === "processing" && (
                      <button 
                        disabled={updatingId === order.id}
                        onClick={() => handleUpdateStatus(order.id, "completed")}
                        className="flex items-center justify-between w-full p-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200 disabled:opacity-50"
                      >
                        <span className="font-semibold text-sm">Selesaikan Pesanan</span>
                        <CheckCircle2 className="w-4 h-4 font-bold" />
                      </button>
                    )}

                    {order.status === "completed" && (
                       <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-emerald-200 rounded-xl bg-emerald-50/50 p-4">
                          <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" />
                          <span className="text-sm font-semibold text-emerald-600 text-center">Pesanan Selesai</span>
                       </div>
                    )}
                    
                    {order.status === "cancelled" && (
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
    </AdminLayout>
  );
}
