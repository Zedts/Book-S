/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { Heart, ShoppingCart, DollarSign, BookOpen, TrendingUp, TrendingDown, ArrowUpRight, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { GlassCard } from "@/src/components/ui/GlassCard";
import { useRequireRole } from "@/src/hooks/useRequireRole";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { cn, formatCurrency } from "@/src/lib/utils";
import { getAllOrders, getOrderStats } from "@/src/lib/actions/order";
import { getBooks, getTopBooks } from "@/src/lib/actions/book";
import type { OrderItem, OrderStats } from "@/src/types/order";

type TopBookItem = {
  id: string;
  title: string;
  author: string;
  imageUrl: string | null;
  imageAlt: string | null;
  sales: number;
};

export default function AdminHome() {
  const { loading: authLoading } = useRequireRole('admin');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderItem[]>([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [topBooks, setTopBooks] = useState<TopBookItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, ordersData, booksData, topBooksData] = await Promise.all([
          getOrderStats(),
          getAllOrders(),
          getBooks(),
          getTopBooks(4)
        ]);
        
        setStats(statsData);
        if (Array.isArray(ordersData)) {
          setRecentOrders((ordersData as unknown as OrderItem[]).slice(0, 5));
        }
        if (Array.isArray(booksData)) {
          setTotalBooks(booksData.length);
        }
        if (Array.isArray(topBooksData)) {
          setTopBooks(topBooksData);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin h-12 w-12 text-slate-800" />
      </div>
    );
  }

  const kpis = [
    { label: "Total Pesanan", value: stats?.totalOrders.toLocaleString() || "0", icon: ShoppingCart, trend: "+5.2%", isPositive: true },
    { label: "Total Pendapatan", value: formatCurrency(stats?.totalRevenue || 0), icon: DollarSign, trend: "+18.1%", isPositive: true },
    { label: "Total Buku Aktif", value: totalBooks.toLocaleString(), icon: BookOpen, trend: "Stable", isPositive: true },
    { label: "Menunggu Proses", value: stats?.pendingOrders.toLocaleString() || "0", icon: Heart, trend: "Current", isPositive: true },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 pb-12 reveal active">
        {/* Header Overview */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Ringkasan Admin</h1>
            <p className="text-slate-500 mt-1">Pantau aktivitas toko dan kinerja penjualan real-time.</p>
          </div>
          <Button variant="primary" className="shrink-0 gap-2 shadow-lg">
            <ArrowUpRight className="w-4 h-4" />
            Unduh Laporan
          </Button>
        </div>

        {/* Key Metrics / KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <GlassCard key={i} className="p-6 flex flex-col hover:border-slate-300 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-full ${stat.isPositive ? 'bg-emerald-100/50 text-emerald-700' : 'bg-rose-100/50 text-rose-700'}`}>
                    {stat.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stat.trend}
                  </span>
                </div>
                <div>
                  <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.label}</h3>
                  <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{stat.value}</p>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Detail Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Books Chart / List */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Buku Terpopuler</h2>
            <GlassCard className="p-1 divide-y divide-slate-200/50">
              {topBooks.map((book, index) => (
                <div key={book.id} className="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors">
                  <span className="text-lg font-black text-slate-300 w-4 text-center">{index + 1}</span>
                  <img src={book.imageUrl || '/placeholder-book.jpg'} alt={book.title} className="w-12 h-16 object-cover rounded-md shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{book.title}</p>
                    <p className="text-xs text-slate-500 truncate">{book.author}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">{book.sales}</p>
                    <p className="text-xs text-slate-500">terjual</p>
                  </div>
                </div>
              ))}
              {topBooks.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-sm">
                  Belum ada data penjualan buku
                </div>
              )}
              <Button variant="ghost" fullWidth className="py-4 text-slate-600 font-semibold hover:bg-slate-50">
                Lihat Semua Buku
              </Button>
            </GlassCard>
          </div>

          {/* Recent Transactions List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Transaksi Terbaru</h2>
            <GlassCard className="overflow-hidden">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200/50">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID Transaksi</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pembeli</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nominal</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                            {order.id.slice(0, 8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-800">{order.user.fullName}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {new Date(order.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short"
                          })}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-800">{formatCurrency(order.total)}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={cn(
                            "inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase",
                            order.status === 'completed' ? "bg-emerald-50 text-emerald-700 border-emerald-200/50" : "bg-blue-50 text-blue-700 border-blue-200/50"
                          )}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {recentOrders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                          Belum ada transaksi terbaru.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-slate-200/50 bg-slate-50/30">
                <Button variant="ghost" fullWidth className="text-slate-600 font-semibold hover:bg-slate-100">
                  Lihat Semua Transaksi
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
