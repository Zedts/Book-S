"use server";

import { prisma } from "@/src/lib/prisma";
import { getSession } from "@/src/lib/auth";
import { revalidatePath } from "next/cache";

export async function getUserProgress() {
  try {
    const session = await getSession();
    if (!session?.id) {
      return { success: false, message: "Unauthorized", data: [] };
    }

    const progressRecords = await prisma.userBookProgress.findMany({
      where: { userId: session.id },
      include: {
        book: {
          include: {
            category: true
          }
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return { success: true, message: "Berhasil mengambil data progress", data: progressRecords };
  } catch (error) {
    console.error("getUserProgress Error:", error);
    return { success: false, message: "Terjadi kesalahan sistem", data: [] };
  }
}

export async function updateUserProgress(bookId: string, status: "reading" | "completed", progress: number) {
  try {
    const session = await getSession();
    if (!session?.id) return { success: false, message: "Unauthorized" };

    if (progress < 0 || progress > 100) {
      return { success: false, message: "Progress tidak valid" };
    }

    const updated = await prisma.userBookProgress.update({
      where: {
        userId_bookId: {
          userId: session.id,
          bookId
        }
      },
      data: {
        status,
        progress: status === "completed" ? 100 : progress
      },
      include: {
        book: true
      }
    });

    return { 
      success: true,
      message: "Progress berhasil diperbarui",
      data: updated 
    };
  } catch (error) {
    console.error("updateUserProgress Error:", error);
    return { success: false, message: "Gagal mengupdate progress buku" };
  } finally {
    revalidatePath("/user/my-books");
    revalidatePath("/user/home");
  }
}

export async function submitRating(bookId: string, rating: number) {
  try {
    const session = await getSession();
    if (!session?.id) return { success: false, message: "Unauthorized" };

    if (rating < 1 || rating > 5) {
      return { success: false, message: "Rating tidak valid" };
    }

    // Pastikan user memiliki buku tersebut di progress
    const hasBook = await prisma.userBookProgress.findUnique({
      where: {
        userId_bookId: {
          userId: session.id,
          bookId,
        },
      },
    });

    if (!hasBook) {
      return { success: false, message: "Anda tidak memiliki akses untuk memberikan rating pada buku ini" };
    }

    // Jalankan transaksi: upsert Rating lalu update Book average
    await prisma.$transaction(async (tx) => {
      const existingRating = await tx.rating.findUnique({
        where: {
          userId_bookId: {
            userId: session.id,
            bookId,
          },
        },
      });

      if (existingRating && existingRating.score === rating) {
        // Skrip berhenti di sini jika skor sama, tidak perlu update rata-rata
        return;
      }

      await tx.rating.upsert({
        where: {
          userId_bookId: {
            userId: session.id,
            bookId,
          },
        },
        create: {
          userId: session.id,
          bookId,
          score: rating,
        },
        update: {
          score: rating,
        },
      });

      const avgRating = await tx.rating.aggregate({
        where: { bookId },
        _avg: { score: true },
      });

      const newAvg = avgRating._avg.score || 0;

      await tx.book.update({
        where: { id: bookId },
        data: { rating: Number(newAvg.toFixed(1)) },
      });
    });

    return { success: true, message: "Penilaian Anda berhasil disimpan!" };
  } catch (error) {
    console.error("submitRating Error:", error);
    return { success: false, message: "Gagal mengirim penilaian" };
  } finally {
    revalidatePath("/");
  }
}

export async function getUserRating(bookId: string) {
  try {
    const session = await getSession();
    if (!session?.id) return { success: true, rating: 0 };

    const userRating = await prisma.rating.findUnique({
      where: {
        userId_bookId: {
          userId: session.id,
          bookId,
        },
      },
    });

    return { success: true, rating: userRating ? userRating.score : 0 };
  } catch (error) {
    console.error("getUserRating Error:", error);
    return { success: false, rating: 0 };
  }
}
