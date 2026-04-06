"use client";

import { useState } from "react";
import Modal from "@/src/components/ui/Modal";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { updateUserProgress } from "@/src/lib/actions/progress";
import Notification from "@/src/components/ui/Notification";
import { useNotification } from "@/src/hooks/useNotification";

export interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  bookTitle: string;
  initialStatus: "reading" | "completed";
  initialProgress: number;
  onUpdateSuccess: () => void;
}

export function ProgressModal({
  isOpen,
  onClose,
  bookId,
  bookTitle,
  initialStatus,
  initialProgress,
  onUpdateSuccess
}: ProgressModalProps) {
  const [status, setStatus] = useState<"reading" | "completed">(initialStatus);
  const [progress, setProgress] = useState<number>(initialProgress);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { 
    isOpen: notifOpen, 
    message: notifMessage, 
    type: notifType, 
    showNotification, 
    onClose: hideNotif 
  } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (progress < 0 || progress > 100) {
      showNotification("Progress harus antara 0 dan 100%", "error");
      return;
    }

    setIsSubmitting(true);
    const res = await updateUserProgress(bookId, status, progress);
    setIsSubmitting(false);

    if (res.success) {
      showNotification(res.message || "Progress diupdate!", "success");
      onUpdateSuccess();
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      showNotification(res.message || "Gagal mengupdate progress", "error");
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Ubah Progress Membaca" size="sm">
        <div className="p-2 space-y-6">
          <div className="text-center">
            <h3 className="font-bold text-slate-800 text-lg truncate max-w-full" title={bookTitle}>{bookTitle}</h3>
            <p className="text-sm text-slate-500">Sesuaikan status progress membaca Anda saat ini.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Status Buku</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { setStatus("reading"); if(progress === 100) setProgress(99); }}
                  className={`py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all focus:outline-none ${status === 'reading' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-100 hover:border-slate-200 text-slate-500 bg-slate-50 hover:bg-white'}`}
                >
                  Sedang Dibaca
                </button>
                <button
                  type="button"
                  onClick={() => { setStatus("completed"); setProgress(100); }}
                  className={`py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all focus:outline-none ${status === 'completed' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-slate-100 hover:border-slate-200 text-slate-500 bg-slate-50 hover:bg-white'}`}
                >
                  Selesai Dibaca
                </button>
              </div>
            </div>

            {status === "reading" && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Persentase Progress (%)</label>
                <Input
                  type="number"
                  min={0}
                  max={99}
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  required
                  placeholder="Misal: 45"
                  className="bg-slate-50 focus:bg-white"
                />
                {/* Visual Progress Bar Match */}
                <div className="h-2 w-full bg-slate-100 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <Button type="button" variant="secondary" onClick={onClose} className="flex-1 rounded-xl">Batal</Button>
              <Button type="submit" variant="primary" disabled={isSubmitting} className="flex-1 rounded-xl bg-indigo-600 text-white">
                {isSubmitting ? "Menyimpan..." : "Simpan Progress"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Notification 
        isOpen={notifOpen}
        message={notifMessage}
        type={notifType}
        onClose={hideNotif}
      />
    </>
  );
}