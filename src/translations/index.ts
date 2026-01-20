import { en } from './en';
import { es } from './es';
import { Language } from '../context/LanguageContext';

export const translations = {
  en,
  es,
};

export type TranslationKey = typeof en;

export const getTranslation = (language: Language): TranslationKey => {
  return translations[language];
};
