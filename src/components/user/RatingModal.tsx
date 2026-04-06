"use client";

import { useState } from "react";
import Modal from "@/src/components/ui/Modal";
import { Button } from "@/src/components/ui/Button";
import { submitRating } from "@/src/lib/actions/progress";
import Notification from "@/src/components/ui/Notification";
import { Star } from "lucide-react";
import { useNotification } from "@/src/hooks/useNotification";

export interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  bookTitle: string;
}

export function RatingModal({
  isOpen,
  onClose,
  bookId,
  bookTitle
}: RatingModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
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
    if (rating < 1 || rating > 5) {
      showNotification("Silakan pilih rating 1-5 bintang", "error");
      return;
    }
    
    setIsSubmitting(true);
    const res = await submitRating(bookId, rating);
    setIsSubmitting(false);

    if (res.success) {
      showNotification(res.message || "Rating berhasil disimpan!", "success");
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      showNotification(res.message || "Gagal menyimpan rating", "error");
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Beri Rating Buku" size="sm">
        <div className="p-2 space-y-6">
          <div className="text-center">
            <h3 className="font-bold text-slate-800 text-lg truncate max-w-full" title={bookTitle}>{bookTitle}</h3>
            <p className="text-sm text-slate-500 mt-1">Bagaimana penilaian Anda terhadap buku ini?</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2 py-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star 
                    className={`w-10 h-10 ${
                      (hoveredRating || rating) >= star 
                        ? "fill-amber-400 text-amber-400" 
                        : "text-slate-300"
                    } transition-colors`} 
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <Button type="button" variant="secondary" onClick={onClose} className="flex-1 rounded-xl">Batal</Button>
              <Button type="submit" variant="primary" disabled={isSubmitting || rating === 0} className="flex-1 rounded-xl bg-amber-500 text-white hover:bg-amber-600 border-none">
                {isSubmitting ? "Menyimpan..." : "Kirim Rating"}
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