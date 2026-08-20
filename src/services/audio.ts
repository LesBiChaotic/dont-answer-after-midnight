import { SoundSettings } from '../types';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playMessageSentSound(settings: SoundSettings): void {
  if (!settings.enabled || !settings.messageSent) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.08);

    const masterVol = Math.max(0.01, Math.min(settings.volume, 1.0));
    gain.gain.setValueAtTime(0.08 * masterVol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch (err) {
    console.debug('[Audio] Could not play sound:', err);
  }
}

export function playMessageReceivedSound(settings: SoundSettings): void {
  if (!settings.enabled || !settings.messageReceived) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const masterVol = Math.max(0.01, Math.min(settings.volume, 1.0));

    // Two-tone gentle harmonic chime
    [523.25, 659.25].forEach((freq, i) => {
      const start = now + i * 0.06;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.07 * masterVol, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.14);
    });
  } catch (err) {
    console.debug('[Audio] Could not play sound:', err);
  }
}

export function playReactionSound(settings: SoundSettings): void {
  if (!settings.enabled || !settings.reactions) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.06);

    const masterVol = Math.max(0.01, Math.min(settings.volume, 1.0));
    gain.gain.setValueAtTime(0.05 * masterVol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  } catch (err) {
    console.debug('[Audio] Could not play sound:', err);
  }
}

export function playNotificationSound(settings: SoundSettings): void {
  if (!settings.enabled || !settings.notifications) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const masterVol = Math.max(0.01, Math.min(settings.volume, 1.0));

    [440, 880].forEach((freq, idx) => {
      const start = now + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.06 * masterVol, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.18);
    });
  } catch (err) {
    console.debug('[Audio] Could not play sound:', err);
  }
}

export function playBookmarkSound(settings: SoundSettings): void {
  if (!settings.enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.05);

    const masterVol = Math.max(0.01, Math.min(settings.volume, 1.0));
    gain.gain.setValueAtTime(0.06 * masterVol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch (err) {
    console.debug('[Audio] Could not play sound:', err);
  }
}
