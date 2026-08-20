import React, { useState } from 'react';
import { useArchive } from '../../context/ArchiveContext';
import { useNotifications } from '../../context/NotificationContext';
import { useChat } from '../../context/ChatContext';
import { useContinuity } from '../../context/ContinuityContext';
import { TopBar } from '../../components/layout/TopBar';
import { Terminal, Bell, Check, BookOpen, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StoryStage } from '../../types';

export const InternalDevPage: React.FC = () => {
  const navigate = useNavigate();
  const { continuityRecords } = useArchive();
  const { addManualNotification } = useNotifications();
  const { threads } = useChat();
  const { storyStage, continuityDepth, advanceStage } = useContinuity();

  const [notificationSent, setNotificationSent] = useState(false);

  const handleTriggerTestNotification = () => {
    addManualNotification({
      type: 'system_update',
      title: '[CONTINUITY PULSE] Node #402',
      body: 'Automated frequency sweep detected archive timestamp anomaly in 2008 partition.',
      targetUrl: '/archive/2008',
      senderHandle: 'sys.archived',
    });
    setNotificationSent(true);
    setTimeout(() => setNotificationSent(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col app-viewport bg-ah-canvas text-ah-text">
      <TopBar showBack title="Internal Diagnostics" subtitle="ARG Continuity & Event Triggers" />

      <main className="flex-1 overflow-y-auto p-4 space-y-4 max-w-md mx-auto w-full font-mono text-xs">
        {/* Banner */}
        <div className="p-3 bg-indigo-950/40 border border-indigo-800/50 rounded-2xl flex items-start gap-2.5 text-indigo-300">
          <Terminal className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold">AFTERHOURS CONTINUITY RUNTIME</span>
            <p className="text-[11px] text-indigo-200/80 leading-tight">
              Developer tools for inspecting narrative continuity and event triggers.
            </p>
          </div>
        </div>

        {/* Live Simulation Triggers */}
        <div className="p-4 bg-ah-surface border border-ah-border rounded-3xl space-y-3 font-sans">
          <h3 className="text-xs font-semibold text-ah-text font-mono">SIMULATION_TRIGGERS</h3>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate('/notebook')}
              className="flex-1 py-2.5 px-3 bg-brand-600/80 hover:bg-brand-600 text-ah-text rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 min-h-touch"
            >
              <BookOpen className="w-4 h-4" />
              <span>Open Notebook</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/activities')}
              className="flex-1 py-2.5 px-3 bg-ah-surface-2 hover:bg-ah-hover border border-ah-border text-brand-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 min-h-touch"
            >
              <Sparkles className="w-4 h-4" />
              <span>Activities</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleTriggerTestNotification}
            className="w-full py-3 px-4 bg-ah-surface-2 hover:bg-ah-hover border border-ah-border text-ah-text rounded-xl text-xs font-semibold flex items-center justify-center gap-2 min-h-touch active:scale-95 transition-all shadow-xs"
          >
            {notificationSent ? <Check className="w-4 h-4 text-emerald-300" /> : <Bell className="w-4 h-4 text-brand-400" />}
            <span>{notificationSent ? 'Dispatched!' : 'Trigger Continuity Notification'}</span>
          </button>
        </div>

        {/* Story Stage Director Controller */}
        <div className="p-4 bg-ah-surface border border-ah-border rounded-3xl space-y-3 font-sans">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-ah-text font-mono">STORY_STAGE_OVERRIDE</span>
            <span className="text-[10px] text-brand-400 font-mono">STAGE {storyStage} (DEPTH {continuityDepth})</span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 font-mono text-xs">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((stg) => (
              <button
                key={stg}
                type="button"
                onClick={() => advanceStage(stg as StoryStage)}
                className={`py-2 rounded-xl border font-bold min-h-touch transition-all ${
                  storyStage === stg
                    ? 'bg-brand-600 border-brand-500 text-ah-text'
                    : 'bg-ah-surface-2 border-ah-border text-ah-muted hover:text-ah-text'
                }`}
              >
                S{stg}
              </button>
            ))}
          </div>
        </div>

        {/* Continuity Records */}
        <div className="p-4 bg-ah-surface border border-ah-border rounded-3xl space-y-3">
          <div className="flex items-center justify-between text-ah-text">
            <span className="font-semibold">CONTINUITY_INDEX_RECORDS</span>
            <span className="text-[11px] text-brand-400">({continuityRecords.length} records)</span>
          </div>

          <div className="space-y-2">
            {continuityRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-3 bg-black/40 border border-ah-border rounded-xl text-[11px] space-y-1 text-emerald-400"
              >
                <div className="flex items-center justify-between text-[10px] text-ah-muted">
                  <span>TYPE: {rec.recordType}</span>
                  <span>ENTITY: {rec.entityId}</span>
                </div>
                <p className="text-slate-200">{rec.description}</p>
                <div className="text-[9px] text-indigo-300">REF: {rec.evidenceRef}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Threads Index */}
        <div className="p-4 bg-ah-surface border border-ah-border rounded-3xl space-y-2">
          <span className="font-semibold text-ah-text">ACTIVE_THREAD_PARTITIONS</span>
          <div className="space-y-1 text-[11px] text-ah-muted">
            {threads.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-2 bg-ah-surface-2 rounded-lg">
                <span className="text-ah-text truncate">{t.title || t.id}</span>
                <span className="text-[10px]">{t.unreadCount} unread</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
