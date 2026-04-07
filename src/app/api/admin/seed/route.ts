import { sql } from '@vercel/postgres';
import fs from 'fs/promises';
import path from 'path';
import { rawProjectsData } from '@/data/projects-data';

const SCHEMA_PATH = path.join(process.cwd(), 'src', 'lib', 'db', 'schema.sql');

async function runSchema() {
  const schema = await fs.readFile(SCHEMA_PATH, 'utf-8');
  await sql.query(schema);
  console.log('✅ Schema applied successfully');
}

async function seedProjects() {
  for (let i = 0; i < rawProjectsData.length; i++) {
    const p = rawProjectsData[i];
    const tagsForDb = p.tags ? `{${p.tags.join(',')}}` : '{}';
    
    await sql`
      INSERT INTO projects (
        src, site_url, repo_url, tags,
        name_pt, name_en, name_es, name_fr, name_zh,
        abt_pt, abt_en, abt_es, abt_fr, abt_zh,
        alt_pt, alt_en, alt_es, alt_fr, alt_zh,
        featured, display_order
      ) VALUES (
        ${p.src}, ${p.site || ''}, ${p.repo || ''}, ${tagsForDb},
        ${p.name.ptBR}, ${p.name.enUS}, '', '', '',
        ${p.abt.ptBR}, ${p.abt.enUS}, '', '', '',
        ${p.alt.ptBR}, ${p.alt.enUS}, '', '', '',
        ${p.featured || false}, ${i}
      )
      ON CONFLICT (src) DO UPDATE SET
        name_pt = EXCLUDED.name_pt,
        name_en = EXCLUDED.name_en,
        abt_pt = EXCLUDED.abt_pt,
        abt_en = EXCLUDED.abt_en,
        alt_pt = EXCLUDED.alt_pt,
        alt_en = EXCLUDED.alt_en,
        featured = EXCLUDED.featured,
        display_order = EXCLUDED.display_order;
    `;
  }
  console.log(`✅ Seeded ${rawProjectsData.length} projects`);
}

