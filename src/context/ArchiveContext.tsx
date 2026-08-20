import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  LegacyPlatform,
  LegacyAccount,
  LegacyMessage,
  ContinuityRecord,
  LegacyEra,
} from '../types';
import { getDB } from '../services/storage';

interface ArchiveContextType {
  platforms: LegacyPlatform[];
  accounts: LegacyAccount[];
  messages: LegacyMessage[];
  continuityRecords: ContinuityRecord[];
  readableMode: boolean;
  setReadableMode: (enabled: boolean) => void;
  toggleReadableMode: () => void;
  getPlatformByEra: (era: LegacyEra) => LegacyPlatform | undefined;
  getMessagesByEra: (era: LegacyEra) => LegacyMessage[];
  searchArchive: (query: string, eraFilter?: string) => {
    messages: LegacyMessage[];
    accounts: LegacyAccount[];
  };
}

const ArchiveContext = createContext<ArchiveContextType | undefined>(undefined);

export const ArchiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [platforms, setPlatforms] = useState<LegacyPlatform[]>([]);
  const [accounts, setAccounts] = useState<LegacyAccount[]>([]);
  const [messages, setMessages] = useState<LegacyMessage[]>([]);
  const [continuityRecords, setContinuityRecords] = useState<ContinuityRecord[]>([]);
  const [readableMode, setReadableMode] = useState<boolean>(false);

  useEffect(() => {
    async function loadArchiveData() {
      try {
        const db = await getDB();
        const storedPlatforms = await db.getAll('legacy_platforms');
        const storedAccounts = await db.getAll('legacy_accounts');
        const storedMessages = await db.getAll('legacy_messages');
        const storedContinuity = await db.getAll('continuity');

        setPlatforms(storedPlatforms);
        setAccounts(storedAccounts);
        setMessages(storedMessages);
        setContinuityRecords(storedContinuity);
      } catch (err) {
        console.warn('[ArchiveContext] Failed to load archive:', err);
      }
    }
    loadArchiveData();
  }, []);

  const toggleReadableMode = useCallback(() => {
    setReadableMode((prev) => !prev);
  }, []);

  const getPlatformByEra = useCallback(
    (era: LegacyEra): LegacyPlatform | undefined => {
      return platforms.find((p) => p.era === era);
    },
    [platforms]
  );

  const getMessagesByEra = useCallback(
    (era: LegacyEra): LegacyMessage[] => {
      return messages.filter((m) => m.era === era);
    },
    [messages]
  );

  const searchArchive = useCallback(
    (query: string, eraFilter?: string) => {
      const q = query.toLowerCase().trim();
      if (!q) {
        return {
          messages: eraFilter ? messages.filter((m) => m.era === eraFilter) : messages,
          accounts: eraFilter ? accounts.filter((a) => a.era === eraFilter) : accounts,
        };
      }

      const filteredMessages = messages.filter((m) => {
        const matchesEra = !eraFilter || eraFilter === 'all' || m.era === eraFilter;
        const matchesQuery =
          m.content.toLowerCase().includes(q) ||
          m.senderDisplayName.toLowerCase().includes(q) ||
          m.senderHandle.toLowerCase().includes(q) ||
          m.threadTitle.toLowerCase().includes(q);
        return matchesEra && matchesQuery;
      });

      const filteredAccounts = accounts.filter((a) => {
        const matchesEra = !eraFilter || eraFilter === 'all' || a.era === eraFilter;
        const matchesQuery =
          a.displayName.toLowerCase().includes(q) ||
          a.handle.toLowerCase().includes(q) ||
          a.bioSnippet.toLowerCase().includes(q);
        return matchesEra && matchesQuery;
      });

      return {
        messages: filteredMessages,
        accounts: filteredAccounts,
      };
    },
    [messages, accounts]
  );

  return (
    <ArchiveContext.Provider
      value={{
        platforms,
        accounts,
        messages,
        continuityRecords,
        readableMode,
        setReadableMode,
        toggleReadableMode,
        getPlatformByEra,
        getMessagesByEra,
        searchArchive,
      }}
    >
      {children}
    </ArchiveContext.Provider>
  );
};

export function useArchive(): ArchiveContextType {
  const context = useContext(ArchiveContext);
  if (!context) {
    throw new Error('useArchive must be used within an ArchiveProvider');
  }
  return context;
}
