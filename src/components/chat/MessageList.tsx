"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { formatChatTime } from "@/src/lib/utils";

export interface ChatMessage {
  id: string;
  message: string;
  senderId: string;
  receiverId: string;
  createdAt: string | Date;
  sender?: {
    id: string;
    fullName: string;
    avatarUrl?: string | null;
  };
}

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
  isLoading?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  isLoading
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-500 text-sm italic">
          Belum ada pesan. Mulai percakapan sekarang!
        </div>
      ) : (
        messages.map((msg) => {
          const isSelf = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex gap-3 max-w-[85%] ${
                  isSelf ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {!isSelf && msg.sender && (
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0 relative overflow-hidden ring-1 ring-gray-200">
                    {msg.sender.avatarUrl ? (
                      <Image
                        src={msg.sender.avatarUrl}
                        alt={msg.sender.fullName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 text-xs font-bold font-serif">
                        {msg.sender.fullName[0]}
                      </div>
                    )}
                  </div>
                )}
                <div className="flex flex-col">
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm ${
                      isSelf
                        ? "bg-blue-600 text-white rounded-tr-none shadow-sm"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-200 dark:border-gray-700 shadow-sm"
                    }`}
                  >
                    {msg.message}
                  </div>
                  <div
                    className={`text-[10px] text-gray-400 mt-1 ${
                      isSelf ? "text-right" : "text-left px-1"
                    }`}
                  >
                    {formatChatTime(msg.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={scrollRef} />
    </div>
  );
};
