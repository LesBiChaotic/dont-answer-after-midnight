import React from 'react';
import { OfflineBanner } from '../common/OfflineBanner';
import { useSettings } from '../../context/SettingsContext';
import { X, Smartphone } from 'lucide-react';
import { PWAUpdateToast } from '../common/PWAUpdateToast';

interface MobileContainerProps {
  children: React.ReactNode;
  isSimulatedFrame?: boolean;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({
  children,
  isSimulatedFrame = false,
}) => {
  const { toggleDesktopPreview } = useSettings();

  if (isSimulatedFrame) {
    return (
      <div className="app-viewport w-full bg-[#08090d] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
        {/* Top Control Bar */}
        <div className="w-full max-w-[390px] flex items-center justify-between py-2 px-3 mb-2 bg-slate-900/90 border border-slate-800 rounded-full text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5 text-brand-400" />
            <span className="font-mono text-[11px]">390 × 844 Mobile Device</span>
          </div>
          <button
            type="button"
            onClick={toggleDesktopPreview}
            className="flex min-h-touch min-w-touch items-center justify-center gap-1 text-[11px] px-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <span>Exit</span>
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Mobile Phone Device Frame */}
        <div className="w-full max-w-[390px] h-[844px] max-h-[92vh] bg-ah-canvas border-4 border-slate-700/80 rounded-[44px] shadow-2xl shadow-black overflow-hidden flex flex-col relative ring-1 ring-white/10">
          {/* Hardware Dynamic Island Notch Mockup */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-50 pointer-events-none flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#18181b] mr-4" />
            <div className="w-2 h-2 rounded-full bg-[#101018]" />
          </div>

          <OfflineBanner />
          <PWAUpdateToast />
          <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    );
  }

  // Real Mobile Viewport
  return (
    <div className="app-viewport w-full max-w-[430px] desktop:max-w-[1100px] mx-auto bg-ah-canvas flex flex-col relative overflow-x-hidden shadow-xl desktop:border-x desktop:border-ah-border">
      <OfflineBanner />
      <PWAUpdateToast />
      <div className="flex-1 flex flex-col min-h-0 relative">
        {children}
      </div>
    </div>
  );
};
