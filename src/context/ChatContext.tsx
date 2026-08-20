import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ConversationThread,
  Message,
  MessageBookmark,
  BookmarkCategory,
  TypingEvent,
} from '../types';
import {
  getDB,
  getDraft,
  saveDraft,
} from '../services/storage';
import { liveDirector } from '../services/liveDirector';
import {
  playMessageSentSound,
  playMessageReceivedSound,
  playReactionSound,
  playBookmarkSound,
} from '../services/audio';
import { useAuthProfile } from './AuthProfileContext';
import { useSettings } from './SettingsContext';

interface ChatContextType {
  threads: ConversationThread[];
  messages: Record<string, Message[]>;
  activeTyping: TypingEvent | null;
  drafts: Record<string, string>;
  bookmarks: MessageBookmark[];
  unreadTotal: number;
  activeThreadId: string | null;
  setActiveThreadId: (id: string | null) => void;
  sendMessage: (
    threadId: string,
    content: string,
    replyToMessageId?: string,
    replySnippet?: { senderName: string; text: string }
  ) => Promise<Message>;
  addReaction: (messageId: string, threadId: string, emoji: string) => Promise<void>;
  removeReaction: (messageId: string, threadId: string, emoji: string) => Promise<void>;
  bookmarkMessage: (
    messageId: string,
    threadId: string,
    category: BookmarkCategory,
    customTag?: string,
    note?: string
  ) => Promise<MessageBookmark>;
  removeBookmark: (bookmarkId: string) => Promise<void>;
  isMessageBookmarked: (messageId: string) => MessageBookmark | undefined;
  setThreadDraft: (threadId: string, text: string) => void;
  loadThreadDraft: (threadId: string) => Promise<string>;
  markThreadRead: (threadId: string) => Promise<void>;
  togglePinThread: (threadId: string) => Promise<void>;
  toggleArchiveThread: (threadId: string) => Promise<void>;
  getThreadById: (threadId: string) => ConversationThread | undefined;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useAuthProfile();
  const { settings, isUserBlocked, isThreadMuted } = useSettings();

  const [threads, setThreads] = useState<ConversationThread[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [activeTyping, setActiveTyping] = useState<TypingEvent | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [bookmarks, setBookmarks] = useState<MessageBookmark[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  // Initial Load
  useEffect(() => {
    async function loadChatData() {
      try {
        const db = await getDB();
        const storedThreads = await db.getAll('threads');
        const storedMessages = await db.getAll('messages');
        const storedBookmarks = await db.getAll('bookmarks');

        // Group messages by thread
        const msgMap: Record<string, Message[]> = {};
        for (const thread of storedThreads) {
          msgMap[thread.id] = [];
        }
        for (const msg of storedMessages) {
          if (!msgMap[msg.threadId]) {
            msgMap[msg.threadId] = [];
          }
          msgMap[msg.threadId].push(msg);
        }

        // Sort messages in each thread by timestamp
        for (const tId in msgMap) {
          msgMap[tId].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        }

        // Update threads with latest message if available
        const updatedThreads = storedThreads.map((t) => {
          const tMsgs = msgMap[t.id] || [];
          const lastMsg = tMsgs.length > 0 ? tMsgs[tMsgs.length - 1] : undefined;
          return {
            ...t,
            lastMessage: lastMsg || t.lastMessage,
          };
        });

        // Sort threads: pinned first, then by updatedAt descending
        updatedThreads.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });

        setThreads(updatedThreads);
        setMessages(msgMap);
        setBookmarks(storedBookmarks);
      } catch (err) {
        console.error('[ChatContext] Error loading initial chat data:', err);
      }
    }

    loadChatData();
  }, []);

  // Listen to Typing Events from LiveDirector
  useEffect(() => {
    const unsubscribe = liveDirector.subscribeTyping((event) => {
      setActiveTyping(event);
    });
    return unsubscribe;
  }, []);

