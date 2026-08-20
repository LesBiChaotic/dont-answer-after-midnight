import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Room, Message } from '../types';
import { getDB } from '../services/storage';
import { useAuthProfile } from './AuthProfileContext';
import { useSettings } from './SettingsContext';
import { playMessageSentSound } from '../services/audio';

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
  const [roomMessages, setRoomMessages] = useState<Record<string, Message[]>>({
    room_night_owls: [
      {
        id: 'rmsg_no_1',
        threadId: 'room_night_owls',
        senderId: 'user_elena_v',
        senderHandle: 'elena.v',
        senderName: 'Elena Vance',
        content: 'Reminder for everyone working on document preservation: make sure to backup before scheduled 4 AM server cycles.',
        timestamp: '2026-08-20T17:00:00Z',
        status: 'delivered',
        reactions: [{ id: 'rr1', emoji: '☕', userId: 'user_marcus_b', userHandle: 'marcus_b', timestamp: '2026-08-20T17:05:00Z' }],
      },
      {
        id: 'rmsg_no_2',
        threadId: 'room_night_owls',
        senderId: 'user_julian_k',
        senderHandle: 'julian_k',
        senderName: 'Julian K.',
        content: 'The low band interference tonight is unusually clean. Perfect time for tape loops.',
        timestamp: '2026-08-20T18:30:00Z',
        status: 'delivered',
        reactions: [],
      },
    ],
    room_old_internet: [
      {
        id: 'rmsg_oi_1',
        threadId: 'room_old_internet',
        senderId: 'user_marcus_b',
        senderHandle: 'marcus_b',
        senderName: 'Marcus Bell',
        content: 'Found a 2004 web ring listing for vintage astronomical observatories. Half the domains still resolve to parked static pages.',
        timestamp: '2026-08-20T16:15:00Z',
        status: 'delivered',
        reactions: [{ id: 'rr2', emoji: '🔭', userId: 'user_elena_v', userHandle: 'elena.v', timestamp: '2026-08-20T16:20:00Z' }],
      },
    ],
    room_after_midnight: [
      {
        id: 'rmsg_am_1',
        threadId: 'room_after_midnight',
        senderId: 'user_sys_daemon',
        senderHandle: 'sys.archived',
        senderName: 'Archive Daemon',
        content: 'NODE: AFTER_MIDNIGHT | Ambient room mode active until 06:00 UTC.',
        timestamp: '2026-08-20T19:00:00Z',
        status: 'delivered',
        reactions: [],
      },
    ],
  });

  useEffect(() => {
    async function loadRooms() {
      try {
        const db = await getDB();
        const storedRooms = await db.getAll('rooms');
        if (storedRooms.length > 0) {
          setRooms(storedRooms);
        }
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

      setRoomMessages((prev) => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), newMsg],
      }));

      playMessageSentSound(settings.sound);
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
