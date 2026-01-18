import { ResearchProject } from '../../types';

export const researchData: ResearchProject[] = [
  {
    id: 'safety-representations',
    title: 'Mapping Safety Representations in LLMs',
    description: 'Exploring how different language models represent and process safety-related concepts through activation steering experiments. This research investigates whether safety mechanisms are universal across model families or unique to individual architectures.',
    period: '2024',
    findings: [
      {
        id: 'finding-1',
        title: 'Cross-Model Steering Vectors',
        description: 'Successfully extracted and applied steering vectors across different model families (GPT, Claude, Llama), demonstrating some transferability of safety representations.',
        status: 'success',
      },
      {
        id: 'finding-2',
        title: 'Layer-Specific Patterns',
        description: 'Safety-related activations show distinct patterns in middle layers (layers 15-25 in 32-layer models), suggesting a specific computational stage for safety processing.',
        status: 'success',
      },
      {
        id: 'finding-3',
        title: 'Fine-Tuning Interference',
        description: 'Post-training modifications can significantly alter safety representations, but core patterns remain somewhat stable across different fine-tuning approaches.',
        status: 'warning',
      },
      {
        id: 'finding-4',
        title: 'Limited Universality',
        description: 'While some patterns transfer, many safety mechanisms appear to be architecture-specific, limiting the generalizability of steering approaches.',
        status: 'error',
      },
    ],
    tags: ['Mechanistic Interpretability', 'LLM Safety', 'Activation Steering'],
  },
];
