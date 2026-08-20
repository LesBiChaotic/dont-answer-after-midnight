import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { TopBar } from '../components/layout/TopBar';
import { BottomNav } from '../components/layout/BottomNav';
import { Bookmark, Trash2, ArrowRight, CornerDownRight, Clock } from 'lucide-react';
import { BookmarkCategory } from '../types';
import { useContinuity } from '../context/ContinuityContext';

const CATEGORIES: ('All' | BookmarkCategory)[] = ['All', 'Important', 'Evidence', 'Strange', 'Funny', 'Personal'];

export const BookmarksPage: React.FC = () => {
  const navigate = useNavigate();
  const { bookmarks, removeBookmark, messages, threads } = useChat();
  const { checkActionTrigger } = useContinuity();
  const [selectedCategory, setSelectedCategory] = useState<'All' | BookmarkCategory>('All');

  React.useEffect(() => {
    const hasOurList = bookmarks.some((b) => b.id === 'bm_our_list' || b.customTag === 'OUR LIST');
    if (hasOurList) {
      checkActionTrigger('INSPECT_OUR_LIST_BOOKMARK');
    }
  }, [bookmarks, checkActionTrigger]);

  const enrichedBookmarks = bookmarks.map((bm) => {
    const threadMsgs = messages[bm.threadId] || [];
    const targetMsg = threadMsgs.find((m) => m.id === bm.messageId);
    const thread = threads.find((t) => t.id === bm.threadId);
    return {
      ...bm,
      message: targetMsg,
      threadTitle: thread?.title || thread?.participants[0]?.displayName || 'Conversation',
    };
  });

  const filteredBookmarks = enrichedBookmarks.filter(
    (b) => selectedCategory === 'All' || b.category === selectedCategory
  );

  return (
    <div className="flex-1 flex flex-col app-viewport bg-ah-canvas text-ah-text pb-20">
      <TopBar title="Bookmarks & Evidence" subtitle="Saved Notes & Logs" showBack />

      {/* Categories Filter */}
      <div className="flex gap-1.5 px-3 py-2.5 overflow-x-auto no-scrollbar border-b border-ah-border/60 shrink-0 bg-ah-canvas">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium min-h-touch whitespace-nowrap transition-all select-none ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-[#D5AB5E] to-[#F0A06D] text-[#11101A] font-bold shadow-xs'
                : 'bg-ah-surface text-ah-muted hover:text-ah-text border border-ah-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Bookmarks List */}
      <main className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredBookmarks.length === 0 ? (
          <div className="py-20 text-center text-ah-muted space-y-2">
            <Bookmark className="w-8 h-8 mx-auto text-ah-muted/40 mb-2" />
            <p className="text-sm font-medium">No saved bookmarks in this category.</p>
            <p className="text-xs max-w-xs mx-auto">
              Tap any message in a chat to bookmark it for future investigation.
            </p>
          </div>
        ) : (
          filteredBookmarks.map((item) => {
            const isOurList = item.id === 'bm_our_list' || item.customTag === 'OUR LIST';
            return (
              <div
                key={item.id}
                className={`p-4 rounded-3xl space-y-3 shadow-md border ${
                  isOurList
                    ? 'bg-[#21182B] border-[#8FA9FF]/50 shadow-[0_0_16px_rgba(143,169,255,0.15)]'
                    : 'bg-[#201A15] border-[#4D3F28]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isOurList
                      ? 'bg-[#2D1E42] text-[#8FA9FF] border border-[#8FA9FF]/40'
                      : 'bg-[#362B1A] text-[#D5AB5E] border border-[#D5AB5E]/40'
                  }`}>
                    {item.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeBookmark(item.id)}
                    className="p-1.5 text-ah-muted hover:text-[#E16F86] min-h-touch min-w-touch flex items-center justify-center transition-colors"
                    aria-label="Remove bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Message quote */}
                <div className="p-3.5 bg-[#15121B] border border-ah-border rounded-2xl text-xs text-ah-text leading-relaxed select-text space-y-1">
                  <div className="font-semibold text-[#8197FF] text-[11px]">
                    {item.message?.senderName || 'Contact'}:
                  </div>
                  <p className="italic whitespace-pre-wrap">
                    "{item.message?.content || 'Archived message content'}"
                  </p>
                </div>

                {/* Note */}
                {item.note && (
                  <div className="text-xs text-ah-text-2 flex items-start gap-1.5 pt-1">
                    <CornerDownRight className="w-3.5 h-3.5 text-[#D5AB5E] shrink-0 mt-0.5" />
                    <p className="whitespace-pre-wrap">{item.note}</p>
                  </div>
                )}

                {/* Footer Metadata */}
                <div className="flex items-center justify-between pt-2 border-t border-ah-border/50 text-[10px] text-ah-muted font-mono">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#D5AB5E]" />
                    <span>Saved: {new Date(item.savedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/chats/${item.threadId}`)}
                    className="text-[#8197FF] hover:text-[#B979FF] flex items-center gap-1 font-semibold min-h-touch"
                  >
                    <span>Open thread</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </main>

      <BottomNav />
    </div>
  );
};
