import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { DesktopShell } from './DesktopShell';
import { MobileContainer } from './MobileContainer';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { settings, toggleDesktopPreview } = useSettings();
  const location = useLocation();

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

  if (isDesktopWidth && !settings.desktopPreviewEnabled) {
    return <DesktopShell onEnablePreview={toggleDesktopPreview} />;
  }

  return (
    <MobileContainer isSimulatedFrame={isDesktopWidth && settings.desktopPreviewEnabled}>
      {children}
    </MobileContainer>
  );
};
