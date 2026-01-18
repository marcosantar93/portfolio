import React from 'react';
import ResearchCard from '../../components/research/ResearchCard';
import { researchData } from '../../content/data/research';
import styles from './Research.module.css';

const Research: React.FC = () => {
  return (
    <div className={styles.research}>
      <h1 className={styles.pageTitle}>Research & Experiments</h1>
      <p className={styles.description}>
        Amateur explorations in mechanistic interpretability and LLM safety.
        These are personal research projects conducted outside of work.
      </p>
      {researchData.map((project) => (
        <ResearchCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default Research;
