import React from "react";
import { CheckCircle2, XCircle, Loader2, Clock, ShieldCheck, User } from "lucide-react";
import { OrderStatus, PaymentStatus } from "@/src/lib/constants";

interface AdminStatusBadgeProps {
  status: OrderStatus | PaymentStatus | string;
  type?: "order" | "payment" | "role";
  size?: "sm" | "md";
}

export const AdminStatusBadge: React.FC<AdminStatusBadgeProps> = ({
  status,
  type = "order",
  size = "md"
}) => {
  const getColors = () => {
    const s = String(status).toLowerCase();
    switch (s) {
      case "completed":
      case "paid":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "processing":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "cancelled":
      case "failed":
        return "bg-rose-50 text-rose-600 border-rose-200";
      case "pending":
      case "unchecked":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "admin":
        return "bg-indigo-50 text-indigo-600 border-indigo-200/50";
      case "customer":
        return "bg-slate-100 text-slate-600 border-slate-200/50";
      default:
        return "bg-slate-50 text-slate-500 border-slate-200";
    }
  };

  const getIcon = () => {
    const s = String(status).toLowerCase();
    const iconSize = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";
    
    switch (s) {
      case "completed":
      case "paid":
        return <CheckCircle2 className={iconSize} />;
      case "processing":
        return <Loader2 className={`${iconSize} animate-spin`} />;
      case "cancelled":
      case "failed":
        return <XCircle className={iconSize} />;
      case "pending":
      case "unchecked":
        return <Clock className={iconSize} />;
      case "admin":
        return <ShieldCheck className={iconSize} />;
      case "customer":
        return <User className={iconSize} />;
      default:
        return null;
    }
  };

  const padding = size === "sm" ? "px-2 py-0.5" : "px-3 py-1.5";
  const fontSize = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <div className={`inline-flex items-center gap-1.5 ${padding} ${fontSize} font-semibold rounded-full border ${getColors()}`}>
      {getIcon()}
      <span className="capitalize">{status}</span>
    </div>
  );
};
