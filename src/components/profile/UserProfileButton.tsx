import React, { useState } from 'react';
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
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-surface-card hover:bg-white/10 border-2 border-surface-border transition-all cursor-pointer shadow-sm group"
        title="View Profile & Progress Sync"
        id="user-profile-btn"
      >
        <div className="relative">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover border border-emerald-400"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-duo-blue to-purple-600 flex items-center justify-center text-xs font-black text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#182329]"
            title="Auto-saved"
          />
        </div>

        <span className="text-xs font-bold text-white max-w-[90px] truncate hidden sm:inline-block">
          {user.name}
        </span>

        {user.isGuest ? (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Guest
          </span>
        ) : (
          <span className="text-xs">☁️</span>
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
