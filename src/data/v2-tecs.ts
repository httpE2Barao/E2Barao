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

export function getTechIconUrl(icon: string): string {
  if (icon.startsWith("http")) {
    return icon;
  }
  return `/images/${icon}`;
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
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
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
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
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
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
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
        name: "n8n",
        icon: "https://cdn.jsdelivr.net/gh/n8n-io/n8n@master/packages/nodes/base/n8n-square.svg",
        level: 65,
        years: 1,
        projects: 5,
        description: {
          pt: "Framework Node.js extremamente rápido e de baixo custo.",
          en: "Extremely fast and low-overhead Node.js framework.",
          es: "Framework Node.js extremadamente rápido.",
          fr: "Framework Node.js extrêmement rapide.",
          zh: "极快的低开销Node.js框架。",
        },
      },
      {
        name: "Shadcn UI",
        icon: "https://ui.shadcn.com/favicon.ico",
        level: 85,
        years: 2,
        projects: 15,
        description: {
          pt: "Componentes React reutilizáveis com Tailwind e Radix.",
          en: "Reusable React components with Tailwind and Radix.",
          es: "Componentes React reutilizables.",
          fr: "Composants React réutilisables.",
          zh: "可复用的React组件。",
        },
      },
{
        name: "Radix UI",
        icon: "https://cdn.jsdelivr.net/gh/radix-ui/primitives@main/packages/core-icons/svg/avatar.svg",
        level: 82,
        years: 2,
        projects: 15,
        description: {
          pt: "Biblioteca de animações para React.",
          en: "Animation library for React.",
          es: "Biblioteca de animaciones para React.",
          fr: "Bibliothèque d'animations pour React.",
          zh: "React动画库。",
        },
      },
      {
        name: "Socket.io",
        icon: "https://socket.io/assets/logo.svg",
        level: 75,
        years: 2,
        projects: 8,
        description: {
          pt: "Comunicação em tempo real via WebSockets.",
          en: "Real-time communication via WebSockets.",
          es: "Comunicación en tiempo real vía WebSockets.",
          fr: "Communication temps réel via WebSockets.",
          zh: "通过WebSockets进行实时通信。",
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
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
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
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
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
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
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
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
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
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
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
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
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
        name: "MySQL",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
        level: 70,
        years: 3,
        projects: 8,
        description: {
          pt: "Banco de dados relacional muito popular em aplicações web.",
          en: "Very popular relational database in web applications.",
          es: "Base de datos relacional muy popular en aplicaciones web.",
          fr: "Base de données relationnelle très populaire.",
          zh: "Web应用中最流行的关系数据库。",
        },
      },
      {
        name: "SQLite",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
        level: 65,
        years: 2,
        projects: 5,
        description: {
          pt: "Banco de dados leve, embedded, sem servidor.",
          en: "Lightweight serverless embedded database.",
          es: "Base de datos ligera embebida sin servidor.",
          fr: "Base de données légère embarquée sans serveur.",
          zh: "轻量级嵌入式无服务器数据库。",
        },
      },
      {
        name: "Prisma",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg",
        level: 75,
        years: 2,
        projects: 10,
        description: {
          pt: "ORM moderno para TypeScript com migrations e type safety.",
          en: "Modern ORM for TypeScript with migrations and type safety.",
          es: "ORM moderno para TypeScript con migrations.",
          fr: "ORM moderne pour TypeScript avec migrations.",
          zh: "现代化TypeScript ORM工具。",
        },
      },
      {
        name: "WordPress",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-original.svg",
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
        name: "Tainacan",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-original.svg",
        level: 75,
        years: 2,
        projects: 8,
        description: {
          pt: "Plugin WordPress para digitalização de acervos culturais.",
          en: "WordPress plugin for cultural heritage digitization.",
          es: "Plugin WordPress para digitalización.",
          fr: "Plugin WordPress pour numérisation culturelle.",
          zh: "用于文化遗产数字化的WordPress插件。",
        },
      },
      {
        name: "Postman",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",
        level: 80,
        years: 3,
        projects: 20,
        description: {
          pt: "Plataforma para testes e documentação de APIs.",
          en: "Platform for API testing and documentation.",
          es: "Plataforma para pruebas y documentación de APIs.",
          fr: "Plateforme pour tests et documentation d'APIs.",
          zh: "API测试和文档平台。",
        },
      },
{
        name: "Insomnia",
        icon: "https://cdn.jsdelivr.net/gh/Tintiby/Insomnia-Icon@main/insomnia.svg",
        level: 72,
        years: 2,
        projects: 6,
        description: {
          pt: "Backend as a Service com PostgreSQL e auth integrado.",
          en: "Backend as a Service with PostgreSQL and integrated auth.",
          es: "Backend as a Service con PostgreSQL.",
          fr: "Backend as a Service avec PostgreSQL.",
          zh: "带PostgreSQL和集成的后端服务。",
        },
      },
      {
        name: "PlanetScale",
        icon: "https://planetscale.com/favicon.ico",
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
  {
    id: "apis",
    name: {
      pt: "APIs & IA",
      en: "APIs & AI",
      es: "APIs & IA",
      fr: "APIs & IA",
      zh: "API和AI",
    },
    icon: "🤖",
    techs: [
      {
        name: "OpenAI",
        icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/OpenAI_Logo.svg/240px-OpenAI_Logo.svg.png",
        level: 80,
        years: 2,
        projects: 10,
        description: {
          pt: "API de IA para LLMs, embeddings e image generation.",
          en: "API for LLMs, embeddings and image generation.",
          es: "API de IA para LLMs y generación de imágenes.",
          fr: "API IA pour LLMs et génération d'images.",
          zh: "用于LLM和图像生成的AI API。",
        },
      },
      {
        name: "Google Gemini",
        icon: "https://www.gstatic.com/images/branding/productlogos/ai/v1/ai_96dp.png",
        level: 75,
        years: 1,
        projects: 6,
        description: {
          pt: "LLM do Google para geração de código e texto.",
          en: "Google LLM for code and text generation.",
          es: "LLM de Google para código y texto.",
          fr: "LLM Google pour génération de code.",
          zh: "Google的代码和文本生成LLM。",
        },
      },
      {
        name: "DeepL",
        icon: "https://www.deepl.com/img/favicon32x32.png",
        level: 70,
        years: 1,
        projects: 5,
        description: {
          pt: "API de tradução com IA neural avançada.",
          en: "Translation API with advanced neural AI.",
          es: "API de traducción con IA neural.",
          fr: "API de traduction avec IA neurale.",
          zh: "具有高级神经AI的翻译API。",
        },
      },
      {
        name: "Mercado Pago",
        icon: "https://http.mercadopago.com/static/logo-ico.png",
        level: 75,
        years: 2,
        projects: 8,
        description: {
          pt: "API de pagamentos brasileiro (Pix, cartão, boleto).",
          en: "Brazilian payment API (Pix, card, slip).",
          es: "API de pagos brasileño.",
          fr: "API de paiement brésilienne.",
          zh: "巴西支付API。",
        },
      },
    ],
  },
];

export const allTechs = techCategories.flatMap((cat) => cat.techs);