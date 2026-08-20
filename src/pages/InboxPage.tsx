import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { Avatar } from '../components/common/Avatar';
import { TopBar } from '../components/layout/TopBar';
import { BottomNav } from '../components/layout/BottomNav';
import { Search, Pin, BellOff, Users, Moon, MessageSquare, BookOpen, Sparkles } from 'lucide-react';

type InboxTab = 'all' | 'unread' | 'groups' | 'archived';

export const InboxPage: React.FC = () => {
  const navigate = useNavigate();
  const { threads, activeTyping } = useChat();
  const [activeTab, setActiveTab] = useState<InboxTab>('all');

  const filteredThreads = threads.filter((thread) => {
    if (activeTab === 'archived') return thread.isArchived;
    if (thread.isArchived) return false;
    if (activeTab === 'unread') return thread.unreadCount > 0;
    if (activeTab === 'groups') return thread.type === 'group';
    return true;
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#11101A] text-[#F4EEF8] pb-20">
      {/* Top Header */}
      <TopBar
        title="AFTERHOURS"
        subtitle="Nocturnal Messaging Network"
        showNotifications
        actions={
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => navigate('/notebook')}
              className="p-2 text-[#8197FF] hover:text-[#B979FF] min-h-touch min-w-touch flex items-center justify-center rounded-full active:bg-[#211C30] transition-colors"
              title="Continuity Investigation Notebook"
              aria-label="Investigation Notebook"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/activities')}
              className="p-2 text-[#D5AB5E] hover:text-[#F0A06D] min-h-touch min-w-touch flex items-center justify-center rounded-full active:bg-[#211C30] transition-colors"
              title="Sanctuary Activities"
              aria-label="Activities"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/search')}
              className="p-2 text-[#91819A] hover:text-[#F4EEF8] min-h-touch min-w-touch flex items-center justify-center rounded-full active:bg-[#211C30] transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Filter Tabs */}
      <div className="flex px-3 pt-3 pb-2.5 gap-1.5 overflow-x-auto no-scrollbar shrink-0 border-b border-[#2E2742]/60 bg-[#11101A]">
        {[
          { id: 'all', label: 'All' },
          { id: 'unread', label: 'Unread' },
          { id: 'groups', label: 'Groups' },
          { id: 'archived', label: 'Archived' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as InboxTab)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium min-h-touch transition-all select-none ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#8197FF] to-[#B979FF] text-[#11101A] font-bold shadow-md shadow-[#8197FF]/20'
                : 'bg-[#191625] text-[#91819A] hover:text-[#F4EEF8] border border-[#2E2742]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Thread List */}
      <main className="flex-1 overflow-y-auto divide-y divide-[#2E2742]/40 px-2 py-1 space-y-1">
        {filteredThreads.length === 0 ? (
          <div className="py-20 px-6 text-center text-[#91819A] space-y-2">
            <Moon className="w-8 h-8 mx-auto text-[#91819A]/40 mb-2" />
            <p className="text-sm font-medium">No conversations in this view.</p>
            <p className="text-xs">Incoming messages and room activity will populate here.</p>
          </div>
        ) : (
          filteredThreads.map((thread) => {
            const participant = thread.participants[0];
            const isTyping = activeTyping?.threadId === thread.id;
            const formattedTime = thread.lastMessage
              ? new Date(thread.lastMessage.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '';

            const isUnread = thread.unreadCount > 0;
            const isPinned = thread.isPinned;

            return (
              <button
                key={thread.id}
                type="button"
                onClick={() => navigate(`/chats/${thread.id}`)}
                className={`w-full px-3.5 py-3 rounded-2xl flex items-center gap-3.5 text-left transition-all min-h-touch select-none border ${
                  isUnread
                    ? 'bg-[#211C30] border-[#8197FF]/30 shadow-md shadow-[#8197FF]/5'
                    : isPinned
                    ? 'bg-[#191625]/90 border-[#382D52]'
                    : 'bg-[#191625]/50 hover:bg-[#191625] border-transparent hover:border-[#2E2742]'
                }`}
              >
                {/* Avatar with Halo Ring */}
                <div className="relative shrink-0">
                  {thread.type === 'group' ? (
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2D1B4E] to-[#141122] border border-[#B979FF]/40 flex items-center justify-center text-[#B979FF] shadow-inner">
                      <Users className="w-6 h-6" />
                    </div>
                  ) : participant ? (
                    <div className="p-0.5 rounded-2xl ring-1 ring-[#8197FF]/30">
                      <Avatar
                        config={participant.avatarConfig}
                        size="md"
                        showStatusDot
                        status={participant.status}
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-[#191625] border border-[#2E2742] flex items-center justify-center text-[#91819A]">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className={`text-sm truncate ${isUnread ? 'font-bold text-white' : 'font-medium text-[#F4EEF8]'}`}>
                        {thread.title || participant?.displayName || 'Chat'}
                      </span>
                      {participant?.isModerator && (
                        <span className="px-1.5 py-0.2 rounded bg-[#252038] text-[#B979FF] border border-[#4D357F] text-[10px] font-semibold">
                          MOD
                        </span>
                      )}
                      {thread.isPinned && <Pin className="w-3 h-3 text-[#8197FF] fill-current shrink-0" />}
                      {thread.isMuted && <BellOff className="w-3 h-3 text-[#91819A] shrink-0" />}
                    </div>

                    <span className="text-[11px] text-[#91819A] font-mono shrink-0">{formattedTime}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs truncate leading-normal ${isUnread ? 'text-[#C9B9D2] font-medium' : 'text-[#91819A]'}`}>
                      {isTyping ? (
                        <span className="text-[#8197FF] font-medium animate-pulse">typing...</span>
                      ) : thread.lastMessage ? (
                        thread.lastMessage.content
                      ) : (
                        <span className="italic">No messages yet</span>
                      )}
                    </p>

                    {thread.unreadCount > 0 && (
                      <span className="bg-[#F0A06D] text-[#11101A] text-[11px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shrink-0 shadow-sm animate-pulse">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </main>

      <BottomNav />
    </div>
  );
};
