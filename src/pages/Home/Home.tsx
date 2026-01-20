import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/common/Header/Header';
import SkillsList from '../../components/skills/SkillsList';
import { useTranslation } from '../../hooks/useTranslation';
import { skills } from '../../content/data/skills';
import styles from './Home.module.css';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.home}>
      <Helmet>
        <title>{t.home.pageTitle}</title>
        <meta name="description" content={t.home.metaDescription} />
        <link rel="canonical" href="https://marcosantar.com/" />
      </Helmet>

      <Header />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t.home.aboutTitle}</h2>
        <p className={styles.about}>{t.home.aboutText}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t.home.skillsTitle}</h2>
        <SkillsList skills={skills} />
      </section>
    </div>
  );
};

export default Home;
