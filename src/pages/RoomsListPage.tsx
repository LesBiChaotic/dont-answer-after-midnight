import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRooms } from '../context/RoomContext';
import { TopBar } from '../components/layout/TopBar';
import { BottomNav } from '../components/layout/BottomNav';
import { Hash, Users, Check, Plus, Search } from 'lucide-react';

const getRoomAccent = (slug: string) => {
  switch (slug) {
    case 'night-owls':
      return { border: 'border-[#8197FF]/40', bg: 'bg-[#8197FF]/10', text: 'text-[#8197FF]', glow: 'hover:border-[#8197FF]' };
    case 'old-internet':
      return { border: 'border-[#F0A06D]/40', bg: 'bg-[#F0A06D]/10', text: 'text-[#F0A06D]', glow: 'hover:border-[#F0A06D]' };
    case 'urban-legends':
      return { border: 'border-[#57C7C1]/40', bg: 'bg-[#57C7C1]/10', text: 'text-[#57C7C1]', glow: 'hover:border-[#57C7C1]' };
    case 'book-club':
      return { border: 'border-[#E07DA5]/40', bg: 'bg-[#E07DA5]/10', text: 'text-[#E07DA5]', glow: 'hover:border-[#E07DA5]' };
    case 'soundscapes':
      return { border: 'border-[#B979FF]/40', bg: 'bg-[#B979FF]/10', text: 'text-[#B979FF]', glow: 'hover:border-[#B979FF]' };
    case 'quiet-hours':
      return { border: 'border-[#69C49A]/40', bg: 'bg-[#69C49A]/10', text: 'text-[#69C49A]', glow: 'hover:border-[#69C49A]' };
    default:
      return { border: 'border-[#57C7C1]/40', bg: 'bg-[#57C7C1]/10', text: 'text-[#57C7C1]', glow: 'hover:border-[#57C7C1]' };
  }
};

export const RoomsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { rooms, joinRoom, leaveRoom } = useRooms();
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'General', 'History & Archives', 'Folklore & Mystery', 'Rest & Wellness', 'Audio & Music', 'Literature', 'Technology', 'Food & Drink', 'Art & Writing', 'Support'];

  const filteredRooms = rooms.filter((room) => {
    const matchesCat = filterCategory === 'All' || room.category === filterCategory;
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#11101A] text-[#F4EEF8] pb-20">
      <TopBar title="Community Rooms" subtitle="11 Nocturnal Nodes" />

      {/* Search & Category Filter */}
      <div className="px-3 pt-3 space-y-2 shrink-0 bg-[#11101A]">
        <div className="flex items-center gap-2 bg-[#191625] border border-[#2E2742] focus-within:border-[#57C7C1] rounded-2xl px-3.5 py-2.5 transition-all">
          <Search className="w-4 h-4 text-[#91819A]" />
          <input
            type="text"
            placeholder="Search rooms and topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-[#F4EEF8] placeholder-[#91819A] outline-hidden"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium min-h-touch whitespace-nowrap transition-all select-none ${
                filterCategory === cat
                  ? 'bg-gradient-to-r from-[#57C7C1] to-[#8197FF] text-[#11101A] font-bold shadow-md shadow-[#57C7C1]/20'
                  : 'bg-[#191625] text-[#91819A] hover:text-[#F4EEF8] border border-[#2E2742]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Room Cards List */}
      <main className="flex-1 overflow-y-auto px-3 py-2 space-y-2.5">
        {filteredRooms.map((room) => {
          const accent = getRoomAccent(room.slug);
          return (
            <div
              key={room.id}
              onClick={() => navigate(`/rooms/${room.id}`)}
              className={`p-4 bg-[#191625] hover:bg-[#211C30] border ${accent.border} ${accent.glow} rounded-2xl cursor-pointer transition-all active:scale-[0.99] space-y-2.5 shadow-md`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${accent.bg} border ${accent.border} flex items-center justify-center ${accent.text}`}>
                    <Hash className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white leading-tight">{room.name}</h2>
                    <span className={`text-[10px] ${accent.text} font-medium tracking-wide`}>{room.category}</span>
                  </div>
                </div>

                {/* Join / Joined Pill */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (room.isJoined) {
                      leaveRoom(room.id);
                    } else {
                      joinRoom(room.id);
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold min-h-touch flex items-center gap-1 transition-all active:scale-95 ${
                    room.isJoined
                      ? 'bg-[#211C30] border border-[#2E2742] text-[#91819A] hover:text-[#E16F86]'
                      : 'bg-[#57C7C1] hover:bg-[#3F9B9A] text-[#11101A] shadow-xs'
                  }`}
                >
                  {room.isJoined ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#69C49A]" />
                      <span>Joined</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Join</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-[#C9B9D2] leading-relaxed line-clamp-2">
                {room.description}
              </p>

              {/* Footer Details */}
              <div className="flex items-center justify-between pt-1 border-t border-[#2E2742]/50 text-[11px] text-[#91819A] font-mono">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#57C7C1]" />
                  <span>{room.memberCount} members</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#69C49A] animate-pulse" />
                  <span>{room.onlineCount} online</span>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      <BottomNav />
    </div>
  );
};
