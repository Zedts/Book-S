"use server";

import { prisma } from "@/src/lib/prisma";
import { getSession } from "@/src/lib/auth";
import { revalidatePath } from "next/cache";

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

  const totalOrders = await prisma.order.count();
  const totalRevenue = await prisma.order.aggregate({
    _sum: {
      total: true
    },
    where: {
      status: "completed"
    }
  });

  const pendingOrders = await prisma.order.count({
    where: { status: "pending" }
  });

  return {
    totalOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    pendingOrders
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
    return { success: true, message: "Status pesanan berhasil diperbarui." };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, message: "Gagal memperbarui status pesanan." };
  }
}
