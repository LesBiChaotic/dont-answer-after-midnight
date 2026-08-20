import React from 'react';
import { Award, Bookmark, Lock, MessageSquare, Moon, Radio, Sparkles } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { BottomNav } from '../components/layout/BottomNav';
import { useChat } from '../context/ChatContext';
import { useContinuity } from '../context/ContinuityContext';
import { useSettings } from '../context/SettingsContext';
import { ProfileFrame } from '../types';

const frames: Array<{ id: ProfileFrame; name: string; className: string }> = [
  { id: 'none', name: 'Unframed', className: 'border-ah-border' },
  { id: 'signal', name: 'Dead Signal', className: 'border-cyan-400 shadow-[0_0_18px_rgba(34,211,238,.35)]' },
  { id: 'archive', name: 'Archive Gold', className: 'border-amber-400 shadow-[0_0_18px_rgba(251,191,36,.35)]' },
  { id: 'blood-moon', name: 'Blood Moon', className: 'border-rose-500 shadow-[0_0_18px_rgba(244,63,94,.35)]' },
  { id: 'continuity', name: 'Continuity Breach', className: 'border-violet-400 shadow-[0_0_18px_rgba(167,139,250,.45)]' },
];

export const NightCabinetPage: React.FC = () => {
  const { messages, threads, bookmarks } = useChat();
  const { solvedCount, continuityDepth } = useContinuity();
  const { settings, setProfileFrame } = useSettings();
  const hour = new Date().getHours();
  const sentCount = Object.values(messages).flat().filter((message) => message.senderId.startsWith('user_')).length;

  const achievements = [
    { name: 'First Transmission', detail: 'Send a message into the network', unlocked: sentCount >= 1, icon: MessageSquare },
    { name: 'Still Awake', detail: 'Visit AFTERHOURS between midnight and 4 AM', unlocked: hour < 4, icon: Moon },
    { name: 'Archive Diver', detail: 'Preserve three pieces of evidence', unlocked: bookmarks.length >= 3, icon: Bookmark },
    { name: 'Crowded Frequency', detail: 'Open a network with ten conversation threads', unlocked: threads.length >= 10, icon: Radio },
    { name: 'Continuity Witness', detail: 'Solve one continuity puzzle', unlocked: solvedCount >= 1, icon: Sparkles },
    { name: 'Do Not Answer', detail: 'Reach corruption depth three', unlocked: continuityDepth >= 3, icon: Award },
  ];

  const unlockedCount = achievements.filter((item) => item.unlocked).length;

  return (
    <div className="app-viewport flex flex-1 flex-col bg-ah-canvas pb-20 text-ah-text">
      <TopBar showBack title="Night Cabinet" subtitle={`${unlockedCount}/${achievements.length} records unlocked`} />
      <main className="mx-auto w-full max-w-4xl flex-1 space-y-6 overflow-y-auto p-4 desktop:grid desktop:grid-cols-2 desktop:items-start desktop:gap-6 desktop:space-y-0">
        <section className="rounded-3xl border border-ah-border bg-ah-surface p-4">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ah-muted">Achievement Records</h2>
          <div className="space-y-2">
            {achievements.map((item) => {
              const Icon = item.unlocked ? item.icon : Lock;
              return (
                <div key={item.name} className={`flex items-center gap-3 rounded-2xl border p-3 ${item.unlocked ? 'border-ah-primary/40 bg-ah-surface-2' : 'border-ah-border bg-ah-canvas opacity-60'}`}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ah-surface-3 text-ah-primary"><Icon className="h-4 w-4" /></div>
                  <div><p className="text-xs font-semibold">{item.name}</p><p className="text-[11px] text-ah-muted">{item.detail}</p></div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-ah-border bg-ah-surface p-4">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-ah-muted">Profile Frames</h2>
          <p className="mb-3 text-[11px] text-ah-muted">Decorative proof that restraint has failed.</p>
          <div className="grid grid-cols-2 gap-2">
            {frames.map((frame) => (
              <button key={frame.id} type="button" onClick={() => setProfileFrame(frame.id)} className={`rounded-2xl border-2 bg-ah-surface-2 p-3 text-left text-xs font-semibold ${frame.className} ${settings.profileFrame === frame.id ? 'ring-2 ring-ah-primary ring-offset-2 ring-offset-ah-canvas' : ''}`}>
                <span className="mb-2 block h-8 rounded-xl bg-gradient-to-r from-ah-primary/30 to-ah-teal/30" />
                {frame.name}
              </button>
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
};
