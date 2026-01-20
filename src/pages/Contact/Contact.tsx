import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { contactLinks } from '../../content/data/contact';
import styles from './Contact.module.css';

const getIconSymbol = (iconName: string): string => {
  const icons: { [key: string]: string } = {
    email: '✉',
    linkedin: 'in',
    github: '⌘',
    twitter: '𝕏',
  };
  return icons[iconName] || '';
};

const Contact: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.contact}>
      <h1 className={styles.pageTitle}>{t.contact.pageTitle}</h1>
      <p className={styles.description}>
        {t.contact.description}
      </p>

      <div className={styles.contactLinks}>
        {contactLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactLink}
          >
            <span className={styles.icon}>{getIconSymbol(link.icon)}</span>
            <span className={styles.label}>{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Contact;
