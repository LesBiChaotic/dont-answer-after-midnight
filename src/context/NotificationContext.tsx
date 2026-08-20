import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Notification } from '../types';
import { getDB } from '../services/storage';
import { liveDirector } from '../services/liveDirector';
import { playNotificationSound } from '../services/audio';
import { useSettings } from './SettingsContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  activeToast: Notification | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  dismissToast: () => void;
  addManualNotification: (notif: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeToast, setActiveToast] = useState<Notification | null>(null);

  // Load from DB
  useEffect(() => {
    async function load() {
      try {
        const db = await getDB();
        const stored = await db.getAll('notifications');
        // Sort descending by created date
        stored.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNotifications(stored);
      } catch (err) {
        console.warn('[NotificationContext] Failed to load notifications:', err);
      }
    }
    load();
  }, []);

  // Listen to liveDirector notifications
  useEffect(() => {
    const unsubscribe = liveDirector.subscribeNotification(async (newNotif) => {
      const db = await getDB();
      await db.put('notifications', newNotif);

      setNotifications((prev) => [newNotif, ...prev.filter((n) => n.id !== newNotif.id)]);
      setActiveToast(newNotif);
      playNotificationSound(settings.sound);

      // Auto dismiss toast after 4s
      setTimeout(() => {
        setActiveToast((current) => (current?.id === newNotif.id ? null : current));
      }, 4000);
    });

    return unsubscribe;
  }, [settings.sound]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = useCallback(async (id: string) => {
    const db = await getDB();
    const target = await db.get('notifications', id);
    if (target) {
      target.isRead = true;
      await db.put('notifications', target);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const db = await getDB();
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    const tx = db.transaction('notifications', 'readwrite');
    for (const notif of updated) {
      await tx.store.put(notif);
    }
    await tx.done;
    setNotifications(updated);
  }, [notifications]);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  const addManualNotification = useCallback(
    async (notifData: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
      const newNotif: Notification = {
        ...notifData,
        id: `notif_${Date.now()}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      const db = await getDB();
      await db.put('notifications', newNotif);
      setNotifications((prev) => [newNotif, ...prev]);
      setActiveToast(newNotif);
      playNotificationSound(settings.sound);
    },
    [settings.sound]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        activeToast,
        markAsRead,
        markAllAsRead,
        dismissToast,
        addManualNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
