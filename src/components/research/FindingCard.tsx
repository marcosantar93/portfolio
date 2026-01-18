import React from 'react';
import { ResearchFinding } from '../../types';
import styles from './FindingCard.module.css';

interface FindingCardProps {
  finding: ResearchFinding;
}

const FindingCard: React.FC<FindingCardProps> = ({ finding }) => {
  const statusClass = styles[finding.status];

  return (
    <div className={`${styles.findingCard} ${statusClass}`}>
      <div className={styles.statusIndicator}></div>
      <div className={styles.content}>
        <h4 className={styles.title}>{finding.title}</h4>
        <p className={styles.description}>{finding.description}</p>
      </div>
    </div>
  );
};

export default FindingCard;