async function seedSkills() {
  const skills = [
    // Tech skills with levels
    { name: 'JavaScript', category: 'tech', level: 92, icon_src: 'img-javascript.png', display_order: 1 },
    { name: 'TypeScript', category: 'tech', level: 90, icon_src: 'img-typescript.png', display_order: 2 },
    { name: 'React', category: 'tech', level: 92, icon_src: 'img-react.png', display_order: 3 },
    { name: 'Next.js', category: 'tech', level: 90, icon_src: 'img-nextjs.png', display_order: 4 },
    { name: 'Tailwind CSS', category: 'tech', level: 88, icon_src: 'img-tailwind.png', display_order: 5 },
    { name: 'HTML5', category: 'tech', level: 95, icon_src: 'img-html.png', display_order: 6 },
    { name: 'CSS3', category: 'tech', level: 93, icon_src: 'img-css.png', display_order: 7 },
    { name: 'Node.js', category: 'tech', level: 78, icon_src: 'img-nodejs.png', display_order: 8 },
    { name: 'Python', category: 'tech', level: 70, icon_src: 'img-python.png', display_order: 9 },
    { name: 'PHP', category: 'tech', level: 65, icon_src: 'img-php.png', display_order: 10 },
    { name: 'PostgreSQL', category: 'tech', level: 72, icon_src: 'img-postgres.png', display_order: 11 },
    { name: 'Prisma ORM', category: 'tech', level: 75, display_order: 12 },
    { name: 'REST APIs', category: 'tech', level: 82, icon_src: 'img-api.png', display_order: 13 },
    { name: 'Git', category: 'tech', level: 85, icon_src: 'img-github.png', display_order: 14 },
    { name: 'Docker', category: 'tech', level: 68, icon_src: 'img-docker.png', display_order: 15 },
    { name: 'Figma', category: 'tech', level: 80, icon_src: 'img-figma.png', display_order: 16 },
    { name: 'WordPress', category: 'tech', level: 75, icon_src: 'img-wordpress.png', display_order: 17 },
    { name: 'Vite', category: 'tech', level: 78, icon_src: 'img-vite.png', display_order: 18 },
    { name: 'SASS', category: 'tech', level: 85, icon_src: 'img-sass.png', display_order: 19 },
    { name: 'Bootstrap', category: 'tech', level: 80, icon_src: 'img-bootstrap.png', display_order: 20 },
    { name: 'jQuery', category: 'tech', level: 70, icon_src: 'img-jquery.png', display_order: 21 },
    { name: 'Styled Components', category: 'tech', level: 75, icon_src: 'img-styledcomponents.png', display_order: 22 },

    // Concepts
    { name: 'Clean Code', category: 'concept', display_order: 1 },
    { name: 'Mobile First', category: 'concept', display_order: 2 },
    { name: 'Object Orientation', category: 'concept', display_order: 3 },
    { name: 'Functional Programming', category: 'concept', display_order: 4 },
    { name: 'UI / UX Design', category: 'concept', display_order: 5 },
    { name: 'Accessibility', category: 'concept', display_order: 6 },
    { name: 'Software Architecture', category: 'concept', display_order: 7 },
    { name: 'Information Architecture', category: 'concept', display_order: 8 },
    { name: 'State Management', category: 'concept', display_order: 9 },
    { name: 'Server Side Rendering', category: 'concept', display_order: 10 },
    { name: 'Relational Database', category: 'concept', display_order: 11 },
    { name: 'Information Security', category: 'concept', display_order: 12 },
    { name: 'Agile Development', category: 'concept', display_order: 13 },
    { name: 'SEO', category: 'concept', display_order: 14 },
    { name: 'Performance Optimization', category: 'concept', display_order: 15 },
    { name: 'Continuous Learning', category: 'concept', display_order: 16 },
    { name: 'Analytical Thinking', category: 'concept', display_order: 17 },
    { name: 'Code Versioning', category: 'concept', display_order: 18 },
    { name: 'Teamwork', category: 'concept', display_order: 19 },
    { name: 'Self-Management', category: 'concept', display_order: 20 },

    // Programs
    { name: 'VS Code', category: 'program', icon_src: 'img-visualcode.png', display_order: 1 },
    { name: 'GitHub', category: 'program', icon_src: 'img-github.png', display_order: 2 },
    { name: 'Figma', category: 'program', icon_src: 'img-figma.png', display_order: 3 },
    { name: 'PostgreSQL', category: 'program', display_order: 4 },
    { name: 'PgAdmin4', category: 'program', display_order: 5 },
    { name: 'Docker', category: 'program', icon_src: 'img-docker.png', display_order: 6 },
    { name: 'Notion', category: 'program', display_order: 7 },
    { name: 'Photoshop', category: 'program', icon_src: 'img-photoshop.png', display_order: 8 },
    { name: 'Premiere Pro', category: 'program', display_order: 9 },
    { name: 'Lightroom', category: 'program', icon_src: 'img-lightroom.png', display_order: 10 },
    { name: 'Adobe XD', category: 'program', display_order: 11 },
    { name: 'Adobe Dreamweaver', category: 'program', display_order: 12 },
    { name: 'Adobe Dimension 3D', category: 'program', display_order: 13 },
    { name: 'Sony Vegas', category: 'program', display_order: 14 },
    { name: 'Cisco Packet Tracer', category: 'program', display_order: 15 },
    { name: 'Microsoft 365', category: 'program', icon_src: 'img-microsoft365.png', display_order: 16 },
    { name: 'WordPress', category: 'program', icon_src: 'img-wordpress.png', display_order: 17 },
    { name: 'n8n', category: 'program', display_order: 18 },
  ];

  for (const skill of skills) {
    await sql`
      INSERT INTO skills (name, category, level, color, icon_src, display_order, active)
      VALUES (${skill.name}, ${skill.category}, ${skill.level}, '', ${skill.icon_src || ''}, ${skill.display_order}, true)
      ON CONFLICT DO NOTHING;
    `;
  }
  console.log(`✅ Seeded ${skills.length} skills`);
}

