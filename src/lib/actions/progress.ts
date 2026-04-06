"use server";

import { prisma } from "@/src/lib/prisma";
import { cookies } from "next/headers";
import { getSession } from "@/src/lib/auth";

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
      message: `Progress buku "${updated.book.title}" berhasil diupdate`, 
      data: updated 
    };
  } catch (error) {
    console.error("updateUserProgress Error:", error);
    return { success: false, message: "Gagal mengupdate progress buku" };
  }
}

// Untuk sementara hanya fungsi dummy visual jika UI rating ingin dinyalakan.
export async function submitRating(bookId: string, rating: number) {
  try {
    const session = await getSession();
    if (!session?.id) return { success: false, message: "Unauthorized" };
    
    if (rating < 1 || rating > 5) {
        return { success: false, message: "Rating tidak valid" };
    }

    return { success: true, message: "Terima kasih atas penilaian Anda!" };
  } catch (error) {
     console.error("submitRating Error:", error);
     return { success: false, message: "Gagal mengirim penilaian" };
  }
}
