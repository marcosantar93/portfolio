import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTranslation } from '../../../hooks/useTranslation';
import styles from './LanguageSelector.module.css';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  const ariaLabel = language === 'en' ? t.common.switchToSpanish : t.common.switchToEnglish;

  return (
    <button
      onClick={toggleLanguage}
      className={styles.languageSelector}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <span className={`${styles.lang} ${language === 'en' ? styles.active : ''}`}>
        EN
      </span>
      <span className={styles.separator}>/</span>
      <span className={`${styles.lang} ${language === 'es' ? styles.active : ''}`}>
        ES
      </span>
    </button>
  );
};

export default LanguageSelector;