async function seedExperience() {
  const experiences = [
    {
      period_start: 'May 2025',
      period_end: 'Present',
      role_pt: 'Desenvolvedor CMS',
      role_en: 'CMS Developer',
      role_es: 'Desarrollador CMS',
      role_fr: 'Développeur CMS',
      role_zh: 'CMS开发者',
      company_pt: 'Prefeitura Municipal de Colombo',
      company_en: 'Colombo Municipal City Hall',
      company_es: 'Ayuntamiento Municipal de Colombo',
      company_fr: 'Mairie Municipale de Colombo',
      company_zh: '科伦坡市政厅',
      description_pt: 'Modernização e digitalização do acervo do Museu Municipal Cristóforo Colombo através de um sistema robusto em WordPress integrado com Tainacan. Preservação, catalogação e disponibilização pública do patrimônio cultural.',
      description_en: 'Modernizing and digitizing the Municipal Museum Cristoforo Colombo archive through a robust WordPress system integrated with Tainacan. Preserving, cataloging, and making cultural heritage publicly accessible.',
      description_es: 'Modernización y digitalización del acervo del Museo Municipal Cristóforo Colombo a través de un sistema robusto en WordPress integrado con Tainacan.',
      description_fr: 'Modernisation et numérisation des archives du Musée Municipal Cristoforo Colombo via un système WordPress robuste intégré à Tainacan.',
      description_zh: '通过 robust WordPress 系统集成 Tainacan，现代化和数字化科伦坡市立博物馆档案。',
      highlight: true,
      display_order: 1,
    },
    {
      period_start: 'January 2024',
      period_end: 'Present',
      role_pt: 'Desenvolvedor Web Freelance',
      role_en: 'Freelance Web Developer',
      role_es: 'Desarrollador Web Freelance',
      role_fr: 'Développeur Web Freelance',
      role_zh: '自由Web开发者',
      company_pt: 'Freelance',
      company_en: 'Freelance',
      company_es: 'Freelance',
      company_fr: 'Freelance',
      company_zh: '自由职业',
      description_pt: 'Desenvolvimento de páginas dinâmicas e estáticas, landing pages, e-commerces e sites complexos usando WordPress, React, JavaScript, TypeScript, Tailwind e Next.js.',
      description_en: 'Developing dynamic and static pages, landing pages, e-commerces, and complex websites using WordPress, React, JavaScript, TypeScript, Tailwind, and Next.js.',
      description_es: 'Desarrollo de páginas dinámicas y estáticas, landing pages, e-commerces y sitios web complejos usando WordPress, React, JavaScript, TypeScript, Tailwind y Next.js.',
      description_fr: 'Développement de pages dynamiques et statiques, landing pages, e-commerces et sites complexes avec WordPress, React, JavaScript, TypeScript, Tailwind et Next.js.',
      description_zh: '使用 WordPress、React、JavaScript、TypeScript、Tailwind 和 Next.js 开发动态和静态页面、着陆页、电商和复杂网站。',
      highlight: true,
      display_order: 2,
    },
    {
      period_start: 'June 2023',
      period_end: 'Present',
      role_pt: 'Motorista de Transporte/Frete',
      role_en: 'Rideshare/Freight Driver',
      role_es: 'Conductor de Transporte/Carga',
      role_fr: 'Conducteur de Transport/Fret',
      role_zh: '网约车/货运司机',
      company_pt: 'inDrive',
      company_en: 'inDrive',
      company_es: 'inDrive',
      company_fr: 'inDrive',
      company_zh: 'inDrive',
      description_pt: 'Logística, gestão de rotas e tempo, direção defensiva, consciência situacional.',
      description_en: 'Logistics, route/time management, defensive driving, situational awareness.',
      description_es: 'Logística, gestión de rutas/tiempo, conducción defensiva, conciencia situacional.',
      description_fr: 'Logistique, gestion des itinéraires/temps, conduite défensive, conscience situationnelle.',
      description_zh: '物流、路线/时间管理、防御性驾驶、情境意识。',
      highlight: false,
      display_order: 3,
    },
    {
      period_start: 'November 2021',
      period_end: 'May 2022',
      role_pt: 'Assistente de Logística',
      role_en: 'Logistics Assistant',
      role_es: 'Asistente de Logística',
      role_fr: 'Assistant Logistique',
      role_zh: '物流助理',
      company_pt: 'HELLAS AIR TEMP, INC',
      company_en: 'HELLAS AIR TEMP, INC',
      company_es: 'HELLAS AIR TEMP, INC',
      company_fr: 'HELLAS AIR TEMP, INC',
      company_zh: 'HELLAS AIR TEMP, INC',
      description_pt: 'Controle de informações financeiras, identificação e correção de inconsistências em relatórios financeiros. Implementação de novo sistema de organização que triplicou o tempo de otimização para busca e atualização de valores.',
      description_en: 'Controlled financial information, identified and corrected inconsistencies in financial reports. Implemented a new organization system that tripled optimization time for search and value updates.',
      description_es: 'Control de información financiera, identificación y corrección de inconsistencias en informes financieros. Implementación de un nuevo sistema de organización que triplicó el tiempo de optimización.',
      description_fr: 'Contrôle des informations financières, identification et correction des incohérences dans les rapports financiers. Mise en place d\'un nouveau système d\'organisation qui a triplé le temps d\'optimisation.',
      description_zh: '控制财务信息，识别和纠正财务报告中的不一致之处。实施新的组织系统，将搜索和价值更新优化时间提高了三倍。',
      highlight: false,
      display_order: 4,
    },
    {
      period_start: 'February 2019',
      period_end: 'January 2020',
      role_pt: 'Estagiário',
      role_en: 'Intern',
      role_es: 'Pasante',
      role_fr: 'Stagiaire',
      role_zh: '实习生',
      company_pt: 'Tribunal de Justiça do Estado do Paraná (TJPR)',
      company_en: 'Court of Justice of the State of Paraná (TJPR)',
      company_es: 'Tribunal de Justicia del Estado de Paraná (TJPR)',
      company_fr: 'Tribunal de Justice de l\'État du Paraná (TJPR)',
      company_zh: '巴拉那州法院 (TJPR)',
      description_pt: 'Controle, pesquisa e organização de processos jurídicos. Triagem de documentos, expedição para outros setores, digitalização de processos contribuindo para otimização do fluxo de trabalho.',
      description_en: 'Controlled, researched, and organized legal processes. Document screening, dispatch to other sectors, process digitization contributing to workflow optimization.',
      description_es: 'Control, investigación y organización de procesos legales. Tamizaje de documentos, envío a otros sectores, digitalización de procesos contribuyendo a la optimización del flujo de trabajo.',
      description_fr: 'Contrôle, recherche et organisation des processus juridiques. Filtrage de documents, expédition vers d\'autres secteurs, numérisation des processus contribuant à l\'optimisation du flux de travail.',
      description_zh: '控制、研究和组织法律流程。文件筛选、 dispatch 到其他部门、流程数字化，为工作流优化做出贡献。',
      highlight: false,
      display_order: 5,
    },
  ];

  for (const exp of experiences) {
    await sql`
      INSERT INTO experience_entries (
        period_start, period_end,
        role_pt, role_en, role_es, role_fr, role_zh,
        company_pt, company_en, company_es, company_fr, company_zh,
        description_pt, description_en, description_es, description_fr, description_zh,
        highlight, display_order
      ) VALUES (
        ${exp.period_start}, ${exp.period_end},
        ${exp.role_pt}, ${exp.role_en}, ${exp.role_es}, ${exp.role_fr}, ${exp.role_zh},
        ${exp.company_pt}, ${exp.company_en}, ${exp.company_es}, ${exp.company_fr}, ${exp.company_zh},
        ${exp.description_pt}, ${exp.description_en}, ${exp.description_es}, ${exp.description_fr}, ${exp.description_zh},
        ${exp.highlight}, ${exp.display_order}
      )
      ON CONFLICT DO NOTHING;
    `;
  }
  console.log(`✅ Seeded ${experiences.length} experience entries`);
}

