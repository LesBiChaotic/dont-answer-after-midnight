import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  SettingsState,
  ThemeMode,
  FontChoice,
  SoundSettings,
  AccessibilitySettings,
  QuietHoursSetting,
  BlockedRelationship,
  MutedThread,
  ConversationParticipant,
} from '../types';
import {
  getStoredSettings,
  saveStoredSettings,
  getDB,
  exportAllData,
  resetDatabaseToInitial,
} from '../services/storage';
import { applyTheme, applyFont, setupSystemThemeListener } from '../services/theme';
import { INITIAL_SETTINGS } from '../data/seed';

interface SettingsContextType {
  settings: SettingsState;
  blockedList: BlockedRelationship[];
  mutedThreads: MutedThread[];
  setTheme: (theme: ThemeMode) => Promise<void>;
  setFont: (font: FontChoice) => Promise<void>;
  updateSoundSettings: (sound: Partial<SoundSettings>) => Promise<void>;
  updateAccessibilitySettings: (acc: Partial<AccessibilitySettings>) => Promise<void>;
  updateQuietHours: (quietHours: QuietHoursSetting, custom?: { start: string; end: string }) => Promise<void>;
  toggleDesktopPreview: () => void;
  blockUser: (participant: ConversationParticipant, reason?: string) => Promise<void>;
  unblockUser: (userId: string) => Promise<void>;
  isUserBlocked: (userId: string) => boolean;
  muteThread: (threadId: string) => Promise<void>;
  unmuteThread: (threadId: string) => Promise<void>;
  isThreadMuted: (threadId: string) => boolean;
  exportData: () => Promise<Record<string, unknown>>;
  resetAllData: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>(INITIAL_SETTINGS);
  const [blockedList, setBlockedList] = useState<BlockedRelationship[]>([]);
  const [mutedThreads, setMutedThreads] = useState<MutedThread[]>([]);

  // Initial load
  useEffect(() => {
    async function load() {
      try {
        const stored = await getStoredSettings();
        setSettings(stored);
        applyTheme(stored.theme);
        applyFont(stored.font);

        // Load blocked and muted from DB
        const db = await getDB();
        const storedBlocked = await db.getAll('blocked');
        const storedMuted = await db.getAll('muted');
        setBlockedList(storedBlocked);
        setMutedThreads(storedMuted);
      } catch (err) {
        console.warn('[Settings] Failed to load settings from DB:', err);
      }
    }
    load();
  }, []);

  // Listen to system color scheme changes when mode is 'device'
  useEffect(() => {
    const cleanup = setupSystemThemeListener(() => {
      if (settings.theme === 'device') {
        applyTheme('device');
      }
    });
    return cleanup;
  }, [settings.theme]);

  // Synchronize reduced motion class
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (settings.accessibility?.reduceMotion) {
        document.documentElement.classList.add('reduce-motion');
      } else {
        document.documentElement.classList.remove('reduce-motion');
      }
    }
  }, [settings.accessibility?.reduceMotion]);

  const setTheme = useCallback(
    async (theme: ThemeMode) => {
      const updated: SettingsState = { ...settings, theme };
      applyTheme(theme);
      setSettings(updated);
      await saveStoredSettings(updated);
    },
    [settings]
  );

  const setFont = useCallback(
    async (font: FontChoice) => {
      const updated: SettingsState = { ...settings, font };
      applyFont(font);
      setSettings(updated);
      await saveStoredSettings(updated);
    },
    [settings]
  );

  const updateSoundSettings = useCallback(
    async (soundUpdates: Partial<SoundSettings>) => {
      const updated: SettingsState = {
        ...settings,
        sound: { ...settings.sound, ...soundUpdates },
      };
      setSettings(updated);
      await saveStoredSettings(updated);
    },
    [settings]
  );

  const updateAccessibilitySettings = useCallback(
    async (accUpdates: Partial<AccessibilitySettings>) => {
      const updated: SettingsState = {
        ...settings,
        accessibility: { ...settings.accessibility, ...accUpdates },
      };
      setSettings(updated);
      await saveStoredSettings(updated);
    },
    [settings]
  );

  const updateQuietHours = useCallback(
    async (quietHours: QuietHoursSetting, custom?: { start: string; end: string }) => {
      const updated: SettingsState = {
        ...settings,
        quietHours,
        customQuietHours: custom || settings.customQuietHours,
      };
      setSettings(updated);
      await saveStoredSettings(updated);
    },
    [settings]
  );

  const toggleDesktopPreview = useCallback(() => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        desktopPreviewEnabled: !prev.desktopPreviewEnabled,
      };
      void saveStoredSettings(updated);
      return updated;
    });
  }, []);

  const blockUser = useCallback(
    async (participant: ConversationParticipant, reason?: string) => {
      const newBlock: BlockedRelationship = {
        id: `block_${participant.id}`,
        targetUserId: participant.id,
        targetHandle: participant.handle,
        targetDisplayName: participant.displayName,
        blockedAt: new Date().toISOString(),
        reason: reason || 'User blocked from chat menu',
      };
      const db = await getDB();
      await db.put('blocked', newBlock);
      setBlockedList((prev) => [...prev.filter((b) => b.targetUserId !== participant.id), newBlock]);
    },
    []
  );

  const unblockUser = useCallback(async (userId: string) => {
    const db = await getDB();
    await db.delete('blocked', `block_${userId}`);
    setBlockedList((prev) => prev.filter((b) => b.targetUserId !== userId));
  }, []);

  const isUserBlocked = useCallback(
    (userId: string): boolean => {
      return blockedList.some((b) => b.targetUserId === userId);
    },
    [blockedList]
  );

  const muteThread = useCallback(async (threadId: string) => {
    const newMute: MutedThread = {
      threadId,
      mutedAt: new Date().toISOString(),
    };
    const db = await getDB();
    await db.put('muted', newMute);
    setMutedThreads((prev) => [...prev.filter((m) => m.threadId !== threadId), newMute]);
  }, []);

  const unmuteThread = useCallback(async (threadId: string) => {
    const db = await getDB();
    await db.delete('muted', threadId);
    setMutedThreads((prev) => prev.filter((m) => m.threadId !== threadId));
  }, []);

  const isThreadMuted = useCallback(
    (threadId: string): boolean => {
      return mutedThreads.some((m) => m.threadId === threadId);
    },
    [mutedThreads]
  );

  const exportData = useCallback(async () => {
    return await exportAllData();
  }, []);

  const resetAllData = useCallback(async () => {
    await resetDatabaseToInitial();
    window.location.reload();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        blockedList,
        mutedThreads,
        setTheme,
        setFont,
        updateSoundSettings,
        updateAccessibilitySettings,
        updateQuietHours,
        toggleDesktopPreview,
        blockUser,
        unblockUser,
        isUserBlocked,
        muteThread,
        unmuteThread,
        isThreadMuted,
        exportData,
        resetAllData,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
