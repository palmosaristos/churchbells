import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from '../locales/fr.json';
import it from '../locales/it.json';
import en from '../locales/en.json';

// Récupérer la langue sauvegardée ou par défaut (FR)
const savedLanguage = localStorage.getItem('appLanguage') || 'fr';

const initI18n = async () => {
  await i18n
    .use(initReactI18next)
    .init({
      resources: {
        fr: { translation: fr },
        it: { translation: it },
        en: { translation: en }
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
