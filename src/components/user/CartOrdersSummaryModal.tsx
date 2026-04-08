import React, { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import Modal from "@/src/components/ui/Modal";
import { Button } from "@/src/components/ui/Button";
import { OrderItem } from "@/src/types/order";
import { formatCurrency } from "@/src/lib/utils";

interface CartOrdersSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  visibleCartItems: any[];
  visibleOrders: OrderItem[];
  activeOrdersCount: number;
  totalCartCount: number;
  onClearCartBag: () => void;
  onClearOrdersBag: () => void;
}

export const CartOrdersSummaryModal: React.FC<CartOrdersSummaryModalProps> = ({
  isOpen,
  onClose,
  visibleCartItems,
  visibleOrders,
  activeOrdersCount,
  totalCartCount,
  onClearCartBag,
  onClearOrdersBag
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"cart" | "orders">("cart");

  const isAnyNonActiveOrder = visibleOrders.some(o => o.status !== 'pending' && o.status !== 'processing');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Keranjang & Pesanan Saya"
      size="md"
    >
      <div className="space-y-6">
        <div className="flex gap-2 p-1 bg-slate-100/80 backdrop-blur-sm rounded-xl overflow-x-auto hide-scrollbar sticky top-0 z-10 border border-slate-200">
          <button
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-lg text-sm font-bold transition-all relative ${
              activeTab === "cart" 
                ? "bg-white text-indigo-700 shadow-sm border border-slate-200/60" 
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
            onClick={() => setActiveTab("cart")}
          >
            Keranjang
            {totalCartCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            )}
          </button>
          <button
             className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-lg text-sm font-bold transition-all relative ${
               activeTab === "orders" 
                 ? "bg-white text-indigo-700 shadow-sm border border-slate-200/60" 
                 : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
             }`}
             onClick={() => setActiveTab("orders")}
          >
            Pesanan Saya
            {activeOrdersCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            )}
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {activeTab === "cart" ? (
            visibleCartItems.length === 0 ? (
              <div className="py-8 text-center text-slate-500">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p>Keranjang Anda masih kosong.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-slate-600">Terakhir Ditambahkan</p>
                  <button 
                    onClick={onClearCartBag}
                    className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                {visibleCartItems.map((item: any) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <img 
                      src={item.book.imageUrl || '/placeholder-book.jpg'} 
                      alt={item.book.title} 
                      className="w-16 h-20 object-cover rounded-md border border-slate-200/60" 
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{item.book.title}</h4>
                      <p className="text-xs text-slate-500 mb-1">{item.book.author}</p>
                      <p className="font-semibold text-slate-700 text-sm">
                        <span className="text-slate-400 font-normal">{item.quantity}x</span> {formatCurrency(item.book.price)}
                      </p>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="primary" 
                  className="w-full mt-4 justify-center" 
                  onClick={() => {
                    onClose();
                    router.push("/user/cart");
                  }}
                >
                  Beralih ke Keranjang
                </Button>
              </div>
            )
          ) : (
            visibleOrders.length === 0 ? (
              <div className="py-8 text-center text-slate-500">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p>Belum ada riwayat pesanan.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-slate-600">Terakhir Dipesan</p>
                  {isAnyNonActiveOrder && (
                    <button 
                      onClick={onClearOrdersBag}
                      className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {visibleOrders.map((order: OrderItem) => {
                  const isCompleted = order.status === "completed";
                  const isCancelled = order.status === "cancelled" || order.status === "failed";
                  const isPending = order.status === "pending" || order.status === "processing";

                  return (
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
                          isPending ? 'bg-amber-100 text-amber-700' :
                          isCompleted ? 'bg-emerald-100 text-emerald-700' :
                          isCancelled ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {String(order.status).charAt(0).toUpperCase() + String(order.status).slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                        <span className="text-sm text-slate-500">Total:</span>
                        <span className="font-bold text-slate-800">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  );
                })}
                <Button 
                  variant="outline" 
                  className="w-full mt-4 justify-center" 
                  onClick={() => {
                    onClose();
                    router.push("/user/cart");
                  }}
                >
                  Kelola Semua Pesanan
                </Button>
              </div>
            )
          )}
        </div>
      </div>
    </Modal>
  );
};
