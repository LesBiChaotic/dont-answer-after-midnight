import React, { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { TopBar } from '../components/layout/TopBar';
import { Clock } from 'lucide-react';
import { HISTORICAL_BLOCK_RECORDS } from '../data/lore';
import { useContinuity } from '../context/ContinuityContext';

export const BlockedPage: React.FC = () => {
  const { blockedList, unblockUser } = useSettings();
  const { checkActionTrigger } = useContinuity();

  useEffect(() => {
    checkActionTrigger('INSPECT_BEFOREYOU_PROFILE');
  }, [checkActionTrigger]);

  return (
    <div className="flex-1 flex flex-col app-viewport bg-night-bg text-night-text">
      <TopBar showBack title="Blocked Contacts" subtitle="Simulated Message Suppression" />

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Active Block List */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Active Blocked Contacts ({blockedList.length})
          </h2>

          {blockedList.length === 0 ? (
            <div className="p-4 bg-night-card border border-night-border rounded-2xl text-center text-night-muted text-xs">
              No live contacts currently blocked.
            </div>
          ) : (
            <div className="space-y-2">
              {blockedList.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-night-surface border border-night-border rounded-2xl flex items-center justify-between gap-3 shadow-xs"
                >
                  <div>
                    <div className="font-semibold text-xs text-white">{item.targetDisplayName}</div>
                    <div className="text-[11px] text-night-muted">@{item.targetHandle}</div>
                    <div className="text-[10px] text-red-400/80 mt-1">Blocked: {item.reason || 'Manual block'}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => unblockUser(item.targetUserId)}
                    className="px-3.5 py-1.5 rounded-xl bg-night-card hover:bg-night-hover border border-night-border text-xs font-semibold text-brand-300 min-h-touch transition-colors"
                  >
                    Unblock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Story-Layer Recovered Historical Block Records */}
        <div className="space-y-2 pt-2 border-t border-night-border/60">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Recovered Historical Block Index
            </h2>
          </div>
          <p className="text-[11px] text-night-muted leading-relaxed">
            Archived security partition records recovered from previous platform versions (read-only index).
          </p>

          <div className="space-y-2">
            {HISTORICAL_BLOCK_RECORDS.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-amber-950/20 border border-amber-800/50 rounded-2xl space-y-1.5"
              >
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="font-semibold text-amber-300">
                    [{item.platformEra}] @{item.handle}
                  </span>
                  <span className="text-night-muted">{item.blockedDate}</span>
                </div>
                <p className="text-xs text-night-text leading-relaxed">
                  Reason: {item.reason}
                </p>
                <p className="text-[10px] text-amber-200/60 font-mono">
                  Partition: {item.recoveredFromPartition}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
