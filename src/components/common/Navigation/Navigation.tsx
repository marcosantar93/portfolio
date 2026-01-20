import React from 'react';
import { NavLink } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { useTranslation } from '../../../hooks/useTranslation';
import styles from './Navigation.module.css';

const Navigation: React.FC = () => {
  const { t } = useTranslation();

  const navItems = [
    { path: '/', label: t.nav.home },
    { path: '/experience', label: t.nav.experience },
    { path: '/education', label: t.nav.education },
    { path: '/blog', label: t.nav.blog },
    { path: '/contact', label: t.nav.contact },
  ];

  return (
    <nav className={styles.navigation}>
      <div className={styles.navContent}>
        <div className={styles.navLinks}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className={styles.controls}>
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
