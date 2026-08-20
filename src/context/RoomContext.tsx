import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Room, Message } from '../types';
import { getDB } from '../services/storage';
import { useAuthProfile } from './AuthProfileContext';
import { useSettings } from './SettingsContext';
import { playMessageReceivedSound, playMessageSentSound } from '../services/audio';

interface RoomContextType {
  rooms: Room[];
  roomMessages: Record<string, Message[]>;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: (roomId: string) => Promise<void>;
  toggleMuteRoom: (roomId: string) => Promise<void>;
  sendRoomMessage: (roomId: string, content: string) => Promise<Message>;
  getRoomById: (roomId: string) => Room | undefined;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useAuthProfile();
  const { settings } = useSettings();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomMessages, setRoomMessages] = useState<Record<string, Message[]>>({});

  useEffect(() => {
    async function loadRooms() {
      try {
        const db = await getDB();
        const [storedRooms, storedMessages] = await Promise.all([
          db.getAll('rooms'),
          db.getAll('messages'),
        ]);
        if (storedRooms.length > 0) {
          setRooms(storedRooms);
        }
        const roomIds = new Set(storedRooms.map((room) => room.id));
        const groupedMessages = storedMessages
          .filter((message) => roomIds.has(message.threadId))
          .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
          .reduce<Record<string, Message[]>>((groups, message) => {
            (groups[message.threadId] ??= []).push(message);
            return groups;
          }, {});
        setRoomMessages(groupedMessages);
      } catch (err) {
        console.warn('[RoomContext] Failed to load rooms:', err);
      }
    }
    loadRooms();
  }, []);

  const getRoomById = useCallback(
    (roomId: string): Room | undefined => {
      return rooms.find((r) => r.id === roomId || r.slug === roomId);
    },
    [rooms]
  );

  const joinRoom = useCallback(async (roomId: string) => {
    const db = await getDB();
    const target = await db.get('rooms', roomId);
    if (target) {
      const updated: Room = {
        ...target,
        isJoined: true,
        memberCount: target.memberCount + 1,
      };
      await db.put('rooms', updated);
      setRooms((prev) => prev.map((r) => (r.id === roomId ? updated : r)));
    }
  }, []);

  const leaveRoom = useCallback(async (roomId: string) => {
    const db = await getDB();
    const target = await db.get('rooms', roomId);
    if (target) {
      const updated: Room = {
        ...target,
        isJoined: false,
        memberCount: Math.max(1, target.memberCount - 1),
      };
      await db.put('rooms', updated);
      setRooms((prev) => prev.map((r) => (r.id === roomId ? updated : r)));
    }
  }, []);

  const toggleMuteRoom = useCallback(async (roomId: string) => {
    const db = await getDB();
    const target = await db.get('rooms', roomId);
    if (target) {
      const updated: Room = {
        ...target,
        isMuted: !target.isMuted,
      };
      await db.put('rooms', updated);
      setRooms((prev) => prev.map((r) => (r.id === roomId ? updated : r)));
    }
  }, []);

  const sendRoomMessage = useCallback(
    async (roomId: string, content: string): Promise<Message> => {
      const trimmed = content.trim();
      if (!trimmed) throw new Error('Message cannot be empty');

      const userSenderId = profile?.id || 'user_player';
      const userHandle = profile?.handle || 'you';
      const userName = profile?.displayName || 'You';

      const newMsg: Message = {
        id: `rmsg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        threadId: roomId,
        senderId: userSenderId,
        senderHandle: userHandle,
        senderName: userName,
        content: trimmed,
        timestamp: new Date().toISOString(),
        status: 'delivered',
        reactions: [],
      };

      const db = await getDB();
      await db.put('messages', newMsg);

      setRoomMessages((prev) => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), newMsg],
      }));

      playMessageSentSound(settings.sound);

      // Keep rooms conversational: a recent room regular responds without
      // requiring a backend, while the reply is persisted like every message.
      window.setTimeout(async () => {
        const history = await db.getAllFromIndex('messages', 'by-thread', roomId);
        const recentRegular = [...history]
          .reverse()
          .find((message) => message.senderId !== userSenderId);
        if (!recentRegular) return;

        const roomReplies = trimmed.includes('?')
          ? ['I was wondering that too. Anyone have the original timestamp?', 'Possibly. I am checking my local copy now.']
          : ['That belongs in the pinned notes, honestly.', 'Seen and quietly appreciated.', 'Okay, now the room is awake.'];
        const reply: Message = {
          id: `rmsg_live_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          threadId: roomId,
          senderId: recentRegular.senderId,
          senderHandle: recentRegular.senderHandle,
          senderName: recentRegular.senderName,
          content: roomReplies[Math.floor(Math.random() * roomReplies.length)],
          timestamp: new Date().toISOString(),
          status: 'delivered',
          reactions: [],
        };
        await db.put('messages', reply);
        setRoomMessages((prev) => ({
          ...prev,
          [roomId]: [...(prev[roomId] || []), reply],
        }));
        playMessageReceivedSound(settings.sound);
      }, 1800);

      return newMsg;
    },
    [profile, settings.sound]
  );

  return (
    <RoomContext.Provider
      value={{
        rooms,
        roomMessages,
        joinRoom,
        leaveRoom,
        toggleMuteRoom,
        sendRoomMessage,
        getRoomById,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export function useRooms(): RoomContextType {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRooms must be used within a RoomProvider');
  }
  return context;
}
