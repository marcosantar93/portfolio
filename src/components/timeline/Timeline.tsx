import React, { ReactNode } from 'react';
import styles from './Timeline.module.css';

interface TimelineProps {
  children: ReactNode;
}

const Timeline: React.FC<TimelineProps> = ({ children }) => {
  return <div className={styles.timeline}>{children}</div>;
};

export default Timeline;
