import React, { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';

export const PWAUpdateToast: React.FC = () => {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    let active = true;
    let intervalId: number | undefined;

    const watchRegistration = async () => {
      const reg = await navigator.serviceWorker.ready;
      if (!active) return;

      if (reg.waiting) setRegistration(reg);
      reg.addEventListener('updatefound', () => {
        const worker = reg.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            setRegistration(reg);
            setDismissed(false);
          }
        });
      });

      intervalId = window.setInterval(() => void reg.update(), 60 * 60 * 1000);
    };

    void watchRegistration();
    const reload = () => window.location.reload();
    navigator.serviceWorker.addEventListener('controllerchange', reload, { once: true });

    return () => {
      active = false;
      if (intervalId) window.clearInterval(intervalId);
      navigator.serviceWorker.removeEventListener('controllerchange', reload);
    };
  }, []);

  if (!registration || dismissed) return null;

  const activateUpdate = () => registration.waiting?.postMessage({ type: 'SKIP_WAITING' });

  return (
    <aside className="fixed inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-[80] mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-ah-primary/50 bg-ah-surface p-3 text-ah-text shadow-2xl" role="status">
      <RefreshCw className="h-5 w-5 shrink-0 text-ah-primary" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold">A new signal is available.</p>
        <p className="text-[11px] text-ah-muted">Reload to receive the latest AFTERHOURS transmission.</p>
      </div>
      <button type="button" onClick={activateUpdate} className="min-h-touch rounded-xl bg-ah-primary px-3 text-xs font-bold text-ah-canvas">
        Reload
      </button>
      <button type="button" onClick={() => setDismissed(true)} className="min-h-touch min-w-touch rounded-xl text-ah-muted" aria-label="Dismiss update">
        <X className="mx-auto h-4 w-4" />
      </button>
    </aside>
  );
};
