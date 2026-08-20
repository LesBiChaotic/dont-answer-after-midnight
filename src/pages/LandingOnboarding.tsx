import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthProfile } from '../context/AuthProfileContext';
import { useSettings } from '../context/SettingsContext';
import { Avatar } from '../components/common/Avatar';
import { AvatarBuilder } from '../components/avatar/AvatarBuilder';
import { Logo } from '../components/common/Logo';
import { AvatarConfig, QuietHoursSetting } from '../types';
import { DEFAULT_AVATAR } from '../data/seed';
import { PWAInstallBanner } from '../components/common/PWAInstallBanner';
import {
  Moon,
  Sun,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Hash,
  Archive,
  Database,
  WifiOff,
  Check,
  Shield,
  HelpCircle,
  Eye,
  Palette,
  Clock,
} from 'lucide-react';

const INTEREST_TAGS = [
  'Digital Archives',
  'Synth & Ambient',
  'Late Night Coding',
  'Nocturnal Reading',
  'Urban Legends',
  'Coffee & Tea',
  'Insomnia Musings',
  'Old Internet Relics',
  'Quiet Hours',
  'Field Recordings',
];

const QUIET_HOURS_OPTIONS: { id: QuietHoursSetting; label: string; desc: string }[] = [
  { id: 'off', label: 'Off (Standard)', desc: 'Standard message delivery at all hours' },
  { id: '23:00-07:00', label: '23:00 – 07:00', desc: 'Softened night delivery between 11 PM and 7 AM' },
  { id: '00:00-08:00', label: '00:00 – 08:00 (Recommended)', desc: 'Deep quiet mode during peak late-night stillness' },
  { id: 'custom', label: 'Custom Window', desc: 'Personalized nocturnal schedule' },
];

