import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/layout/TopBar';
import { BottomNav } from '../components/layout/BottomNav';
import { useSettings } from '../context/SettingsContext';
import { Shield, UserX, BellOff, ChevronRight } from 'lucide-react';

export const SafetyHubPage: React.FC = () => {
  const navigate = useNavigate();
  const { blockedList, mutedThreads } = useSettings();

  return (
    <div className="flex-1 flex flex-col app-viewport bg-night-bg text-night-text pb-20">
      <TopBar showBack title="Safety & Privacy" subtitle="Boundaries & Discretion" />

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Top Guidelines Banner */}
        <div className="p-4 bg-emerald-950/30 border border-emerald-800/50 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs">
            <Shield className="w-4 h-4" />
            <span>Fictional Application Discretion</span>
          </div>
          <p className="text-xs text-emerald-200/80 leading-relaxed">
            AFTERHOURS never accesses your device contacts, real SMS, camera, microphone, or location. All interactions are self-contained simulated nocturnal network narratives.
          </p>
        </div>

        {/* Safety Actions */}
        <div className="bg-night-surface border border-night-border rounded-3xl overflow-hidden divide-y divide-night-border/50 text-xs font-medium">
          <button
            type="button"
            onClick={() => navigate('/blocked')}
            className="w-full p-4 flex items-center justify-between hover:bg-night-card min-h-touch text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <UserX className="w-4 h-4 text-red-400" />
              <div>
                <div className="text-white font-semibold">Blocked Contacts</div>
                <div className="text-[11px] text-night-muted">
                  {blockedList.length} contact{blockedList.length === 1 ? '' : 's'} currently blocked
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-night-muted" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/muted')}
            className="w-full p-4 flex items-center justify-between hover:bg-night-card min-h-touch text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <BellOff className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-white font-semibold">Muted Threads</div>
                <div className="text-[11px] text-night-muted">
                  {mutedThreads.length} conversation{mutedThreads.length === 1 ? '' : 's'} silenced
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-night-muted" />
          </button>
        </div>

        {/* Community Standard Rules */}
        <div className="p-4 bg-night-surface border border-night-border rounded-3xl space-y-2 text-xs">
          <h3 className="font-semibold text-white">Nocturnal Etiquette</h3>
          <ul className="space-y-1.5 text-night-muted list-disc list-inside">
            <li>Block stops all ongoing message simulation from that sender.</li>
            <li>Mute silences notifications while keeping transcripts readable.</li>
            <li>No sound will ever play without explicit opt-in in Sound Settings.</li>
          </ul>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};
