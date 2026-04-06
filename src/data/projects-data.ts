export interface projectInterface {
  src: string;
  name: string;
  alt: string;
  abt: string;
  site: string;
  repo: string;
  tags?: string[];
}

// Interface para os dados brutos bilíngues
interface RawProjectData {
  src: string;
  tags?: string[];
  site: string;
  repo: string;
  name: { ptBR: string; enUS: string };
  alt: { ptBR: string; enUS: string };
  abt: { ptBR: string; enUS: string };
  featured?: boolean; // Para V2 - apenas projetos destaque
}

export const rawProjectsData: RawProjectData[] = [
    {
      src: 'platera',
      tags: ['typescript', 'nextjs', 'prisma', 'postgresql', 'tailwind', 'shadcn', 'ai', 'openai', 'gemini', 'mercadopago', 'lalamove', 'focusnfe', 'pusher', 'leaflet', 'saas'],
      site: '',
      repo: '',
      featured: true,
      name: {
        ptBR: 'Platera',
        enUS: 'Platera'
      },
      alt: {
        ptBR: 'Sistema operacional completo para restaurantes modernos com IA',
        enUS: 'Complete operating system for modern restaurants with AI'
      },
      abt: {
        ptBR: 'Platera é um Sistema Operacional completo para restaurantes modernos. Projetado para escalar do food truck à franquia, unifica todos os aspectos da operação — do pedido à entrega, do estoque ao lucro — em uma interface elegante impulsionada por Inteligência Artificial. Possui chatbot com IA para atendimento automático via WhatsApp e Web 24/7, omnichannel (delivery próprio, QR Code mesa, totens, retirada, social commerce), integração com Lalamove e iFood, fichas técnicas dinâmicas com CMV em tempo real, KDS, POS, emissão fiscal NFC-e, pagamentos Mercado Pago, heatmaps de delivery, dashboard com AI Insights, gamificação e cashback.',
        enUS: 'Platera is a complete Operating System for modern restaurants. Designed to scale from food truck to franchise, it unifies all aspects of operations — from order to delivery, inventory to profit — in an elegant interface powered by Artificial Intelligence. Features AI chatbot for automated WhatsApp and Web ordering 24/7, omnichannel (own delivery, QR Code table ordering, kiosks, takeaway, social commerce), Lalamove and iFood integration, dynamic recipe cards with real-time CMV, KDS, POS, NFC-e fiscal emission, Mercado Pago payments, delivery heatmaps, AI Insights dashboard, gamification and cashback.'
      }
    },
    {
      src: 'digital-acceleration-christopher-columbus-museum',
      tags: ['wordpress', 'tainacan', 'museu', 'patrimonio', 'cultura', 'digitalizacao'],
      site: '',
      repo: '',
      featured: true,
      name: {
        ptBR: 'Museu Cristóforo Colombo',
        enUS: 'Cristóforo Colombo Museum'
      },
      alt: {
        ptBR: 'Digitalização do acervo do Museu Municipal Cristóforo Colombo',
        enUS: 'Digital archive of the Municipal Museum Cristóforo Colombo'
      },
      abt: {
        ptBR: 'Modernização e digitalização do acervo do Museu Municipal Cristóforo Colombo através de um sistema robusto em WordPress integrado com Tainacan. Preservação, catalogação e disponibilização pública do patrimônio cultural do museu utilizando plataforma open-source que garante flexibilidade e sustentabilidade para gestão de coleções museológicas.',
        enUS: 'Modernization and digitization of the Cristóforo Colombo Municipal Museum archive through a robust WordPress system integrated with Tainacan. Preservation, cataloging, and public accessibility of the museum cultural heritage using an open-source platform that ensures flexibility and sustainability for managing museum collections.'
      }
    },
    {
      src: 'janine-mathias',
      tags: ['typescript', 'vite', 'tailwind', 'spotify-api', 'figma'],
      site: 'https://janine-mathias.vercel.app',
      repo: 'https://github.com/httpE2Barao/Janine-Mathias/',
      featured: true,
      name: {
        ptBR: 'Janine Mathias',
        enUS: 'Janine Mathias'
      },
      alt: {
        ptBR: 'Portfólio digital para cantora e compositora',
        enUS: 'Digital portfolio for singer and songwriter'
      },
      abt: {
        ptBR: 'Portfólio digital para Janine Mathias, cantora e compositora de música brasileira. Interface moderna e responsiva que permite explorar álbuns diretamente do Spotify, visualizar próximos shows e navegar por redes sociais de forma dinâmica.',
        enUS: 'Digital portfolio for Janine Mathias, a Brazilian music singer and songwriter. Modern and responsive interface that allows visitors to explore her albums directly from Spotify, view upcoming shows, and browse her social media dynamically.'
      }
    },
    {
      src: 'thiago-battista',
      tags: ['typescript', 'react', 'nextjs', 'tailwind', 'fotografia'],
      site: 'https://thiagobattista.vercel.app',
      repo: 'https://github.com/httpE2Barao/webfolio-thiago_battista',
      featured: true,
      name: {
        ptBR: 'Thiago Battista',
        enUS: 'Thiago Battista'
      },
      alt: {
        ptBR: 'Portfólio fotográfico profissional',
        enUS: 'Professional photography portfolio'
      },
      abt: {
        ptBR: 'Portfólio fotográfico profissional com galeria interativa, navegação fluida e design minimalista que destaca o trabalho visual. Construído com React, Next.js e Tailwind CSS.',
        enUS: 'Professional photography portfolio with interactive gallery, fluid navigation, and minimalist design that highlights visual work. Built with React, Next.js, and Tailwind CSS.'
      }
    },
    {
      src: 'patio-monitoramento',
      tags: ['typescript', 'react', 'nextjs', 'tailwind', 'autenticacao', 'formularios'],
      site: '',
      repo: 'https://github.com/httpE2Barao/Patio-Monitoramento/',
      featured: true,
      name: {
        ptBR: 'Pátio Monitoramento',
        enUS: 'Patio Monitoring'
      },
      alt: {
        ptBR: 'Sistema de cadastro residencial com autenticação',
        enUS: 'Residential registration system with authentication'
      },
      abt: {
        ptBR: 'Aplicação React com autenticação e formulário inteligente para cadastro de residentes. Interface responsiva com validação automática de dados via API, focada em acessibilidade e eficiência.',
        enUS: 'React application with authentication and smart form for resident registration. Responsive interface with automatic data validation via API, focused on accessibility and efficiency.'
      }
    },
    {
      src: 'space-tourism',
      tags: ['javascript', 'react', 'tailwind', 'space'],
      site: 'https://turismo-espacial-xi.vercel.app/',
      repo: 'https://github.com/httpE2Barao/SpaceTourism',
      featured: true,
      name: {
        ptBR: 'Turismo Espacial',
        enUS: 'Space Tourism'
      },
      alt: {
        ptBR: 'Aplicação web sobre missões espaciais',
        enUS: 'Web application about space missions'
      },
      abt: {
        ptBR: 'Aplicação web com informações sobre missões espaciais. Interface moderna e responsiva utilizando React e Tailwind CSS, com hooks avançados para gerenciamento de estado e otimização de performance.',
        enUS: 'Web application presenting information about space missions. Modern and responsive interface using React and Tailwind CSS, with advanced hooks for state management and performance optimization.'
      }
    },
    {
      src: 'negociacoes',
      tags: ['typescript', 'oop', 'decorators', 'api'],
      site: 'https://negocicoes.vercel.app/dist/index.html',
      repo: 'https://github.com/httpE2Barao/Negotiation',
      featured: false,
      name: {
        ptBR: 'Negociações API',
        enUS: 'Negotiations API'
      },
      alt: {
        ptBR: 'Projeto TypeScript com OOP e decorators',
        enUS: 'TypeScript project with OOP and decorators'
      },
      abt: {
        ptBR: 'Projeto que consome API externa aplicando boas práticas de TypeScript: tipagem estática, orientação a objetos, decorators e micro-framework para gerenciamento de rotas.',
        enUS: 'Project consuming external API applying TypeScript best practices: static typing, object orientation, decorators, and micro-framework for route management.'
      }
    },
    {
      src: 'moni-bank',
      tags: ['javascript', 'html', 'css', 'webcam', 'validacao'],
      site: 'https://moni-bank-omega.vercel.app/',
      repo: 'https://github.com/httpE2Barao/MoniBank',
      featured: false,
      name: {
        ptBR: 'MoniBank',
        enUS: 'MoniBank'
      },
      alt: {
        ptBR: 'Cadastro em banco digital com webcam',
        enUS: 'Digital bank registration with webcam'
      },
      abt: {
        ptBR: 'Aplicação de cadastro para banco digital com validação de CPF, verificação de maioridade e captura de foto por webcam.',
        enUS: 'Digital bank registration application with CPF validation, age verification, and webcam photo capture.'
      }
    },
    {
      src: 'cadastro-inteligente',
      tags: ['javascript', 'html', 'css', 'api', 'cep'],
      site: 'https://cep-auto-complete.vercel.app/',
      repo: 'https://github.com/httpE2Barao/CEP_auto-complete',
      featured: false,
      name: {
        ptBR: 'Cadastro Autocomplete',
        enUS: 'Autocomplete Registration'
      },
      alt: {
        ptBR: 'Busca de endereço por CEP com validação',
        enUS: 'ZIP code address search with validation'
      },
      abt: {
        ptBR: 'Funcionalidade de busca de endereço por CEP com validação de CPF e verificação de maioridade.',
        enUS: 'ZIP code address search functionality with CPF validation and age verification.'
      }
    },
    {
      src: 'typing-challenge',
      tags: ['javascript', 'tailwind', 'jquery', 'api'],
      site: 'https://typing-challenge-theta.vercel.app/',
      repo: 'https://github.com/httpE2Barao/typing-challenge',
      featured: false,
      name: {
        ptBR: 'Desafio de Digitação',
        enUS: 'Typing Challenge'
      },
      alt: {
        ptBR: 'Teste de velocidade de digitação',
        enUS: 'Typing speed test'
      },
      abt: {
        ptBR: 'Desafio de digitação com cronômetro, feedback em tempo real e placar de performance (palavras por minuto).',
        enUS: 'Typing challenge with timer, real-time feedback, and performance scoreboard (words per minute).'
      }
    },
    {
      src: 'serenatto-cafe',
      tags: ['javascript', 'bootstrap'],
      site: 'https://serenatto-ebon.vercel.app/',
      repo: 'https://github.com/httpE2Barao/Study-Repo/tree/main/Front%20End/Bootstrap/Projeto_Serenatto',
      featured: false,
      name: {
        ptBR: 'Serenatto Café',
        enUS: 'Serenatto Coffee'
      },
      alt: {
        ptBR: 'Site de cafeteria',
        enUS: 'Coffee shop website'
      },
      abt: {
        ptBR: 'Site elegante para cafeteria com apresentação de produtos e alternância de tema claro/escuro.',
        enUS: 'Elegant coffee shop website with product showcase and light/dark theme toggle.'
      }
    },
    {
      src: 'stopwatch',
      tags: ['typescript', 'react', 'sass'],
      site: 'https://stopwatch-react-app0.vercel.app/',
      repo: 'https://github.com/httpE2Barao/Stopwatch-react-app',
      featured: false,
      name: {
        ptBR: 'Cronômetro',
        enUS: 'Stopwatch'
      },
      alt: {
        ptBR: 'Aplicação de cronômetro',
        enUS: 'Stopwatch application'
      },
      abt: {
        ptBR: 'Cronômetro com React, TypeScript e Sass. Componentes reutilizáveis e tipagem estática.',
        enUS: 'Stopwatch with React, TypeScript, and Sass. Reusable components and static typing.'
      }
    },
    {
      src: 'books-react',
      tags: ['javascript', 'react', 'api'],
      site: 'https://books-react-project-a.vercel.app/',
      repo: 'https://github.com/httpE2Barao/Books_react-project',
      featured: false,
      name: {
        ptBR: 'E-Biblioteca',
        enUS: 'E-Library'
      },
      alt: {
        ptBR: 'Biblioteca de livros em React',
        enUS: 'React book library'
      },
      abt: {
        ptBR: 'Aplicação de biblioteca de livros com React e integração com API externa.',
        enUS: 'Book library application with React and external API integration.'
      }
    },
    {
      src: 'generador-pdf',
      tags: ['javascript', 'pdf'],
      site: '',
      repo: '',
      featured: false,
      name: {
        ptBR: 'Generador PDF',
        enUS: 'PDF Generator'
      },
      alt: {
        ptBR: 'Gerador de PDF',
        enUS: 'PDF generator tool'
      },
      abt: {
        ptBR: 'Ferramenta para geração de documentos PDF.',
        enUS: 'Tool for generating PDF documents.'
      }
    },
  ];

  export const projectsList = (language: string): projectInterface[] => {
  const renderText = (textObj: { ptBR: string; enUS:string }) => {
    return language === 'pt-BR' ? textObj.ptBR : textObj.enUS;
  };

  return rawProjectsData.map(project => ({
    ...project,
    name: renderText(project.name),
    alt: renderText(project.alt),
    abt: renderText(project.abt),
  }));
};

export const featuredProjectsList = (language: string): projectInterface[] => {
  const renderText = (textObj: { ptBR: string; enUS:string }) => {
    return language === 'pt-BR' ? textObj.ptBR : textObj.enUS;
  };

  return rawProjectsData
    .filter(project => project.featured)
    .map(project => ({
      ...project,
      name: renderText(project.name),
      alt: renderText(project.alt),
      abt: renderText(project.abt),
    }));
};
