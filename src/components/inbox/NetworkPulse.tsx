import React from 'react';
import { Radio, Sparkles } from 'lucide-react';
import { ConversationThread } from '../../types';
import { Avatar } from '../common/Avatar';

interface NetworkPulseProps {
  threads: ConversationThread[];
  onOpenThread: (threadId: string) => void;
}

export const NetworkPulse: React.FC<NetworkPulseProps> = ({ threads, onOpenThread }) => {
  const activeContacts = threads
    .filter((thread) => !thread.isArchived && thread.participants[0]?.status !== 'offline')
    .slice(0, 5);

  return (
    <section className="mx-3 mt-3 rounded-2xl border border-[#8197FF]/25 bg-gradient-to-br from-ah-surface-2 to-ah-surface p-3 shadow-md shadow-[#8197FF]/5">
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex w-2.5 h-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#69C49A] opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-[#69C49A]" />
          </span>
          <div className="min-w-0">
            <h2 className="text-xs font-bold text-ah-text tracking-wide">NETWORK PULSE</h2>
            <p className="text-[10px] text-ah-muted truncate">quiet hours, unusually conversational</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-[#57C7C1] shrink-0">
          <Radio className="w-3 h-3" />
          LIVE
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {activeContacts.map((thread) => {
          const contact = thread.participants[0];
          return (
            <button
              key={thread.id}
              type="button"
              onClick={() => onOpenThread(thread.id)}
              className="flex items-center gap-2 min-w-[150px] max-w-[180px] p-2 rounded-xl bg-ah-canvas/60 border border-ah-border hover:border-[#8197FF]/50 text-left transition-colors"
            >
              <Avatar config={contact.avatarConfig} size="sm" showStatusDot status={contact.status} />
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold text-ah-text truncate">{contact.displayName}</span>
                <span className="block text-[10px] text-ah-muted truncate">{contact.statusMessage || contact.status}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-2.5 pt-2 border-t border-ah-border/60 flex items-center gap-1.5 text-[10px] text-ah-text-2">
        <Sparkles className="w-3 h-3 text-[#D5AB5E] shrink-0" />
        <span><strong className="text-ah-text">Trending:</strong> phantom timestamps, weather radio, emergency toast</span>
      </div>
    </section>
  );
};
