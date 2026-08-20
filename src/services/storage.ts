import { openDB, DBSchema, IDBPDatabase } from 'idb';
import {
  UserProfile,
  ConversationThread,
  Message,
  Room,
  LegacyPlatform,
  LegacyAccount,
  LegacyMessage,
  Notification,
  MessageBookmark,
  BlockedRelationship,
  MutedThread,
  ContinuityRecord,
  SettingsState,
  DraftState,
} from '../types';
import {
  INITIAL_THREADS,
  INITIAL_MESSAGES,
  INITIAL_ROOMS,
  INITIAL_LEGACY_PLATFORMS,
  INITIAL_LEGACY_ACCOUNTS,
  INITIAL_LEGACY_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_BOOKMARKS,
  INITIAL_SETTINGS,
  INITIAL_CONTINUITY_RECORDS,
  DEFAULT_AVATAR,
} from '../data/seed';

interface AfterhoursDB extends DBSchema {
  profile: {
    key: string;
    value: UserProfile;
  };
  threads: {
    key: string;
    value: ConversationThread;
    indexes: { 'by-updated': string };
  };
  messages: {
    key: string;
    value: Message;
    indexes: { 'by-thread': string; 'by-timestamp': string };
  };
  rooms: {
    key: string;
    value: Room;
  };
  legacy_platforms: {
    key: string;
    value: LegacyPlatform;
  };
  legacy_accounts: {
    key: string;
    value: LegacyAccount;
  };
  legacy_messages: {
    key: string;
    value: LegacyMessage;
    indexes: { 'by-era': string; 'by-thread': string };
  };
  notifications: {
    key: string;
    value: Notification;
    indexes: { 'by-created': string };
  };
  bookmarks: {
    key: string;
    value: MessageBookmark;
    indexes: { 'by-category': string; 'by-message': string };
  };
  blocked: {
    key: string;
    value: BlockedRelationship;
  };
  muted: {
    key: string;
    value: MutedThread;
  };
  continuity: {
    key: string;
    value: ContinuityRecord;
  };
  settings: {
    key: string;
    value: SettingsState;
  };
  drafts: {
    key: string;
    value: DraftState;
  };
}

const DB_NAME = 'afterhours_app_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<AfterhoursDB>> | null = null;

