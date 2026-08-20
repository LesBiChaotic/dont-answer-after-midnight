import React, { useState, useEffect } from 'react';
import {
  Message,
  MessageBookmark,
  BookmarkCategory,
} from '../../types';
import {
  Check,
  CheckCheck,
  Bookmark,
  Play,
  Pause,
  FileText,
  Copy,
  CornerUpLeft,
  X,
  History,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useContinuity } from '../../context/ContinuityContext';
import { MessageEditHistoryModal } from './MessageEditHistoryModal';
import { useNavigate } from 'react-router-dom';

interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
  onReply?: (message: Message) => void;
  bookmark?: MessageBookmark;
}

const EMOJI_OPTIONS = ['❤️', '👍', '👀', '☕', '📻', '🌙'];
const BOOKMARK_CATEGORIES: BookmarkCategory[] = ['Important', 'Evidence', 'Strange', 'Funny', 'Personal'];

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isUser,
  onReply,
  bookmark,
}) => {
  const navigate = useNavigate();
  const { addReaction, bookmarkMessage, removeBookmark } = useChat();
  const { checkActionTrigger } = useContinuity();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showBookmarkPicker, setShowBookmarkPicker] = useState(false);
  const [showEditHistory, setShowEditHistory] = useState(false);
  const [bookmarkNote, setBookmarkNote] = useState('');
  const [copied, setCopied] = useState(false);

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCopyText = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowActionModal(false);
    }, 1200);
  };

  const handleSaveBookmark = (cat: BookmarkCategory) => {
    bookmarkMessage(message.id, message.threadId, cat, undefined, bookmarkNote);
    setShowBookmarkPicker(false);
    setShowActionModal(false);
  };

  const handleToggleBookmark = () => {
    if (bookmark) {
      removeBookmark(bookmark.id);
      setShowActionModal(false);
    } else {
      setShowBookmarkPicker(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowActionModal(false);
        setShowBookmarkPicker(false);
        setShowEditHistory(false);
      }
    };
    if (showActionModal || showBookmarkPicker || showEditHistory) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [showActionModal, showBookmarkPicker, showEditHistory]);

  return (
    <>
      <div
        className={`flex flex-col my-1.5 select-text ${
          isUser ? 'items-end ml-10' : 'items-start mr-10'
        }`}
      >
        {/* Reply Reference Quote */}
        {message.replySnippet && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (message.replySnippet?.text.includes('archive should keep this')) {
                checkActionTrigger('SEARCH_HUSHROOMS_QUOTE');
                navigate('/search');
              }
            }}
            className={`text-xs px-3 py-1.5 mb-1 rounded-xl border max-w-[85%] truncate cursor-pointer active:scale-95 transition-all border-l-2 ${
              isUser
                ? 'bg-ah-surface-2 border-l-[#8197FF] border-[#382D52] text-ah-text-2'
                : 'bg-ah-surface border-l-[#8197FF] border-ah-border text-ah-muted hover:text-ah-text'
            }`}
          >
            <div className="font-semibold text-[10px] text-[#8197FF]">
              Replying to {message.replySnippet.senderName}
            </div>
            <div className="truncate">{message.replySnippet.text}</div>
          </div>
        )}

        {/* Bubble Container */}
        <div
          onClick={() => setShowActionModal(true)}
          className={`relative px-4 py-2.5 rounded-2xl cursor-pointer max-w-full break-words shadow-md transition-all active:scale-[0.99] ${
            isUser
              ? 'bg-gradient-to-br from-ah-primary to-ah-electric-lilac text-ah-text border border-[#4E347A] rounded-br-xs'
              : 'bg-ah-surface-3 text-ah-text border border-ah-border rounded-bl-xs'
          }`}
        >
          {/* Bookmark Badge */}
          {bookmark && (
            <div
              className={`absolute -top-2 ${
                isUser ? '-left-2' : '-right-2'
              } bg-[#D5AB5E] text-[#11101A] p-1 rounded-full shadow-md`}
              title={`Bookmarked: ${bookmark.category}`}
            >
              <Bookmark className="w-2.5 h-2.5 fill-current" />
            </div>
          )}

          {/* Voice Note Module */}
          {message.voiceNote && (
            <div className="space-y-2 mb-2 p-2.5 rounded-xl bg-ah-canvas/60 border border-ah-border">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPlayingAudio(!isPlayingAudio);
                  }}
                  className="w-8 h-8 rounded-full bg-[#8197FF] hover:bg-[#6F83E6] text-[#11101A] flex items-center justify-center min-h-touch min-w-touch shrink-0 shadow font-bold"
                  aria-label={isPlayingAudio ? 'Pause voice note' : 'Play voice note'}
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                {/* Waveform Visualization */}
                <div className="flex items-center gap-1 flex-1 h-6">
                  {message.voiceNote.waveform.map((val, idx) => (
                    <div
                      key={idx}
                      className={`w-1 rounded-full transition-all ${
                        isPlayingAudio
                          ? 'bg-[#8197FF] animate-pulse'
                          : 'bg-[#91819A]/50'
                      }`}
                      style={{
                        height: `${Math.max(20, (val / 100) * 100)}%`,
                        animationDelay: `${idx * 80}ms`,
                      }}
                    />
                  ))}
                </div>

                <span className="text-[11px] font-mono text-ah-muted shrink-0">
                  {message.voiceNote.durationSeconds}s
                </span>
              </div>

              {/* Transcript Toggle */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTranscript(!showTranscript);
                }}
                className="w-full text-left text-[11px] font-medium text-[#8197FF] hover:text-[#B979FF] flex items-center gap-1 pt-1"
              >
                <FileText className="w-3 h-3" />
                <span>{showTranscript ? 'Hide transcript' : 'View transcript'}</span>
              </button>

              {showTranscript && (
                <p className="text-xs italic bg-ah-surface p-2.5 rounded-lg text-ah-text-2 border-l-2 border-[#8197FF]">
                  "{message.voiceNote.transcriptText}"
                </p>
              )}
            </div>
          )}

          {/* Message Text Body (Comfortable 16-17px on mobile) */}
          <p className="text-[15px] sm:text-[16px] leading-relaxed whitespace-pre-wrap font-normal">
            {message.content}
          </p>

          {/* Timestamp and Delivery Status */}
          <div className="flex items-center justify-end gap-1.5 mt-1 text-[10px] text-ah-muted font-mono">
            {message.isEdited && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditHistory(true);
                }}
                className="hover:underline flex items-center gap-0.5 text-[#8197FF]"
              >
                <History className="w-2.5 h-2.5" />
                <span>edited</span>
              </button>
            )}

            <span>{formattedTime}</span>

            {isUser && (
              <span>
                {message.status === 'read' ? (
                  <CheckCheck className="w-3.5 h-3.5 text-[#8197FF] stroke-[2.5]" />
                ) : message.status === 'delivered' ? (
                  <CheckCheck className="w-3.5 h-3.5 text-ah-muted" />
                ) : message.status === 'sent' ? (
                  <Check className="w-3.5 h-3.5 text-ah-muted" />
                ) : message.status === 'continuity_unresolved' ? (
                  <span className="text-[9px] bg-ah-surface-2 px-1 rounded text-[#8FA9FF] font-mono border border-[#3E4663]">
                    Continuity
                  </span>
                ) : (
                  <span className="w-2 h-2 rounded-full border border-white/60 border-t-transparent animate-spin inline-block" />
                )}
              </span>
            )}
          </div>
        </div>

        {/* Reactions List */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1 px-1">
            {Array.from(new Set(message.reactions.map((r) => r.emoji))).map((emoji) => {
              const count = message.reactions.filter((r) => r.emoji === emoji).length;
              return (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => addReaction(message.id, message.threadId, emoji)}
                  className="px-2 py-0.5 rounded-full bg-ah-surface-2 border border-ah-border hover:border-[#8197FF] text-xs flex items-center gap-1 active:scale-90 transition-all shadow-xs"
                >
                  <span>{emoji}</span>
                  <span className="text-[10px] text-ah-text-2 font-mono">{count}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Message Action Modal */}
      {showActionModal && (
        <div
          onClick={() => setShowActionModal(false)}
          className="fixed inset-0 z-50 bg-ah-surface-3 backdrop-blur-xs flex items-end justify-center p-3 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[400px] bg-ah-surface border border-ah-border rounded-3xl p-4 space-y-4 animate-slide-up shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-ah-border pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-ah-muted">
                Message Options
              </span>
              <button
                type="button"
                onClick={() => setShowActionModal(false)}
                className="p-1 rounded-full text-ah-muted hover:text-ah-text min-h-touch min-w-touch flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Emoji Bar */}
            <div className="flex items-center justify-around bg-ah-surface-2 p-2 rounded-2xl border border-ah-border">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    addReaction(message.id, message.threadId, emoji);
                    setShowActionModal(false);
                  }}
                  className="text-xl p-2 rounded-xl hover:bg-ah-hover active:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-2 gap-2">
              {onReply && (
                <button
                  type="button"
                  onClick={() => {
                    onReply(message);
                    setShowActionModal(false);
                  }}
                  className="flex items-center gap-2 p-3 bg-ah-surface-2 hover:bg-ah-hover rounded-xl text-xs font-medium text-ah-text min-h-touch"
                >
                  <CornerUpLeft className="w-4 h-4 text-[#8197FF]" />
                  <span>Reply</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleCopyText}
                className="flex items-center gap-2 p-3 bg-ah-surface-2 hover:bg-ah-hover rounded-xl text-xs font-medium text-ah-text min-h-touch"
              >
                <Copy className="w-4 h-4 text-[#57C7C1]" />
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleBookmark}
                className="flex items-center gap-2 p-3 bg-ah-surface-2 hover:bg-ah-hover rounded-xl text-xs font-medium text-ah-text min-h-touch"
              >
                <Bookmark className="w-4 h-4 text-[#D5AB5E]" />
                <span>{bookmark ? 'Remove Bookmark' : 'Bookmark'}</span>
              </button>

              {message.isEdited && (
                <button
                  type="button"
                  onClick={() => {
                    setShowActionModal(false);
                    setShowEditHistory(true);
                  }}
                  className="flex items-center gap-2 p-3 bg-ah-surface-2 hover:bg-ah-hover rounded-xl text-xs font-medium text-ah-text min-h-touch"
                >
                  <History className="w-4 h-4 text-[#B979FF]" />
                  <span>Edit History</span>
                </button>
              )}
            </div>

            {/* Bookmark Tag Selector */}
            {showBookmarkPicker && (
              <div className="p-3 bg-ah-surface-2 border border-ah-border rounded-2xl space-y-3">
                <span className="text-xs font-medium text-ah-text block">Select Category</span>
                <div className="flex flex-wrap gap-1.5">
                  {BOOKMARK_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleSaveBookmark(cat)}
                      className="px-3 py-1.5 rounded-xl bg-ah-surface hover:bg-[#8197FF] hover:text-[#11101A] border border-ah-border text-xs text-ah-text-2 font-medium active:scale-95"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Optional bookmark note..."
                  value={bookmarkNote}
                  onChange={(e) => setBookmarkNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-ah-surface border border-ah-border rounded-xl text-ah-text focus:outline-hidden focus:border-[#8197FF]"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit History Modal */}
      {showEditHistory && (
        <MessageEditHistoryModal
          message={message}
          onClose={() => setShowEditHistory(false)}
        />
      )}
    </>
  );
};
