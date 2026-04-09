/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Heart, ShoppingCart, DollarSign, BookOpen, ArrowUpRight, Loader2, Bell } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { GlassCard } from "@/src/components/ui/GlassCard";
import { useRequireRole } from "@/src/hooks/useRequireRole";
import AdminLayout from "@/src/components/layout/AdminLayout";
import AdminReportModal from "@/src/components/ui/AdminReportModal";
import { AdminPageHeader } from "@/src/components/admin/AdminPageHeader";
import { AdminNotificationModal } from "@/src/components/admin/AdminNotificationModal";
import { AdminStatCard } from "@/src/components/admin/AdminStatCard";
import { cn, formatCurrency, calculateTrendPercentage } from "@/src/lib/utils";
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
  const router = useRouter();
  const { loading: authLoading } = useRequireRole('admin');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [allOrders, setAllOrders] = useState<OrderItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<OrderItem[]>([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [booksTrend, setBooksTrend] = useState({ value: "0%", isPositive: true });
  const [topBooks, setTopBooks] = useState<TopBookItem[]>([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [adminNotificationsClearedAt, setAdminNotificationsClearedAt] = useState<number>(0);

  useEffect(() => {
    setAdminNotificationsClearedAt(parseInt(localStorage.getItem("adminNotificationsClearedAt") || "0", 10));
  }, []);

  const adminNotifications = useMemo(() => {
    return allOrders.filter(
      (o) => o.paymentStatus === 'Unchecked' && new Date(o.createdAt).getTime() > adminNotificationsClearedAt
    );
  }, [allOrders, adminNotificationsClearedAt]);

  const handleClearNotifications = () => {
    const now = Date.now();
    setAdminNotificationsClearedAt(now);
    localStorage.setItem("adminNotificationsClearedAt", now.toString());
  };

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
          const orders = ordersData as unknown as OrderItem[];
          setAllOrders(orders);
          setRecentOrders(orders.slice(0, 5));
        }
        if (Array.isArray(booksData)) {
          setTotalBooks(booksData.length);
          const now = new Date();
          const yesterday = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
          const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
          
          const recentBooks = booksData.filter(b => new Date((b as any).createdAt || new Date()) >= yesterday).length;
          const previousBooks = booksData.filter(b => {
            const date = new Date((b as any).createdAt || new Date());
            return date >= twoDaysAgo && date < yesterday;
          }).length;
          setBooksTrend(calculateTrendPercentage(recentBooks, previousBooks));
        }
        if (Array.isArray(topBooksData)) {
          setTopBooks(topBooksData as TopBookItem[]);
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
    { label: "Total Pesanan", value: stats?.totalOrders.toLocaleString() || "0", icon: <ShoppingCart className="w-6 h-6" />, color: "indigo" as const, trend: stats?.trends?.orders },
    { label: "Total Pendapatan", value: formatCurrency(stats?.totalRevenue || 0), icon: <DollarSign className="w-6 h-6" />, color: "emerald" as const, trend: stats?.trends?.revenue },
    { label: "Total Buku Aktif", value: totalBooks.toLocaleString(), icon: <BookOpen className="w-6 h-6" />, color: "blue" as const, trend: booksTrend },
    { label: "Menunggu Proses", value: stats?.pendingOrders.toLocaleString() || "0", icon: <Heart className="w-6 h-6" />, color: "amber" as const },
  ];

  return (
    <AdminLayout
      headerActions={
        <div className="flex md:hidden items-center gap-2">
          <button 
            onClick={() => setIsNotificationModalOpen(true)}
            className="relative p-2 bg-white/60 backdrop-blur-md border border-slate-200/60 text-slate-600 rounded-xl hover:bg-white transition-colors shadow-sm"
            aria-label="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {adminNotifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </button>
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Laporan
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        <AdminPageHeader 
          title="Ringkasan Admin" 
          description="Pantau aktivitas toko dan kinerja penjualan real-time."
          actionLabel="Unduh Laporan"
          actionIcon={<ArrowUpRight className="w-5 h-5 mr-1" />}
          onActionClick={() => setIsReportModalOpen(true)}
        >
          <button 
            onClick={() => setIsNotificationModalOpen(true)}
            className="relative p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
            aria-label="Notifikasi"
          >
            <Bell className="w-5 h-5" />
            {adminNotifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </button>
        </AdminPageHeader>

        <AdminNotificationModal
          isOpen={isNotificationModalOpen}
          onClose={() => setIsNotificationModalOpen(false)}
          notifications={adminNotifications}
          onClear={handleClearNotifications}
        />

        {/* Key Metrics / KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((stat, i) => (
            <AdminStatCard 
              key={i}
              title={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
            />
          ))}
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

      <AdminReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        orders={allOrders}
        stats={stats}
      />
    </AdminLayout>
  );
}
