import React from 'react';
import Header from '../../components/common/Header/Header';
import SkillsList from '../../components/skills/SkillsList';
import { aboutText } from '../../content/data/about';
import { skills } from '../../content/data/skills';
import styles from './Home.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles.home}>
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
