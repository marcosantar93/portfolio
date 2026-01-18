import React, { useEffect, useRef, useState } from 'react';
import Timeline from '../../components/timeline/Timeline';
import TimelineItem from '../../components/timeline/TimelineItem';
import { experienceData } from '../../content/data/experience';
import styles from './Experience.module.css';

const Experience: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;

      // Calculate scroll progress (0 to 1)
      const scrollTop = -rect.top;
      const maxScroll = elementHeight - windowHeight;
      const progress = Math.max(0, Math.min(1, scrollTop / maxScroll));

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.experience} ref={containerRef}>
      <h1 className={styles.pageTitle}>Work Experience</h1>

      <div
        className={styles.timelineProgress}
        style={{ height: `${scrollProgress * 100}%` }}
      />

      <Timeline>
        {experienceData.map((item) => (
          <TimelineItem
            key={item.id}
            title={item.title}
            subtitle={item.company}
            period={item.period}
            description={item.description}
            skills={item.skills}
          />
        ))}
      </Timeline>
    </div>
  );
};

export default Experience;
