export interface TechItem {
  name: string;
  icon: string;
  level: number;
  years: number;
  projects: number;
  description: {
    pt: string;
    en: string;
    es: string;
    fr: string;
    zh: string;
  };
}

export interface TechCategory {
  id: string;
  name: {
    pt: string;
    en: string;
    es: string;
    fr: string;
    zh: string;
  };
  icon: string;
  techs: TechItem[];
}

export const techCategories: TechCategory[] = [
  {
    id: "languages",
    name: {
      pt: "Linguagens",
      en: "Languages",
      es: "Lenguajes",
      fr: "Langages",
      zh: "编程语言",
    },
    icon: "💻",
    techs: [
      {
        name: "TypeScript",
        icon: "img-typescript.png",
        level: 90,
        years: 3,
        projects: 25,
        description: {
          pt: "Superset do JavaScript com tipagem estática, aumenta produtividade e segurança no código.",
          en: "JavaScript superset with static typing, increases productivity and code safety.",
          es: "Superconjunto de JavaScript con tipado estático, aumenta la productividad.",
          fr: "Sur-ensemble de JavaScript avec typage statique, augmente la productivité.",
          zh: "带静态类型的JavaScript超集，提高代码安全性和效率。",
        },
      },
      {
        name: "JavaScript",
        icon: "img-javascript.png",
        level: 92,
        years: 5,
        projects: 40,
        description: {
          pt: "Linguagem principal para desenvolvimento web, versátil e presente em todo o stack.",
          en: "Main language for web development, versatile and present throughout the stack.",
          es: "Lenguaje principal para desarrollo web, versátil.",
          fr: "Langage principal pour le développement web, polyvalent.",
          zh: "主要的Web开发语言，无处不在。",
        },
      },
      {
        name: "Python",
        icon: "img-python.png",
        level: 70,
        years: 2,
        projects: 8,
        description: {
          pt: "Linguagem de alto nível, excelente para automação, IA e scripts.",
          en: "High-level language, excellent for automation, AI and scripts.",
          es: "Lenguaje de alto nivel, excelente para automatización.",
          fr: "Langage de haut niveau, excellent pour l'automatisation.",
          zh: "高级语言，非常适合自动化和AI。",
        },
      },
      {
        name: "PHP",
        icon: "img-php.png",
        level: 65,
        years: 4,
        projects: 12,
        description: {
          pt: "Server-side linguagem, amplamente usada para CMS e APIs.",
          en: "Server-side language, widely used for CMS and APIs.",
          es: "Lenguaje del lado del servidor, ampliamente usado.",
          fr: "Langage côté serveur, largement utilisé pour les CMS.",
          zh: "服务端语言，广泛用于CMS和API。",
        },
      },
      {
        name: "HTML5",
        icon: "img-html.png",
        level: 95,
        years: 6,
        projects: 50,
        description: {
          pt: "Markup language fundamental para toda web.",
          en: "Fundamental markup language for the entire web.",
          es: "Lenguaje de marcado fundamental para la web.",
          fr: "Langage de balisage fondamental pour le web.",
          zh: "Web的基础标记语言。",
        },
      },
      {
        name: "CSS3",
        icon: "img-css.png",
        level: 93,
        years: 6,
        projects: 50,
        description: {
          pt: "Estilização visual, animações e design responsivo.",
          en: "Visual styling, animations and responsive design.",
          es: "Estilización visual, animaciones y diseño responsivo.",
          fr: "Style visuel, animations et design responsive.",
          zh: "视觉样式、动画和响应式设计。",
        },
      },
    ],
  },
  {
    id: "frameworks",
    name: {
      pt: "Frameworks",
      en: "Frameworks",
      es: "Frameworks",
      fr: "Frameworks",
      zh: "框架",
    },
    icon: "🛠️",
    techs: [
      {
        name: "React",
        icon: "img-react.png",
        level: 92,
        years: 4,
        projects: 30,
        description: {
          pt: "Biblioteca principal para UI, componentização e virtual DOM.",
          en: "Main library for UI, componentization and virtual DOM.",
          es: "Biblioteca principal para UI y componentización.",
          fr: "Bibliothèque principale pour l'UI et la composition.",
          zh: "UI和组件化的主要库。",
        },
      },
      {
        name: "Next.js",
        icon: "img-nextjs.png",
        level: 90,
        years: 3,
        projects: 20,
        description: {
          pt: "Framework React com SSR, SSG e otimizações de performance.",
          en: "React framework with SSR, SSG and performance optimizations.",
          es: "Framework React con SSR y optimizaciones.",
          fr: "Framework React avec SSR et optimisations.",
          zh: "带SSR和性能优化的React框架。",
        },
      },
      {
        name: "Tailwind CSS",
        icon: "img-tailwind.png",
        level: 88,
        years: 3,
        projects: 25,
        description: {
          pt: "Utility-first CSS framework para desenvolvimento rápido.",
          en: "Utility-first CSS framework for rapid development.",
          es: "Framework CSS utility-first para desarrollo rápido.",
          fr: "Framework CSS utilitaire pour développement rapide.",
          zh: "实用优先的CSS框架。",
        },
      },
      {
        name: "SASS",
        icon: "img-sass.png",
        level: 85,
        years: 4,
        projects: 18,
        description: {
          pt: "Pré-processador CSS com variáveis, mixins e nesting.",
          en: "CSS preprocessor with variables, mixins and nesting.",
          es: "Preprocesador CSS con variables y mixins.",
          fr: "Préprocesseur CSS avec variables et mixins.",
          zh: "带变量和混入的CSS预处理器。",
        },
      },
      {
        name: "Node.js",
        icon: "img-nodejs.png",
        level: 78,
        years: 3,
        projects: 15,
        description: {
          pt: "Runtime JavaScript para backend, APIs e microservices.",
          en: "JavaScript runtime for backend, APIs and microservices.",
          es: "Runtime JavaScript para backend y APIs.",
          fr: "Runtime JavaScript pour le backend et APIs.",
          zh: "后端和API的JavaScript运行时。",
        },
      },
      {
        name: "Bootstrap",
        icon: "img-bootstrap.png",
        level: 80,
        years: 5,
        projects: 20,
        description: {
          pt: "Framework CSS completo com componentes prontos.",
          en: "Complete CSS framework with ready-made components.",
          es: "Framework CSS completo con componentes listos.",
          fr: "Framework CSS complet avec composants prêts.",
          zh: "完整的CSS框架和现成组件。",
        },
      },
      {
        name: "Styled Components",
        icon: "img-styledcomponents.png",
        level: 75,
        years: 2,
        projects: 10,
        description: {
          pt: "CSS-in-JS para componentização dinâmica de estilos.",
          en: "CSS-in-JS for dynamic style componentization.",
          es: "CSS-in-JS para componentización de estilos.",
          fr: "CSS-in-JS pour la composition de styles.",
          zh: "CSS-in-JS样式组件化。",
        },
      },
      {
        name: "jQuery",
        icon: "img-jquery.png",
        level: 70,
        years: 5,
        projects: 15,
        description: {
          pt: "Biblioteca legacy para manipulação DOM e requisições AJAX.",
          en: "Legacy library for DOM manipulation and AJAX requests.",
          es: "Biblioteca legacy para manipulación DOM.",
          fr: "Bibliothèque legacy pour manipulation DOM.",
          zh: "用于DOM操作的遗留库。",
        },
      },
      {
        name: "Vite",
        icon: "img-vite.png",
        level: 78,
        years: 2,
        projects: 12,
        description: {
          pt: "Build tool moderno com HMR instantâneo.",
          en: "Modern build tool with instant HMR.",
          es: "Build tool moderno con HMR instantáneo.",
          fr: "Outil de build moderne avec HMR instantané.",
          zh: "具有即时HMR的现代构建工具。",
        },
      },
    ],
  },
  {
    id: "tools",
    name: {
      pt: "Ferramentas",
      en: "Tools",
      es: "Herramientas",
      fr: "Outils",
      zh: "工具",
    },
    icon: "🔧",
    techs: [
      {
        name: "Git",
        icon: "img-github.png",
        level: 85,
        years: 5,
        projects: 50,
        description: {
          pt: "Controle de versão distribuído para colaboração.",
          en: "Distributed version control for collaboration.",
          es: "Control de versiones distribuido para colaboración.",
          fr: "Contrôle de version distribué pour la collaboration.",
          zh: "用于协作的分布式版本控制。",
        },
      },
      {
        name: "GitHub",
        icon: "img-github.png",
        level: 88,
        years: 5,
        projects: 50,
        description: {
          pt: "Plataforma de hospedagem de código e CI/CD.",
          en: "Code hosting platform and CI/CD.",
          es: "Plataforma de alojamiento de código y CI/CD.",
          fr: "Plateforme d'hébergement de code et CI/CD.",
          zh: "代码托管平台和CI/CD。",
        },
      },
      {
        name: "Figma",
        icon: "img-figma.png",
        level: 80,
        years: 3,
        projects: 25,
        description: {
          pt: "Design tool colaborativo para UI/UX e prototipagem.",
          en: "Collaborative design tool for UI/UX and prototyping.",
          es: "Herramienta de diseño colaborativo para UI/UX.",
          fr: "Outil de design collaboratif pour UI/UX.",
          zh: "UI/UX协作设计工具。",
        },
      },
      {
        name: "Docker",
        icon: "img-docker.png",
        level: 68,
        years: 2,
        projects: 8,
        description: {
          pt: "Containerização para ambientes consistentes.",
          en: "Containerization for consistent environments.",
          es: "Contenedores para ambientes consistentes.",
          fr: "Conteneurisation pour environnements cohérents.",
          zh: "用于一致环境的容器化。",
        },
      },
      {
        name: "VS Code",
        icon: "img-visualcode.png",
        level: 95,
        years: 5,
        projects: 50,
        description: {
          pt: "Editor de código principal com extensões poderosas.",
          en: "Main code editor with powerful extensions.",
          es: "Editor de código principal con extensiones poderosas.",
          fr: "Éditeur de code principal avec extensions puissantes.",
          zh: "功能强大的主要代码编辑器。",
        },
      },
      {
        name: "PostgreSQL",
        icon: "img-sql.png",
        level: 72,
        years: 2,
        projects: 8,
        description: {
          pt: "Banco de dados relacional robusto com recursos avançados.",
          en: "Robust relational database with advanced features.",
          es: "Base de datos relacional robusta con características avanzadas.",
          fr: "Base de données relationnelle robuste avec fonctionnalités avancées.",
          zh: "具有高级功能的健壮关系数据库。",
        },
      },
      {
        name: "WordPress",
        icon: "img-wordpress.png",
        level: 75,
        years: 4,
        projects: 15,
        description: {
          pt: "CMS mais popular, ideal para blogs e sites corporativos.",
          en: "Most popular CMS, ideal for blogs and corporate sites.",
          es: "CMS más popular, ideal para blogs y sitios corporativos.",
          fr: "CMS le plus populaire, idéal pour les blogs.",
          zh: "最流行的CMS，适合博客和企业网站。",
        },
      },
      {
        name: "Adobe Photoshop",
        icon: "img-photoshop.png",
        level: 80,
        years: 6,
        projects: 30,
        description: {
          pt: "Edição de imagens e design gráfico profissional.",
          en: "Image editing and professional graphic design.",
          es: "Edición de imágenes y diseño gráfico profesional.",
          fr: "Édition d'images et design graphique professionnel.",
          zh: "图像编辑和专业图形设计。",
        },
      },
      {
        name: "Adobe Lightroom",
        icon: "img-lightroom.png",
        level: 75,
        years: 5,
        projects: 20,
        description: {
          pt: "Edição de fotos profissionais e color grading.",
          en: "Professional photo editing and color grading.",
          es: "Edición de fotos profesionales.",
          fr: "Édition photo professionnelle et color grading.",
          zh: "专业照片编辑和调色。",
        },
      },
      {
        name: "Microsoft 365",
        icon: "img-microsoft365.png",
        level: 85,
        years: 6,
        projects: 30,
        description: {
          pt: "Suite de produtividade para trabalho profissional.",
          en: "Productivity suite for professional work.",
          es: "Suite de productividad para trabajo profesional.",
          fr: "Suite de productivité pour le travail professionnel.",
          zh: "专业工作生产力套件。",
        },
      },
      {
        name: "Notion",
        icon: "img-figma.png",
        level: 82,
        years: 3,
        projects: 20,
        description: {
          pt: "Organização de projetos, documentação e notas.",
          en: "Project organization, documentation and notes.",
          es: "Organización de proyectos y documentación.",
          fr: "Organisation de projets et documentation.",
          zh: "项目组织和文档。",
        },
      },
    ],
  },
  {
    id: "cloud",
    name: {
      pt: "Cloud",
      en: "Cloud",
      es: "Nube",
      fr: "Cloud",
      zh: "云服务",
    },
    icon: "☁️",
    techs: [
      {
        name: "Vercel",
        icon: "img-nextjs.png",
        level: 85,
        years: 3,
        projects: 20,
        description: {
          pt: "Deploy de aplicações web serverless e edge.",
          en: "Serverless and edge web application deployment.",
          es: "Deploy de aplicaciones web serverless y edge.",
          fr: "Déploiement d'applications web serverless et edge.",
          zh: "无服务器和边缘Web应用部署。",
        },
      },
      {
        name: "AWS",
        icon: "img-docker.png",
        level: 55,
        years: 1,
        projects: 5,
        description: {
          pt: "Serviços de cloud computing completo (S3, EC2, Lambda).",
          en: "Complete cloud computing services (S3, EC2, Lambda).",
          es: "Servicios completos de cloud computing.",
          fr: "Services complets de cloud computing.",
          zh: "完整的云计算服务。",
        },
      },
      {
        name: "Supabase",
        icon: "img-nodejs.png",
        level: 70,
        years: 1,
        projects: 6,
        description: {
          pt: "Backend as a Service com PostgreSQL e auth integrado.",
          en: "Backend as a Service with PostgreSQL and integrated auth.",
          es: "Backend as a Service con PostgreSQL y auth.",
          fr: "Backend as a Service avec PostgreSQL et auth.",
          zh: "带PostgreSQL和集成的后端服务。",
        },
      },
      {
        name: "PlanetScale",
        icon: "img-sql.png",
        level: 65,
        years: 1,
        projects: 5,
        description: {
          pt: "Database serverless MySQL com branching.",
          en: "Serverless MySQL database with branching.",
          es: "Database serverless MySQL con branching.",
          fr: "Base de données serverless MySQL avec branching.",
          zh: "可分支的无服务器MySQL数据库。",
        },
      },
    ],
  },
];

export const allTechs = techCategories.flatMap((cat) => cat.techs);