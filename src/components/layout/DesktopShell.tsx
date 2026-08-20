import React, { useState } from 'react';
import { Smartphone, Copy, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { Logo } from '../common/Logo';

interface DesktopShellProps {
  onEnablePreview: () => void;
}

export const DesktopShell: React.FC<DesktopShellProps> = ({ onEnablePreview }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="app-viewport w-full bg-ah-canvas text-ah-text flex flex-col items-center justify-between p-6 sm:p-12 relative overflow-hidden">
      {/* Subtle Ambient Plum / Periwinkle Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#6E45C7]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#8197FF]/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-4xl flex items-center justify-between z-10">
        <Logo size="md" />

        {/* Developer Escape Hatch */}
        <button
          type="button"
          onClick={onEnablePreview}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-ah-surface hover:bg-ah-surface-2 border border-ah-border hover:border-[#8197FF] text-xs font-semibold text-ah-text transition-all shadow-md active:scale-95"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#8197FF]" />
          <span>Launch Mobile Preview</span>
          <ArrowRight className="w-3 h-3 text-ah-muted" />
        </button>
      </header>

      {/* Main Showcase Hero */}
      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-10 items-center my-auto py-8 z-10">
        <div className="md:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ah-surface-2 border border-[#8197FF]/30 text-[#8197FF] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#8197FF] animate-pulse" />
            Designed Exclusively for Mobile Handsets
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ah-text leading-tight font-serif">
            A quiet sanctuary for after-midnight conversations.
          </h1>

          <p className="text-ah-text-2 text-sm sm:text-base leading-relaxed">
            AFTERHOURS is engineered specifically for handheld smartphones — complete with tactile 44px touch targets, virtual keyboard layout anchoring, legacy web archives, and community rooms.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#8197FF] to-[#B979FF] text-[#11101A] text-xs sm:text-sm font-bold transition-all shadow-lg shadow-[#8197FF]/20 active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-[#11101A]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Link Copied to Clipboard' : 'Copy Mobile Link'}</span>
            </button>

            <button
              type="button"
              onClick={onEnablePreview}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-ah-surface hover:bg-ah-surface-2 text-ah-text border border-ah-border text-xs sm:text-sm font-medium transition-all active:scale-95"
            >
              <Smartphone className="w-4 h-4 text-ah-muted" />
              <span>Simulate 390×844 Mobile Device</span>
            </button>
          </div>

          <div className="pt-4 border-t border-ah-border flex items-center gap-6 text-xs text-ah-muted">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#69C49A]" />
              <span>Zero SMS Permissions Required</span>
            </div>
            <span>•</span>
            <span>Local-First PWA Storage</span>
          </div>
        </div>

        {/* QR & Mobile Simulator Card */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[280px] bg-ah-surface border border-ah-border rounded-3xl p-6 shadow-2xl shadow-black/80 flex flex-col items-center text-center space-y-4">
            <div className="w-48 h-48 bg-ah-canvas rounded-2xl border border-ah-border flex flex-col items-center justify-center p-3 relative group">
              {/* Stylized Vector QR Target */}
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#8197FF]">
                <rect x="5" y="5" width="30" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="13" y="13" width="14" height="14" rx="2" fill="currentColor" />
                
                <rect x="65" y="5" width="30" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="73" y="13" width="14" height="14" rx="2" fill="currentColor" />
                
                <rect x="5" y="65" width="30" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="13" y="73" width="14" height="14" rx="2" fill="currentColor" />
                
                {/* Modern Data Matrix Pixels */}
                <rect x="45" y="10" width="8" height="8" rx="1.5" fill="currentColor" />
                <rect x="45" y="25" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.6" />
                <rect x="45" y="45" width="8" height="8" rx="1.5" fill="currentColor" />
                <rect x="10" y="45" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.8" />
                <rect x="25" y="45" width="8" height="8" rx="1.5" fill="currentColor" />
                <rect x="65" y="45" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.7" />
                <rect x="80" y="45" width="8" height="8" rx="1.5" fill="currentColor" />
                <rect x="45" y="65" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.6" />
                <rect x="45" y="80" width="8" height="8" rx="1.5" fill="currentColor" />
                <rect x="65" y="65" width="12" height="12" rx="2" fill="currentColor" />
                <rect x="82" y="82" width="10" height="10" rx="2" fill="currentColor" />
              </svg>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-ah-text block">Scan with your phone</span>
              <p className="text-[11px] text-ah-muted">Open your mobile camera to launch the native PWA view.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center text-xs text-ah-muted z-10 font-mono">
        AFTERHOURS v1.0.4 • NOCTURNAL SANCTUARY • STANDALONE WEB APP
      </footer>
    </div>
  );
};
