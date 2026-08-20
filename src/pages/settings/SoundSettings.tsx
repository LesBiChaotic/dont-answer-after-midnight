import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { TopBar } from '../../components/layout/TopBar';
import { Volume2, VolumeX, Play } from 'lucide-react';
import {
  playMessageSentSound,
  playMessageReceivedSound,
  playReactionSound,
  playNotificationSound,
} from '../../services/audio';

export const SoundSettings: React.FC = () => {
  const { settings, updateSoundSettings, updateQuietHours } = useSettings();
  const sound = settings.sound;

  const handleToggleMaster = () => {
    updateSoundSettings({ enabled: !sound.enabled });
  };

  const handleTestAudio = () => {
    playMessageReceivedSound({ ...sound, enabled: true });
  };

  return (
    <div className="flex-1 flex flex-col app-viewport bg-night-bg text-night-text">
      <TopBar showBack title="Sound & Audio" subtitle="Synthesized Haptics & Tones" />

      <main className="flex-1 overflow-y-auto p-4 space-y-5 max-w-md mx-auto w-full">
        {/* Safety & Design Notice */}
        <div className="p-4 bg-indigo-950/30 border border-indigo-800/40 rounded-2xl text-xs space-y-1.5 text-indigo-200">
          <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
            <VolumeX className="w-4 h-4 text-indigo-400" />
            <span>Off by Default (Zero Audio-Gated Clues)</span>
          </div>
          <p className="text-[11px] leading-relaxed text-indigo-200/80">
            Per design rules, sound is completely optional. No screams, jumpscares, or puzzles will ever require audio to solve.
          </p>
        </div>

        {/* Master Sound Switch */}
        <div className="p-4 bg-night-surface border border-night-border rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  sound.enabled ? 'bg-emerald-600 text-white' : 'bg-night-card text-night-muted'
                }`}
              >
                {sound.enabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Enable Audio Cues</div>
                <div className="text-[11px] text-night-muted">Web Audio synthesized chimes</div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleMaster}
              className={`w-12 h-7 rounded-full transition-colors relative min-h-touch flex items-center p-1 ${
                sound.enabled ? 'bg-brand-600' : 'bg-night-card border border-night-border'
              }`}
              aria-label="Toggle Sound Master Switch"
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform transform ${
                  sound.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Volume Slider & Test Button */}
          {sound.enabled && (
            <div className="pt-3 border-t border-night-border/40 space-y-3 animate-slide-up">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-night-muted">
                  <span>Volume</span>
                  <span className="font-mono">{Math.round(sound.volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={sound.volume}
                  onChange={(e) => updateSoundSettings({ volume: parseFloat(e.target.value) })}
                  className="w-full accent-brand-500 h-1.5 bg-night-card rounded-lg cursor-pointer"
                />
              </div>

              <button
                type="button"
                onClick={handleTestAudio}
                className="w-full py-2.5 px-3 bg-night-card hover:bg-night-hover border border-night-border rounded-xl text-xs font-medium text-brand-300 flex items-center justify-center gap-2 min-h-touch active:scale-95 transition-transform"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Chime Tone</span>
              </button>
            </div>
          )}
        </div>

        {/* Granular Sound Event Toggles */}
        {sound.enabled && (
          <div className="bg-night-surface border border-night-border rounded-3xl overflow-hidden divide-y divide-night-border/50 text-xs animate-slide-up">
            {[
              {
                id: 'messageSent',
                label: 'Message Sent Pop',
                checked: sound.messageSent,
                test: () => playMessageSentSound(sound),
              },
              {
                id: 'messageReceived',
                label: 'Message Received Chime',
                checked: sound.messageReceived,
                test: () => playMessageReceivedSound(sound),
              },
              {
                id: 'notifications',
                label: 'Notification Bell',
                checked: sound.notifications,
                test: () => playNotificationSound(sound),
              },
              {
                id: 'reactions',
                label: 'Reaction Chirp',
                checked: sound.reactions,
                test: () => playReactionSound(sound),
              },
            ].map((event) => (
              <div key={event.id} className="p-4 flex items-center justify-between min-h-touch">
                <span className="text-white font-medium">{event.label}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={event.test}
                    className="p-1.5 text-night-muted hover:text-brand-300 min-h-touch min-w-touch flex items-center justify-center"
                    title="Test tone"
                  >
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                  <input
                    type="checkbox"
                    checked={event.checked}
                    onChange={(e) =>
                      updateSoundSettings({ [event.id]: e.target.checked } as Partial<typeof sound>)
                    }
                    className="w-4 h-4 rounded text-brand-600 bg-night-card border-night-border focus:ring-brand-500"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quiet Hours Schedule Configuration */}
        <div className="p-4 bg-night-surface border border-night-border rounded-3xl space-y-3">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-white">Quiet Hours Schedule</h3>
            <p className="text-[11px] text-night-muted">
              Softens notification chimes and fictional delivery volume during late hours.
            </p>
          </div>

          <div className="space-y-1.5">
            {[
              { id: 'off', label: 'Off (24/7 Delivery)', desc: 'Standard chimes at all hours' },
              { id: '23:00-07:00', label: '23:00 – 07:00', desc: 'Mutes audio between 11 PM and 7 AM' },
              { id: '00:00-08:00', label: '00:00 – 08:00 (Recommended)', desc: 'Full nocturnal silence during peak quiet hours' },
              { id: 'custom', label: 'Custom', desc: 'Personalized delivery window' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateQuietHours(opt.id as any)}
                className={`w-full p-3 rounded-2xl border text-left flex items-start justify-between min-h-touch transition-all ${
                  settings.quietHours === opt.id
                    ? 'bg-brand-950/40 border-brand-500 text-white ring-1 ring-brand-500/50'
                    : 'bg-night-card border-night-border text-night-muted hover:text-white'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">{opt.label}</div>
                  <div className="text-[10px] text-night-muted">{opt.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
