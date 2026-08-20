import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already in standalone PWA mode
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    setIsStandalone(isStandaloneMode);
    if (isStandaloneMode) return;

    // Check if dismissed previously this session
    const isDismissed = sessionStorage.getItem('afterhours_install_dismissed') === 'true';
    if (isDismissed) return;

    // Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent);
    setIsIOS(isIOSDevice && isSafari);

    // Standard PWA beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // On iOS Safari, show gentle guide if not standalone
    if (isIOSDevice && isSafari && !isStandaloneMode) {
      setIsVisible(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('afterhours_install_dismissed', 'true');
  };

  if (!isVisible || isStandalone) {
    return null;
  }

  return (
    <aside
      aria-label="Install Afterhours PWA"
      className="p-3.5 bg-gradient-to-r from-brand-950/90 to-night-card border border-brand-800/60 rounded-2xl shadow-xl space-y-2.5 animate-slide-up select-none"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-600/30 border border-brand-500/40 flex items-center justify-center text-brand-300 shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-ah-text flex items-center gap-1.5">
              <span>Install AFTERHOURS</span>
              <Sparkles className="w-3 h-3 text-brand-400" />
            </h2>
            <p className="text-[11px] text-ah-muted">
              Add to Home Screen for a pure standalone nocturnal experience.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 text-ah-muted hover:text-ah-text min-h-touch min-w-touch flex items-center justify-center shrink-0"
          aria-label="Dismiss install banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 text-[10px] text-ah-muted font-mono pt-0.5">
        <span className="text-center py-1 bg-ah-surface-3 rounded-lg border border-ah-border">⚡ Instant Launch</span>
        <span className="text-center py-1 bg-ah-surface-3 rounded-lg border border-ah-border">📦 Offline Sync</span>
        <span className="text-center py-1 bg-ah-surface-3 rounded-lg border border-ah-border">📱 Fullscreen</span>
      </div>

      {isIOS ? (
        <div className="p-2 bg-ah-surface-3 border border-ah-border rounded-xl text-[11px] text-ah-muted flex items-center gap-2">
          <Share className="w-4 h-4 text-brand-400 shrink-0" />
          <span>Tap <strong>Share</strong> in Safari, then select <strong>Add to Home Screen</strong>.</span>
        </div>
      ) : (
        deferredPrompt && (
          <button
            type="button"
            onClick={handleInstallClick}
            className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-ah-text rounded-xl text-xs font-semibold flex items-center justify-center gap-2 min-h-touch active:scale-95 transition-transform"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>
        )
      )}
    </aside>
  );
};
