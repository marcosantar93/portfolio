import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header className={styles.header}>
      <div className={styles.profileImage}>
        <img src="/assets/images/profile.jpg" alt="Marco Santarcangelo Zazzetta" />
      </div>
      <h1 className={styles.name}>Marco Santarcangelo Zazzetta</h1>
      <p className={styles.title}>{t.home.titles[0]}</p>
    </header>
  );
};

export default Header;
