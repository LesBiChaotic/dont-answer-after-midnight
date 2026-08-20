import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { useAuthProfile } from '../context/AuthProfileContext';
import { ThreadHeader } from '../components/chat/ThreadHeader';
import { MessageList } from '../components/chat/MessageList';
import { MessageComposer } from '../components/chat/MessageComposer';
import { FinalEncounterModal } from '../components/chat/FinalEncounterModal';
import { Message } from '../types';
import { ArrowLeft, Sparkles, Moon } from 'lucide-react';

export const ChatThreadPage: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
  const {
    getThreadById,
    messages,
    activeTyping,
    bookmarks,
    sendMessage,
    markThreadRead,
    setActiveThreadId,
  } = useChat();
  const { profile } = useAuthProfile();

  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showFinalModal, setShowFinalModal] = useState(false);

  const currentThreadId = threadId || '';
  const thread = getThreadById(currentThreadId);
  const threadMessages = messages[currentThreadId] || [];

  useEffect(() => {
    if (currentThreadId) {
      setActiveThreadId(currentThreadId);
      markThreadRead(currentThreadId);
    }
    return () => {
      setActiveThreadId(null);
    };
  }, [currentThreadId, markThreadRead, setActiveThreadId]);

  if (!thread) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-night-bg text-night-text min-h-screen">
        <h2 className="text-base font-semibold mb-1">Conversation Not Found</h2>
        <p className="text-xs text-night-muted mb-4">
          This thread frequency may have expired or been archived.
        </p>
        <button
          type="button"
          onClick={() => navigate('/chats')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-night-card border border-night-border text-xs font-medium text-night-text hover:bg-night-hover min-h-touch"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Inbox</span>
        </button>
      </div>
    );
  }

  const handleSendMessage = async (content: string, replyTo?: Message) => {
    const replySnippet = replyTo
      ? { senderName: replyTo.senderName, text: replyTo.content }
      : undefined;

    await sendMessage(currentThreadId, content, replyTo?.id, replySnippet);
    setReplyingTo(null);
  };

  return (
    <div className="flex-1 flex flex-col h-screen max-h-screen bg-night-bg text-night-text overflow-hidden">
      {/* Header */}
      <ThreadHeader thread={thread} activeTyping={activeTyping} />

      {/* Special Continuity Banner for @beforeyou */}
      {currentThreadId === 'thread_beforeyou_dm' && (
        <div className="px-3 py-2 bg-brand-950/70 border-b border-brand-800/60 flex items-center justify-between animate-fade-in shrink-0">
          <div className="flex items-center gap-2 text-xs text-brand-200">
            <Moon className="w-4 h-4 text-brand-400 shrink-0" />
            <span className="truncate">Historical Backfill Active (2001–2026)</span>
          </div>
          <button
            type="button"
            onClick={() => setShowFinalModal(true)}
            className="px-2.5 py-1 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 shrink-0 min-h-touch"
          >
            <Sparkles className="w-3 h-3" />
            <span>Final Choice</span>
          </button>
        </div>
      )}

      {/* Message List */}
      <MessageList
        threadId={currentThreadId}
        messages={threadMessages}
        currentUserId={profile?.id || 'user_player'}
        bookmarks={bookmarks}
        onReplyMessage={(msg) => setReplyingTo(msg)}
      />

      {/* Composer */}
      <MessageComposer
        threadId={currentThreadId}
        onSendMessage={handleSendMessage}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
      />

      {/* Final Encounter Modal */}
      {showFinalModal && (
        <FinalEncounterModal onClose={() => setShowFinalModal(false)} />
      )}
    </div>
  );
};
