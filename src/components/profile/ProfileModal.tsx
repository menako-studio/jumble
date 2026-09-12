import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalStars?: number;
  completedLessonsCount?: number;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  totalStars = 0,
  completedLessonsCount = 0,
}) => {
  const { i18n } = useTranslation();
  const { user, isConfigured, syncStatus, signInWithGoogle, signOut } = useAuth();
  const lang = (i18n.language as 'en' | 'id') || 'en';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-ink-900/45 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="relative z-10 w-full max-w-md bg-white border-2 border-surface-border rounded-3xl p-6 text-ink-900 shadow-card-lg overflow-hidden font-nunito"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-ink-700 flex items-center justify-center font-black transition-all cursor-pointer"
          >
            ✕
          </button>

          {/* User Profile Header */}
          <div className="flex flex-col items-center text-center mt-2 mb-6">
            <div className="relative mb-3">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-20 h-20 rounded-full border-4 border-duo-green shadow-glow object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-duo-blue to-indigo-500 border-4 border-duo-blue-light shadow-3d-blue flex items-center justify-center text-3xl font-black text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px]" title="Auto-Save Active">
                ☁️
              </span>
            </div>

            <h3 className="text-xl font-black text-ink-900 flex items-center gap-2">
              <span>{user.name}</span>
              {user.isGuest && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-extrabold border border-amber-200">
                  {lang === 'id' ? 'Tamu' : 'Guest'}
                </span>
              )}
            </h3>
            {user.email && (
              <p className="text-xs text-ink-500 font-semibold">{user.email}</p>
            )}

            {/* Auto-Save & Cloud Sync Status Badge */}
            <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {syncStatus === 'saving'
                  ? (lang === 'id' ? 'Menyimpan progress...' : 'Saving progress...')
                  : (lang === 'id' ? 'Progress tersimpan otomatis' : 'Auto-save active & synced')}
              </span>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3.5 rounded-2xl bg-surface-panel border border-surface-border text-center">
              <span className="text-2xl block mb-1">⭐</span>
              <span className="text-xl font-black text-amber-500">{totalStars}</span>
              <span className="text-[11px] font-bold text-ink-500 block">
                {lang === 'id' ? 'Total Bintang' : 'Total Stars'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-panel border border-surface-border text-center">
              <span className="text-2xl block mb-1">🏆</span>
              <span className="text-xl font-black text-duo-green-dark">{completedLessonsCount}</span>
              <span className="text-[11px] font-bold text-ink-500 block">
                {lang === 'id' ? 'Lesson Selesai' : 'Completed'}
              </span>
            </div>
          </div>

          {/* Google Auth CTA or Account Management */}
          {user.isGuest ? (
            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-ink-700 leading-relaxed">
                💡 {lang === 'id'
                  ? 'Masuk dengan Google agar progress belajar kamu otomatis tersinkronisasi di semua perangkat dan tidak hilang di jumble.vercel!'
                  : 'Sign in with Google to keep your learning progress permanently synchronized across devices and production deployments!'}
              </div>

              <button
                onClick={async () => {
                  await signInWithGoogle();
                  onClose();
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-white text-gray-900 hover:bg-gray-50 border-2 border-slate-200 font-black text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm active:scale-98"
                id="google-signin-btn"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{lang === 'id' ? 'Lanjutkan dengan Google' : 'Continue with Google'}</span>
              </button>

              {!isConfigured && (
                <span className="text-[10px] text-center text-ink-400">
                  (Demo environment: simulates instant sign-in while preserving progress)
                </span>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await signOut();
                  onClose();
                }}
                className="w-full text-duo-red hover:text-duo-red-dark hover:bg-red-50 border-red-200"
              >
                {lang === 'id' ? 'Keluar Akun' : 'Sign Out'}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
