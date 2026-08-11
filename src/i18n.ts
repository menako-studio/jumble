/**
 * i18n.ts — i18next configuration
 * Supports: English (en) [Default] and Bahasa Indonesia (id)
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en/translation.json';
import idTranslation from './locales/id/translation.json';

const resources = {
  en: { translation: enTranslation },
  id: { translation: idTranslation },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    // Default language — detect from localStorage or fall back to 'en'
    lng: (localStorage.getItem('jumble_lang') as 'en' | 'id') || 'en',
    fallbackLng: 'en',
    interpolation: {
      // React already escapes values
      escapeValue: false,
    },
  });

export default i18n;
