export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  skills?: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description?: string;
}

export interface ResearchFinding {
  id: string;
  title: string;
  description: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  period: string;
  findings: ResearchFinding[];
  tags?: string[];
  githubUrl?: string;
  paperUrl?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readTime?: string;
  content?: string;
}

export interface ContactLink {
  id: string;
  label: string;
  url: string;
  icon: string;
}

export type Theme = 'light' | 'dark';
