/**
 * Order Status constants to ensure consistency across the application.
 */
export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  FAILED: "failed",
} as const;

export const PAYMENT_STATUS = {
  UNCHECKED: "Unchecked",
  PAID: "paid",
  FAILED: "failed",
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];
