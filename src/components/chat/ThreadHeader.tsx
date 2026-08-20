import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, BellOff, Bell, UserX, Shield, Bookmark, Sparkles } from 'lucide-react';
import { ConversationThread, ConversationParticipant, TypingEvent } from '../../types';
import { Avatar } from '../common/Avatar';
import { useSettings } from '../../context/SettingsContext';
import { useChat } from '../../context/ChatContext';

interface ThreadHeaderProps {
  thread: ConversationThread;
  activeTyping: TypingEvent | null;
}

export const ThreadHeader: React.FC<ThreadHeaderProps> = ({ thread, activeTyping }) => {
  const navigate = useNavigate();
  const { isThreadMuted, muteThread, unmuteThread, blockUser, unblockUser, isUserBlocked } = useSettings();
  const { togglePinThread, toggleArchiveThread } = useChat();
  const [menuOpen, setMenuOpen] = useState(false);

  const participant: ConversationParticipant | undefined = thread.participants[0];
  const isTyping = activeTyping?.threadId === thread.id;
  const isMuted = isThreadMuted(thread.id);
  const isBlocked = participant ? isUserBlocked(participant.id) : false;

  const handleToggleMute = () => {
    if (isMuted) {
      unmuteThread(thread.id);
    } else {
      muteThread(thread.id);
    }
    setMenuOpen(false);
  };

  const handleToggleBlock = () => {
    if (!participant) return;
    if (isBlocked) {
      unblockUser(participant.id);
    } else {
      blockUser(participant, 'Blocked from chat header');
    }
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-ah-surface/95 backdrop-blur-md border-b border-ah-border pt-[max(env(safe-area-inset-top),6px)] select-none">
      <div className="flex items-center justify-between px-3 h-14">
        {/* Back and Contact Info */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            type="button"
            onClick={() => navigate('/chats')}
            className="p-2 -ml-1 text-ah-muted hover:text-ah-text min-h-touch min-w-touch flex items-center justify-center rounded-full active:bg-ah-surface-2 transition-colors"
            aria-label="Back to inbox"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Avatar */}
          <div className="shrink-0">
            {participant ? (
              <Avatar
                config={participant.avatarConfig}
                size="sm"
                showStatusDot
                status={participant.status}
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-brand-900/60 border border-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-300">
                #
              </div>
            )}
          </div>

          {/* Name & Presence Subtitle */}
          <div className="flex flex-col min-w-0 flex-1 ml-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold truncate text-ah-text">
                {thread.title || participant?.displayName || 'Chat'}
              </span>
              {isMuted && <BellOff className="w-3 h-3 text-ah-muted shrink-0" />}
              {isBlocked && (
                <span className="text-[10px] bg-ah-surface-2 text-ah-text border border-red-800/60 px-1.5 rounded-sm">
                  Blocked
                </span>
              )}
            </div>

            <div className="text-[11px] truncate leading-tight">
              {isTyping ? (
                <span className="text-brand-400 font-medium animate-pulse flex items-center gap-1">
                  <span>typing</span>
                  <span className="inline-flex gap-0.5">
                    <span className="w-1 h-1 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </span>
              ) : participant?.statusMessage ? (
                <span className="text-ah-muted truncate">{participant.statusMessage}</span>
              ) : (
                <span className="text-ah-muted capitalize">{participant?.status || 'Active'}</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Menu */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-ah-muted hover:text-ah-text min-h-touch min-w-touch flex items-center justify-center rounded-full active:bg-ah-surface-2 transition-colors"
            aria-label="Conversation options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-12 w-52 bg-ah-surface-2 border border-ah-border rounded-2xl shadow-2xl py-1.5 z-50 text-xs text-ah-text animate-slide-up">
                <button
                  type="button"
                  onClick={handleToggleMute}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-ah-hover min-h-touch text-left transition-colors"
                >
                  {isMuted ? <Bell className="w-4 h-4 text-emerald-400" /> : <BellOff className="w-4 h-4 text-amber-400" />}
                  <span>{isMuted ? 'Unmute Notifications' : 'Mute Notifications'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    togglePinThread(thread.id);
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-ah-hover min-h-touch text-left transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-brand-400" />
                  <span>{thread.isPinned ? 'Unpin Conversation' : 'Pin Conversation'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    toggleArchiveThread(thread.id);
                    setMenuOpen(false);
                    navigate('/chats');
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-ah-hover min-h-touch text-left transition-colors"
                >
                  <Bookmark className="w-4 h-4 text-blue-400" />
                  <span>{thread.isArchived ? 'Unarchive' : 'Archive Thread'}</span>
                </button>

                {participant && (
                  <button
                    type="button"
                    onClick={handleToggleBlock}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-ah-hover min-h-touch text-left text-red-400 transition-colors border-t border-ah-border/60"
                  >
                    {isBlocked ? <Shield className="w-4 h-4 text-emerald-400" /> : <UserX className="w-4 h-4 text-red-400" />}
                    <span>{isBlocked ? 'Unblock Contact' : 'Block Contact'}</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
