import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/common/Header/Header';
import SkillsList from '../../components/skills/SkillsList';
import { aboutText } from '../../content/data/about';
import { skills } from '../../content/data/skills';
import styles from './Home.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      <Helmet>
        <title>Marco Santar - Robotics & CV Engineer</title>
        <meta name="description" content="Marco Santar - Robotics & CV Engineer, ML researcher, and full-stack developer. Exploring mechanistic interpretability and LLM safety." />
        <link rel="canonical" href="https://marcosantar.com/" />
      </Helmet>

      <Header />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>About</h2>
        <p className={styles.about}>{aboutText}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Skills</h2>
        <SkillsList skills={skills} />
      </section>
    </div>
  );
};

export default Home;
