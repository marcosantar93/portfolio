export const en = {
  // Navigation
  nav: {
    home: 'Home',
    experience: 'Experience',
    education: 'Education',
    blog: 'Blog',
    contact: 'Contact',
  },

  // Home Page
  home: {
    pageTitle: 'Marco Santarcangelo Zazzetta - Robotics & CV Engineer',
    metaDescription: 'Marco Santarcangelo Zazzetta - Robotics & CV Engineer, ML researcher, and full-stack developer. Exploring mechanistic interpretability and LLM safety.',
    aboutTitle: 'About',
    skillsTitle: 'Skills',
    aboutText: `I'm a Robotics & CV Engineer at Scale AI with a deep interest in mechanistic interpretability and understanding how neural networks actually work. My background spans computer vision, full-stack development, and cloud infrastructure, but I'm most excited about probing the inner workings of language models and exploring safety mechanisms in AI systems.

Currently experimenting with activation steering and representation analysis in my spare time, trying to map how different model families encode safety-related concepts.`,
    titles: [
      'Robotics & CV Engineer',
      'Wannabe Mech Interp Researcher',
      'Full Stack Developer',
    ],
  },

  // Experience Page
  experience: {
    pageTitle: 'Experience',
    jobs: {
      'scale-ai': {
        title: 'Robotics & CV Engineer',
        company: 'Scale AI',
        period: 'Dec 2024 — Present',
        description: 'Working on robotics and computer vision solutions for AI training data.',
      },
      'caylent': {
        title: 'Cloud Engineer',
        company: 'Caylent',
        period: 'Jan 2024 — Dec 2024',
        description: 'Designed and implemented cloud infrastructure solutions for enterprise clients using AWS services.',
      },
      'amazon': {
        title: 'Software Development Engineer',
        company: 'Amazon',
        period: 'Jun 2022 — Jun 2023',
        description: 'Developed scalable backend services and APIs for Amazon\'s e-commerce platform.',
      },
      'zksystems': {
        title: 'Full Stack Developer & Tech Lead',
        company: 'ZkSystems',
        period: 'Mar 2021 — Jun 2022',
        description: 'Led development team building web applications and managed technical architecture decisions.',
      },
      'rebellion-pay': {
        title: 'Full Stack Developer',
        company: 'Rebellion Pay',
        period: 'Jun 2020 — Mar 2021',
        description: 'Developed fintech applications with focus on payment processing and security.',
      },
      'freelance': {
        title: 'Front-end Developer',
        company: 'Freelance',
        period: 'Jun 2019 — Jun 2020',
        description: 'Built responsive web applications for various clients across different industries.',
      },
      'sysone': {
        title: 'Mobile & Backend Developer',
        company: 'SysOne',
        period: 'Feb 2019 — Jun 2019',
        description: 'Developed mobile applications and backend APIs for enterprise solutions.',
      },
      'wehaus': {
        title: 'IoT & Computer Vision Developer',
        company: 'WeHaus IoT',
        period: 'Jan 2018 — Feb 2019',
        description: 'Implemented IoT solutions and computer vision systems for smart home automation.',
      },
    },
  },

  // Education Page
  education: {
    pageTitle: 'Education',
    items: {
      'unlp': {
        degree: 'Computer Engineering',
        institution: 'Universidad Nacional de La Plata',
        period: '2012 — 2018',
        description: 'Focused on software engineering, embedded systems, and computer architecture.',
      },
    },
  },

  // Blog Page
  blog: {
    pageTitle: 'Blog',
    metaDescription: 'Thoughts and findings on mechanistic interpretability, LLM safety, and AI research by Marco Santarcangelo Zazzetta.',
    description: 'Thoughts and findings on mechanistic interpretability, LLM safety, and AI research.',
    noPosts: 'No blog posts yet. Check back soon!',
  },

  // Contact Page
  contact: {
    pageTitle: 'Contact',
    description: 'Feel free to reach out if you\'d like to discuss mechanistic interpretability, LLM safety research, or potential collaborations.',
  },

  // Common
  common: {
    readMore: 'Read more',
    backToBlog: 'Back to blog',
    switchToDark: 'Switch to dark mode',
    switchToLight: 'Switch to light mode',
    switchToSpanish: 'Switch to Spanish',
    switchToEnglish: 'Switch to English',
    postNotFound: 'Post Not Found',
    postNotFoundMessage: "The blog post you're looking for doesn't exist.",
  },

  // Blog Posts
  blogPosts: {
    'empathy-structure-validated': {
      title: 'We Tried to Measure Empathy in LLMs. We Found a Methodological Pitfall—Then Discovered Something Universal.',
      excerpt: 'How a failed experiment revealed a subtle issue with probe comparison, and what we learned when we fixed it: empathy structure is real, causally meaningful, and universal across architectures.',
      readTime: '15 min read',
    },
    'layer-specific-safety-vulnerabilities': {
      title: 'Layer-Specific Safety Vulnerabilities in LLMs: 83% Jailbreak Rate via Activation Steering',
      excerpt: 'Investigating how safety mechanisms in instruction-tuned language models are layer-localized and systematically bypassable. We achieve 83% jailbreak success on Mistral-7B through targeted layer-24 activation steering, while Gemma and Llama remain resistant.',
      readTime: '10 min read',
    },
    'empathetic-language-bandwidth': {
      title: 'Measuring Empathetic Language Bandwidth in LLMs',
      excerpt: 'Investigating how different language models encode empathetic communication patterns through geometric analysis. We find 109% variation in representational bandwidth across five 7-9B models, with empathy encoding 2.8x larger than syntactic complexity.',
      readTime: '12 min read',
    },
  },
};
