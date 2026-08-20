import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, Hash, Archive, Search, User } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const BottomNav: React.FC = () => {
  const { unreadTotal } = useChat();

  const navItems = [
    {
      to: '/chats',
      label: 'Chats',
      icon: MessageSquare,
      badge: unreadTotal > 0 ? unreadTotal : null,
      activeColor: 'text-[#8197FF]',
      activeGlow: 'shadow-[0_0_12px_rgba(129,151,255,0.4)]',
    },
    {
      to: '/rooms',
      label: 'Rooms',
      icon: Hash,
      badge: null,
      activeColor: 'text-[#57C7C1]',
      activeGlow: 'shadow-[0_0_12px_rgba(87,199,193,0.4)]',
    },
    {
      to: '/archive',
      label: 'Archive',
      icon: Archive,
      badge: null,
      activeColor: 'text-[#F0A06D]',
      activeGlow: 'shadow-[0_0_12px_rgba(240,160,109,0.4)]',
    },
    {
      to: '/search',
      label: 'Search',
      icon: Search,
      badge: null,
      activeColor: 'text-[#8197FF]',
      activeGlow: 'shadow-[0_0_12px_rgba(129,151,255,0.4)]',
    },
    {
      to: '/profile',
      label: 'Profile',
      icon: User,
      badge: null,
      activeColor: 'text-[#B979FF]',
      activeGlow: 'shadow-[0_0_12px_rgba(185,121,255,0.4)]',
    },
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 max-w-[430px] desktop:max-w-[760px] mx-auto bg-ah-surface/95 backdrop-blur-xl border border-b-0 border-ah-border desktop:rounded-t-3xl z-40 pb-[max(env(safe-area-inset-bottom),8px)] shadow-2xl"
    >
      <div className="grid grid-cols-5 items-center justify-around h-14 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-h-touch min-w-touch relative transition-all duration-150 select-none ${
                  isActive
                    ? `${item.activeColor} font-semibold`
                    : 'text-ah-muted hover:text-ah-text active:scale-95'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`relative p-1.5 rounded-xl transition-all ${
                      isActive ? `bg-ah-surface-2 ${item.activeGlow}` : ''
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isActive ? 'scale-110' : ''
                      }`}
                      strokeWidth={isActive ? 2.3 : 1.8}
                    />
                    {item.badge !== null && (
                      <span className="absolute -top-1 -right-1.5 bg-[#F0A06D] text-[#11101A] text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[17px] text-center border-2 border-[#191625] shadow-sm animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] tracking-tight mt-0.5 font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
