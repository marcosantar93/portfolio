import { BlogPost } from '../../types';

export const blogPosts: BlogPost[] = [
  {
    slug: 'activation-steering-basics',
    title: 'Getting Started with Activation Steering',
    date: '2024-12-15',
    excerpt: 'A practical introduction to steering language model behavior by manipulating activation vectors in specific layers.',
    tags: ['Mechanistic Interpretability', 'Activation Steering', 'LLMs'],
    readTime: '8 min read',
  },
  {
    slug: 'safety-representations-initial-findings',
    title: 'Initial Findings on Safety Representations',
    date: '2024-11-20',
    excerpt: 'Exploring how different model families encode safety-related concepts and what this means for AI alignment.',
    tags: ['AI Safety', 'Interpretability', 'Research'],
    readTime: '10 min read',
  },
];