async function seedEducation() {
  const education = [
    {
      period_start: 'May 2024',
      period_end: 'June 2028',
      degree_pt: 'Engenharia de Software',
      degree_en: 'Software Engineering',
      degree_es: 'Ingeniería de Software',
      degree_fr: 'Ingénierie Logicielle',
      degree_zh: '软件工程',
      school_pt: 'Descomplica Faculdade Digital',
      school_en: 'Descomplica Digital Faculty',
      school_es: 'Descomplica Facultad Digital',
      school_fr: 'Descomplica Faculté Numérique',
      school_zh: 'Descomplica 数字学院',
      description_pt: 'Bacharelado em Engenharia de Software com MEC 5/5. Cursos principais: Banco de Dados, Algoritmos e Programação, Arquitetura de Computadores, Redes de Computadores, Inteligência Artificial, Machine Learning.',
      description_en: 'Bachelor\'s in Software Engineering with MEC rating 5/5. Key courses: Database, Algorithms & Programming, Computer Architecture, Computer Networks, Artificial Intelligence, Machine Learning.',
      description_es: 'Licenciatura en Ingeniería de Software con MEC 5/5. Cursos principales: Base de Datos, Algoritmos y Programación, Arquitectura de Computadoras, Redes, Inteligencia Artificial, Machine Learning.',
      description_fr: 'Licence en Ingénierie Logicielle avec note MEC 5/5. Cours principaux: Base de données, Algorithmes et Programmation, Architecture Informatique, Réseaux, Intelligence Artificielle, Machine Learning.',
      description_zh: '软件工程学士学位，MEC 评分 5/5。主要课程：数据库、算法与编程、计算机架构、计算机网络、人工智能、机器学习。',
      display_order: 1,
    },
    {
      period_start: 'October 2022',
      period_end: 'July 2023',
      degree_pt: 'Desenvolvimento de Software',
      degree_en: 'Software Development',
      degree_es: 'Desarrollo de Software',
      degree_fr: 'Développement Logiciel',
      degree_zh: '软件开发',
      school_pt: 'Alura',
      school_en: 'Alura',
      school_es: 'Alura',
      school_fr: 'Alura',
      school_zh: 'Alura',
      description_pt: 'Foco em desenvolvimento de software. Tecnologias: JavaScript, TypeScript, React, Tailwind CSS, REST APIs, Git.',
      description_en: 'Focus on software development. Technologies: JavaScript, TypeScript, React, Tailwind CSS, REST APIs, Git.',
      description_es: 'Enfoque en desarrollo de software. Tecnologías: JavaScript, TypeScript, React, Tailwind CSS, REST APIs, Git.',
      description_fr: 'Focus sur le développement logiciel. Technologies: JavaScript, TypeScript, React, Tailwind CSS, REST APIs, Git.',
      description_zh: '专注于软件开发。技术：JavaScript、TypeScript、React、Tailwind CSS、REST APIs、Git。',
      display_order: 2,
    },
    {
      period_start: 'January 2019',
      period_end: 'December 2020',
      degree_pt: 'Curso Técnico em Artes Visuais e Cênicas',
      degree_en: 'Technical Course in Visual and Performing Arts',
      degree_es: 'Curso Técnico en Artes Visuales y Escénicas',
      degree_fr: 'Cours Technique en Arts Visuels et de la Scène',
      degree_zh: '视觉与表演艺术技术课程',
      school_pt: 'Teatro Barracao',
      school_en: 'Teatro Barracao',
      school_es: 'Teatro Barracao',
      school_fr: 'Teatro Barracao',
      school_zh: 'Teatro Barracao',
      description_pt: 'Consciência corporal, dicção, criatividade, interação pública, responsabilidade emocional. Participação em 3 produções teatrais.',
      description_en: 'Body awareness, diction, creativity, public interaction, emotional responsibility. Participated in 3 theatrical productions.',
      description_es: 'Conciencia corporal, dicción, creatividad, interacción pública, responsabilidad emocional. Participación en 3 producciones teatrales.',
      description_fr: 'Conscience corporelle, diction, créativité, interaction publique, responsabilité émotionnelle. Participation à 3 productions théâtrales.',
      description_zh: '身体意识、发音、创造力、公共互动、情感责任。参与3部戏剧制作。',
      display_order: 3,
    },
    {
      period_start: 'January 2013',
      period_end: 'December 2019',
      degree_pt: 'Ensino Médio',
      degree_en: 'High School',
      degree_es: 'Escuela Secundaria',
      degree_fr: 'Lycée',
      degree_zh: '高中',
      school_pt: 'Colégio Estadual Julio Mesquita',
      school_en: 'Julio Mesquita State School',
      school_es: 'Escuela Estatal Julio Mesquita',
      school_fr: 'École d\'État Julio Mesquita',
      school_zh: 'Julio Mesquita 州立学校',
      description_pt: 'Menção Honrosa na Olimpíada Brasileira de Matemática.',
      description_en: 'Honorable Mention in the Brazilian Mathematical Olympiad.',
      description_es: 'Mención Honrosa en la Olimpíada Brasileña de Matemáticas.',
      description_fr: 'Mention Honorable à l\'Olympiade Brésilienne de Mathématiques.',
      description_zh: '巴西数学奥林匹克竞赛荣誉奖。',
      display_order: 4,
    },
  ];

  for (const edu of education) {
    await sql`
      INSERT INTO education_entries (
        period_start, period_end,
        degree_pt, degree_en, degree_es, degree_fr, degree_zh,
        school_pt, school_en, school_es, school_fr, school_zh,
        description_pt, description_en, description_es, description_fr, description_zh,
        display_order
      ) VALUES (
        ${edu.period_start}, ${edu.period_end},
        ${edu.degree_pt}, ${edu.degree_en}, ${edu.degree_es}, ${edu.degree_fr}, ${edu.degree_zh},
        ${edu.school_pt}, ${edu.school_en}, ${edu.school_es}, ${edu.school_fr}, ${edu.school_zh},
        ${edu.description_pt}, ${edu.description_en}, ${edu.description_es}, ${edu.description_fr}, ${edu.description_zh},
        ${edu.display_order}
      )
      ON CONFLICT DO NOTHING;
    `;
  }
  console.log(`✅ Seeded ${education.length} education entries`);
}

