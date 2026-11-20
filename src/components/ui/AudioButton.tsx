import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { speak, isSpeechSupported } from '../../lib/speech';

interface AudioButtonProps {
  text: string;
  lang?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'glass' | 'accent';
  className?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  lang = 'en-US',
  size = 'md',
  variant = 'glass',
  className = '',
}) => {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isSpeechSupported()) {
    return null;
  }

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) return;
    setIsPlaying(true);
    speak(text, { lang, rate: 0.9 })
      .then(() => setIsPlaying(false))
      .catch(() => setIsPlaying(false));
  };

  const sizeClasses = {
    sm: 'w-11 h-11 text-sm',
    md: 'w-11 h-11 text-base',
    lg: 'w-12 h-12 text-lg',
  }[size];

  const variantClasses = {
    ghost: 'bg-slate-100 hover:bg-slate-200 text-ink-700',
    glass: 'bg-sky-50 hover:bg-sky-100 text-duo-blue-dark border border-sky-200',
    accent: 'bg-duo-yellow hover:bg-duo-yellow-dark text-amber-950 font-black',
  }[variant];

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      type="button"
      onClick={handlePlay}
      className={`rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${sizeClasses} ${variantClasses} ${className}`}
      title={t('ui.listen')}
      aria-label={t('ui.listen')}
      aria-pressed={isPlaying}
      id={`audio-btn-${text.slice(0, 10).replace(/\s+/g, '-')}`}
    >
      {isPlaying ? (
        <motion.span
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
          className="text-emerald-600" aria-hidden="true"
        >
          🔊
        </motion.span>
      ) : (
        <span aria-hidden="true">🗣️</span>
      )}
    </motion.button>
  );
};
