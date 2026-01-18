import React, { ReactNode } from 'react';
import styles from './TimelineItem.module.css';

interface TimelineItemProps {
  title: string;
  subtitle: string;
  period: string;
  description?: string;
  skills?: string[];
  children?: ReactNode;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  title,
  subtitle,
  period,
  description,
  skills,
  children,
}) => {
  return (
    <div className={styles.timelineItem}>
      <div className={styles.marker}></div>
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
          <span className={styles.period}>{period}</span>
        </div>
        {description && <p className={styles.description}>{description}</p>}
        {children}
        {skills && skills.length > 0 && (
          <div className={styles.skills}>
            {skills.map((skill) => (
              <span key={skill} className={styles.skill}>
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineItem;
