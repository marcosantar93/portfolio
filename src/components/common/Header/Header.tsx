import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.profileImage}>
        <img src="/assets/images/profile.jpg" alt="Marco Santar" />
      </div>
      <h1 className={styles.name}>Marco Santarcangelo</h1>
      <p className={styles.title}>Full Stack Developer</p>
    </header>
  );
};

export default Header;
