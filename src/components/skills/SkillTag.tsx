import React from 'react';
import styles from './SkillTag.module.css';

interface SkillTagProps {
  skill: string;
}

const SkillTag: React.FC<SkillTagProps> = ({ skill }) => {
  return <span className={styles.skillTag}>{skill}</span>;
};

export default SkillTag;
