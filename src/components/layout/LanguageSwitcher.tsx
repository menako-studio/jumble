/**
 * LanguageSwitcher.tsx — EN ↔ ID toggle button
 */

import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();
  const current = (i18n.language as 'en' | 'id') || 'en';

  const toggle = () => {
    const next = current === 'en' ? 'id' : 'en';
    i18n.changeLanguage(next);
    localStorage.setItem('jumble_lang', next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center gap-1.5 px-3 min-h-11 rounded-xl glass-light hover:bg-slate-100 transition-colors duration-200 font-bold text-sm cursor-pointer"
      aria-label={`${t('ui.switchLanguage')} (${current.toUpperCase()})`}
      id="lang-switcher"
    >
      <span className="text-lg" aria-hidden="true">{current === 'en' ? '🇬🇧' : '🇮🇩'}</span>
      <span className="uppercase text-ink-700">{current}</span>
    </button>
  );
};
