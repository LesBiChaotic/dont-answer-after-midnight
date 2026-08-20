import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState<boolean>(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="alert"
      className="bg-amber-950/90 text-amber-200 border-b border-amber-800/60 px-3 py-2 text-xs flex items-center gap-2.5 animate-slide-up select-none shrink-0"
    >
      <WifiOff className="w-4 h-4 shrink-0 text-amber-400" />
      <span className="leading-tight">
        You're offline. Saved conversations are still available. New activity will resume when you're connected.
      </span>
    </div>
  );
};
