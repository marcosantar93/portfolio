import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import styles from './ThemeToggle.module.css';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={styles.themeToggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className={`${styles.circle} ${theme === 'dark' ? styles.dark : styles.light}`} />
    </button>
  );
};

export default ThemeToggle;
