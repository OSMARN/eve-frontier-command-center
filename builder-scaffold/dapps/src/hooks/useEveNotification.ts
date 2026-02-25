import { useState, useCallback } from 'react';

interface Notification {
  id: string;
  message: string;
}

interface Confirmation {
  id: string;
  message: string;
  onConfirm: () => void;
}

export function useEveNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const showNotification = useCallback((message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message }]);
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const showConfirmation = useCallback((message: string, onConfirm: () => void) => {
    const id = Date.now().toString();
    setConfirmation({ id, message, onConfirm });
  }, []);

  const closeConfirmation = useCallback(() => {
    setConfirmation(null);
  }, []);

  return {
    notifications,
    confirmation,
    showNotification,
    removeNotification,
    showConfirmation,
    closeConfirmation
  };
}
