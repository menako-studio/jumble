import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { ProfileModal } from './ProfileModal';

interface UserProfileButtonProps {
  totalStars?: number;
  completedLessonsCount?: number;
}

export const UserProfileButton: React.FC<UserProfileButtonProps> = ({
  totalStars = 0,
  completedLessonsCount = 0,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-3 min-h-11 rounded-2xl bg-white hover:bg-slate-50 border-2 border-surface-border transition-colors cursor-pointer shadow-sm group"
        aria-label={t('profile.open', { name: user.name })}
        aria-haspopup="dialog"
        id="user-profile-btn"
      >
        <div className="relative" aria-hidden="true">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              className="w-7 h-7 rounded-full object-cover border border-emerald-400"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-duo-blue to-purple-600 flex items-center justify-center text-xs font-black text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
        </div>

        <span className="text-xs font-bold text-ink-900 max-w-[90px] truncate hidden sm:inline-block">
          {user.name}
        </span>

        {user.isGuest ? (
          <span className="px-1.5 py-0.5 rounded text-xs font-black bg-amber-50 text-amber-800 border border-amber-200">
            {t('profile.guest')}
          </span>
        ) : (
          <span className="text-xs" aria-hidden="true">☁️</span>
        )}
      </button>

      <ProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        totalStars={totalStars}
        completedLessonsCount={completedLessonsCount}
      />
    </>
  );
};
