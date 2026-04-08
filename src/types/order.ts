import { OrderStatus, PaymentStatus } from "../lib/constants";

export type OrderItem = {
  id: string;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  cancelReason?: string | null;
  cancelledAt?: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  user: {
    fullName: string;
    email: string;
    avatarUrl?: string | null;
  };
  orderItems: {
    bookId: string;
    quantity: number;
    price: number;
    book: {
      id: string;
      title: string;
      author: string;
      imageUrl: string | null;
      price: number;
    };
  }[];
};

export type OrderStats = {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
};
