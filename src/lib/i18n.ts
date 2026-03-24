// lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import your translation files
import en from '../../public/locales/en/common.json';
import de from '../../public/locales/de/common.json';
import fr from '../../public/locales/fr/common.json';
import es from '../../public/locales/es/common.json';
import ja from '../../public/locales/ja/common.json';
import zh from '../../public/locales/zh/common.json';

const resources = {
  en: { common: en },
  de: { common: de },
  fr: { common: fr },
  es: { common: es },
  ja: { common: ja },
  zh: { common: zh },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false, // we vibin this works
    },
    ns: ['common'],
    defaultNS: 'common',
  });

export default i18n;
