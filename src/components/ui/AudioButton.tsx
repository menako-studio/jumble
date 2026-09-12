import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-lg',
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
      onClick={handlePlay}
      className={`rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${sizeClasses} ${variantClasses} ${className}`}
      title="Listen to pronunciation"
      aria-label="Listen to pronunciation"
      id={`audio-btn-${text.slice(0, 10).replace(/\s+/g, '-')}`}
    >
      {isPlaying ? (
        <motion.span
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
          className="text-emerald-400"
        >
          🔊
        </motion.span>
      ) : (
        <span>🗣️</span>
      )}
    </motion.button>
  );
};