async function seedPortfolioContent() {
  const content = [
    // Hero section
    { section: 'hero', key: 'greeting', value_pt: 'Olá, eu sou', value_en: 'Hello, I\'m', value_es: 'Hola, soy', value_fr: 'Bonjour, je suis', value_zh: '你好，我是', display_order: 1 },
    { section: 'hero', key: 'title', value_pt: 'Engenheiro de Software & Desenvolvedor Full-Stack', value_en: 'Software Engineer & Full-Stack Developer', value_es: 'Ingeniero de Software & Desarrollador Full-Stack', value_fr: 'Ingénieur Logiciel & Développeur Full-Stack', value_zh: '软件工程师与全栈开发者', display_order: 2 },
    { section: 'hero', key: 'subtitle', value_pt: 'Construindo o futuro digital, uma linha de código por vez.', value_en: 'Building the digital future, one line of code at a time.', value_es: 'Construyendo el futuro digital, una línea de código a la vez.', value_fr: 'Construire l\'avenir numérique, une ligne de code à la fois.', value_zh: '构建数字未来，一行代码一次。', display_order: 3 },

    // About section
    { section: 'about', key: 'title', value_pt: 'Sobre Mim', value_en: 'About Me', value_es: 'Sobre Mí', value_fr: 'À Propos', value_zh: '关于我', display_order: 1 },
    { section: 'about', key: 'description', value_pt: 'Sou Elias Barao, engenheiro de software e desenvolvedor full-stack atualmente reside em Curitiba, Brasil. Trabalho com desenvolvimento web, automação de processos e integração de IA. Acredito que a tecnologia deve ser dirigida para o bem-estar social e luto por um mundo sem preconceitos.', value_en: 'I\'m Elias Barao, a software engineer and full-stack developer based in Curitiba, Brazil. I work with web development, process automation, and AI integration. I believe technology should be directed toward social well-being and I fight for a prejudice-free world.', value_es: 'Soy Elias Barao, ingeniero de software y desarrollador full-stack basado en Curitiba, Brasil. Trabajo con desarrollo web, automatización de procesos e integración de IA. Creo que la tecnología debe dirigirse al bienestar social y lucho por un mundo sin prejuicios.', value_fr: 'Je suis Elias Barao, ingénieur logiciel et développeur full-stack basé à Curitiba, Brésil. Je travaille avec le développement web, l\'automatisation des processus et l\'intégration IA. Je crois que la technologie doit être dirigée vers le bien-être social.', value_zh: '我是 Elias Barao，软件工程师和全栈开发者，常驻巴西库里蒂巴。我从事Web开发、流程自动化和AI集成工作。我相信技术应该为社会福祉服务。', display_order: 2 },

    // Approach section
    { section: 'approach', key: 'title', value_pt: 'Minha Abordagem', value_en: 'My Approach', value_es: 'Mi Enfoque', value_fr: 'Mon Approche', value_zh: '我的方法', display_order: 1 },
    { section: 'approach', key: 'phrase_1', value_pt: 'Código limpo, soluções elegantes', value_en: 'Clean code, elegant solutions', value_es: 'Código limpio, soluciones elegantes', value_fr: 'Code propre, solutions élégantes', value_zh: '干净的代码，优雅的解决方案', display_order: 2 },
    { section: 'approach', key: 'phrase_2', value_pt: 'Design centrado no usuário', value_en: 'User-centered design', value_es: 'Diseño centrado en el usuario', value_fr: 'Design centré sur l\'utilisateur', value_zh: '以用户为中心的设计', display_order: 3 },
    { section: 'approach', key: 'phrase_3', value_pt: 'Performance e acessibilidade', value_en: 'Performance and accessibility', value_es: 'Rendimiento y accesibilidad', value_fr: 'Performance et accessibilité', value_zh: '性能和可访问性', display_order: 4 },

    // Sticky phrases
    { section: 'phrases', key: 'phrase_1', value_pt: 'A vida não é esperar a tempestade passar, é aprender a dançar na chuva.', value_en: 'Life isn\'t about waiting for the storm to pass, it\'s about learning to dance in the rain.', value_es: 'La vida no es esperar la tormenta, es aprender a bailar bajo la lluvia.', value_fr: 'La vie ce n\'est pas attendre que l\'orage passe, c\'est apprendre à danser sous la pluie.', value_zh: '生活不是等待暴风雨过去，而是学会在雨中跳舞。', display_order: 1 },
    { section: 'phrases', key: 'phrase_2', value_pt: 'Juntos, podemos ir mais longe.', value_en: 'Together, we can go further.', value_es: 'Juntos, podemos ir más lejos.', value_fr: 'Ensemble, nous pouvons aller plus loin.', value_zh: ' together，我们可以走得更远。', display_order: 2 },

    // Footer
    { section: 'footer', key: 'copyright', value_pt: '© 2026 Elias Barao. Todos os direitos reservados.', value_en: '© 2026 Elias Barao. All rights reserved.', value_es: '© 2026 Elias Barao. Todos los derechos reservados.', value_fr: '© 2026 Elias Barao. Tous droits réservés.', value_zh: '© 2026 Elias Barao. 版权所有。', display_order: 1 },
  ];

  for (const item of content) {
    await sql`
      INSERT INTO portfolio_content (section, key, value_pt, value_en, value_es, value_fr, value_zh, display_order)
      VALUES (${item.section}, ${item.key}, ${item.value_pt}, ${item.value_en}, ${item.value_es}, ${item.value_fr}, ${item.value_zh}, ${item.display_order})
      ON CONFLICT (section, key) DO NOTHING;
    `;
  }
  console.log(`✅ Seeded ${content.length} portfolio content entries`);
}

