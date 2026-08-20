import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { useChat } from '../context/ChatContext';
import { TopBar } from '../components/layout/TopBar';
import { BellOff, Bell } from 'lucide-react';

export const MutedPage: React.FC = () => {
  const { mutedThreads, unmuteThread } = useSettings();
  const { threads } = useChat();

  return (
    <div className="flex-1 flex flex-col app-viewport bg-ah-canvas text-ah-text">
      <TopBar showBack title="Muted Threads" subtitle="Silenced Conversations" />

      <main className="flex-1 overflow-y-auto p-4 space-y-3">
        {mutedThreads.length === 0 ? (
          <div className="py-20 text-center text-ah-muted space-y-2">
            <Bell className="w-8 h-8 mx-auto text-ah-muted/40 mb-2" />
            <p className="text-sm font-medium">No threads currently muted.</p>
            <p className="text-xs max-w-xs mx-auto">
              You can mute any conversation from its chat menu to silence alerts.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {mutedThreads.map((item) => {
              const thread = threads.find((t) => t.id === item.threadId);
              const title = thread?.title || thread?.participants[0]?.displayName || item.threadId;

              return (
                <div
                  key={item.threadId}
                  className="p-3.5 bg-ah-surface border border-ah-border rounded-2xl flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <BellOff className="w-4 h-4 text-amber-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-ah-text truncate">{title}</div>
                      <div className="text-[10px] text-ah-muted">
                        Muted on {new Date(item.mutedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => unmuteThread(item.threadId)}
                    className="px-3.5 py-1.5 rounded-xl bg-ah-surface-2 hover:bg-ah-hover border border-ah-border text-xs font-semibold text-brand-300 min-h-touch transition-colors"
                  >
                    Unmute
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
