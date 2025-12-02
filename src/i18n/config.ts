import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from '../locales/fr.json';
import it from '../locales/it.json';
import en from '../locales/en.json';
import es from '../locales/es.json';

// Fonction pour détecter et mapper la langue du navigateur
const detectBrowserLanguage = (): string => {
  const browserLang = navigator.language || navigator.languages?.[0] || 'fr';
  const langCode = browserLang.split('-')[0].toLowerCase(); // 'en-US' -> 'en'
  const supportedLanguages = ['fr', 'en', 'it', 'es'];
  return supportedLanguages.includes(langCode) ? langCode : 'fr';
};

// Récupérer la langue sauvegardée ou détecter celle du navigateur
const savedLanguage = localStorage.getItem('appLanguage') || detectBrowserLanguage();

const initI18n = async () => {
  await i18n
    .use(initReactI18next)
    .init({
      resources: {
        fr: { translation: fr },
        it: { translation: it },
        en: { translation: en },
        es: { translation: es }
      },
      lng: savedLanguage,
      fallbackLng: 'fr',
      interpolation: {
        escapeValue: false
      },
      react: {
        useSuspense: false // ✅ Important pour éviter les erreurs de hooks
      }
    });

  // Sauvegarder la langue quand elle change
  i18n.on('languageChanged', (lng) => {
    localStorage.setItem('appLanguage', lng);
  });
};

initI18n().catch(err => console.error('i18n initialization error:', err));

export default i18n;
