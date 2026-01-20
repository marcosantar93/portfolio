import React from 'react';
import Timeline from '../../components/timeline/Timeline';
import TimelineItem from '../../components/timeline/TimelineItem';
import { useTranslation } from '../../hooks/useTranslation';
import { educationData } from '../../content/data/education';
import styles from './Education.module.css';

const Education: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.education}>
      <h1 className={styles.pageTitle}>{t.education.pageTitle}</h1>
      <Timeline>
        {educationData.map((item) => {
          const translatedItem = t.education.items[item.id as keyof typeof t.education.items];
          return (
            <TimelineItem
              key={item.id}
              title={translatedItem?.degree || item.degree}
              subtitle={translatedItem?.institution || item.institution}
              period={translatedItem?.period || item.period}
              description={translatedItem?.description || item.description}
            />
          );
        })}
      </Timeline>
    </div>
  );
};

export default Education;
