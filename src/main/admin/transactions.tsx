 
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { GlassCard } from "@/src/components/ui/GlassCard";
import { Button } from "@/src/components/ui/Button";
import Modal from "@/src/components/ui/Modal";
import { Loader2, DollarSign, ShoppingBag, Clock, FileText, Receipt, Printer, ExternalLink } from "lucide-react";
import { getAllOrders, getOrderStats } from "@/src/lib/actions/order";
import { formatCurrency } from "@/src/lib/utils";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { AdminPageHeader } from "@/src/components/admin/AdminPageHeader";
import { AdminSearchToolbar } from "@/src/components/admin/AdminSearchToolbar";
import { AdminStatusBadge } from "@/src/components/admin/AdminStatusBadge";
import { AdminStatCard } from "@/src/components/admin/AdminStatCard";
import type { OrderItem, OrderStats } from "@/src/types/order";

export default function AdminTransactions() {
  const router = useRouter();
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

  const handlePrintPDF = (order: OrderItem) => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("Invoice Pembelian Book'S", 14, 22);
    
    doc.setFontSize(10);
    doc.text(`ID Pesanan : ${order.id.toUpperCase()}`, 14, 32);
    doc.text(`Tanggal    : ${new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`, 14, 38);
    
    doc.text("Informasi Pelanggan:", 14, 50);
    doc.setFont("helvetica", "bold");
    doc.text(order.user.fullName, 14, 56);
    doc.setFont("helvetica", "normal");
    doc.text(order.user.email, 14, 62);

    doc.text(`Metode Pembayaran : ${order.paymentMethod}`, 140, 56);
    doc.text(`Status Pembayaran : ${order.paymentStatus}`, 140, 62);

    const tableData = order.orderItems.map((item, index) => [
      index + 1,
      item.book.title,
      item.quantity || 1, // fallback quantity to 1 if it's not explicitly stated
      formatCurrency(item.price),
      formatCurrency(item.price * (item.quantity || 1))
    ]);

    autoTable(doc, {
      startY: 75,
      head: [["No.", "Judul Buku", "Qty", "Harga Satuan", "Subtotal"]],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [51, 65, 85] },
      styles: { fontSize: 9 }
    });

    // typescript workaround for autotable
    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY || 75;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Pembayaran : ${formatCurrency(order.total)}`, 14, finalY + 15);

    doc.save(`Invoice-${order.id.slice(0, 8).toUpperCase()}.pdf`);
  };

  const fetchData = async () => {
    try {
      const [ordersRes, statsRes] = await Promise.all([
        getAllOrders(),
        getOrderStats()
      ]);
      if (Array.isArray(ordersRes)) {
        const allOrders = ordersRes as unknown as OrderItem[];
        const filteredByStatus = allOrders.filter((order) => {
          const pStatus = (order.paymentStatus || "").toLowerCase();
          return ["unchecked", "paid", "failed"].includes(pStatus);
        });
        setOrders(filteredByStatus);
      }
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

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8 pb-12 reveal active">
        <AdminPageHeader 
          title="Pantau Transaksi" 
          description="Lacak dan kelola semua transaksi dari pelanggan."
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <AdminStatCard 
            title="Total Pendapatan"
            value={stats ? formatCurrency(stats.totalRevenue) : "Rp0"}
            subtitle="Total revenue pesanan selesai"
            icon={<DollarSign className="w-6 h-6" />}
            color="emerald"
            trend={stats?.trends?.revenue}
          />
          <AdminStatCard 
            title="Total Pesanan"
            value={stats ? stats.totalOrders.toString() : "0"}
            subtitle="Total pesanan dibuat"
            icon={<ShoppingBag className="w-6 h-6" />}
            color="indigo"
            trend={stats?.trends?.orders}
          />
          <AdminStatCard 
            title="Pesanan Pending"
            value={stats ? stats.pendingOrders.toString() : "0"}
            subtitle="Pesanan menunggu diproses"
            icon={<Clock className="w-6 h-6" />}
            color="amber"
          />
        </div>

        <AdminSearchToolbar 
          placeholder="Cari ID pesanan atau nama pelanggan..."
          value={searchQuery}
          onChange={setSearchQuery}
        />

        {/* Content Table */}
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
                    <th className="px-6 py-4">Status Pembayaran</th>
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
                      <td className="px-6 py-4 text-slate-500 font-medium">
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize text-slate-600 font-medium">{order.paymentMethod}</span>
                      </td>
                      <td className="px-6 py-4">
                        <AdminStatusBadge status={order.paymentStatus} type="payment" size="sm" />
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
                    <p className="text-slate-400 font-medium">{formatCurrency(item.price)}</p>
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
                  <AdminStatusBadge status={selectedInvoice.paymentStatus} type="payment" size="sm" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-800">
                {formatCurrency(selectedInvoice.total)}
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              {(selectedInvoice.paymentStatus.toLowerCase() === "paid" || selectedInvoice.paymentStatus.toLowerCase() === "failed") && (
                <Button variant="outline" onClick={() => handlePrintPDF(selectedInvoice)}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print PDF
                </Button>
              )}
              <Button variant="primary" onClick={() => router.push("/admin/orders")}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Proses Pesanan
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </AdminLayout>
  );
}