async function seedContactInfo() {
  const contacts = [
    {
      label: 'LinkedIn',
      value: 'https://www.linkedin.com/in/e2barao/',
      icon: 'linkedin',
      description_pt: 'Conexão profissional',
      description_en: 'Professional connection',
      description_es: 'Conexión profesional',
      description_fr: 'Connexion professionnelle',
      description_zh: '职业联系',
      display_order: 1,
    },
    {
      label: 'GitHub',
      value: 'https://github.com/httpE2Barao',
      icon: 'github',
      description_pt: 'Veja meu código',
      description_en: 'Check out my code',
      description_es: 'Mira mi código',
      description_fr: 'Voir mon code',
      description_zh: '查看我的代码',
      display_order: 2,
    },
    {
      label: 'Email',
      value: 'e2barao@hotmail.com',
      icon: 'email',
      description_pt: 'Envie uma mensagem',
      description_en: 'Send a message',
      description_es: 'Enviar un mensaje',
      description_fr: 'Envoyer un message',
      description_zh: '发送消息',
      display_order: 3,
    },
    {
      label: 'WhatsApp',
      value: '+55 41 99804-6755',
      icon: 'whatsapp',
      description_pt: 'Converse comigo',
      description_en: 'Chat with me',
      description_es: 'Chatea conmigo',
      description_fr: 'Discutez avec moi',
      description_zh: '与我聊天',
      display_order: 4,
    },
  ];

  for (const contact of contacts) {
    await sql`
      INSERT INTO contact_info (label, value, icon, description_pt, description_en, description_es, description_fr, description_zh, visible, display_order)
      VALUES (${contact.label}, ${contact.value}, ${contact.icon}, ${contact.description_pt}, ${contact.description_en}, ${contact.description_es}, ${contact.description_fr}, ${contact.description_zh}, true, ${contact.display_order})
      ON CONFLICT DO NOTHING;
    `;
  }
  console.log(`✅ Seeded ${contacts.length} contact entries`);
}

