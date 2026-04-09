"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MoreVertical, Trash2, Loader2 } from "lucide-react";
import { useChatWebSocket } from "@/src/hooks/useChatWebSocket";
import {
  getAdminConversations,
  getChatHistory,
  sendChatMessage,
  markMessagesAsRead,
  deleteConversation,
} from "@/src/lib/actions/chat";
import { ChatRoom } from "@/src/components/chat/ChatRoom";
import { formatChatTime } from "@/src/lib/utils";

interface AdminChatProps {
  adminId: string;
  isWidgetOpen?: boolean;
  onUnreadChange?: (hasUnread: boolean) => void;
}

export function AdminChat({ adminId, isWidgetOpen, onUnreadChange }: AdminChatProps) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showOptionsId, setShowOptionsId] = useState<string | null>(null);
  
  const { socket } = useChatWebSocket(adminId);

  const fetchConversations = useCallback(async () => {
    try {
      const data = await getAdminConversations(adminId);
      setConversations(data);
      
      const totalUnread = data.reduce((acc: number, curr: any) => acc + (curr.unreadCount || 0), 0);
      if (onUnreadChange) {
        onUnreadChange(totalUnread > 0);
      }
    } catch (error) {
      console.error("Gagal mengambil data list percakapan admin:", error);
    } finally {
      setIsLoading(false);
    }
  }, [adminId, onUnreadChange]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (!socket) return;

    const handleReceive = (incomingMsg: any) => {
      if (selectedUser?.id === incomingMsg.senderId) {
        setMessages((prev) => {
          if (prev.find((m) => m.id === incomingMsg.id)) return prev;
          return [...prev, {
            ...incomingMsg,
            sender: incomingMsg.senderId === adminId ? undefined : {
              id: selectedUser.id,
              fullName: selectedUser.fullName,
              avatarUrl: selectedUser.avatarUrl
            }
          }];
        });
        if (isWidgetOpen) {
          markMessagesAsRead(incomingMsg.senderId, adminId).catch(console.error);
          if (onUnreadChange) onUnreadChange(false);
        } else {
          if (onUnreadChange) onUnreadChange(true);
        }
      } else {
        if (onUnreadChange) onUnreadChange(true);
      }
      
      fetchConversations();
    };

    socket.on("receive-message", handleReceive);
    return () => {
      socket.off("receive-message", handleReceive);
    };
  }, [socket, adminId, selectedUser, fetchConversations, isWidgetOpen, onUnreadChange]);

  const handleSelectUser = async (user: any) => {
    // Simpan seluruh objek user agar bisa ambil avatar dsb
    setSelectedUser(user);
    setIsLoading(true);
    
    try {
      const history = await getChatHistory(adminId, user.id);
      // Map history untuk inject sender info
      const mappedHistory = history.map((m: any) => ({
        ...m,
        sender: m.senderId === adminId ? undefined : {
          id: user.id,
          fullName: user.fullName,
          avatarUrl: user.avatarUrl
        }
      }));
      setMessages(mappedHistory);
      await markMessagesAsRead(user.id, adminId);
      fetchConversations();
    } catch (error) {
      console.error("Gagal memuat rekam jejak chat user", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedUser(null);
    setMessages([]);
  };

  const handleSend = async (text: string) => {
    if (!selectedUser) return;
    setIsSending(true);

    try {
      const newMsg = await sendChatMessage(adminId, selectedUser.id, text);
      setMessages((prev) => [...prev, newMsg]);

      if (socket) {
        socket.emit("send-message", newMsg);
      }
      fetchConversations();
    } catch (error) {
      console.error("Gagal mengirim pesan dari admin", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteChat = async (userId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus seluruh riwayat chat dengan pengguna ini?")) {
      try {
        await deleteConversation(adminId, userId);
        setShowOptionsId(null);
        if (selectedUser?.id === userId) {
          handleBackToList();
        }
        fetchConversations();
      } catch (error) {
        console.error("Gagal menghapus percakapan", error);
      }
    }
  };

  if (isLoading && conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (selectedUser) {
    return (
      <ChatRoom
        messages={messages}
        currentUserId={adminId}
        onSendMessage={handleSend}
        onBack={handleBackToList}
        title={selectedUser.fullName}
        isLoadingHistory={isLoading}
        isSending={isSending}
      />
    );
  }

  // Tampilan List Inbox User untuk Admin
  return (
    <div className="flex-1 overflow-y-auto w-full h-full bg-white dark:bg-gray-900">
      {conversations.length === 0 ? (
        <div className="text-center text-sm py-10 text-gray-500">
          Belum ada percakapan masuk dari user.
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {conversations.map((conv) => (
            <li
              key={conv.user.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative"
            >
              <div
                className="flex flex-col p-4 w-full cursor-pointer pr-10"
                onClick={() => handleSelectUser(conv.user)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-sm text-gray-900 dark:text-white truncate pr-2">
                    {conv.user.fullName}
                  </span>
                  {conv.lastMessage && (
                    <span className="text-xs text-gray-400 shrink-0">
                      {formatChatTime(conv.lastMessage.createdAt)}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span className="truncate pr-4">
                    {conv.lastMessage?.message || "Mulai percakapan via Chat"}
                  </span>
                  {conv.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>

              {/* Titik Tiga & Hapus Action */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowOptionsId(
                      showOptionsId === conv.user.id ? null : conv.user.id
                    );
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {showOptionsId === conv.user.id && (
                  <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg border dark:border-gray-700 z-10">
                    <button
                      onClick={(e) => {
                         e.stopPropagation();
                         handleDeleteChat(conv.user.id);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
                    >
                      Hapus Chat <Trash2 className="w-3.h-3" />
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
