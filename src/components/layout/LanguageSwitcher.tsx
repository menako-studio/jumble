/**
 * LanguageSwitcher.tsx — EN ↔ ID toggle button
 */

import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const current = (i18n.language as 'en' | 'id') || 'en';

  const toggle = () => {
    const next = current === 'en' ? 'id' : 'en';
    i18n.changeLanguage(next);
    localStorage.setItem('jumble_lang', next);
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-light hover:bg-white/15 transition-all duration-200 font-bold text-sm cursor-pointer"
      aria-label="Switch language"
      id="lang-switcher"
    >
      <span className="text-lg">{current === 'en' ? '🇬🇧' : '🇮🇩'}</span>
      <span className="uppercase text-white/80">{current}</span>
    </button>
  );
};
