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
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuthProfile();

  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [statusText, setStatusText] = useState(profile?.statusMessage || '');

  if (!profile) return null;

  const handleSaveStatus = async () => {
    await updateProfile({ statusMessage: statusText.trim() });
    setIsEditingStatus(false);
  };

  return (
    <div className="flex-1 flex flex-col app-viewport bg-[#11101A] text-[#F4EEF8] pb-20">
      <TopBar
        title="Persona"
        subtitle="Identity & Controls"
        actions={
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="p-2 text-[#91819A] hover:text-[#F4EEF8] min-h-touch min-w-touch flex items-center justify-center rounded-full active:bg-[#211C30] transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Profile Identity Card (Luminous Halo + Distinct Tint) */}
        <div className="p-5 bg-gradient-to-b from-[#1E162B] to-[#191625] border border-[#3E2954] rounded-3xl space-y-4 shadow-xl text-center flex flex-col items-center">
          <div className="relative">
            <div className="p-1 rounded-3xl ring-2 ring-[#B979FF]/40 shadow-[0_0_24px_rgba(185,121,255,0.3)]">
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
              <h2 className="text-lg font-bold text-white tracking-tight font-serif">{profile.displayName}</h2>
              {profile.ageConfirmedAdult && (
                <span title="Adult Verified">
                  <ShieldCheck className="w-4 h-4 text-[#69C49A]" />
                </span>
              )}
            </div>
            <p className="text-xs text-[#C9B9D2]">
              @{profile.handle}
              {profile.pronouns && ` • ${profile.pronouns}`}
              {profile.genderIdentity && ` • ${profile.genderIdentity}`}
              {profile.sexuality && ` • ${profile.sexuality}`}
            </p>
            <div className="flex items-center justify-center gap-2 pt-0.5 text-[10px] text-[#91819A] font-mono">
              <span>Joined: {new Date(profile.createdAt).toLocaleDateString([], { month: 'short', year: 'numeric' })}</span>
              <span>•</span>
              <span className="text-[#8197FF]">Quiet Hours: {profile.quietHours || '00:00-08:00'}</span>
            </div>
          </div>

          {/* Inline Status Message */}
          <div className="w-full pt-1">
            {isEditingStatus ? (
              <div className="flex items-center gap-2 bg-[#211C30] border border-[#8197FF]/50 rounded-2xl p-1.5 shadow-inner">
                <input
                  type="text"
                  value={statusText}
                  onChange={(e) => setStatusText(e.target.value)}
                  placeholder="Set status message..."
                  className="flex-1 bg-transparent px-2.5 text-xs text-[#F4EEF8] outline-hidden"
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
                className="w-full px-3.5 py-2.5 bg-[#211C30]/70 hover:bg-[#211C30] border border-[#2E2742] rounded-2xl text-xs text-[#91819A] hover:text-[#F4EEF8] flex items-center justify-between min-h-touch transition-all shadow-xs"
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
            <p className="text-xs text-[#C9B9D2] leading-relaxed max-w-xs">{profile.bio}</p>
          )}

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center pt-1">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 rounded-full bg-[#211C30] border border-[#3E2954] text-[10px] text-[#B979FF] font-medium"
                >
                  #{interest}
                </span>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => navigate('/profile/edit')}
            className="w-full py-2.5 px-4 bg-[#211C30] hover:bg-[#2B243E] border border-[#2E2742] text-[#F4EEF8] rounded-xl text-xs font-semibold min-h-touch transition-colors shadow-xs"
          >
            Edit Profile Details
          </button>
        </div>

        {/* Navigation Quick Links (Different Restrained Tints per Category) */}
        <div className="bg-[#191625] border border-[#2E2742] rounded-3xl overflow-hidden divide-y divide-[#2E2742]/50 text-xs font-medium shadow-md">
          {/* Avatar Builder (Lilac) */}
          <button
            type="button"
            onClick={() => navigate('/avatar')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#211C30] min-h-touch text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#2D1B4E] border border-[#B979FF]/40 flex items-center justify-center text-[#B979FF]">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-[#F4EEF8]">Vector Avatar Builder</span>
            </div>
            <span className="text-[11px] text-[#B979FF] font-semibold">Customize</span>
          </button>

          {/* Bookmarks (Gold) */}
          <button
            type="button"
            onClick={() => navigate('/bookmarks')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#211C30] min-h-touch text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#2D2418] border border-[#D5AB5E]/40 flex items-center justify-center text-[#D5AB5E]">
                <Bookmark className="w-4 h-4" />
              </div>
              <span className="text-[#F4EEF8]">Saved Bookmarks & Evidence</span>
            </div>
            <span className="text-[11px] text-[#D5AB5E] font-semibold">View</span>
          </button>

          {/* Safety (Rose) */}
          <button
            type="button"
            onClick={() => navigate('/safety')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#211C30] min-h-touch text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#2D1A22] border border-[#E07DA5]/40 flex items-center justify-center text-[#E07DA5]">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-[#F4EEF8]">Safety & Block Controls</span>
            </div>
            <span className="text-[11px] text-[#E07DA5] font-semibold">Manage</span>
          </button>

          {/* Settings (Teal) */}
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#211C30] min-h-touch text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#142629] border border-[#57C7C1]/40 flex items-center justify-center text-[#57C7C1]">
                <Settings className="w-4 h-4" />
              </div>
              <span className="text-[#F4EEF8]">Settings, Themes & Offline Sync</span>
            </div>
            <span className="text-[11px] text-[#57C7C1] font-semibold">Configure</span>
          </button>

          {/* Internal Tools (Cold Violet) */}
          <button
            type="button"
            onClick={() => navigate('/internal')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#211C30] min-h-touch text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#1C2030] border border-[#8FA9FF]/40 flex items-center justify-center text-[#8FA9FF]">
                <Code className="w-4 h-4" />
              </div>
              <span className="text-[#F4EEF8]">Internal Continuity Tools</span>
            </div>
            <span className="text-[11px] text-[#8FA9FF] font-mono font-semibold">DEV/ARG</span>
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};
