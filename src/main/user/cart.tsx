"use client";

import { ShoppingCart, ShieldCheck, CreditCard, Wallet, Truck } from "lucide-react";
import UserLayout from "@/src/components/layout/UserLayout";
import { useRequireRole } from "@/src/hooks/useRequireRole";
import { useEffect, useState } from "react";
import { getCart, updateCartItemQuantity, removeFromCart, processCheckout } from "@/src/lib/actions/cart";
import { CartItemCard } from "@/src/components/user/CartItemCard";
import { formatCurrency } from "@/src/lib/utils";
import Notification from "@/src/components/ui/Notification";
import { useNotification } from "@/src/hooks/useNotification";

type CartItemData = {
  id: string;
  quantity: number;
  book: {
    title: string;
    author: string;
    price: number;
    imageUrl: string;
    imageAlt: string;
    stock: number;
    category?: { name: string };
  };
};

export default function UserCart() {
  const { user } = useRequireRole("users");
  
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // States for Checkout
  const [paymentMethod, setPaymentMethod] = useState<string>("Transfer Bank");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const { 
    isOpen: notifOpen, 
    message: notifMessage, 
    type: notifType, 
    showNotification, 
    onClose: hideNotif 
  } = useNotification();

  const fetchCart = async () => {
    setLoading(true);
    const res = await getCart();
    if (res.success && res.data) {
      setCartItems(res.data as CartItemData[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user) fetchCart();
  }, [user]);

  const handleUpdateQty = async (id: string, newQty: number) => {
    setUpdatingId(id);
    const res = await updateCartItemQuantity(id, newQty);
    if (!res.success) {
      showNotification(res.message, "error");
      setUpdatingId(null);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    setUpdatingId(null);
  };

  const handleRemove = async (id: string) => {
    setUpdatingId(id);
    const res = await removeFromCart(id);
    if (!res.success) {
      showNotification(res.message, "error");
      setUpdatingId(null);
      return;
    }
    setCartItems(prev => prev.filter(item => item.id !== id));
    setSelectedItems(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setUpdatingId(null);
  };

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map(c => c.id)));
    }
  };

  const handleCheckout = async () => {
    if (selectedItems.size === 0) {
      showNotification("Pilih minimal satu item untuk dicheckout.", "error");
      return;
    }

    setIsCheckingOut(true);
    const res = await processCheckout(Array.from(selectedItems), paymentMethod);
    if (res.success) {
      showNotification(res.message, "success");
      setSelectedItems(new Set());
      await fetchCart(); // Re-fetch untuk menghapus state lama dan up to date stock
    } else {
      showNotification(res.message, "error");
    }
    setIsCheckingOut(false);
  };

  if (!user) return null;

  const selectedTotal = cartItems
    .filter(c => selectedItems.has(c.id))
    .reduce((acc, c) => acc + (c.book.price * c.quantity), 0);

  return (
    <UserLayout>
      <div className="space-y-8 pb-32">
        <header className="on-load-reveal flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-200/60 pb-8">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight flex items-center justify-center md:justify-start gap-3">
              <span className="p-3 md:p-4 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm border border-indigo-100">
                <ShoppingCart className="w-6 h-6 md:w-8 md:h-8" />
              </span>
              Keranjang Belanja
            </h1>
            <p className="text-slate-500 text-base md:text-lg">
              Semua buku yang ada di dalam keranjang Anda siap untuk di-checkout.
            </p>
          </div>
        </header>

        {loading ? (
           <div className="py-24 text-center">
             <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
             <p className="text-slate-500 font-medium animate-pulse">Memuat keranjang Anda...</p>
           </div>
        ) : cartItems.length > 0 ? (
          <div className="flex flex-col xl:flex-row gap-8">
            
            {/* List Keranjang */}
            <div className="block w-full xl:flex-1 space-y-4">
               <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm border border-slate-200/50 rounded-2xl">
                 <input 
                   type="checkbox"
                   checked={selectedItems.size === cartItems.length && cartItems.length > 0}
                   onChange={toggleSelectAll}
                   className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer shadow-sm ml-1"
                 />
                 <span className="text-sm font-bold text-slate-700">Pilih Semua ({cartItems.length} item)</span>
               </div>
               
               <div className="space-y-4">
                 {cartItems.map((item, index) => (
                   <div key={item.id} className="reveal" style={{ transitionDelay: `${Math.min(index * 50, 300)}ms` }}>
                     <CartItemCard 
                        id={item.id}
                        bookTitle={item.book.title}
                        bookAuthor={item.book.author}
                        bookCategory={item.book.category?.name || "Kategori"}
                        price={item.book.price}
                        imageUrl={item.book.imageUrl}
                        imageAlt={item.book.imageAlt}
                        quantity={item.quantity}
                        stock={item.book.stock}
                        isSelected={selectedItems.has(item.id)}
                        onToggleSelect={toggleSelect}
                        onUpdateQuantity={handleUpdateQty}
                        onRemove={handleRemove}
                        isUpdating={updatingId === item.id}
                     />
                   </div>
                 ))}
               </div>
            </div>

            {/* Detail Checkout Card */}
            <div className="w-full xl:w-[400px] shrink-0">
               <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl shadow-slate-200/40 sticky top-24">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-indigo-500" /> Ringkasan Belanja
                  </h3>
                  
                  <div className="space-y-4 text-sm mb-6 pb-6 border-b border-slate-100">
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>Total Harga ({selectedItems.size} item)</span>
                      <span className="text-slate-800 font-bold">{formatCurrency(selectedTotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>Diskon</span>
                      <span className="text-slate-800 font-bold">{formatCurrency(0)}</span>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-slate-700 mb-3">Pilih Metode Pembayaran</h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Transfer Bank', icon: CreditCard },
                        { label: 'E-wallet', icon: Wallet },
                        { label: 'COD', icon: Truck },
                      ].map((method) => (
                        <label key={method.label} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === method.label ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                          <input 
                            type="radio" 
                            name="paymentMethod" 
                            value={method.label}
                            checked={paymentMethod === method.label}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <method.icon className={`w-5 h-5 ${paymentMethod === method.label ? 'text-indigo-600' : 'text-slate-400'}`} />
                          <span className={`font-medium ${paymentMethod === method.label ? 'text-indigo-800' : 'text-slate-600'}`}>{method.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-8">
                    <span className="text-lg font-bold text-slate-800">Total Tagihan</span>
                    <span className="text-2xl font-black text-indigo-600">{formatCurrency(selectedTotal)}</span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={selectedItems.size === 0 || isCheckingOut}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none relative"
                  >
                    {isCheckingOut ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Memproses...
                      </span>
                    ) : (
                      `Checkout (${selectedItems.size})`
                    )}
                  </button>
               </div>
            </div>
            
          </div>
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
              <ShoppingCart className="w-10 h-10 text-indigo-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-3">Keranjang Kosong</h3>
            <p className="text-slate-500 max-w-md mx-auto text-lg">
              Keranjang belanja Anda belum memiliki buku. Silahkan jelajahi katalog kami.
            </p>
          </div>
        )}
      </div>

      <Notification 
        isOpen={notifOpen}
        message={notifMessage}
        type={notifType}
        onClose={hideNotif}
      />
    </UserLayout>
  );
}


