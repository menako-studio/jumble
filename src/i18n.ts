/**
 * i18n.ts — i18next configuration
 * Supports: Bahasa Indonesia (id) and Japanese (jp)
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import idTranslation from './locales/id/translation.json';
import jpTranslation from './locales/jp/translation.json';

const resources = {
  id: { translation: idTranslation },
  jp: { translation: jpTranslation },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    // Default language — detect from localStorage or fall back to 'id'
    lng: (localStorage.getItem('jumble_lang') as 'id' | 'jp') || 'id',
    fallbackLng: 'id',
    interpolation: {
      // React already escapes values
      escapeValue: false,
    },
  });

export default i18n;
