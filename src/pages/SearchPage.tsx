import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { useRooms } from '../context/RoomContext';
import { useArchive } from '../context/ArchiveContext';
import { TopBar } from '../components/layout/TopBar';
import { BottomNav } from '../components/layout/BottomNav';
import { Avatar } from '../components/common/Avatar';
import { Search, X, Hash, Bookmark, Layers } from 'lucide-react';
import { useContinuity } from '../context/ContinuityContext';

type SearchCategory = 'all' | 'people' | 'messages' | 'rooms' | 'archive' | 'bookmarks';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { threads, messages, bookmarks } = useChat();
  const { rooms } = useRooms();
  const { searchArchive } = useArchive();
  const { checkActionTrigger } = useContinuity();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [acrossAllVersions, setAcrossAllVersions] = useState(true);

  React.useEffect(() => {
    const q = query.toLowerCase().trim();
    if (q.includes('archive should keep this') || q.includes('keep this')) {
      checkActionTrigger('SEARCH_HUSHROOMS_QUOTE');
    }
    if (q.includes('c-0419-recur') || q.includes('recur')) {
      checkActionTrigger('SEARCH_THREAD_PERSISTENCE');
    }
  }, [query, checkActionTrigger]);

  // Search Computation
  const searchResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return null;

    // 1. People / Contacts
    const people = threads
      .flatMap((t) => t.participants)
      .filter((p) => p.displayName.toLowerCase().includes(q) || p.handle.toLowerCase().includes(q));
    const uniquePeople = Array.from(new Map(people.map((p) => [p.id, p])).values());

    // 2. Messages
    const matchedMessages: { threadId: string; threadTitle: string; content: string; senderName: string; timestamp: string }[] = [];
    for (const thread of threads) {
      const tMsgs = messages[thread.id] || [];
      for (const m of tMsgs) {
        if (m.content.toLowerCase().includes(q)) {
          matchedMessages.push({
            threadId: thread.id,
            threadTitle: thread.title || thread.participants[0]?.displayName || 'Chat',
            content: m.content,
            senderName: m.senderName,
            timestamp: m.timestamp,
          });
        }
      }
    }

    // 3. Rooms
    const matchedRooms = rooms.filter(
      (r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
    );

    // 4. Archive (if enabled)
    const archiveResults = acrossAllVersions
      ? searchArchive(q)
      : { messages: [], accounts: [] };

    // 5. Bookmarks
    const matchedBookmarks = bookmarks.filter(
      (b) => b.category.toLowerCase().includes(q) || (b.note && b.note.toLowerCase().includes(q))
    );

    return {
      people: uniquePeople,
      messages: matchedMessages,
      rooms: matchedRooms,
      archiveMessages: archiveResults.messages,
      archiveAccounts: archiveResults.accounts,
      bookmarks: matchedBookmarks,
    };
  }, [query, threads, messages, rooms, searchArchive, bookmarks, acrossAllVersions]);

  const hasResults = searchResults && (
    searchResults.people.length > 0 ||
    searchResults.messages.length > 0 ||
    searchResults.rooms.length > 0 ||
    searchResults.archiveMessages.length > 0 ||
    searchResults.archiveAccounts.length > 0 ||
    searchResults.bookmarks.length > 0
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#11101A] text-[#F4EEF8] pb-20">
      <TopBar title="Search Network" subtitle="Global Index & Archives" />

      {/* Search Input Bar */}
      <div className="p-3 space-y-2.5 bg-[#11101A] shrink-0 border-b border-[#2E2742]/60">
        <div className="flex items-center gap-2 bg-[#191625] border border-[#2E2742] focus-within:border-[#8197FF] focus-within:shadow-[0_0_12px_rgba(129,151,255,0.25)] rounded-2xl px-3.5 py-2.5 transition-all">
          <Search className="w-4 h-4 text-[#8197FF] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search people, messages, rooms, archives..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-[#F4EEF8] placeholder-[#91819A] outline-hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-[#91819A] hover:text-[#F4EEF8]"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Across All Versions Toggle */}
        <div className="flex items-center justify-between px-1 text-xs">
          <label className="flex items-center gap-2 text-[#91819A] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={acrossAllVersions}
              onChange={(e) => setAcrossAllVersions(e.target.checked)}
              className="rounded-sm text-[#8197FF] bg-[#211C30] border-[#2E2742] focus:ring-[#8197FF] w-3.5 h-3.5"
            />
            <span className="text-[11px] font-medium flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#8197FF]" />
              <span>Across All Versions (2001–2026)</span>
            </span>
          </label>
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'people', label: 'People' },
            { id: 'messages', label: 'Messages' },
            { id: 'rooms', label: 'Rooms' },
            { id: 'archive', label: 'Archive' },
            { id: 'bookmarks', label: 'Bookmarks' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id as SearchCategory)}
              className={`px-3.5 py-1 rounded-full text-xs font-medium min-h-touch whitespace-nowrap transition-all select-none ${
                activeCategory === tab.id
                  ? 'bg-gradient-to-r from-[#8197FF] to-[#57C7C1] text-[#11101A] font-bold shadow-xs'
                  : 'bg-[#191625] text-[#91819A] hover:text-[#F4EEF8] border border-[#2E2742]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Content */}
      <main className="flex-1 overflow-y-auto p-3 space-y-4">
        {!query.trim() ? (
          <div className="py-20 text-center text-[#91819A] space-y-2">
            <Search className="w-8 h-8 mx-auto text-[#91819A]/40 mb-2" />
            <p className="text-sm font-medium">Type to search AFTERHOURS</p>
            <p className="text-xs max-w-xs mx-auto">
              Find contacts, messages, frequencies, legacy board posts, or saved bookmarks.
            </p>
          </div>
        ) : !hasResults ? (
          <div className="py-20 text-center text-[#91819A] space-y-1">
            <p className="text-sm font-medium">No results found for "{query}"</p>
            <p className="text-xs">Try searching for keywords like "elena", "archive", "coffee", or "midnight".</p>
          </div>
        ) : (
          <>
            {/* PEOPLE SECTION */}
            {(activeCategory === 'all' || activeCategory === 'people') &&
              searchResults.people.length > 0 && (
                <div className="space-y-2">
                  <h2 className="text-[11px] font-semibold text-[#8197FF] uppercase tracking-wider px-1 font-mono">
                    People & Contacts ({searchResults.people.length})
                  </h2>
                  <div className="space-y-1.5">
                    {searchResults.people.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => navigate(`/chats/${threads.find((t) => t.participants.some((tp) => tp.id === p.id))?.id || 'thread_elena_dm'}`)}
                        className="p-3.5 bg-[#191625] hover:bg-[#211C30] border border-[#2E2742] hover:border-[#8197FF] rounded-2xl cursor-pointer flex items-center gap-3 active:scale-[0.99] transition-all shadow-sm"
                      >
                        <Avatar config={p.avatarConfig} size="sm" showStatusDot status={p.status} />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-white truncate">{p.displayName}</div>
                          <div className="text-[10px] text-[#91819A] font-mono">@{p.handle}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* MESSAGES SECTION */}
            {(activeCategory === 'all' || activeCategory === 'messages') &&
              searchResults.messages.length > 0 && (
                <div className="space-y-2">
                  <h2 className="text-[11px] font-semibold text-[#57C7C1] uppercase tracking-wider px-1 font-mono">
                    Conversation Messages ({searchResults.messages.length})
                  </h2>
                  <div className="space-y-1.5">
                    {searchResults.messages.map((m, idx) => (
                      <div
                        key={idx}
                        onClick={() => navigate(`/chats/${m.threadId}`)}
                        className="p-3.5 bg-[#191625] hover:bg-[#211C30] border border-[#2E2742] hover:border-[#57C7C1] rounded-2xl cursor-pointer space-y-1 active:scale-[0.99] transition-all shadow-sm"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white truncate">{m.threadTitle}</span>
                          <span className="text-[10px] text-[#91819A] font-mono">
                            {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-[#C9B9D2] line-clamp-2 leading-relaxed">{m.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* ROOMS SECTION */}
            {(activeCategory === 'all' || activeCategory === 'rooms') &&
              searchResults.rooms.length > 0 && (
                <div className="space-y-2">
                  <h2 className="text-[11px] font-semibold text-[#B979FF] uppercase tracking-wider px-1 font-mono">
                    Community Rooms ({searchResults.rooms.length})
                  </h2>
                  <div className="space-y-1.5">
                    {searchResults.rooms.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => navigate(`/rooms/${r.id}`)}
                        className="p-3.5 bg-[#191625] hover:bg-[#211C30] border border-[#2E2742] hover:border-[#B979FF] rounded-2xl cursor-pointer flex items-center justify-between active:scale-[0.99] transition-all shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-[#2D1B4E] border border-[#B979FF]/40 flex items-center justify-center text-[#B979FF]">
                            <Hash className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white">{r.name}</div>
                            <div className="text-[10px] text-[#B979FF] font-medium">{r.category}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* ARCHIVES SECTION */}
            {(activeCategory === 'all' || activeCategory === 'archive') &&
              searchResults.archiveMessages.length > 0 && (
                <div className="space-y-2">
                  <h2 className="text-[11px] font-semibold text-[#F0A06D] uppercase tracking-wider px-1 font-mono">
                    Legacy Archives ({searchResults.archiveMessages.length})
                  </h2>
                  <div className="space-y-1.5">
                    {searchResults.archiveMessages.map((am) => (
                      <div
                        key={am.id}
                        onClick={() => navigate(`/archive/${am.era}`)}
                        className="p-3.5 bg-[#1E1728] border border-[#482A52] rounded-2xl cursor-pointer space-y-1 active:scale-[0.99] transition-all shadow-sm"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#F0A06D]">Partition {am.era}</span>
                          <span className="text-[10px] text-[#91819A] font-mono">{am.timestamp}</span>
                        </div>
                        <p className="text-xs text-[#F4EEF8] font-mono leading-relaxed">{am.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* BOOKMARKS SECTION */}
            {(activeCategory === 'all' || activeCategory === 'bookmarks') &&
              searchResults.bookmarks.length > 0 && (
                <div className="space-y-2">
                  <h2 className="text-[11px] font-semibold text-[#D5AB5E] uppercase tracking-wider px-1 font-mono">
                    Saved Bookmarks ({searchResults.bookmarks.length})
                  </h2>
                  <div className="space-y-1.5">
                    {searchResults.bookmarks.map((bm) => (
                      <div
                        key={bm.id}
                        onClick={() => navigate(`/chats/${bm.threadId}`)}
                        className="p-3.5 bg-[#231D14] border border-[#4D3F28] rounded-2xl cursor-pointer space-y-1 active:scale-[0.99] transition-all shadow-sm"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#D5AB5E] flex items-center gap-1">
                            <Bookmark className="w-3 h-3 fill-current" />
                            <span>{bm.category}</span>
                          </span>
                          <span className="text-[10px] text-[#91819A] font-mono">{bm.savedAt.split('T')[0]}</span>
                        </div>
                        <p className="text-xs text-[#C9B9D2] leading-relaxed">{bm.note || 'Saved message bookmark'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};
