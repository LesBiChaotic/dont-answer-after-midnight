import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthProfile } from '../context/AuthProfileContext';
import { TopBar } from '../components/layout/TopBar';
import { Check, Plus, X } from 'lucide-react';

export const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuthProfile();

  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [handle, setHandle] = useState(profile?.handle || '');
  const [pronouns, setPronouns] = useState(profile?.pronouns || '');
  const [genderIdentity, setGenderIdentity] = useState(profile?.genderIdentity || '');
  const [sexuality, setSexuality] = useState(profile?.sexuality || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [quietHours, setQuietHours] = useState(profile?.quietHours || '00:00-08:00');
  const [interests, setInterests] = useState<string[]>(profile?.interests || []);
  const [newTag, setNewTag] = useState('');

  const handleAddInterest = () => {
    const trimmed = newTag.trim().replace(/^#/, '');
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
      setNewTag('');
    }
  };

  const handleRemoveInterest = (tag: string) => {
    setInterests(interests.filter((t) => t !== tag));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanHandle = handle.startsWith('@') ? handle.substring(1) : handle;
    await updateProfile({
      displayName: displayName.trim(),
      handle: cleanHandle.trim(),
      pronouns: pronouns.trim() || undefined,
      genderIdentity: genderIdentity.trim() || undefined,
      sexuality: sexuality.trim() || undefined,
      bio: bio.trim(),
      quietHours,
      interests,
    });
    navigate('/profile');
  };

  return (
    <div className="flex-1 flex flex-col app-viewport bg-ah-canvas text-ah-text">
      <TopBar showBack title="Edit Profile" />

      <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 space-y-4 max-w-md mx-auto w-full">
        {/* Display Name */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-ah-muted uppercase tracking-wider">
            Display Name
          </label>
          <input
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-4 py-3 bg-ah-surface-2 border border-ah-border focus:border-brand-500 rounded-xl text-sm text-ah-text placeholder-night-muted outline-none min-h-touch"
          />
        </div>

        {/* Handle */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-ah-muted uppercase tracking-wider">
            Handle
          </label>
          <div className="flex items-center bg-ah-surface-2 border border-ah-border focus-within:border-brand-500 rounded-xl px-3 min-h-touch">
            <span className="text-ah-muted text-sm select-none">@</span>
            <input
              type="text"
              required
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full px-1.5 py-3 bg-transparent text-sm text-ah-text placeholder-night-muted outline-none"
            />
          </div>
        </div>

        {/* Pronouns */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-ah-muted uppercase tracking-wider">
            Pronouns
          </label>
          <input
            type="text"
            placeholder="e.g. they/them, she/her, he/him"
            value={pronouns}
            onChange={(e) => setPronouns(e.target.value)}
            className="w-full px-4 py-3 bg-ah-surface-2 border border-ah-border focus:border-brand-500 rounded-xl text-sm text-ah-text placeholder-night-muted outline-none min-h-touch"
          />
        </div>

        {/* Gender Identity */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-ah-muted uppercase tracking-wider">
            Gender Identity (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Non-binary, Woman, Man"
            value={genderIdentity}
            onChange={(e) => setGenderIdentity(e.target.value)}
            className="w-full px-4 py-3 bg-ah-surface-2 border border-ah-border focus:border-brand-500 rounded-xl text-sm text-ah-text placeholder-night-muted outline-none min-h-touch"
          />
        </div>

        {/* Sexuality */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-ah-muted uppercase tracking-wider">
            Sexuality / Orientation (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Queer, Lesbian, Gay, Bi, Ace"
            value={sexuality}
            onChange={(e) => setSexuality(e.target.value)}
            className="w-full px-4 py-3 bg-ah-surface-2 border border-ah-border focus:border-brand-500 rounded-xl text-sm text-ah-text placeholder-night-muted outline-none min-h-touch"
          />
        </div>

        {/* Quiet Hours Window */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-ah-muted uppercase tracking-wider">
            Quiet Hours Preference
          </label>
          <select
            value={quietHours}
            onChange={(e) => setQuietHours(e.target.value as any)}
            className="w-full px-4 py-3 bg-ah-surface-2 border border-ah-border focus:border-brand-500 rounded-xl text-sm text-ah-text outline-none min-h-touch"
          >
            <option value="off">Off (Standard 24/7)</option>
            <option value="23:00-07:00">23:00 – 07:00</option>
            <option value="00:00-08:00">00:00 – 08:00 (Recommended)</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-ah-muted uppercase tracking-wider">
            Bio
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-3 bg-ah-surface-2 border border-ah-border focus:border-brand-500 rounded-xl text-sm text-ah-text placeholder-night-muted outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Interests */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-ah-muted uppercase tracking-wider">
            Interests & Topic Tags
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add topic (e.g. Audio, BBS)..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddInterest();
                }
              }}
              className="flex-1 px-3 py-2 bg-ah-surface-2 border border-ah-border rounded-xl text-xs text-ah-text outline-none min-h-touch"
            />
            <button
              type="button"
              onClick={handleAddInterest}
              className="px-3 py-2 bg-brand-600 hover:bg-brand-500 text-ah-text rounded-xl text-xs font-semibold min-h-touch flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {interests.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-ah-surface-2 border border-ah-border text-xs text-brand-300 font-medium"
              >
                <span>#{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(tag)}
                  className="p-0.5 text-ah-muted hover:text-red-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Sticky Bottom Save */}
        <div className="pt-6">
          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-ah-text rounded-xl font-semibold text-sm min-h-touch flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98]"
          >
            <Check className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