export async function getDB(): Promise<IDBPDatabase<AfterhoursDB>> {
  if (!dbPromise) {
    dbPromise = openDB<AfterhoursDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('profile')) {
          db.createObjectStore('profile', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('threads')) {
          const threadStore = db.createObjectStore('threads', { keyPath: 'id' });
          threadStore.createIndex('by-updated', 'updatedAt');
        }
        if (!db.objectStoreNames.contains('messages')) {
          const msgStore = db.createObjectStore('messages', { keyPath: 'id' });
          msgStore.createIndex('by-thread', 'threadId');
          msgStore.createIndex('by-timestamp', 'timestamp');
        }
        if (!db.objectStoreNames.contains('rooms')) {
          db.createObjectStore('rooms', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('legacy_platforms')) {
          db.createObjectStore('legacy_platforms', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('legacy_accounts')) {
          db.createObjectStore('legacy_accounts', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('legacy_messages')) {
          const legMsgStore = db.createObjectStore('legacy_messages', { keyPath: 'id' });
          legMsgStore.createIndex('by-era', 'era');
          legMsgStore.createIndex('by-thread', 'threadId');
        }
        if (!db.objectStoreNames.contains('notifications')) {
          const notifStore = db.createObjectStore('notifications', { keyPath: 'id' });
          notifStore.createIndex('by-created', 'createdAt');
        }
        if (!db.objectStoreNames.contains('bookmarks')) {
          const bmStore = db.createObjectStore('bookmarks', { keyPath: 'id' });
          bmStore.createIndex('by-category', 'category');
          bmStore.createIndex('by-message', 'messageId');
        }
        if (!db.objectStoreNames.contains('blocked')) {
          db.createObjectStore('blocked', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('muted')) {
          db.createObjectStore('muted', { keyPath: 'threadId' });
        }
        if (!db.objectStoreNames.contains('continuity')) {
          db.createObjectStore('continuity', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
        if (!db.objectStoreNames.contains('drafts')) {
          db.createObjectStore('drafts', { keyPath: 'threadId' });
        }
      },
    });
  }
  return dbPromise;
}

export async function initializeDatabaseSeed(): Promise<void> {
  const db = await getDB();
  const threadCount = await db.count('threads');

  if (threadCount === 0) {
    console.log('[Storage] Initializing database seed data...');
    const tx = db.transaction(
      [
        'threads',
        'messages',
        'rooms',
        'legacy_platforms',
        'legacy_accounts',
        'legacy_messages',
        'notifications',
        'bookmarks',
        'settings',
        'continuity',
      ],
      'readwrite'
    );

    // Seed Threads
    for (const thread of INITIAL_THREADS) {
      await tx.objectStore('threads').put(thread);
    }

    // Seed Messages
    for (const msg of INITIAL_MESSAGES) {
      await tx.objectStore('messages').put(msg);
    }

    // Seed Rooms
    for (const room of INITIAL_ROOMS) {
      await tx.objectStore('rooms').put(room);
    }

    // Seed Legacy Platforms & Messages
    for (const platform of INITIAL_LEGACY_PLATFORMS) {
      await tx.objectStore('legacy_platforms').put(platform);
    }
    for (const acc of INITIAL_LEGACY_ACCOUNTS) {
      await tx.objectStore('legacy_accounts').put(acc);
    }
    for (const legMsg of INITIAL_LEGACY_MESSAGES) {
      await tx.objectStore('legacy_messages').put(legMsg);
    }

    // Seed Notifications
    for (const notif of INITIAL_NOTIFICATIONS) {
      await tx.objectStore('notifications').put(notif);
    }

    // Seed Bookmarks
    for (const bm of INITIAL_BOOKMARKS) {
      await tx.objectStore('bookmarks').put(bm);
    }

    // Seed Continuity
    for (const cont of INITIAL_CONTINUITY_RECORDS) {
      await tx.objectStore('continuity').put(cont);
    }

    // Seed Settings
    await tx.objectStore('settings').put(INITIAL_SETTINGS, 'current_settings');

    await tx.done;
    console.log('[Storage] Seed complete.');
  }
}

// PROFILE ACCESSORS
export async function getStoredProfile(): Promise<UserProfile | null> {
  try {
    const db = await getDB();
    const profiles = await db.getAll('profile');
    if (profiles.length > 0) return profiles[0];
    
    // Check localStorage fallback
    const local = localStorage.getItem('afterhours_profile');
    if (local) {
      const parsed = JSON.parse(local) as UserProfile;
      await db.put('profile', parsed);
      return parsed;
    }
    return null;
  } catch (err) {
    console.warn('[Storage] Error loading profile from IndexedDB, trying localStorage fallback', err);
    const local = localStorage.getItem('afterhours_profile');
    return local ? JSON.parse(local) : null;
  }
}

export async function saveStoredProfile(profile: UserProfile): Promise<void> {
  try {
    const db = await getDB();
    await db.put('profile', profile);
    localStorage.setItem('afterhours_profile', JSON.stringify(profile));
  } catch (err) {
    console.error('[Storage] Error saving profile:', err);
    localStorage.setItem('afterhours_profile', JSON.stringify(profile));
  }
}

// SETTINGS ACCESSORS
export async function getStoredSettings(): Promise<SettingsState> {
  try {
    const db = await getDB();
    const settings = await db.get('settings', 'current_settings');
    if (settings) return { ...INITIAL_SETTINGS, ...settings };

    const local = localStorage.getItem('afterhours_settings');
    if (local) return { ...INITIAL_SETTINGS, ...JSON.parse(local) };

    return INITIAL_SETTINGS;
  } catch {
    const local = localStorage.getItem('afterhours_settings');
    return local ? { ...INITIAL_SETTINGS, ...JSON.parse(local) } : INITIAL_SETTINGS;
  }
}

export async function saveStoredSettings(settings: SettingsState): Promise<void> {
  try {
    const db = await getDB();
    await db.put('settings', settings, 'current_settings');
    localStorage.setItem('afterhours_settings', JSON.stringify(settings));
  } catch {
    localStorage.setItem('afterhours_settings', JSON.stringify(settings));
  }
}

// DRAFTS
export async function getDraft(threadId: string): Promise<string> {
  try {
    const db = await getDB();
    const draft = await db.get('drafts', threadId);
    return draft ? draft.text : '';
  } catch {
    return localStorage.getItem(`afterhours_draft_${threadId}`) || '';
  }
}

export async function saveDraft(threadId: string, text: string): Promise<void> {
  try {
    const db = await getDB();
    if (text.trim() === '') {
      await db.delete('drafts', threadId);
      localStorage.removeItem(`afterhours_draft_${threadId}`);
    } else {
      await db.put('drafts', { threadId, text, updatedAt: new Date().toISOString() });
      localStorage.setItem(`afterhours_draft_${threadId}`, text);
    }
  } catch {
    if (text.trim() === '') {
      localStorage.removeItem(`afterhours_draft_${threadId}`);
    } else {
      localStorage.setItem(`afterhours_draft_${threadId}`, text);
    }
  }
}

// FULL DATABASE RESET & EXPORT
export async function exportAllData(): Promise<Record<string, unknown>> {
  const db = await getDB();
  const profile = await getStoredProfile();
  const settings = await getStoredSettings();
  const threads = await db.getAll('threads');
  const messages = await db.getAll('messages');
  const rooms = await db.getAll('rooms');
  const notifications = await db.getAll('notifications');
  const bookmarks = await db.getAll('bookmarks');
  const blocked = await db.getAll('blocked');
  const muted = await db.getAll('muted');
  const continuity = await db.getAll('continuity');

  return {
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
    profile: profile || {
      id: 'user_player',
      displayName: 'Anonymous',
      handle: 'anon',
      ageConfirmedAdult: true,
      bio: '',
      statusMessage: '',
      interests: [],
      avatarConfig: DEFAULT_AVATAR,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      visibility: 'public',
      storyFlags: [],
    },
    settings,
    threads,
    messages,
    rooms,
    notifications,
    bookmarks,
    blocked,
    muted,
    continuity,
  };
}

export async function resetDatabaseToInitial(): Promise<void> {
  const db = await getDB();
  const storeNames = db.objectStoreNames;
  const tx = db.transaction(storeNames, 'readwrite');
  for (const store of storeNames) {
    await tx.objectStore(store).clear();
  }
  await tx.done;
  localStorage.clear();
  await initializeDatabaseSeed();
}
