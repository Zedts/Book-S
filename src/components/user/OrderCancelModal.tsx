import React from "react";
import Modal from "@/src/components/ui/Modal";
import { Button } from "@/src/components/ui/Button";

interface OrderCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  cancelReason: string;
  setCancelReason: (reason: string) => void;
  onSubmit: () => void;
  isCancelling: boolean;
}

export const OrderCancelModal: React.FC<OrderCancelModalProps> = ({
  isOpen,
  onClose,
  cancelReason,
  setCancelReason,
  onSubmit,
  isCancelling
}) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Batalkan Pesanan"
    >
      <div className="space-y-4">
        <p className="text-slate-600 text-sm">
          Apakah Anda yakin ingin membatalkan pesanan ini? Aksi ini tidak dapat dikembalikan.
        </p>
        <div className="space-y-2">
          <label htmlFor="cancelReason" className="block text-sm font-medium text-slate-700">
            Alasan Pembatalan
          </label>
          <textarea
            id="cancelReason"
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Beritahu kami mengapa Anda membatalkan pesanan ini..."
            className="w-full rounded-xl border-slate-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
            maxLength={200}
          />
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isCancelling}
          >
            Batal
          </Button>
          <Button 
            variant="primary"
            className="bg-red-600 hover:bg-red-700 text-white" 
            onClick={onSubmit}
            disabled={isCancelling}
          >
            {isCancelling ? "Memproses..." : "Ya, Batalkan Pesanan"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
