export const es = {
  // Navegación
  nav: {
    home: 'Inicio',
    experience: 'Experiencia',
    education: 'Educación',
    blog: 'Blog',
    contact: 'Contacto',
  },

  // Página de Inicio
  home: {
    pageTitle: 'Marco Santarcangelo Zazzetta - Robotics & CV Engineer',
    metaDescription: 'Marco Santarcangelo Zazzetta - Robotics & CV Engineer, investigador de ML, y full-stack developer. Explorando mechanistic interpretability y seguridad en LLMs.',
    aboutTitle: 'Acerca de',
    skillsTitle: 'Habilidades',
    aboutText: `Soy Robotics & CV Engineer en Scale AI con un profundo interés en mechanistic interpretability y en comprender cómo funcionan realmente las redes neuronales. Mi experiencia abarca computer vision, desarrollo full-stack e infraestructura en la nube, pero lo que más me entusiasma es explorar el funcionamiento interno de los language models y los mecanismos de seguridad en sistemas de IA.

Actualmente experimento con activation steering y representation analysis en mi tiempo libre, intentando mapear cómo diferentes familias de modelos codifican conceptos relacionados con la seguridad.`,
    titles: [
      'Robotics & CV Engineer',
      'Aspirante a Mech Interp Researcher',
      'Full Stack Developer',
    ],
  },

  // Página de Experiencia
  experience: {
    pageTitle: 'Experiencia',
    jobs: {
      'scale-ai': {
        title: 'Robotics & CV Engineer',
        company: 'Scale AI',
        period: 'Dic 2024 — Presente',
        description: 'Trabajo en soluciones de robótica y computer vision para datos de entrenamiento de IA.',
      },
      'caylent': {
        title: 'Cloud Engineer',
        company: 'Caylent',
        period: 'Ene 2024 — Dic 2024',
        description: 'Diseñé e implementé soluciones de infraestructura cloud para clientes empresariales usando servicios de AWS.',
      },
      'amazon': {
        title: 'Software Development Engineer',
        company: 'Amazon',
        period: 'Jun 2022 — Jun 2023',
        description: 'Desarrollé servicios backend escalables y APIs para la plataforma de e-commerce de Amazon.',
      },
      'zksystems': {
        title: 'Full Stack Developer & Tech Lead',
        company: 'ZkSystems',
        period: 'Mar 2021 — Jun 2022',
        description: 'Lideré el equipo de desarrollo construyendo aplicaciones web y gestioné las decisiones de arquitectura técnica.',
      },
      'rebellion-pay': {
        title: 'Full Stack Developer',
        company: 'Rebellion Pay',
        period: 'Jun 2020 — Mar 2021',
        description: 'Desarrollé aplicaciones fintech con enfoque en procesamiento de pagos y seguridad.',
      },
      'freelance': {
        title: 'Front-end Developer',
        company: 'Freelance',
        period: 'Jun 2019 — Jun 2020',
        description: 'Construí aplicaciones web responsivas para varios clientes en diferentes industrias.',
      },
      'sysone': {
        title: 'Mobile & Backend Developer',
        company: 'SysOne',
        period: 'Feb 2019 — Jun 2019',
        description: 'Desarrollé aplicaciones móviles y APIs backend para soluciones empresariales.',
      },
      'wehaus': {
        title: 'IoT & Computer Vision Developer',
        company: 'WeHaus IoT',
        period: 'Ene 2018 — Feb 2019',
        description: 'Implementé soluciones IoT y sistemas de computer vision para automatización de hogares inteligentes.',
      },
    },
  },

  // Página de Educación
  education: {
    pageTitle: 'Educación',
    items: {
      'unlp': {
        degree: 'Ingeniería en Computación',
        institution: 'Universidad Nacional de La Plata',
        period: '2012 — 2018',
        description: 'Enfocado en ingeniería de software, sistemas embebidos y arquitectura de computadoras.',
      },
    },
  },

  // Página de Blog
  blog: {
    pageTitle: 'Blog',
    metaDescription: 'Reflexiones y hallazgos sobre mechanistic interpretability, seguridad en LLMs e investigación en IA por Marco Santarcangelo Zazzetta.',
    description: 'Reflexiones y hallazgos sobre mechanistic interpretability, seguridad en LLMs e investigación en IA.',
    noPosts: '¡Aún no hay publicaciones! Vuelve pronto.',
  },

  // Página de Contacto
  contact: {
    pageTitle: 'Contacto',
    description: 'Sentite libre de contactarme si te gustaría discutir sobre mechanistic interpretability, investigación en seguridad de LLMs, o posibles colaboraciones.',
  },

  // Común
  common: {
    readMore: 'Leer más',
    backToBlog: 'Volver al blog',
    switchToDark: 'Cambiar a modo oscuro',
    switchToLight: 'Cambiar a modo claro',
    switchToSpanish: 'Cambiar a español',
    switchToEnglish: 'Cambiar a inglés',
    postNotFound: 'Post No Encontrado',
    postNotFoundMessage: 'El post que estás buscando no existe.',
  },

  // Blog Posts
  blogPosts: {
    'sign-inversion-activation-steering': {
      title: 'Intentamos Jailbreakear LLMs con Activation Steering. Nos Equivocamos de Signo.',
      excerpt: 'El método estándar para extraer "refusal directions" en realidad extrae lo opuesto—una dirección que refuerza la seguridad. Para jailbreakear, necesitás hacer steering en la dirección contraria.',
      readTime: '12 min de lectura',
    },
    'empathy-structure-validated': {
      title: 'Intentamos Medir Empatía en LLMs. Encontramos un Pitfall Metodológico—Y Luego Descubrimos Algo Universal.',
      excerpt: 'Cómo un experimento fallido reveló un problema sutil con la comparación de probes, y lo que aprendimos cuando lo arreglamos: la estructura de empatía es real, causalmente significativa, y universal entre arquitecturas.',
      readTime: '15 min de lectura',
    },
    'layer-specific-safety-vulnerabilities': {
      title: 'Vulnerabilidades de Seguridad Layer-Specific en LLMs: 83% Jailbreak Rate vía Activation Steering',
      excerpt: 'Investigando cómo los mecanismos de seguridad en language models instruction-tuned están layer-localized y son sistemáticamente bypasseables. Logramos 83% de éxito de jailbreak en Mistral-7B mediante activation steering dirigido al layer 24, mientras Gemma y Llama permanecen resistentes.',
      readTime: '10 min de lectura',
    },
    'empathetic-language-bandwidth': {
      title: 'Midiendo el Empathetic Language Bandwidth en LLMs',
      excerpt: 'Investigando cómo diferentes language models codifican patrones de comunicación empática a través de geometric analysis. Encontramos una variación del 109% en representational bandwidth entre cinco modelos de 7-9B, con empathy encoding 2.8x más grande que syntactic complexity.',
      readTime: '12 min de lectura',
    },
  },
};
