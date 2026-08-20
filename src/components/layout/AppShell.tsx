import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { MobileContainer } from './MobileContainer';
import { useContinuity } from '../../context/ContinuityContext';
import { Moon, X } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { settings, toggleDesktopPreview } = useSettings();
  const location = useLocation();
  const { continuityDepth } = useContinuity();
  const [showMidnightEvent, setShowMidnightEvent] = useState(() => {
    const hour = new Date().getHours();
    return hour < 4 && sessionStorage.getItem('afterhours_midnight_dismissed') !== '1';
  });

  const [isDesktopWidth, setIsDesktopWidth] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 768 : false;
  });

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktopWidth(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check query parameter ?desktop-preview=1
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('desktop-preview') === '1' && !settings.desktopPreviewEnabled) {
      toggleDesktopPreview();
    }
  }, [location.search, settings.desktopPreviewEnabled, toggleDesktopPreview]);

  useEffect(() => {
    document.documentElement.dataset.corruptionDepth = String(continuityDepth);
  }, [continuityDepth]);

  const dismissMidnightEvent = () => {
    sessionStorage.setItem('afterhours_midnight_dismissed', '1');
    setShowMidnightEvent(false);
  };

  return (
    <MobileContainer isSimulatedFrame={isDesktopWidth && settings.desktopPreviewEnabled}>
      {showMidnightEvent && (
        <aside className="mx-3 mt-[max(env(safe-area-inset-top),.75rem)] flex items-center gap-3 rounded-2xl border border-ah-primary/40 bg-ah-surface-2 p-3 text-ah-text shadow-lg" role="status">
          <Moon className="h-4 w-4 shrink-0 text-ah-primary" />
          <div className="min-w-0 flex-1"><p className="text-xs font-semibold">Quiet Window Active</p><p className="text-[11px] text-ah-muted">One room is reporting more members than it contains.</p></div>
          <button type="button" onClick={dismissMidnightEvent} className="min-h-touch min-w-touch rounded-xl text-ah-muted" aria-label="Dismiss midnight event"><X className="mx-auto h-4 w-4" /></button>
        </aside>
      )}
      {children}
    </MobileContainer>
  );
};
