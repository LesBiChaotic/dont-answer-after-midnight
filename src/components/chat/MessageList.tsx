import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Message, MessageBookmark } from '../../types';
import { MessageBubble } from './MessageBubble';
import { ArrowDown } from 'lucide-react';

interface MessageListProps {
  threadId: string;
  messages: Message[];
  currentUserId: string;
  bookmarks: MessageBookmark[];
  onReplyMessage?: (message: Message) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  threadId,
  messages,
  currentUserId,
  bookmarks,
  onReplyMessage,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef<boolean>(true);
  const prevMessagesLengthRef = useRef<number>(messages.length);

  const [isScrolledUp, setIsScrolledUp] = useState<boolean>(false);
  const [unreadNewCount, setUnreadNewCount] = useState<number>(0);

  // Scroll to bottom helper
  const scrollToBottom = useCallback((smooth = true) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
      setIsScrolledUp(false);
      setUnreadNewCount(0);
      isNearBottomRef.current = true;
    }
  }, []);

  // Handle scroll events to detect if user is reading older messages
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    const nearBottom = distanceFromBottom < 100;
    isNearBottomRef.current = nearBottom;

    if (nearBottom) {
      setIsScrolledUp(false);
      setUnreadNewCount(0);
    } else {
      setIsScrolledUp(true);
    }

    // Save scroll position
    sessionStorage.setItem(`afterhours_scroll_${threadId}`, String(scrollTop));
  }, [threadId]);

  // Restore scroll position on initial load
  useEffect(() => {
    const savedScroll = sessionStorage.getItem(`afterhours_scroll_${threadId}`);
    if (savedScroll && containerRef.current) {
      containerRef.current.scrollTop = Number(savedScroll);
    } else {
      scrollToBottom(false);
    }
    prevMessagesLengthRef.current = messages.length;
  }, [threadId, scrollToBottom]);

  // Handle incoming messages without yanking scroll if scrolled up
  useEffect(() => {
    const newCount = messages.length - prevMessagesLengthRef.current;

    if (newCount > 0) {
      if (isNearBottomRef.current) {
        // User was at bottom -> smooth scroll to bottom
        scrollToBottom(true);
      } else {
        // User was reading older history -> DO NOT YANK! Show floating chip
        setUnreadNewCount((prev) => prev + newCount);
      }
    }

    prevMessagesLengthRef.current = messages.length;
  }, [messages, scrollToBottom]);

  // Date separator grouping helper
  const renderMessagesWithDates = () => {
    let lastDateStr = '';

    return messages.map((msg, index) => {
      const msgDate = new Date(msg.timestamp).toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      const showDateSeparator = msgDate !== lastDateStr;
      lastDateStr = msgDate;

      const isUser = msg.senderId === currentUserId;
      const bookmark = bookmarks.find((b) => b.messageId === msg.id);

      return (
        <React.Fragment key={msg.id || index}>
          {showDateSeparator && (
            <div className="flex items-center justify-center my-3">
              <span className="text-[10px] font-mono font-medium tracking-wide uppercase px-3 py-1 rounded-full bg-[#191625] border border-[#2E2742] text-[#91819A] shadow-xs">
                {msgDate}
              </span>
            </div>
          )}
          <MessageBubble
            message={msg}
            isUser={isUser}
            onReply={onReplyMessage}
            bookmark={bookmark}
          />
        </React.Fragment>
      );
    });
  };

  return (
    <div className="relative flex-1 min-h-0 flex flex-col">
      {/* Scrollable message container with ARIA log live region */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 overscroll-contain"
        tabIndex={0}
        role="log"
        aria-live="polite"
        aria-label="Message Conversation History"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#91819A]">
            <p className="text-sm font-medium">No messages in this frequency yet.</p>
            <p className="text-xs mt-1">Send a message below to begin the exchange.</p>
          </div>
        ) : (
          renderMessagesWithDates()
        )}
      </div>

      {/* Floating New Messages Chip (Non-intrusive scroll safety) */}
      {isScrolledUp && unreadNewCount > 0 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 animate-fade-in">
          <button
            type="button"
            onClick={() => scrollToBottom(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8197FF] to-[#B979FF] text-[#11101A] rounded-full shadow-xl shadow-[#8197FF]/30 text-xs font-bold tracking-wide min-h-touch active:scale-95 transition-all"
            aria-label="Scroll to newest messages"
          >
            <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>
              {unreadNewCount} {unreadNewCount === 1 ? 'new message' : 'new messages'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
