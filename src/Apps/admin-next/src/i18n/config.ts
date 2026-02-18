import i18n, { InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslations from "./locales/en.json";
import viTranslations from "./locales/vi.json";

// Type definitions for translations
export interface TranslationResources {
  en: {
    translation: typeof enTranslations;
  };
  vi: {
    translation: typeof viTranslations;
  };
}

const resources: TranslationResources = {
  en: {
    translation: enTranslations,
  },
  vi: {
    translation: viTranslations,
  },
};

const i18nConfig: InitOptions = {
  resources,
  fallbackLng: "en",
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
  },
};

i18n.use(LanguageDetector).use(initReactI18next).init(i18nConfig);

export default i18n;
