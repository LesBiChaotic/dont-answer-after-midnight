import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthProfile } from '../context/AuthProfileContext';
import { AvatarBuilder } from '../components/avatar/AvatarBuilder';
import { DEFAULT_AVATAR } from '../data/seed';

export const AvatarPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateAvatar } = useAuthProfile();

  const handleSave = async (newConfig: typeof DEFAULT_AVATAR) => {
    await updateAvatar(newConfig);
    navigate('/profile');
  };

  return (
    <div className="flex-1 flex flex-col h-screen max-h-screen bg-ah-canvas text-ah-text">
      <AvatarBuilder
        initialConfig={profile?.avatarConfig || DEFAULT_AVATAR}
        onSave={handleSave}
        onCancel={() => navigate('/profile')}
      />
    </div>
  );
};
