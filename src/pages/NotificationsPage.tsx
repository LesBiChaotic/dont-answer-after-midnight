import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { TopBar } from '../components/layout/TopBar';
import { BottomNav } from '../components/layout/BottomNav';
import { Bell, CheckCheck, MessageSquare, Hash, ShieldAlert, Database, Info, Sparkles } from 'lucide-react';
import { NotificationType } from '../types';

const getNotifCategoryStyle = (type: NotificationType) => {
  switch (type) {
    case 'message':
      return {
        icon: MessageSquare,
        bg: 'bg-ah-surface-2',
        border: 'border-[#8197FF]/40',
        text: 'text-[#8197FF]',
      };
    case 'mention':
      return {
        icon: Sparkles,
        bg: 'bg-ah-surface-2',
        border: 'border-[#B979FF]/40',
        text: 'text-[#B979FF]',
      };
    case 'room_post':
      return {
        icon: Hash,
        bg: 'bg-ah-surface-2',
        border: 'border-[#57C7C1]/40',
        text: 'text-[#57C7C1]',
      };
    case 'safety_alert':
      return {
        icon: ShieldAlert,
        bg: 'bg-ah-surface-2',
        border: 'border-[#E07DA5]/40',
        text: 'text-[#E07DA5]',
      };
    case 'archive_alert':
      return {
        icon: Database,
        bg: 'bg-ah-surface-2',
        border: 'border-[#8FA9FF]/40',
        text: 'text-[#8FA9FF]',
      };
    case 'system_update':
    default:
      return {
        icon: Info,
        bg: 'bg-ah-surface-2',
        border: 'border-[#F0A06D]/40',
        text: 'text-[#F0A06D]',
      };
  }
};

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [filterUnread, setFilterUnread] = useState(false);

  const filtered = filterUnread
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  const handleNotificationClick = async (id: string, targetUrl: string) => {
    await markAsRead(id);
    if (targetUrl) {
      navigate(targetUrl);
    }
  };

  return (
    <div className="flex-1 flex flex-col app-viewport bg-ah-canvas text-ah-text pb-20">
      <TopBar
        showBack
        title="Notifications"
        subtitle="Network Alerts & Activity"
        actions={
          <button
            type="button"
            onClick={markAllAsRead}
            className="p-2 text-ah-muted hover:text-ah-text text-xs flex items-center gap-1 min-h-touch"
            title="Mark all as read"
          >
            <CheckCheck className="w-4 h-4 text-[#8197FF]" />
            <span className="text-[11px] font-medium hidden sm:inline">Mark Read</span>
          </button>
        }
      />

      {/* Filter Toggle */}
      <div className="flex px-3 py-2.5 border-b border-ah-border/60 shrink-0 bg-ah-canvas">
        <button
          type="button"
          onClick={() => setFilterUnread(!filterUnread)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border min-h-touch transition-all select-none ${
            filterUnread
              ? 'bg-gradient-to-r from-[#8197FF] to-[#B979FF] text-[#11101A] border-transparent font-bold shadow-xs'
              : 'bg-ah-surface text-ah-muted border-ah-border hover:text-ah-text'
          }`}
        >
          {filterUnread ? 'Showing Unread Only' : 'Show All Activity'}
        </button>
      </div>

      {/* Notifications List */}
      <main className="flex-1 overflow-y-auto divide-y divide-[#2E2742]/40 px-2 py-1 space-y-1">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-ah-muted space-y-2">
            <Bell className="w-8 h-8 mx-auto text-ah-muted/40 mb-2" />
            <p className="text-sm font-medium">No notifications to display.</p>
            <p className="text-xs">Incoming messages and room alerts will notify you here.</p>
          </div>
        ) : (
          filtered.map((notif) => {
            const style = getNotifCategoryStyle(notif.type);
            const Icon = style.icon;
            const timeStr = new Date(notif.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif.id, notif.targetUrl)}
                className={`p-3.5 rounded-2xl flex items-start gap-3.5 cursor-pointer transition-all select-none border ${
                  !notif.isRead
                    ? 'bg-ah-surface-2 border-[#8197FF]/30 shadow-sm'
                    : 'bg-ah-surface/60 hover:bg-ah-surface border-transparent hover:border-ah-border'
                }`}
              >
                <div className={`mt-0.5 w-9 h-9 rounded-xl ${style.bg} border ${style.border} flex items-center justify-center ${style.text} shrink-0 shadow-inner`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs truncate ${!notif.isRead ? 'font-bold text-ah-text' : 'font-semibold text-ah-text'}`}>
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-ah-muted font-mono shrink-0">{timeStr}</span>
                  </div>
                  <p className="text-xs text-ah-text-2 line-clamp-2 leading-relaxed">{notif.body}</p>
                </div>

                {!notif.isRead && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F0A06D] shrink-0 mt-2 shadow-xs animate-pulse" />
                )}
              </div>
            );
          })
        )}
      </main>

      <BottomNav />
    </div>
  );
};
