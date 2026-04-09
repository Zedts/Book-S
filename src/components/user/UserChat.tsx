"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useChatWebSocket } from "@/src/hooks/useChatWebSocket";
import {
  getAssigneeAdmin,
  getChatHistory,
  sendChatMessage,
  markMessagesAsRead,
} from "@/src/lib/actions/chat";
import { ChatRoom } from "@/src/components/chat/ChatRoom";
import { formatChatTime } from "@/src/lib/utils";

interface UserChatProps {
  userId: string;
  isWidgetOpen?: boolean;
  onUnreadChange?: (hasUnread: boolean) => void;
}

export function UserChat({ userId, isWidgetOpen, onUnreadChange }: UserChatProps) {
  const [admin, setAdmin] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { socket } = useChatWebSocket(userId);

  const fetchHistory = useCallback(async (adminInfo: any) => {
    try {
      const history = await getChatHistory(userId, adminInfo.id);
      const mappedHistory = history.map((m: any) => ({
        ...m,
        sender: m.senderId === adminInfo.id ? { 
          id: adminInfo.id, 
          fullName: adminInfo.fullName, 
          avatarUrl: adminInfo.avatarUrl 
        } : undefined
      }));
      setMessages(mappedHistory);
      
      const hasUnreadMessages = history.some(
        (m: any) => m.senderId === adminInfo.id && !m.isRead
      );
      
      if (isWidgetOpen) {
        await markMessagesAsRead(adminInfo.id, userId);
        if (onUnreadChange) onUnreadChange(false);
      } else if (hasUnreadMessages && onUnreadChange) {
        onUnreadChange(true);
      }
    } catch (error) {
      console.error("Failed to load chat history", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, isWidgetOpen, onUnreadChange]);

  useEffect(() => {
    const initChat = async () => {
      try {
        const assignee = await getAssigneeAdmin(userId);
        if (assignee) {
          setAdmin(assignee);
          await fetchHistory(assignee);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Init chat error", error);
        setIsLoading(false);
      }
    };
    initChat();
  }, [userId, fetchHistory]);

  useEffect(() => {
    if (isWidgetOpen && admin) {
      markMessagesAsRead(admin.id, userId).catch(console.error);
    }
  }, [isWidgetOpen, admin, userId]);

  useEffect(() => {
    if (!socket || !admin) return;

    const handleReceive = (incomingMsg: any) => {
      if (
        incomingMsg.senderId === admin.id ||
        incomingMsg.senderId === userId
      ) {
        setMessages((prev) => {
          if (prev.find((m) => m.id === incomingMsg.id)) return prev;
          return [...prev, {
            ...incomingMsg,
            sender: incomingMsg.senderId === admin.id ? {
              id: admin.id,
              fullName: admin.fullName,
              avatarUrl: admin.avatarUrl
            } : undefined
          }];
        });

        if (incomingMsg.senderId === admin.id) {
          if (isWidgetOpen) {
            markMessagesAsRead(admin.id, userId).catch(console.error);
            if (onUnreadChange) onUnreadChange(false);
          } else {
            if (onUnreadChange) onUnreadChange(true);
          }
        }
      }
    };

    socket.on("receive-message", handleReceive);
    return () => {
      socket.off("receive-message", handleReceive);
    };
  }, [socket, admin, userId, isWidgetOpen, onUnreadChange]);

  const handleSend = async (text: string) => {
    if (!admin) return;
    setIsSending(true);

    try {
      const newMsg = await sendChatMessage(userId, admin.id, text);
      setMessages((prev) => [...prev, newMsg]);

      if (socket) {
        socket.emit("send-message", newMsg);
      }
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <ChatRoom
      messages={messages}
      currentUserId={userId}
      onSendMessage={handleSend}
      isLoadingHistory={isLoading}
      isSending={isSending}
      placeholder="Halo! Ada yang bisa kami bantu?"
    />
  );
}
