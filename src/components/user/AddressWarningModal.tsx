import { MapPin, X } from "lucide-react";
import Link from "next/link";

interface AddressWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddressWarningModal({ isOpen, onClose }: AddressWarningModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 md:p-8 space-y-6 text-center">
          <div className="flex justify-end">
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mx-auto w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center border-4 border-white shadow-sm mb-6">
            <MapPin className="w-10 h-10 text-amber-500" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">Alamat Belum Diatur</h3>
            <p className="text-slate-500 text-base leading-relaxed">
              Anda wajib melengkapi alamat pengiriman di profil sebelum melanjutkan proses checkout.
            </p>
          </div>

          <div className="pt-4">
            <Link 
              href="/user/settings"
              className="w-full flex items-center justify-center py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]"
            >
              Lengkapi Alamat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}