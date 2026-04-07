import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Lock, X, AlertTriangle } from "lucide-react";

interface PaymentPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pin: string) => Promise<void>;
  loading: boolean;
}

export default function PaymentPinModal({ isOpen, onClose, onSubmit, loading }: PaymentPinModalProps) {
  const [pin, setPin] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPin(Array(6).fill(""));
      setError(null);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    // Handle pasting 6 digits
    if (value.length === 6) {
      setPin(value.split(""));
      inputRefs.current[5]?.focus();
      return;
    }

    const newPin = [...pin];
    newPin[index] = value.substring(value.length - 1); // Take only last char if multiple typed
    setPin(newPin);
    setError(null);

    // Auto focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      // Auto focus prev on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
      const newPin = [...pin];
      newPin[index - 1] = "";
      setPin(newPin);
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const fullPin = pin.join("");
    if (fullPin.length !== 6) {
      setError("PIN harus 6 digit");
      return;
    }
    
    try {
      await onSubmit(fullPin);
    } catch (err: unknown) {
       setError(err instanceof Error ? err.message : "Gagal memverifikasi PIN");
       setPin(Array(6).fill(""));
       inputRefs.current[0]?.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100">
              <Lock className="w-6 h-6 text-indigo-600" />
            </div>
            <button 
              onClick={onClose}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Verifikasi Payment PIN</h3>
            <p className="text-slate-500 text-sm">
              Untuk keamanan transaksi Anda, masukkan 6 digit Payment PIN Anda sebelum melanjutkan checkout.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-start gap-3 border border-red-100">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="flex justify-between gap-2 md:gap-3 py-4">
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="password"
                inputMode="numeric"
                pattern="\d*"
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={loading}
                className="w-full aspect-square text-center text-2xl font-bold text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all disabled:opacity-50"
              />
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || pin.join("").length !== 6}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-[0.98] flex justify-center items-center gap-2"
          >
            {loading ? (
               <>
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 Memverifikasi...
               </>
            ) : "Verifikasi & Bayar"}
          </button>
        </div>
      </div>
    </div>
  );
}