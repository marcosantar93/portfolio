import React from 'react';
import { ResearchProject } from '../../types';
import FindingCard from './FindingCard';
import styles from './ResearchCard.module.css';

interface ResearchCardProps {
  project: ResearchProject;
}

const ResearchCard: React.FC<ResearchCardProps> = ({ project }) => {
  return (
    <div className={styles.researchCard}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{project.title}</h2>
          <p className={styles.period}>{project.period}</p>
        </div>
        {(project.githubUrl || project.paperUrl) && (
          <div className={styles.links}>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                GitHub
              </a>
            )}
            {project.paperUrl && (
              <a
                href={project.paperUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Paper
              </a>
            )}
          </div>
        )}
      </div>

      <p className={styles.description}>{project.description}</p>

      {project.tags && project.tags.length > 0 && (
        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {project.findings && project.findings.length > 0 && (
        <div className={styles.findings}>
          <h3 className={styles.findingsTitle}>Key Findings</h3>
          {project.findings.map((finding) => (
            <FindingCard key={finding.id} finding={finding} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResearchCard;
