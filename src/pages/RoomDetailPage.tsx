import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRooms } from '../context/RoomContext';
import { useAuthProfile } from '../context/AuthProfileContext';
import { TopBar } from '../components/layout/TopBar';
import { Pin, Shield, Info, Send, ArrowLeft } from 'lucide-react';
import { useContinuity } from '../context/ContinuityContext';

export const RoomDetailPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { getRoomById, roomMessages, sendRoomMessage, joinRoom } = useRooms();
  const { profile } = useAuthProfile();
  const { checkActionTrigger } = useContinuity();

  const [messageText, setMessageText] = useState('');
  const [showRules, setShowRules] = useState(false);
  const [showPinned, setShowPinned] = useState(true);

  React.useEffect(() => {
    if (roomId === 'room_old_internet') {
      checkActionTrigger('VIEW_OLD_INTERNET_ROOM');
    }
  }, [roomId, checkActionTrigger]);

  const room = getRoomById(roomId || '');
  const messages = room ? roomMessages[room.id] || [] : [];

  if (!room) {
    return (
      <div className="app-viewport flex-1 flex flex-col items-center justify-center p-6 text-center bg-night-bg text-night-text">
        <h2 className="text-base font-semibold mb-1">Room Not Found</h2>
        <p className="text-xs text-night-muted mb-4">This room channel may not exist or has been privatized.</p>
        <button
          type="button"
          onClick={() => navigate('/rooms')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-night-card border border-night-border text-xs font-medium text-night-text"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Rooms</span>
        </button>
      </div>
    );
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    await sendRoomMessage(room.id, messageText);
    setMessageText('');
  };

  return (
    <div className="app-viewport flex-1 flex flex-col max-h-[100dvh] bg-night-bg text-night-text overflow-hidden">
      {/* Top Header */}
      <TopBar
        showBack
        title={`#${room.name}`}
        subtitle={
          <span className="flex items-center gap-2">
            <span>{room.onlineCount} online</span>
            <span>•</span>
            <span className="text-brand-400">{room.category}</span>
          </span>
        }
        actions={
          <button
            type="button"
            onClick={() => setShowRules(!showRules)}
            className="p-2 text-night-muted hover:text-night-text min-h-touch min-w-touch flex items-center justify-center rounded-full active:bg-night-card"
            title="Room Rules & Info"
          >
            <Info className="w-5 h-5" />
          </button>
        }
      />

      {/* Rules Disclosure Panel */}
      {showRules && (
        <div className="p-4 bg-night-card border-b border-night-border text-xs space-y-3 animate-slide-up select-none">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-brand-400" />
              <span>Room Guidelines & Safety</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowRules(false)}
              className="text-xs text-night-muted hover:text-white"
            >
              Dismiss
            </button>
          </div>
          <p className="text-night-muted leading-relaxed">{room.description}</p>
          <div className="space-y-1.5 pt-1">
            {room.rules.map((rule) => (
              <div key={rule.id} className="flex items-start gap-2 text-night-text">
                <span className="font-mono text-brand-400 font-bold">{rule.number}.</span>
                <span>{rule.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pinned Post Card */}
      {room.pinnedPost && showPinned && (
        <div className="px-3 py-2 bg-brand-950/30 border-b border-brand-900/40 text-xs flex items-start justify-between gap-2 shrink-0">
          <div className="flex items-start gap-2 min-w-0">
            <Pin className="w-3.5 h-3.5 text-brand-400 mt-0.5 shrink-0 fill-current" />
            <div className="min-w-0">
              <span className="font-semibold text-brand-300 mr-1.5 text-[11px]">
                {room.pinnedPost.authorName}:
              </span>
              <span className="text-night-text text-[11px] leading-snug">{room.pinnedPost.content}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowPinned(false)}
            className="text-[10px] text-night-muted hover:text-night-text shrink-0 p-1"
          >
            Hide
          </button>
        </div>
      )}

      {/* Room Feed */}
      <main className="flex-1 overflow-y-auto p-3 space-y-3 overscroll-contain">
        {messages.length === 0 ? (
          <div className="py-20 text-center text-night-muted space-y-1">
            <p className="text-sm font-medium">Room frequency quiet.</p>
            <p className="text-xs">Be the first to post a message into #{room.name}.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === (profile?.id || 'user_player');
            const timeStr = new Date(msg.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div key={msg.id} className="flex flex-col space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-brand-300">
                    {msg.senderName}
                  </span>
                  <span className="text-[10px] text-night-muted">@{msg.senderHandle}</span>
                  <span className="text-[10px] text-night-muted ml-auto">{timeStr}</span>
                </div>
                <div className={`p-3 border rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                  isMe ? 'bg-brand-950/30 border-brand-800/60 text-brand-100' : 'bg-night-card border-night-border text-night-text'
                }`}>
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Room Composer / Join Prompt */}
      {room.isJoined ? (
        <form
          onSubmit={handleSend}
          className="p-3 bg-night-surface border-t border-night-border flex items-center gap-2 shrink-0 pb-[max(env(safe-area-inset-bottom),10px)]"
        >
          <input
            type="text"
            placeholder={`Message #${room.name}...`}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-night-card border border-night-border focus:border-brand-500 rounded-2xl text-xs text-night-text placeholder-night-muted outline-none min-h-touch"
          />
          <button
            type="submit"
            disabled={!messageText.trim()}
            className={`p-2.5 rounded-2xl min-h-touch min-w-touch flex items-center justify-center transition-all ${
              messageText.trim()
                ? 'bg-brand-600 hover:bg-brand-500 text-white active:scale-95'
                : 'bg-night-card text-night-muted/40 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <div className="p-4 bg-night-surface border-t border-night-border text-center space-y-2 pb-[max(env(safe-area-inset-bottom),14px)]">
          <p className="text-xs text-night-muted">You are viewing #{room.name} in read-only mode.</p>
          <button
            type="button"
            onClick={() => joinRoom(room.id)}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold min-h-touch shadow-md active:scale-95 transition-transform"
          >
            Join Room to Post
          </button>
        </div>
      )}
    </div>
  );
};
