import React from "react";
import Modal from "@/src/components/ui/Modal";
import { Button } from "@/src/components/ui/Button";
import { OrderItem } from "@/src/types/order";
import { formatCurrency } from "@/src/lib/utils";

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  visibleOrders: OrderItem[];
  isLoading: boolean;
  onClearHistory: () => void;
  onCancelInit: (orderId: string) => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  visibleOrders,
  isLoading,
  onClearHistory,
  onCancelInit
}) => {
  const isAnyNonActiveOrder = visibleOrders.some(o => o.status !== 'pending' && o.status !== 'processing');

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Daftar Pesanan" 
      size="lg"
    >
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-slate-500">
          {visibleOrders.length > 0 ? `Menampilkan ${visibleOrders.length} pesanan` : ""}
        </p>
        {isAnyNonActiveOrder && (
          <button
            onClick={onClearHistory}
            className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
          >
            Kosongkan Riwayat
          </button>
        )}
      </div>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {isLoading ? (
          <p className="text-center text-slate-500 py-8">Memuat pesanan...</p>
        ) : visibleOrders.length === 0 ? (
          <p className="text-center text-slate-500 py-8">Belum ada pesanan.</p>
        ) : (
          visibleOrders.map((order) => (
            <div key={order.id} className="p-4 border border-slate-200 rounded-xl space-y-3 shadow-sm bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono text-slate-500">ID: {order.id.slice(-8).toUpperCase()}</span>
                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                  order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                  order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                  order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                  order.status === 'cancelled' || order.status === 'failed' ? 'bg-red-100 text-red-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {String(order.status).toUpperCase()}
                </span>
              </div>
              
              <div className="space-y-2 pt-2 border-t border-slate-100">
                {order.orderItems?.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 truncate mr-4">
                      {item.quantity}x {item.book.title}
                    </span>
                    <span className="font-medium text-slate-800 shrink-0">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center pt-3 mt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-900">Total: {formatCurrency(order.total)}</span>
                {(order.status === 'pending' || order.status === 'processing') && (
                  <Button 
                    variant="outline" 
                    onClick={() => onCancelInit(order.id)}
                    className="px-3 py-1.5 h-auto text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    Batalkan
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex justify-end mt-6">
        <Button variant="outline" onClick={onClose}>Tutup</Button>
      </div>
    </Modal>
  );
};