async function seedCVTemplates() {
  const templates = [
    {
      name: 'Chronological',
      format: 'chronological',
      config: JSON.stringify({
        accentColor: '#06b6d4',
        fontFamily: 'Inter',
        showPhoto: false,
        showProjects: true,
        showSkills: true,
        showLanguages: true,
      }),
      is_default: true,
    },
    {
      name: 'Functional',
      format: 'functional',
      config: JSON.stringify({
        accentColor: '#8b5cf6',
        fontFamily: 'Inter',
        showPhoto: false,
        showProjects: true,
        showSkills: true,
        showLanguages: true,
      }),
      is_default: false,
    },
    {
      name: 'Combination',
      format: 'combination',
      config: JSON.stringify({
        accentColor: '#0ea5e9',
        fontFamily: 'Inter',
        showPhoto: false,
        showProjects: true,
        showSkills: true,
        showLanguages: true,
      }),
      is_default: false,
    },
    {
      name: 'Minimal',
      format: 'minimal',
      config: JSON.stringify({
        accentColor: '#000000',
        fontFamily: 'Georgia',
        showPhoto: false,
        showProjects: false,
        showSkills: true,
        showLanguages: false,
      }),
      is_default: false,
    },
    {
      name: 'Creative',
      format: 'creative',
      config: JSON.stringify({
        accentColor: '#f59e0b',
        fontFamily: 'Inter',
        showPhoto: true,
        showProjects: true,
        showSkills: true,
        showLanguages: true,
      }),
      is_default: false,
    },
  ];

  for (const template of templates) {
    await sql`
      INSERT INTO cv_templates (name, format, config, is_default)
      VALUES (${template.name}, ${template.format}, ${template.config}::jsonb, ${template.is_default})
      ON CONFLICT DO NOTHING;
    `;
  }
  console.log(`✅ Seeded ${templates.length} CV templates`);
}

export async function POST() {
  try {
    console.log('🚀 Starting database migration and seed...');

    await runSchema();
    await seedProjects();
    await seedSkills();
    await seedExperience();
    await seedEducation();
    await seedPortfolioContent();
    await seedContactInfo();
    await seedCVTemplates();

    console.log('✅ Migration and seed completed successfully!');
    return Response.json({ message: 'Migration and seed completed successfully!' });
  } catch (error) {
    console.error('❌ Migration error:', error);
    return Response.json({ message: 'Migration failed', error: String(error) }, { status: 500 });
  }
}
