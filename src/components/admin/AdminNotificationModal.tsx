import React from "react";
import { Bell, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import Modal from "@/src/components/ui/Modal";
import { OrderItem } from "@/src/types/order";
import { formatCurrency } from "@/src/lib/utils";

interface AdminNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: OrderItem[];
  onClear: () => void;
}

export const AdminNotificationModal: React.FC<AdminNotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onClear
}) => {
  const router = useRouter();

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Notifikasi Admin"
      size="md"
    >
      <div className="space-y-4">
        {notifications.length > 0 && (
          <div className="flex justify-end mb-2">
            <button 
              onClick={() => {
                onClear();
                onClose();
              }}
              className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
            >
              Hapus semua notifikasi
            </button>
          </div>
        )}
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-slate-500">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p>Belum ada notifikasi pesanan terbaru.</p>
          </div>
        ) : (
          notifications.map((notif: OrderItem) => {
            const date = new Date(notif.createdAt).toLocaleDateString("id-ID", {
              day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
            });
            
            return (
              <div 
                key={notif.id} 
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group flex gap-4"
                onClick={() => {
                  onClose();
                  router.push("/admin/transactions");
                }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-blue-100 text-blue-600">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    Pesanan Baru
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 mb-2">
                    Transaksi <span className="font-mono text-slate-700">{notif.id.slice(0, 8).toUpperCase()}</span> senilai {formatCurrency(notif.total)} menunggu verifikasi.
                  </p>
                  <span className="text-[10px] font-semibold text-slate-400">{date}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
};
