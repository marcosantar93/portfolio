import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';

export const useTranslation = () => {
  const { language } = useLanguage();
  const t = getTranslation(language);

  return { t, language };
};
