import { useState, useCallback } from "react";

export type NotificationType = "success" | "error";

export interface NotificationState {
  isOpen: boolean;
  message: string;
  type: NotificationType;
}

export function useNotification() {
  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const showNotification = useCallback((message: string, type: NotificationType = "success") => {
    setNotification({
      isOpen: true,
      message,
      type,
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    ...notification,
    showNotification,
    hideNotification,
    // For compatibility with some existing code patterns
    isOpen: notification.isOpen,
    message: notification.message,
    type: notification.type,
    onClose: hideNotification,
  };
}
