import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, AvatarConfig, QuietHoursSetting } from '../types';
import { getStoredProfile, saveStoredProfile, initializeDatabaseSeed } from '../services/storage';
import { DEFAULT_AVATAR } from '../data/seed';

interface AuthProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  isOnboarded: boolean;
  createProfile: (data: {
    displayName: string;
    handle: string;
    ageConfirmedAdult: boolean;
    bio?: string;
    pronouns?: string;
    genderIdentity?: string;
    sexuality?: string;
    interests?: string[];
    quietHours?: QuietHoursSetting;
    avatarConfig?: AvatarConfig;
  }) => Promise<UserProfile>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateAvatar: (avatarConfig: AvatarConfig) => Promise<void>;
}

const AuthProfileContext = createContext<AuthProfileContextType | undefined>(undefined);

export const AuthProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      try {
        await initializeDatabaseSeed();
        const stored = await getStoredProfile();
        setProfile(stored);
      } catch (err) {
        console.error('[AuthProfile] Failed to load stored profile:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const createProfile = useCallback(
    async (data: {
      displayName: string;
      handle: string;
      ageConfirmedAdult: boolean;
      bio?: string;
      pronouns?: string;
      genderIdentity?: string;
      sexuality?: string;
      interests?: string[];
      quietHours?: QuietHoursSetting;
      avatarConfig?: AvatarConfig;
    }): Promise<UserProfile> => {
      const cleanHandle = data.handle.startsWith('@') ? data.handle.substring(1) : data.handle;
      const newProfile: UserProfile = {
        id: `user_${Date.now()}`,
        displayName: data.displayName.trim() || 'Nocturnal User',
        handle: cleanHandle.trim() || `user_${Math.floor(1000 + Math.random() * 9000)}`,
        ageConfirmedAdult: data.ageConfirmedAdult,
        bio: data.bio || '',
        pronouns: data.pronouns || '',
        genderIdentity: data.genderIdentity || '',
        sexuality: data.sexuality || '',
        statusMessage: 'joined afterhours',
        interests: data.interests || ['Late night', 'Archives', 'Ambient audio'],
        quietHours: data.quietHours || '00:00-08:00',
        avatarConfig: data.avatarConfig || DEFAULT_AVATAR,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        visibility: 'public',
        storyFlags: ['onboarding_completed'],
      };

      await saveStoredProfile(newProfile);
      setProfile(newProfile);
      return newProfile;
    },
    []
  );

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>): Promise<void> => {
      if (!profile) return;
      const updated: UserProfile = {
        ...profile,
        ...updates,
        lastActive: new Date().toISOString(),
      };
      await saveStoredProfile(updated);
      setProfile(updated);
    },
    [profile]
  );

  const updateAvatar = useCallback(
    async (avatarConfig: AvatarConfig): Promise<void> => {
      if (!profile) return;
      const updated: UserProfile = {
        ...profile,
        avatarConfig,
        lastActive: new Date().toISOString(),
      };
      await saveStoredProfile(updated);
      setProfile(updated);
    },
    [profile]
  );

  return (
    <AuthProfileContext.Provider
      value={{
        profile,
        isLoading,
        isOnboarded: !!profile && profile.ageConfirmedAdult,
        createProfile,
        updateProfile,
        updateAvatar,
      }}
    >
      {children}
    </AuthProfileContext.Provider>
  );
};

export function useAuthProfile(): AuthProfileContextType {
  const context = useContext(AuthProfileContext);
  if (!context) {
    throw new Error('useAuthProfile must be used within an AuthProfileProvider');
  }
  return context;
}
