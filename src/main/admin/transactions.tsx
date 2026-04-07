"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { GlassCard } from "@/src/components/ui/GlassCard";
import { Button } from "@/src/components/ui/Button";
import Modal from "@/src/components/ui/Modal";
import { Search, Loader2, ArrowUpRight, DollarSign, ShoppingBag, Clock, FileText, CheckCircle2, XCircle, Receipt, X } from "lucide-react";
import { getAllOrders, getOrderStats } from "@/src/lib/actions/order";

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

type OrderStats = {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
};

export default function AdminTransactions() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<OrderItem | null>(null);

  const handleViewInvoice = (order: OrderItem) => {
    setSelectedInvoice(order);
    setIsInvoiceModalOpen(true);
  };

  const fetchData = async () => {
    try {
      const [ordersRes, statsRes] = await Promise.all([
        getAllOrders(),
        getOrderStats()
      ]);
      if (Array.isArray(ordersRes)) setOrders(ordersRes as unknown as OrderItem[]);
      if (statsRes) setStats(statsRes);
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      case "processing": return <Clock className="w-3.5 h-3.5" />;
      default: return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8 pb-12 reveal active">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Pantau Transaksi</h1>
            <p className="text-slate-500 mt-1">Lacak dan kelola semua transaksi dari pelanggan.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <GlassCard className="p-6 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 blur-2xl" />
            <div className="flex items-center justify-between mb-4 relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                Total Pendapatan
              </span>
            </div>
            <div className="relative">
              <h3 className="text-3xl font-bold text-slate-800">
                {stats ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(stats.totalRevenue) : "Rp0"}
              </h3>
              <p className="text-slate-500 text-sm mt-1">Total revenue pesanan selesai</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 blur-2xl" />
            <div className="flex items-center justify-between mb-4 relative">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>
            <div className="relative">
              <h3 className="text-3xl font-bold text-slate-800">
                {stats ? stats.totalOrders : 0}
              </h3>
              <p className="text-slate-500 text-sm mt-1">Total pesanan dibuat</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 blur-2xl" />
            <div className="flex items-center justify-between mb-4 relative">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <div className="relative">
              <h3 className="text-3xl font-bold text-slate-800">
                {stats ? stats.pendingOrders : 0}
              </h3>
              <p className="text-slate-500 text-sm mt-1">Pesanan menunggu diproses</p>
            </div>
          </GlassCard>
        </div>

        {/* Toolbar */}
        <GlassCard className="p-4 w-full">
          <div className="relative w-full">
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
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-slate-800" />
                <p>Memuat riwayat transaksi...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <FileText className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Tidak ada transaksi ditemukan</h3>
                <p className="text-slate-500">Pencarian tidak cocok dengan transaksi manapun.</p>
              </div>
            ) : (
              <table className="w-full text-left whitespace-nowrap min-w-[1000px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">ID Pesanan</th>
                    <th className="px-6 py-4">Pelanggan</th>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Metode Bayar</th>
                    <th className="px-6 py-4">Status Pesanan</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-slate-600 font-medium">{order.id.slice(0, 8).toUpperCase()}...</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{order.user.fullName}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{order.user.email}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(order.total)}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <span className="capitalize">{order.paymentMethod}</span>
                          {order.paymentStatus === "paid" ? (
                            <span className="inline-flex px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-700">PAID</span>
                          ) : (
                            <span className="inline-flex px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-600">UNPAID</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleViewInvoice(order)}
                          className="p-2 text-slate-400 hover:text-indigo-600 bg-white rounded-lg shadow-sm border border-slate-200 transition-colors"
                          title="Lihat Invoice"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </GlassCard>
      </div>

      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title="Detail Invoice"
        size="md"
      >
        {selectedInvoice && (
          <div className="p-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">ID Pesanan</p>
                  <p className="font-mono text-sm font-bold text-slate-800">{selectedInvoice.id.toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Tanggal</p>
                  <p className="text-sm font-bold text-slate-800">
                    {new Date(selectedInvoice.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric", month: "long", year: "numeric"
                    })}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Informasi Pelanggan</p>
                <p className="text-sm font-bold text-slate-800">{selectedInvoice.user.fullName}</p>
                <p className="text-sm text-slate-600">{selectedInvoice.user.email}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-slate-400" />
                Rincian Item
              </h4>
              <div className="bg-white border text-sm border-slate-200 rounded-xl divide-y divide-slate-100">
                {selectedInvoice.orderItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between p-3 items-center">
                    <p className="font-medium text-slate-700">{item.book.title}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center py-4 border-y border-dashed border-slate-200 mb-6 bg-slate-50/50 px-4 rounded-lg">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Pembayaran</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700 uppercase">
                    {selectedInvoice.paymentMethod}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    selectedInvoice.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {selectedInvoice.paymentStatus}
                  </span>
                </div>
              </div>
              <p className="text-2xl font-black text-slate-800">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(selectedInvoice.total)}
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsInvoiceModalOpen(false)}>
                <X className="w-4 h-4 mr-2" />
                Tutup
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </AdminLayout>
  );
}
