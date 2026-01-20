import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useTranslation } from '../../../hooks/useTranslation';
import styles from './ThemeToggle.module.css';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const ariaLabel = theme === 'light' ? t.common.switchToDark : t.common.switchToLight;

  return (
    <button
      className={styles.themeToggle}
      onClick={toggleTheme}
      aria-label={ariaLabel}
    >
      <div className={`${styles.circle} ${theme === 'dark' ? styles.dark : styles.light}`} />
    </button>
  );
};

export default ThemeToggle;
