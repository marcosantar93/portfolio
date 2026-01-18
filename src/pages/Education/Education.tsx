import React from 'react';
import Timeline from '../../components/timeline/Timeline';
import TimelineItem from '../../components/timeline/TimelineItem';
import { educationData } from '../../content/data/education';
import styles from './Education.module.css';

const Education: React.FC = () => {
  return (
    <div className={styles.education}>
      <h1 className={styles.pageTitle}>Education</h1>
      <Timeline>
        {educationData.map((item) => (
          <TimelineItem
            key={item.id}
            title={item.degree}
            subtitle={item.institution}
            period={item.period}
            description={item.description}
          />
        ))}
      </Timeline>
    </div>
  );
};

export default Education;
