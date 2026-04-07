export type OrderItem = {
  id: string;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: Date;
  user: {
    fullName: string;
    email: string;
  };
  orderItems: {
    book: { title: string };
  }[];
};

export type OrderStats = {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
};
