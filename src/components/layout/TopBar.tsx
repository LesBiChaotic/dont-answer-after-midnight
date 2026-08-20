import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, MoreVertical } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

interface TopBarProps {
  title: string;
  subtitle?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  showNotifications?: boolean;
  actions?: React.ReactNode;
  onMenuClick?: () => void;
  className?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  showNotifications = false,
  actions,
  onMenuClick,
  className = '',
}) => {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header
      className={`sticky top-0 z-30 w-full bg-[#191625]/90 backdrop-blur-xl border-b border-[#2E2742] pt-[max(env(safe-area-inset-top),6px)] transition-colors select-none shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between px-3 h-14">
        {/* Left Side: Back button or title */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {showBack && (
            <button
              type="button"
              onClick={handleBack}
              className="p-2 -ml-1 text-[#91819A] hover:text-[#F4EEF8] min-h-touch min-w-touch flex items-center justify-center rounded-full active:bg-[#211C30] transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="flex flex-col min-w-0 flex-1 pr-2">
            <h1 className="text-sm font-semibold truncate text-[#F4EEF8] leading-tight font-serif tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <div className="text-[11px] text-[#91819A] truncate leading-tight mt-0.5 font-mono">
                {subtitle}
              </div>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {actions}

          {showNotifications && (
            <button
              type="button"
              onClick={() => navigate('/notifications')}
              className="p-2.5 text-[#91819A] hover:text-[#F4EEF8] min-h-touch min-w-touch flex items-center justify-center rounded-full active:bg-[#211C30] relative transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#F0A06D] ring-2 ring-[#191625] animate-pulse" />
              )}
            </button>
          )}

          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              className="p-2 text-[#91819A] hover:text-[#F4EEF8] min-h-touch min-w-touch flex items-center justify-center rounded-full active:bg-[#211C30] transition-colors"
              aria-label="Thread menu options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
