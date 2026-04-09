"use client";

import React, { useState } from "react";
import { Send, Loader2, ArrowLeft } from "lucide-react";
import { MessageList, ChatMessage } from "./MessageList";

interface ChatRoomProps {
  messages: ChatMessage[];
  currentUserId: string;
  onSendMessage: (content: string) => Promise<void>;
  isLoadingHistory?: boolean;
  isSending?: boolean;
  onBack?: () => void;
  placeholder?: string;
  title?: string;
  headerAction?: React.ReactNode;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({
  messages,
  currentUserId,
  onSendMessage,
  isLoadingHistory = false,
  isSending = false,
  onBack,
  placeholder = "Ketik pesan...",
  title,
  headerAction
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    const content = inputValue.trim();
    setInputValue("");
    await onSendMessage(content);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      {(title || headerAction || onBack) && (
        <div className="px-4 py-3 border-b dark:border-gray-800 flex items-center gap-3 bg-gray-50 dark:bg-gray-900 sticky top-0 z-10 shrink-0">
          {onBack && (
            <button
              onClick={onBack}
              className="hover:bg-gray-200 dark:hover:bg-gray-800 p-1.5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          )}
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                {title}
              </h4>
            )}
          </div>
          {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
        </div>
      )}

      {/* Messages */}
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        isLoading={isLoadingHistory}
      />

      {/* Input */}
      <div className="p-3 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2 relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1 border dark:border-gray-700 bg-white dark:bg-gray-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-200"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isSending}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 shadow-sm"
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
