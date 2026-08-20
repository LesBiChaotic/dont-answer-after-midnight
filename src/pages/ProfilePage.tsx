import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthProfile } from '../context/AuthProfileContext';
import { Avatar } from '../components/common/Avatar';
import { TopBar } from '../components/layout/TopBar';
import { BottomNav } from '../components/layout/BottomNav';
import {
  Settings,
  Edit3,
  Sparkles,
  Bookmark,
  Shield,
  Code,
  Check,
  ShieldCheck,
  Trophy,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuthProfile();
  const { settings } = useSettings();

  const frameClass = {
    none: 'ring-ah-border',
    signal: 'ring-cyan-400 shadow-[0_0_24px_rgba(34,211,238,.4)]',
    archive: 'ring-amber-400 shadow-[0_0_24px_rgba(251,191,36,.4)]',
    'blood-moon': 'ring-rose-500 shadow-[0_0_24px_rgba(244,63,94,.4)]',
    continuity: 'ring-violet-400 shadow-[0_0_28px_rgba(167,139,250,.5)]',
  }[settings.profileFrame || 'none'];

  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [statusText, setStatusText] = useState(profile?.statusMessage || '');

  if (!profile) return null;

  const handleSaveStatus = async () => {
    await updateProfile({ statusMessage: statusText.trim() });
    setIsEditingStatus(false);
  };

  return (
    <div className="flex-1 flex flex-col app-viewport bg-ah-canvas text-ah-text pb-20">
      <TopBar
        title="Persona"
        subtitle="Identity & Controls"
        actions={
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="p-2 text-ah-muted hover:text-ah-text min-h-touch min-w-touch flex items-center justify-center rounded-full active:bg-ah-surface-2 transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Profile Identity Card (Luminous Halo + Distinct Tint) */}
        <div className="p-5 bg-gradient-to-b from-ah-surface-2 to-ah-surface border border-ah-border rounded-3xl space-y-4 shadow-xl text-center flex flex-col items-center">
          <div className="relative">
            <div className={`p-1 rounded-3xl ring-2 ${frameClass}`}>
              <Avatar config={profile.avatarConfig} size="xl" showStatusDot status="afterhours" />
            </div>
            <button
              type="button"
              onClick={() => navigate('/avatar')}
              className="absolute -bottom-1 -right-1 p-2 bg-gradient-to-r from-[#8197FF] to-[#B979FF] text-[#11101A] rounded-full shadow-lg min-h-touch min-w-touch flex items-center justify-center active:scale-95 transition-transform font-bold"
              title="Edit Avatar"
              aria-label="Edit Avatar"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-lg font-bold text-ah-text tracking-tight font-serif">{profile.displayName}</h2>
              {profile.ageConfirmedAdult && (
                <span title="Adult Verified">
                  <ShieldCheck className="w-4 h-4 text-[#69C49A]" />
                </span>
              )}
            </div>
            <p className="text-xs text-ah-text-2">
              @{profile.handle}
              {profile.pronouns && ` • ${profile.pronouns}`}
              {profile.genderIdentity && ` • ${profile.genderIdentity}`}
              {profile.sexuality && ` • ${profile.sexuality}`}
            </p>
            <div className="flex items-center justify-center gap-2 pt-0.5 text-[10px] text-ah-muted font-mono">
              <span>Joined: {new Date(profile.createdAt).toLocaleDateString([], { month: 'short', year: 'numeric' })}</span>
              <span>•</span>
              <span className="text-ah-periwinkle">Quiet Hours: {profile.quietHours || '00:00-08:00'}</span>
            </div>
          </div>

          {/* Inline Status Message */}
          <div className="w-full pt-1">
            {isEditingStatus ? (
              <div className="flex items-center gap-2 bg-ah-surface-2 border border-[#8197FF]/50 rounded-2xl p-1.5 shadow-inner">
                <input
                  type="text"
                  value={statusText}
                  onChange={(e) => setStatusText(e.target.value)}
                  placeholder="Set status message..."
                  className="flex-1 bg-transparent px-2.5 text-xs text-ah-text outline-hidden"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveStatus}
                  className="px-3 py-1.5 bg-[#8197FF] hover:bg-[#6F83E6] text-[#11101A] rounded-xl text-xs font-bold min-h-touch shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setStatusText(profile.statusMessage || '');
                  setIsEditingStatus(true);
                }}
                className="w-full px-3.5 py-2.5 bg-ah-surface-2/70 hover:bg-ah-surface-2 border border-ah-border rounded-2xl text-xs text-ah-muted hover:text-ah-text flex items-center justify-between min-h-touch transition-all shadow-xs"
              >
                <span className="truncate italic">
                  {profile.statusMessage ? `"${profile.statusMessage}"` : 'Tap to set status message...'}
                </span>
                <Edit3 className="w-3.5 h-3.5 ml-2 text-[#8197FF] shrink-0" />
              </button>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-xs text-ah-text-2 leading-relaxed max-w-xs">{profile.bio}</p>
          )}

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center pt-1">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 rounded-full bg-ah-surface-2 border border-ah-border text-[10px] text-ah-electric-lilac font-medium"
                >
                  #{interest}
                </span>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => navigate('/profile/edit')}
            className="w-full py-2.5 px-4 bg-ah-surface-2 hover:bg-ah-hover border border-ah-border text-ah-text rounded-xl text-xs font-semibold min-h-touch transition-colors shadow-xs"
          >
            Edit Profile Details
          </button>
        </div>

        {/* Navigation Quick Links (Different Restrained Tints per Category) */}
        <div className="bg-ah-surface border border-ah-border rounded-3xl overflow-hidden divide-y divide-ah-border/50 text-xs font-medium shadow-md">
          <button
            type="button"
            onClick={() => navigate('/cabinet')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-ah-surface-2 min-h-touch text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-ah-surface-3 border border-ah-primary/40 flex items-center justify-center text-ah-primary">
                <Trophy className="w-4 h-4" />
              </div>
              <span className="text-ah-text">Night Cabinet</span>
            </div>
            <span className="text-[11px] text-ah-primary font-semibold">Achievements</span>
          </button>
          {/* Avatar Builder (Lilac) */}
          <button
            type="button"
            onClick={() => navigate('/avatar')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-ah-surface-2 min-h-touch text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-ah-surface-3 border border-ah-electric-lilac/40 flex items-center justify-center text-ah-electric-lilac">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-ah-text">Vector Avatar Builder</span>
            </div>
            <span className="text-[11px] text-ah-electric-lilac font-semibold">Customize</span>
          </button>

          {/* Bookmarks (Gold) */}
          <button
            type="button"
            onClick={() => navigate('/bookmarks')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-ah-surface-2 min-h-touch text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-ah-surface-3 border border-ah-gold/40 flex items-center justify-center text-ah-gold">
                <Bookmark className="w-4 h-4" />
              </div>
              <span className="text-ah-text">Saved Bookmarks & Evidence</span>
            </div>
            <span className="text-[11px] text-ah-gold font-semibold">View</span>
          </button>

          {/* Safety (Rose) */}
          <button
            type="button"
            onClick={() => navigate('/safety')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-ah-surface-2 min-h-touch text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-ah-surface-3 border border-ah-rose/40 flex items-center justify-center text-ah-rose">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-ah-text">Safety & Block Controls</span>
            </div>
            <span className="text-[11px] text-ah-rose font-semibold">Manage</span>
          </button>

          {/* Settings (Teal) */}
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-ah-surface-2 min-h-touch text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-ah-surface-3 border border-ah-teal/40 flex items-center justify-center text-ah-teal">
                <Settings className="w-4 h-4" />
              </div>
              <span className="text-ah-text">Settings, Themes & Offline Sync</span>
            </div>
            <span className="text-[11px] text-ah-teal font-semibold">Configure</span>
          </button>

          {/* Internal Tools (Cold Violet) */}
          <button
            type="button"
            onClick={() => navigate('/internal')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-ah-surface-2 min-h-touch text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-ah-surface-3 border border-ah-info/40 flex items-center justify-center text-ah-info">
                <Code className="w-4 h-4" />
              </div>
              <span className="text-ah-text">Internal Continuity Tools</span>
            </div>
            <span className="text-[11px] text-ah-info font-mono font-semibold">DEV/ARG</span>
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};
