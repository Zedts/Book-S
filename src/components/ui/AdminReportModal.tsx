"use client";

import { FileSpreadsheet, FileText } from "lucide-react";
import Modal from "@/src/components/ui/Modal";
import { Button } from "@/src/components/ui/Button";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { OrderItem, OrderStats } from "@/src/types/order";
import { formatCurrency } from "@/src/lib/utils";

interface AdminReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderItem[];
  stats: OrderStats | null;
}

export default function AdminReportModal({ isOpen, onClose, orders, stats }: AdminReportModalProps) {
  const handleExportExcel = () => {
    const overviewData = [
      ["Laporan Ringkasan Penjualan Toko Buku Book'S"],
      ["Tanggal Cetak", new Date().toLocaleString('id-ID')],
      [""],
      ["Total Pesanan", stats?.totalOrders || 0],
      ["Total Pendapatan", stats?.totalRevenue || 0],
      ["Menunggu Proses", stats?.pendingOrders || 0],
      [""],
      ["ID Transaksi", "Email Pembeli", "Nama Pembeli", "Tanggal", "Metode Pembayaran", "Status Pembayaran", "Status Pesanan", "Nominal"]
    ];

    const ordersData = orders.map(order => [
      order.id.slice(0, 8).toUpperCase(),
      order.user.email,
      order.user.fullName,
      new Date(order.createdAt).toLocaleString("id-ID"),
      order.paymentMethod,
      order.paymentStatus,
      order.status,
      order.total
    ]);

    const finalData = [...overviewData, ...ordersData];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(finalData);

    // simple column sizing
    const wscols = [
      {wch: 15}, {wch: 25}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 15}
    ];
    ws['!cols'] = wscols;

    XLSX.utils.book_append_sheet(wb, ws, "Laporan Penjualan");
    XLSX.writeFile(wb, "Laporan-Penjualan-BookS.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text("Laporan Penjualan Book'S", 14, 20);
    
    doc.setFontSize(10);
    doc.text("Tanggal Cetak: " + new Date().toLocaleString('id-ID'), 14, 28);
    
    doc.text("Total Pesanan: " + (stats?.totalOrders || 0), 14, 40);
    doc.text("Total Pendapatan: " + formatCurrency(stats?.totalRevenue || 0), 14, 46);
    doc.text("Menunggu Proses: " + (stats?.pendingOrders || 0), 14, 52);

    doc.text("Data Transaksi:", 14, 64);
    
    const tableData = orders.map(order => [
      order.id.slice(0, 8).toUpperCase(),
      order.user.fullName,
      new Date(order.createdAt).toLocaleDateString("id-ID"),
      formatCurrency(order.total),
      order.status
    ]);

    autoTable(doc, {
      startY: 68,
      head: [["ID Trans.", "Pembeli", "Tanggal", "Nominal", "Status"]],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [51, 65, 85] },
      styles: { fontSize: 8 }
    });

    doc.save("Laporan-Penjualan-BookS.pdf");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Unduh Laporan" size="md">
      <div className="space-y-6">
        <p className="text-slate-600 text-sm">
          Pilih format laporan penjualan yang ingin Anda unduh. Data mencakup ringkasan KPI dan seluruh histori transaksi di dalam sistem.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={handleExportExcel}
            className="group cursor-pointer rounded-2xl border-2 border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50 hover:border-emerald-300 p-6 flex flex-col items-center justify-center text-center transition-all w-full outline-none focus:ring-4 focus:ring-emerald-200"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">Format Excel</h3>
            <p className="text-xs text-slate-500">.xlsx</p>
          </button>

          <button 
            onClick={handleExportPDF}
            className="group cursor-pointer rounded-2xl border-2 border-rose-100 bg-rose-50/30 hover:bg-rose-50 hover:border-rose-300 p-6 flex flex-col items-center justify-center text-center transition-all w-full outline-none focus:ring-4 focus:ring-rose-200"
          >
            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8 text-rose-600" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">Format PDF</h3>
            <p className="text-xs text-slate-500">.pdf</p>
          </button>
        </div>

        <div className="pt-4 flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
        </div>
      </div>
    </Modal>
  );
}
