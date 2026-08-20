import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, Paperclip, X, FileCode, Radio } from 'lucide-react';
import { Message } from '../../types';
import { useChat } from '../../context/ChatContext';

interface MessageComposerProps {
  threadId: string;
  onSendMessage: (content: string, replyTo?: Message) => void;
  replyingTo?: Message | null;
  onCancelReply?: () => void;
}

const QUICK_EMOJIS = ['👋', '🌙', '☕', '👀', '📻', '🤔', '🕯️', '🗝️', '📜', '⏳', '✨', '🖤'];

export const MessageComposer: React.FC<MessageComposerProps> = ({
  threadId,
  onSendMessage,
  replyingTo,
  onCancelReply,
}) => {
  const { loadThreadDraft, setThreadDraft } = useChat();
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load persistent draft on mount
  useEffect(() => {
    async function load() {
      const draft = await loadThreadDraft(threadId);
      setText(draft);
    }
    load();
  }, [threadId, loadThreadDraft]);

  // Adjust textarea height dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    setThreadDraft(threadId, val);
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSendMessage(trimmed, replyingTo || undefined);
    setText('');
    setThreadDraft(threadId, '');
    setShowEmojiPicker(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowEmojiPicker(false);
        setShowAttachmentModal(false);
      }
    };
    if (showEmojiPicker || showAttachmentModal) {
      window.addEventListener('keydown', handleGlobalKeyDown);
      return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }
  }, [showEmojiPicker, showAttachmentModal]);

  const handleEmojiClick = (emoji: string) => {
    const nextText = text + emoji;
    setText(nextText);
    setThreadDraft(threadId, nextText);
    textareaRef.current?.focus();
  };

  const handleSendSnippet = (snippetText: string) => {
    const nextText = text ? `${text}\n${snippetText}` : snippetText;
    setText(nextText);
    setThreadDraft(threadId, nextText);
    setShowAttachmentModal(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="sticky bottom-0 z-30 w-full bg-ah-surface/95 backdrop-blur-xl border-t border-ah-border pb-[max(env(safe-area-inset-bottom),10px)] select-none shadow-xl">
      {/* Replying Banner */}
      {replyingTo && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#252038] border-b border-[#382D52] text-xs">
          <div className="flex flex-col min-w-0 pr-2">
            <span className="text-[#8197FF] font-semibold text-[11px]">
              Replying to {replyingTo.senderName}
            </span>
            <span className="text-ah-muted truncate text-[11px]">{replyingTo.content}</span>
          </div>
          <button
            type="button"
            onClick={onCancelReply}
            className="p-1 text-ah-muted hover:text-ah-text min-h-touch min-w-touch flex items-center justify-center"
            aria-label="Cancel reply"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick Emoji Drawer */}
      {showEmojiPicker && (
        <div className="px-3 py-2 border-b border-ah-border flex items-center gap-2 overflow-x-auto no-scrollbar bg-ah-surface-2 animate-slide-up">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleEmojiClick(emoji)}
              className="text-lg p-1.5 min-h-touch min-w-touch flex items-center justify-center hover:scale-125 active:scale-95 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Main Composer Row */}
      <div className="flex items-end gap-2 px-3 pt-2.5">
        {/* Attachment Options */}
        <button
          type="button"
          onClick={() => setShowAttachmentModal(true)}
          className="p-2.5 text-ah-muted hover:text-ah-text min-h-touch min-w-touch flex items-center justify-center rounded-full active:bg-ah-surface-2 transition-colors shrink-0"
          aria-label="Attach file or archive record"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`p-2.5 min-h-touch min-w-touch flex items-center justify-center rounded-full transition-colors shrink-0 ${
            showEmojiPicker ? 'text-[#B979FF] bg-[#252038]' : 'text-ah-muted hover:text-ah-text active:bg-ah-surface-2'
          }`}
          aria-label="Toggle emoji picker"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Multiline Text Input */}
        <div className="flex-1 min-w-0 bg-ah-surface-2 border border-ah-border focus-within:border-[#B979FF] rounded-2xl px-3.5 py-2 transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full bg-transparent text-ah-text placeholder-[#91819A] text-sm resize-none outline-hidden leading-relaxed max-h-28 overflow-y-auto"
            aria-label="Message text composer"
          />
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim()}
          className={`p-2.5 rounded-2xl min-h-touch min-w-touch flex items-center justify-center transition-all shrink-0 ${
            text.trim()
              ? 'bg-gradient-to-r from-[#8197FF] to-[#B979FF] text-[#11101A] shadow-md shadow-[#8197FF]/20 active:scale-95 font-bold'
              : 'bg-ah-surface-2 text-ah-muted/40 cursor-not-allowed'
          }`}
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Attachment Modal */}
      {showAttachmentModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-3 animate-fade-in">
          <div className="w-full max-w-[400px] bg-ah-surface border border-ah-border rounded-3xl p-4 shadow-2xl space-y-3 animate-slide-up">
            <h3 className="text-xs font-semibold text-ah-muted tracking-wider uppercase font-mono">
              Attach System Resource
            </h3>
            
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleSendSnippet('[ATTACH: ARCHIVE_REF // 2008_HUSHROOMS_NODE_04]')}
                className="w-full p-3 rounded-xl bg-ah-surface-2 hover:bg-ah-hover flex items-center gap-3 min-h-touch text-left text-xs text-ah-text transition-colors"
              >
                <FileCode className="w-4 h-4 text-[#8197FF]" />
                <div>
                  <div className="font-semibold">Hushrooms 2008 Archive Hash</div>
                  <div className="text-[10px] text-ah-muted">Cryptographic checksum ref</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSendSnippet('[ATTACH: FREQ_RECORDING // 432Hz_RELAY_LOOP]')}
                className="w-full p-3 rounded-xl bg-ah-surface-2 hover:bg-ah-hover flex items-center gap-3 min-h-touch text-left text-xs text-ah-text transition-colors"
              >
                <Radio className="w-4 h-4 text-[#57C7C1]" />
                <div>
                  <div className="font-semibold">Relay Frequency Sample</div>
                  <div className="text-[10px] text-ah-muted">432 Hz harmonic capture</div>
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowAttachmentModal(false)}
              className="w-full py-3 rounded-xl border border-ah-border text-ah-muted hover:text-ah-text font-medium text-xs min-h-touch active:bg-ah-surface-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
