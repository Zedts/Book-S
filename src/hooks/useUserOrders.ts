import { useState, useEffect, useCallback } from "react";
import { getUserOrders, cancelUserOrder } from "@/src/lib/actions/order";
import { getCart } from "@/src/lib/actions/cart";
import { getUserProgress } from "@/src/lib/actions/progress";
import { OrderItem } from "@/src/types/order";
import { UserBookProgress } from "@/src/types/progress";
import { useRequireRole } from "./useRequireRole";

export function useUserOrders() {
  const { user } = useRequireRole("users");
  
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [progresses, setProgresses] = useState<UserBookProgress[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Timestamps for "clearing" bags locally
  const [notificationsClearedAt, setNotificationsClearedAt] = useState<number>(0);
  const [cartBagClearedAt, setCartBagClearedAt] = useState<number>(0);
  const [ordersBagClearedAt, setOrdersBagClearedAt] = useState<number>(0);

  // Initialize from localStorage
  useEffect(() => {
    const nca = localStorage.getItem("notificationsClearedAt");
    const cbca = localStorage.getItem("cartBagClearedAt");
    const obca = localStorage.getItem("ordersBagClearedAt");
    
    if (nca) setNotificationsClearedAt(parseInt(nca, 10));
    if (cbca) setCartBagClearedAt(parseInt(cbca, 10));
    if (obca) setOrdersBagClearedAt(parseInt(obca, 10));
  }, []);

  const refreshData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [ordersRes, cartRes, progressRes] = await Promise.all([
        getUserOrders(),
        getCart(),
        getUserProgress()
      ]);
      
      if (ordersRes.success && ordersRes.data) {
        setOrders(ordersRes.data as unknown as OrderItem[]);
      }
      
      if (cartRes.success && cartRes.data) {
        setCartItems(cartRes.data as any[]);
      }

      if (progressRes.success && progressRes.data) {
        setProgresses(progressRes.data as any[]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const clearNotifications = () => {
    const now = Date.now();
    setNotificationsClearedAt(now);
    localStorage.setItem("notificationsClearedAt", now.toString());
  };

  const clearCartBag = () => {
    const now = Date.now();
    setCartBagClearedAt(now);
    localStorage.setItem("cartBagClearedAt", now.toString());
  };

  const clearOrdersBag = () => {
    const now = Date.now();
    setOrdersBagClearedAt(now);
    localStorage.setItem("ordersBagClearedAt", now.toString());
  };

  const cancelOrder = async (orderId: string, reason: string) => {
    const res = await cancelUserOrder(orderId, reason);
    if (res.success) {
      await refreshData();
    }
    return res;
  };

  // Filtered views
  const notifications = orders.filter((order) => {
    const orderTime = new Date(order.updatedAt).getTime();
    const diffTime = Math.abs(new Date().getTime() - orderTime);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 3 && orderTime > notificationsClearedAt;
  });

  const visibleCartItems = cartItems.filter(item => {
    if (!cartBagClearedAt) return true;
    return new Date(item.createdAt).getTime() > cartBagClearedAt;
  });

  const visibleOrders = orders.filter(order => {
    // pending or processing should always show in lists unless specifically cleared? 
    // Usually, we only clear "history" (completed/cancelled).
    if (order.status === 'pending' || order.status === 'processing') return true;
    if (!ordersBagClearedAt) return true;
    return new Date(order.createdAt).getTime() > ordersBagClearedAt;
  });

  const activeOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;

  return {
    user,
    orders,
    cartItems,
    progresses,
    loading,
    notifications,
    visibleCartItems,
    visibleOrders,
    activeOrdersCount,
    refreshData,
    clearNotifications,
    clearCartBag,
    clearOrdersBag,
    cancelOrder
  };
}
