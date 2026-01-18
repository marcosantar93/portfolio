import React from 'react';
import SkillTag from './SkillTag';
import styles from './SkillsList.module.css';

interface SkillsListProps {
  skills: string[];
}

const SkillsList: React.FC<SkillsListProps> = ({ skills }) => {
  return (
    <div className={styles.skillsList}>
      {skills.map((skill) => (
        <SkillTag key={skill} skill={skill} />
      ))}
    </div>
  );
};

export default SkillsList;
