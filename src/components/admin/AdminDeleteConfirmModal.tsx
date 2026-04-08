import React from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import Modal from "@/src/components/ui/Modal";

interface AdminDeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  isDeleting: boolean;
}

export const AdminDeleteConfirmModal: React.FC<AdminDeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isDeleting
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 text-rose-600 mb-4 mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 text-center">Apakah Anda yakin?</h3>
        <p className="text-slate-600 text-center text-sm">
          {message} {itemName && <span className="font-semibold text-slate-800">{itemName}</span>}. 
          Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="pt-4 flex items-center justify-center gap-3 mt-6">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors text-sm"
          >
            Batal
          </button>
          <button 
            type="button" 
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white font-medium rounded-xl hover:bg-rose-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed text-sm"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              "Ya, Hapus"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
