"use server";

import { prisma } from "@/src/lib/prisma";

export async function getAssigneeAdmin(userId: string) {
  try {
    // Cari apakah user ini sudah pernah chat dengan admin tertentu sebelumnya
    const existingMessage = await prisma.chatMessage.findFirst({
      where: {
        OR: [
          { senderId: userId, receiver: { role: "admin" } },
          { receiverId: userId, sender: { role: "admin" } },
        ],
      },
      include: {
        sender: {
          select: { id: true, fullName: true, avatarUrl: true, role: true },
        },
        receiver: {
          select: { id: true, fullName: true, avatarUrl: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (existingMessage) {
      const otherUser =
        existingMessage.senderId === userId
          ? existingMessage.receiver
          : existingMessage.sender;

      if (otherUser && otherUser.role === "admin") {
        return otherUser;
      }
    }

    // Jika belum ada history, assign ke admin pertama secara default
    // (Bisa di-upgrade menjadi round-robin / cari admin yg online kedepannya)
    const firstAdmin = await prisma.user.findFirst({
      where: { role: "admin" },
      orderBy: { createdAt: "asc" },
      select: { id: true, fullName: true, avatarUrl: true, role: true },
    });

    return firstAdmin;
  } catch (error) {
    console.error("Error getting assignee admin:", error);
    throw new Error("Failed to get assignee admin");
  }
}

export async function getAdminConversations(adminId: string) {
  try {
    // Mengambil daftar user yg pernah berinteraksi (mengirim/menerima pesan) dengan admin ini
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { sentMessages: { some: { receiverId: adminId } } },
          { receivedMessages: { some: { senderId: adminId } } },
        ],
        id: { not: adminId }, // Pastikan admin tidak menarik datanya sendiri
      },
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        sentMessages: {
          where: { receiverId: adminId },
          orderBy: { createdAt: "desc" },
          take: 1, // Hanya ambil pesan terakhir untuk preview
        },
        receivedMessages: {
          where: { senderId: adminId },
          orderBy: { createdAt: "desc" },
          take: 1, // Hanya ambil pesan terakhir untuk preview
        },
        _count: {
          select: {
            sentMessages: {
              where: { receiverId: adminId, isRead: false },
            },
          },
        },
      },
    });

    // Format & gabungkan hasil
    const conversations = users.map((user: any) => {
      const lastSent = user.sentMessages[0];
      const lastReceived = user.receivedMessages[0];

      let lastMessage = lastSent;
      if (
        !lastMessage ||
        (lastReceived && lastReceived.createdAt > lastMessage.createdAt)
      ) {
        lastMessage = lastReceived;
      }

      return {
        user: {
          id: user.id,
          fullName: user.fullName,
          avatarUrl: user.avatarUrl,
        },
        lastMessage,
        unreadCount: user._count.sentMessages,
      };
    });

    // Urutkan berdasarkan pesan terbaru
    return conversations.sort((a: any, b: any) => {
      const dateA = a.lastMessage?.createdAt
        ? new Date(a.lastMessage.createdAt).getTime()
        : 0;
      const dateB = b.lastMessage?.createdAt
        ? new Date(b.lastMessage.createdAt).getTime()
        : 0;
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw new Error("Failed to fetch conversations");
  }
}

export async function getChatHistory(userId1: string, userId2: string) {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      orderBy: {
        createdAt: "asc", // Urutkan dari yg paling lama (di atas) ke baru (di bawah)
      },
    });
    return messages;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw new Error("Failed to fetch chat history");
  }
}

export async function sendChatMessage(
  senderId: string,
  receiverId: string,
  message: string
) {
  try {
    if (!senderId || !receiverId || !message.trim()) {
      throw new Error("Invalid message data");
    }

    const newMessage = await prisma.chatMessage.create({
      data: {
        senderId,
        receiverId,
        message,
      },
    });
    return newMessage;
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message");
  }
}

export async function markMessagesAsRead(senderId: string, receiverId: string) {
  try {
    await prisma.chatMessage.updateMany({
      where: {
        senderId: senderId,
        receiverId: receiverId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error marking messages as read:", error);
    throw new Error("Failed to mark messages as read");
  }
}

export async function deleteConversation(userId1: string, userId2: string) {
  try {
    await prisma.chatMessage.deleteMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting conversation:", error);
    throw new Error("Failed to delete conversation");
  }
}