  // Listen to Incoming Simulated Messages
  useEffect(() => {
    const unsubscribe = liveDirector.subscribeMessage(async (newReply) => {
      const db = await getDB();
      await db.put('messages', newReply);

      // Append to state
      setMessages((prev) => {
        const threadMsgs = prev[newReply.threadId] || [];
        // Avoid duplicate
        if (threadMsgs.some((m) => m.id === newReply.id)) return prev;
        return {
          ...prev,
          [newReply.threadId]: [...threadMsgs, newReply],
        };
      });

      // Update thread lastMessage and unread count
      setThreads((prevThreads) => {
        return prevThreads.map((th) => {
          if (th.id === newReply.threadId) {
            const isCurrentlyActive = activeThreadId === th.id;
            const updated = {
              ...th,
              lastMessage: newReply,
              unreadCount: isCurrentlyActive ? 0 : th.unreadCount + 1,
              updatedAt: newReply.timestamp,
            };
            db.put('threads', updated).catch(() => {});
            return updated;
          }
          return th;
        });
      });

      // Play audio cue if not muted
      const muted = isThreadMuted(newReply.threadId);
      if (!muted) {
        playMessageReceivedSound(settings.sound);
      }
    });

    return unsubscribe;
  }, [activeThreadId, isThreadMuted, settings.sound]);

  const unreadTotal = threads.reduce((acc, t) => acc + (t.isArchived ? 0 : t.unreadCount), 0);

  const getThreadById = useCallback(
    (threadId: string): ConversationThread | undefined => {
      return threads.find((t) => t.id === threadId);
    },
    [threads]
  );

