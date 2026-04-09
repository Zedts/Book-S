"use server";

import { prisma } from "@/src/lib/prisma";
import { getSession } from "@/src/lib/auth";
import { revalidatePath } from "next/cache";
import { calculateTrendPercentage } from "../utils";

export async function getAllOrders() {
  const session = await getSession();
  if (!session?.id || session.role !== 'admin') {
    throw new Error("Unauthorized");
  }

  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          fullName: true,
          email: true,
        }
      },
      orderItems: {
        include: {
          book: {
            select: {
              title: true,
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return orders;
}

export async function getOrderStats() {
  const session = await getSession();
  if (!session?.id || session.role !== 'admin') {
    throw new Error("Unauthorized");
  }

  const now = new Date();
  const yesterday = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  const totalOrders = await prisma.order.count();
  const totalRevenue = await prisma.order.aggregate({
    _sum: {
      total: true
    },
    where: {
      paymentStatus: "paid"
    }
  });

  const pendingOrders = await prisma.order.count({
    where: { status: "pending" }
  });

  const currentPeriodOrders = await prisma.order.count({
    where: {
      createdAt: { gte: yesterday }
    }
  });

  const previousPeriodOrders = await prisma.order.count({
    where: {
      createdAt: { gte: twoDaysAgo, lt: yesterday }
    }
  });

  const currentPeriodRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: {
      paymentStatus: "paid",
      createdAt: { gte: yesterday }
    }
  });

  const previousPeriodRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: {
      paymentStatus: "paid",
      createdAt: { gte: twoDaysAgo, lt: yesterday }
    }
  });

  return {
    totalOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    pendingOrders,
    trends: {
      orders: calculateTrendPercentage(currentPeriodOrders, previousPeriodOrders),
      revenue: calculateTrendPercentage(currentPeriodRevenue._sum.total || 0, previousPeriodRevenue._sum.total || 0)
    }
  };
}

export async function updateOrderStatus(orderId: string, status: string, paymentStatus?: string) {
  const session = await getSession();
  if (!session?.id || session.role !== 'admin') {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const data: { status: string; paymentStatus?: string } = { status };
    if (paymentStatus) {
      data.paymentStatus = paymentStatus;
    }

    await prisma.order.update({
      where: { id: orderId },
      data
    });
    
    revalidatePath('/admin/orders');
    revalidatePath('/user/my-books');
    revalidatePath('/user/home');
    return { success: true, message: "Status pesanan berhasil diperbarui." };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, message: "Gagal memperbarui status pesanan." };
  }
}

export async function getUserOrders() {
  const session = await getSession();
  if (!session?.id) {
    return { success: false, message: "Unauthorized", data: [] };
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId: session.id },
      include: {
        orderItems: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                author: true,
                imageUrl: true,
                price: true
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return { success: true, data: orders };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return { success: false, message: "Gagal mengambil data pesanan.", data: [] };
  }
}

export async function cancelUserOrder(orderId: string, reason: string) {
  const session = await getSession();
  if (!session?.id) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true }
    });

    if (!order || order.userId !== session.id) {
      return { success: false, message: "Pesanan tidak ditemukan." };
    }

    if (order.status !== "pending") {
      return { success: false, message: "Hanya pesanan pending yang dapat dibatalkan." };
    }

    // Transaksi pembatalan pesanan dan memulihkan stok buku
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: "cancelled",
          paymentStatus: "failed", // Ubah status pembayaran opsional (menjadi failed agar riwayat jelas)
          cancelReason: reason,
          cancelledAt: new Date()
        }
      });

      // Kembalikan (increment) stok buku
      for (const item of order.orderItems) {
        await tx.book.update({
          where: { id: item.bookId },
          data: {
            stock: { increment: item.quantity }
          }
        });

        // Hapus progress membaca terkait pesanan ini agar tidak muncul di Sedang Dibaca
        await tx.userBookProgress.deleteMany({
          where: {
            userId: session.id,
            bookId: item.bookId
          }
        });
      }
    });

    revalidatePath("/user/cart");
    revalidatePath("/user/home");
    revalidatePath("/user/my-books");
    
    return { success: true, message: "Pesanan berhasil dibatalkan." };
  } catch (error) {
    console.error("Error cancelling order:", error);
    return { success: false, message: "Terjadi kesalahan saat membatalkan pesanan." };
  }
}