export const LandingOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { isOnboarded, createProfile } = useAuthProfile();
  const { settings, setTheme } = useSettings();

  // Landing vs Onboarding Mode
  const [isOnboardingMode, setIsOnboardingMode] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3 | 4>(1);

  // Profile Form States
  const [displayName, setDisplayName] = useState('');
  const [handle, setHandle] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [genderIdentity, setGenderIdentity] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [sexuality, setSexuality] = useState('');
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Digital Archives', 'Quiet Hours']);
  const [quietHours, setQuietHours] = useState<QuietHoursSetting>('00:00-08:00');
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(DEFAULT_AVATAR);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleInterest = (tag: string) => {
    setSelectedInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleStartOnboarding = () => {
    if (isOnboarded) {
      navigate('/chats', { replace: true });
    } else {
      setIsOnboardingMode(true);
    }
  };

  const handleStep1Next = () => {
    if (!displayName.trim()) {
      setError('Please provide a display name.');
      return;
    }
    if (!ageConfirmed) {
      setError('You must confirm you are 18+ to enter AFTERHOURS.');
      return;
    }
    setError(null);
    setOnboardingStep(2);
  };

  const handleStep2Next = () => {
    setError(null);
    setOnboardingStep(3);
  };

  const handleStep3Next = () => {
    setError(null);
    setOnboardingStep(4);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToRules) {
      setError('Please acknowledge the community rules to proceed.');
      return;
    }

    try {
      await createProfile({
        displayName: displayName.trim(),
        handle: handle.trim() || displayName.toLowerCase().replace(/\s+/g, '_'),
        ageConfirmedAdult: true,
        genderIdentity: genderIdentity.trim() || undefined,
        pronouns: pronouns.trim() || undefined,
        sexuality: sexuality.trim() || undefined,
        bio: bio.trim() || 'Nocturnal member.',
        interests: selectedInterests,
        quietHours,
        avatarConfig,
      });
      navigate('/chats', { replace: true });
    } catch {
      setError('Failed to initialize profile. Please try again.');
    }
  };

  if (isEditingAvatar) {
    return (
      <AvatarBuilder
        initialConfig={avatarConfig}
        onSave={(newCfg) => {
          setAvatarConfig(newCfg);
          setIsEditingAvatar(false);
        }}
        onCancel={() => setIsEditingAvatar(false)}
      />
    );
  }

  // ==========================================
  // VIEW A: PUBLIC LANDING PAGE (MOBILE-FIRST)
  // ==========================================
  if (!isOnboardingMode) {
    return (
      <div className="flex-1 flex flex-col app-viewport bg-[#11101A] text-[#F4EEF8] select-none">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-[#191625]/90 backdrop-blur-xl border-b border-[#2E2742] pt-[max(env(safe-area-inset-top),6px)]">
          <Logo size="sm" />

          <button
            type="button"
            onClick={() => setTheme(settings.theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-[#91819A] hover:text-white rounded-full min-h-touch min-w-touch flex items-center justify-center active:bg-[#211C30] transition-colors"
            aria-label="Toggle theme"
          >
            {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-[#F0A06D]" /> : <Moon className="w-4 h-4 text-[#8197FF]" />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-6 max-w-md mx-auto w-full">
          {/* PWA Install Banner */}
          <PWAInstallBanner />

          {/* Hero Section (Controlled Plum to Periwinkle Gradient) */}
          <section className="relative p-6 rounded-3xl bg-gradient-to-br from-[#2D1B4E] via-[#1E1730] to-[#141122] border border-[#6E45C7]/50 shadow-2xl space-y-4 overflow-hidden text-left">
            {/* Abstract Chat Constellation SVG */}
            <div className="absolute top-2 right-2 w-36 h-36 opacity-30 pointer-events-none">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="30" r="3" fill="#8197FF" />
                <circle cx="65" cy="20" r="4" fill="#B979FF" />
                <circle cx="80" cy="60" r="3" fill="#F0A06D" />
                <circle cx="35" cy="75" r="3.5" fill="#57C7C1" />
                <path d="M20 30L65 20L80 60L35 75Z" stroke="#8197FF" strokeWidth="0.8" strokeDasharray="2 2" />
                <path d="M20 30L35 75" stroke="#B979FF" strokeWidth="0.8" strokeDasharray="2 2" />
              </svg>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#211C30]/80 border border-[#8197FF]/40 rounded-full text-[10px] font-mono font-semibold text-[#8197FF]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#69C49A] animate-pulse" />
              <span>NOCTURNAL NETWORK ACTIVE</span>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif leading-tight">
                Stay up. Stay in touch.
              </h1>
              <p className="text-xs text-[#C9B9D2] leading-relaxed">
                A private place for late-night conversations, small communities, archived groups, and the people you don't want to lose track of.
              </p>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleStartOnboarding}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#8197FF] to-[#B979FF] text-[#11101A] rounded-2xl text-xs font-bold flex items-center justify-center gap-2 min-h-touch active:scale-95 transition-all shadow-lg shadow-[#8197FF]/20"
              >
                <span>{isOnboarded ? 'Open Afterhours' : 'Create Profile'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {isOnboarded && (
                <button
                  type="button"
                  onClick={() => setIsOnboardingMode(true)}
                  className="w-full py-2.5 text-center text-xs text-[#91819A] hover:text-[#F4EEF8] font-medium min-h-touch"
                >
                  Edit Persona Profile
                </button>
              )}
            </div>
          </section>

          {/* 5 Distinct Alternating Tint Feature Cards */}
          <section className="space-y-2.5">
            <h2 className="text-xs font-bold text-[#91819A] uppercase tracking-wider px-1 font-mono">
              Platform Features
            </h2>

            <div className="grid grid-cols-1 gap-2.5">
              {/* 1. Private Chats (Lavender Tint) */}
              <div className="p-4 bg-[#1E172E] border border-[#4B3573] rounded-2xl flex items-start gap-3.5 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#2D1B4E] border border-[#B979FF]/40 flex items-center justify-center text-[#B979FF] shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-semibold text-white">Private chats</h3>
                  <p className="text-[11px] text-[#C9B9D2] leading-relaxed">
                    Direct messaging with typing pulses, draft persistence, and reaction trays.
                  </p>
                </div>
              </div>

              {/* 2. Small Rooms (Blue/Periwinkle Tint) */}
              <div className="p-4 bg-[#161D2E] border border-[#2B3E68] rounded-2xl flex items-start gap-3.5 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#1D2947] border border-[#8197FF]/40 flex items-center justify-center text-[#8197FF] shrink-0">
                  <Hash className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-semibold text-white">Small rooms</h3>
                  <p className="text-[11px] text-[#C9B9D2] leading-relaxed">
                    Topic channels with community guidelines, moderator pins, and calm feeds.
                  </p>
                </div>
              </div>

              {/* 3. Archive Old Conversations (Teal Tint) */}
              <div className="p-4 bg-[#132223] border border-[#214F4D] rounded-2xl flex items-start gap-3.5 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#173636] border border-[#57C7C1]/40 flex items-center justify-center text-[#57C7C1] shrink-0">
                  <Archive className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-semibold text-white">Archive old conversations</h3>
                  <p className="text-[11px] text-[#C9B9D2] leading-relaxed">
                    Explore five legacy communication partitions preserved from 2001 to 2026.
                  </p>
                </div>
              </div>

              {/* 4. Your Data, Your Controls (Gold Tint) */}
              <div className="p-4 bg-[#231D14] border border-[#4D3F28] rounded-2xl flex items-start gap-3.5 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#362D1B] border border-[#D5AB5E]/40 flex items-center justify-center text-[#D5AB5E] shrink-0">
                  <Database className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-semibold text-white">Your data, your controls</h3>
                  <p className="text-[11px] text-[#C9B9D2] leading-relaxed">
                    Local-first IndexedDB storage, strict identity safety, and full JSON exports.
                  </p>
                </div>
              </div>

              {/* 5. Offline Reading (Rose Tint) */}
              <div className="p-4 bg-[#22161E] border border-[#4F2D40] rounded-2xl flex items-start gap-3.5 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#381F2E] border border-[#E07DA5]/40 flex items-center justify-center text-[#E07DA5] shrink-0">
                  <WifiOff className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-semibold text-white">Offline reading</h3>
                  <p className="text-[11px] text-[#C9B9D2] leading-relaxed">
                    Cached conversations, background offline drafting, and gentle reconnection.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Community Quote */}
          <section className="p-5 bg-gradient-to-br from-[#1E162B] to-[#191625] border border-[#3E2954] rounded-2xl text-center space-y-2 shadow-sm">
            <p className="text-xs italic text-[#B979FF] leading-relaxed font-serif">
              "The only place that makes 3:00 AM feel like a sanctuary instead of isolation."
            </p>
            <span className="text-[10px] font-mono text-[#91819A] uppercase tracking-widest block">
              — NIGHT OWLS COMMUNITY
            </span>
          </section>

          {/* Footer Links */}
          <footer className="pt-4 pb-8 border-t border-[#2E2742]/60 text-center space-y-3">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-medium text-[#91819A]">
              <button type="button" onClick={() => navigate('/safety')} className="hover:text-white min-h-touch flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-[#E07DA5]" />
                <span>Safety</span>
              </button>
              <button type="button" onClick={() => navigate('/help')} className="hover:text-white min-h-touch flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-[#8197FF]" />
                <span>Help</span>
              </button>
              <button type="button" onClick={() => navigate('/safety')} className="hover:text-white min-h-touch flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#69C49A]" />
                <span>Privacy</span>
              </button>
              <button type="button" onClick={() => navigate('/settings/accessibility')} className="hover:text-white min-h-touch flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-[#57C7C1]" />
                <span>Accessibility</span>
              </button>
              <button type="button" onClick={() => navigate('/settings/appearance')} className="hover:text-white min-h-touch flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-[#B979FF]" />
                <span>Appearance</span>
              </button>
            </div>
            <p className="text-[11px] text-[#91819A]/60 font-mono">
              AFTERHOURS v1.0 • NOCTURNAL SANCTUARY • LOCAL-FIRST
            </p>
          </footer>
        </main>
      </div>
    );
  }

  // ==========================================
  // VIEW B: 4-STEP PERSONA ONBOARDING FLOW
  // ==========================================
  return (
    <div className="flex-1 flex flex-col app-viewport bg-[#11101A] text-[#F4EEF8] select-none">
      {/* Header */}
      <header className="px-4 h-14 flex items-center justify-between border-b border-[#2E2742] bg-[#191625]/90 backdrop-blur-md pt-[max(env(safe-area-inset-top),6px)]">
        <button
          type="button"
          onClick={() => {
            if (onboardingStep > 1) {
              setOnboardingStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
            } else {
              setIsOnboardingMode(false);
            }
          }}
          className="text-xs font-semibold text-[#8197FF] hover:text-[#B979FF] min-h-touch flex items-center"
        >
          {onboardingStep === 1 ? 'Cancel' : '← Back'}
        </button>

        <span className="text-xs font-mono font-bold tracking-wider text-[#91819A]">
          STEP {onboardingStep} OF 4
        </span>

        <button
          type="button"
          onClick={() => setTheme(settings.theme === 'dark' ? 'light' : 'dark')}
          className="p-2 text-[#91819A] hover:text-white rounded-full min-h-touch min-w-touch flex items-center justify-center"
          aria-label="Toggle theme"
        >
          {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-[#F0A06D]" /> : <Moon className="w-4 h-4 text-[#8197FF]" />}
        </button>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-[#191625] h-1">
        <div
          className="bg-gradient-to-r from-[#8197FF] to-[#B979FF] h-1 transition-all duration-300 shadow-sm"
          style={{ width: `${(onboardingStep / 4) * 100}%` }}
        />
      </div>

      <main className="flex-1 overflow-y-auto p-4 max-w-md mx-auto w-full space-y-5">
        {error && (
          <div className="p-3 bg-[#381F26] border border-[#E16F86]/60 rounded-2xl text-xs text-[#E16F86] animate-shake">
            {error}
          </div>
        )}

        {/* STEP 1: Basic Identity & Adult Age Pledge */}
        {onboardingStep === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white font-serif tracking-tight">
                Create your Persona
              </h2>
              <p className="text-xs text-[#C9B9D2] leading-relaxed">
                Choose a display name and unique handle for nocturnal messaging.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-medium text-[#C9B9D2] block mb-1">
                  Display Name <span className="text-[#8197FF]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rowan, Sam, NightReader"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#191625] border border-[#2E2742] focus:border-[#8197FF] rounded-xl text-xs text-[#F4EEF8] placeholder-[#91819A] outline-hidden min-h-touch"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#C9B9D2] block mb-1">
                  Unique Handle <span className="text-[#91819A]">(Optional)</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs text-[#91819A] font-mono">@</span>
                  <input
                    type="text"
                    placeholder="handle"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
                    className="w-full pl-8 pr-3.5 py-2.5 bg-[#191625] border border-[#2E2742] focus:border-[#8197FF] rounded-xl text-xs font-mono text-[#F4EEF8] placeholder-[#91819A] outline-hidden min-h-touch"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-[#191625] border border-[#2E2742] rounded-2xl flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agePledge"
                  checked={ageConfirmed}
                  onChange={(e) => setAgeConfirmed(e.target.checked)}
                  className="mt-0.5 w-5 h-5 shrink-0 rounded-sm border-[#2E2742] text-[#8197FF] focus:ring-[#8197FF] bg-[#211C30]"
                />
                <label htmlFor="agePledge" className="text-xs text-[#C9B9D2] leading-relaxed cursor-pointer select-none">
                  <span className="font-semibold text-white">Adult Confirmation:</span> I confirm that I am 18 years of age or older.
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStep1Next}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#8197FF] to-[#B979FF] text-[#11101A] rounded-xl text-xs font-bold flex items-center justify-center gap-2 min-h-touch shadow-lg active:scale-95 transition-all"
            >
              <span>Continue to Demographics</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Demographics, Identity & Interests */}
        {onboardingStep === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white font-serif tracking-tight">
                Identity & Demographics
              </h2>
              <p className="text-xs text-[#C9B9D2] leading-relaxed">
                All demographic fields are strictly optional. They appear in your profile and help group similar late-night interests.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-[#C9B9D2] block mb-1">
                    Gender Identity
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Non-binary, Woman, Man"
                    value={genderIdentity}
                    onChange={(e) => setGenderIdentity(e.target.value)}
                    className="w-full px-3 py-2 bg-[#191625] border border-[#2E2742] rounded-xl text-xs text-[#F4EEF8] placeholder-[#91819A] outline-hidden min-h-touch"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#C9B9D2] block mb-1">
                    Pronouns
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. they/them, she/her"
                    value={pronouns}
                    onChange={(e) => setPronouns(e.target.value)}
                    className="w-full px-3 py-2 bg-[#191625] border border-[#2E2742] rounded-xl text-xs text-[#F4EEF8] placeholder-[#91819A] outline-hidden min-h-touch"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#C9B9D2] block mb-1">
                  Sexuality
                </label>
                <input
                  type="text"
                  placeholder="e.g. Queer, Bisexual, Ace, Gay, Straight"
                  value={sexuality}
                  onChange={(e) => setSexuality(e.target.value)}
                  className="w-full px-3 py-2 bg-[#191625] border border-[#2E2742] rounded-xl text-xs text-[#F4EEF8] placeholder-[#91819A] outline-hidden min-h-touch"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#C9B9D2] block mb-1">
                  Short Bio
                </label>
                <textarea
                  rows={2}
                  placeholder="Nocturnal habits, favorite tea, music..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 bg-[#191625] border border-[#2E2742] rounded-xl text-xs text-[#F4EEF8] placeholder-[#91819A] outline-hidden resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#C9B9D2] block mb-1.5">
                  Nocturnal Interests
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {INTEREST_TAGS.map((tag) => {
                    const isSelected = selectedInterests.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleInterest(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium min-h-touch transition-all active:scale-95 ${
                          isSelected
                            ? 'bg-[#8197FF] text-[#11101A] font-bold shadow-xs'
                            : 'bg-[#191625] text-[#91819A] border border-[#2E2742] hover:text-[#F4EEF8]'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStep2Next}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#8197FF] to-[#B979FF] text-[#11101A] rounded-xl text-xs font-bold flex items-center justify-center gap-2 min-h-touch shadow-lg active:scale-95 transition-all"
            >
              <span>Continue to Avatar & Schedule</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 3: Avatar Preview & Quiet Hours Schedule */}
        {onboardingStep === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white font-serif tracking-tight">
                Avatar & Quiet Hours
              </h2>
              <p className="text-xs text-[#C9B9D2] leading-relaxed">
                Design your vector avatar and specify your delivery window schedule.
              </p>
            </div>

            {/* Avatar Preview Card */}
            <div className="p-4 bg-[#191625] border border-[#2E2742] rounded-3xl flex flex-col items-center gap-3 text-center shadow-md">
              <div className="p-1 rounded-3xl ring-2 ring-[#B979FF]/40 shadow-[0_0_20px_rgba(185,121,255,0.25)]">
                <Avatar config={avatarConfig} size="xl" showStatusDot status="afterhours" />
              </div>
              <button
                type="button"
                onClick={() => setIsEditingAvatar(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#211C30] hover:bg-[#2B243E] border border-[#3E2954] text-[#B979FF] rounded-xl text-xs font-semibold min-h-touch active:scale-95 transition-transform"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open Vector Avatar Builder</span>
              </button>
            </div>

            {/* Quiet Hours Window Selector */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#C9B9D2] block flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#8197FF]" />
                <span>Quiet Hours Window</span>
              </label>

              <div className="space-y-2">
                {QUIET_HOURS_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`p-3 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                      quietHours === opt.id
                        ? 'bg-[#211C30] border-[#8197FF] shadow-xs'
                        : 'bg-[#191625] border-[#2E2742] text-[#91819A]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="quietHours"
                      value={opt.id}
                      checked={quietHours === opt.id}
                      onChange={() => setQuietHours(opt.id)}
                      className="mt-0.5 text-[#8197FF] focus:ring-[#8197FF] bg-[#211C30]"
                    />
                    <div className="space-y-0.5">
                      <span className={`text-xs font-bold block ${quietHours === opt.id ? 'text-white' : 'text-[#C9B9D2]'}`}>
                        {opt.label}
                      </span>
                      <p className="text-[11px] text-[#91819A] leading-relaxed">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleStep3Next}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#8197FF] to-[#B979FF] text-[#11101A] rounded-xl text-xs font-bold flex items-center justify-center gap-2 min-h-touch shadow-lg active:scale-95 transition-all"
            >
              <span>Continue to Community Pledge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 4: Community Rules & Final Confirmation */}
        {onboardingStep === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white font-serif tracking-tight">
                Community Sanctuary Rules
              </h2>
              <p className="text-xs text-[#C9B9D2] leading-relaxed">
                AFTERHOURS is maintained as a quiet sanctuary. Please review the core principles:
              </p>
            </div>

            <div className="p-4 bg-[#191625] border border-[#2E2742] rounded-2xl space-y-3 text-xs text-[#C9B9D2] leading-relaxed">
              <div className="flex items-start gap-2.5">
                <span className="font-bold text-[#8197FF] shrink-0 font-mono">1.</span>
                <p>Respect late-night quiet hours and avoid aggressive spam or loud media.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="font-bold text-[#8197FF] shrink-0 font-mono">2.</span>
                <p>Treat all members with mutual kindness, regardless of pronouns, sexuality, or background.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="font-bold text-[#8197FF] shrink-0 font-mono">3.</span>
                <p>Label all audio clips with volume warnings in community rooms.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="font-bold text-[#8197FF] shrink-0 font-mono">4.</span>
                <p>Preserve legacy archive data; do not redistribute personal identities found in vintage partitions.</p>
              </div>
            </div>

            <div className="p-3.5 bg-[#191625] border border-[#2E2742] rounded-2xl flex items-start gap-3">
              <input
                type="checkbox"
                id="rulesPledge"
                checked={agreedToRules}
                onChange={(e) => setAgreedToRules(e.target.checked)}
                className="mt-0.5 w-5 h-5 shrink-0 rounded-sm border-[#2E2742] text-[#8197FF] focus:ring-[#8197FF] bg-[#211C30]"
              />
              <label htmlFor="rulesPledge" className="text-xs text-[#C9B9D2] leading-relaxed cursor-pointer select-none">
                <span className="font-semibold text-white">I agree</span> to uphold the AFTERHOURS sanctuary rules and enter the network responsibly.
              </label>
            </div>

            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={!agreedToRules}
              className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 min-h-touch transition-all shadow-lg ${
                agreedToRules
                  ? 'bg-gradient-to-r from-[#8197FF] to-[#B979FF] text-[#11101A] shadow-[#8197FF]/25 active:scale-95'
                  : 'bg-[#211C30] text-[#91819A]/40 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Enter AFTERHOURS</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