  const sendMessage = useCallback(
    async (
      threadId: string,
      content: string,
      replyToMessageId?: string,
      replySnippet?: { senderName: string; text: string }
    ): Promise<Message> => {
      const trimmed = content.trim();
      if (!trimmed) throw new Error('Message cannot be empty');

      const thread = threads.find((t) => t.id === threadId);
      const userSenderId = profile?.id || 'user_player';
      const userHandle = profile?.handle || 'you';
      const userName = profile?.displayName || 'You';

      const newMessage: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        threadId,
        senderId: userSenderId,
        senderHandle: userHandle,
        senderName: userName,
        content: trimmed,
        timestamp: new Date().toISOString(),
        status: 'sent',
        reactions: [],
        replyToMessageId,
        replySnippet,
      };

      const db = await getDB();
      await db.put('messages', newMessage);

      // Update Messages state
      setMessages((prev) => ({
        ...prev,
        [threadId]: [...(prev[threadId] || []), newMessage],
      }));

      // Update Thread state
      const updatedThread: ConversationThread = thread
        ? {
            ...thread,
            lastMessage: newMessage,
            updatedAt: newMessage.timestamp,
          }
        : {
            id: threadId,
            type: 'dm',
            participants: [],
            lastMessage: newMessage,
            unreadCount: 0,
            isMuted: false,
            isArchived: false,
            isPinned: false,
            createdAt: newMessage.timestamp,
            updatedAt: newMessage.timestamp,
          };

      await db.put('threads', updatedThread);
      setThreads((prev) => [
        updatedThread,
        ...prev.filter((t) => t.id !== threadId),
      ]);

      // Clear draft
      setDrafts((prev) => {
        const copy = { ...prev };
        delete copy[threadId];
        return copy;
      });
      await saveDraft(threadId, '');

      // Play sent sound
      playMessageSentSound(settings.sound);

      // Check if recipient is blocked / muted and trigger live director
      if (thread) {
        const recipient = thread.participants[0];
        const isBlocked = recipient ? isUserBlocked(recipient.id) : false;
        const isMuted = isThreadMuted(thread.id);
        liveDirector.handleUserMessageSent(newMessage, thread, isBlocked, isMuted);
      }

      return newMessage;
    },
    [profile, threads, settings.sound, isUserBlocked, isThreadMuted]
  );

  const addReaction = useCallback(
    async (messageId: string, threadId: string, emoji: string) => {
      const userHandle = profile?.handle || 'you';
      const userId = profile?.id || 'user_player';

      const targetMsgs = messages[threadId] || [];
      const msgIndex = targetMsgs.findIndex((m) => m.id === messageId);
      if (msgIndex === -1) return;

      const targetMsg = targetMsgs[msgIndex];
      // Check if user already added this reaction
      const existingReactionIndex = targetMsg.reactions.findIndex(
        (r) => r.emoji === emoji && r.userId === userId
      );

      let updatedReactions = [...targetMsg.reactions];
      if (existingReactionIndex >= 0) {
        // Toggle off
        updatedReactions.splice(existingReactionIndex, 1);
      } else {
        // Add
        updatedReactions.push({
          id: `react_${Date.now()}`,
          emoji,
          userId,
          userHandle,
          timestamp: new Date().toISOString(),
        });
        playReactionSound(settings.sound);
      }

      const updatedMsg: Message = {
        ...targetMsg,
        reactions: updatedReactions,
      };

      const db = await getDB();
      await db.put('messages', updatedMsg);

      setMessages((prev) => ({
        ...prev,
        [threadId]: prev[threadId].map((m) => (m.id === messageId ? updatedMsg : m)),
      }));
    },
    [messages, profile, settings.sound]
  );

  const removeReaction = useCallback(
    async (messageId: string, threadId: string, emoji: string) => {
      const userId = profile?.id || 'user_player';
      const targetMsgs = messages[threadId] || [];
      const msg = targetMsgs.find((m) => m.id === messageId);
      if (!msg) return;

      const updatedReactions = msg.reactions.filter(
        (r) => !(r.emoji === emoji && r.userId === userId)
      );
      const updatedMsg = { ...msg, reactions: updatedReactions };

      const db = await getDB();
      await db.put('messages', updatedMsg);

      setMessages((prev) => ({
        ...prev,
        [threadId]: prev[threadId].map((m) => (m.id === messageId ? updatedMsg : m)),
      }));
    },
    [messages, profile]
  );

  const bookmarkMessage = useCallback(
    async (
      messageId: string,
      threadId: string,
      category: BookmarkCategory,
      customTag?: string,
      note?: string
    ): Promise<MessageBookmark> => {
      const newBookmark: MessageBookmark = {
        id: `bm_${Date.now()}`,
        messageId,
        threadId,
        category,
        customTag,
        savedAt: new Date().toISOString(),
        note,
      };

      const db = await getDB();
      await db.put('bookmarks', newBookmark);
      setBookmarks((prev) => [...prev.filter((b) => b.messageId !== messageId), newBookmark]);
      playBookmarkSound(settings.sound);
      return newBookmark;
    },
    [settings.sound]
  );

  const removeBookmark = useCallback(async (bookmarkId: string) => {
    const db = await getDB();
    await db.delete('bookmarks', bookmarkId);
    setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
  }, []);

  const isMessageBookmarked = useCallback(
    (messageId: string): MessageBookmark | undefined => {
      return bookmarks.find((b) => b.messageId === messageId);
    },
    [bookmarks]
  );

  const setThreadDraft = useCallback((threadId: string, text: string) => {
    setDrafts((prev) => ({ ...prev, [threadId]: text }));
    saveDraft(threadId, text).catch(() => {});
  }, []);

  const loadThreadDraft = useCallback(
    async (threadId: string): Promise<string> => {
      if (drafts[threadId] !== undefined) return drafts[threadId];
      const saved = await getDraft(threadId);
      setDrafts((prev) => ({ ...prev, [threadId]: saved }));
      return saved;
    },
    [drafts]
  );

  const markThreadRead = useCallback(async (threadId: string) => {
    const db = await getDB();
    const thread = await db.get('threads', threadId);
    if (thread && thread.unreadCount > 0) {
      const updated = { ...thread, unreadCount: 0 };
      await db.put('threads', updated);
      setThreads((prev) => prev.map((t) => (t.id === threadId ? updated : t)));
    }
  }, []);

  const togglePinThread = useCallback(async (threadId: string) => {
    const db = await getDB();
    const thread = await db.get('threads', threadId);
    if (thread) {
      const updated = { ...thread, isPinned: !thread.isPinned };
      await db.put('threads', updated);
      setThreads((prev) => {
        const list = prev.map((t) => (t.id === threadId ? updated : t));
        list.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
        return list;
      });
    }
  }, []);

  const toggleArchiveThread = useCallback(async (threadId: string) => {
    const db = await getDB();
    const thread = await db.get('threads', threadId);
    if (thread) {
      const updated = { ...thread, isArchived: !thread.isArchived };
      await db.put('threads', updated);
      setThreads((prev) => prev.map((t) => (t.id === threadId ? updated : t)));
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        threads,
        messages,
        activeTyping,
        drafts,
        bookmarks,
        unreadTotal,
        activeThreadId,
        setActiveThreadId,
        sendMessage,
        addReaction,
        removeReaction,
        bookmarkMessage,
        removeBookmark,
        isMessageBookmarked,
        setThreadDraft,
        loadThreadDraft,
        markThreadRead,
        togglePinThread,
        toggleArchiveThread,
        getThreadById,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export function useChat(): ChatContextType {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
