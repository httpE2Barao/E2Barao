export interface SkillCategory {
  id: string;
  label: { pt: string; en: string; es: string };
  keywords: string[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "languages",
    label: { pt: "Linguagens", en: "Languages", es: "Lenguajes" },
    keywords: ["javascript", "typescript", "python", "php", "html", "css", "sql"],
  },
  {
    id: "frameworks",
    label: { pt: "Frameworks & Bibliotecas", en: "Frameworks & Libraries", es: "Frameworks y Bibliotecas" },
    keywords: ["react", "next.js", "nextjs", "node.js", "nodejs", "vite", "radix", "shadcn", "framer motion", "lucide", "react hook form", "zod", "nextauth"],
  },
  {
    id: "styling",
    label: { pt: "Estilização & UI", en: "Styling & UI", es: "Estilización y UI" },
    keywords: ["tailwind", "sass", "bootstrap", "styled components", "jquery"],
  },
  {
    id: "database",
    label: { pt: "Banco de Dados", en: "Database", es: "Base de Datos" },
    keywords: ["postgres", "sqlite", "neon", "prisma"],
  },
  {
    id: "state",
    label: { pt: "Gerenciamento de Estado", en: "State Management", es: "Gestión de Estado" },
    keywords: ["zustand", "tanstack"],
  },
  {
    id: "auth",
    label: { pt: "Autenticação & Segurança", en: "Authentication & Security", es: "Autenticación y Seguridad" },
    keywords: ["jwt", "bcrypt", "2fa"],
  },
  {
    id: "ai",
    label: { pt: "IA & Machine Learning", en: "AI & Machine Learning", es: "IA y Aprendizaje Automático" },
    keywords: ["nvidia", "gemini", "groq", "ollama", "mcp"],
  },
  {
    id: "devops",
    label: { pt: "DevOps & Cloud", en: "DevOps & Cloud", es: "DevOps y Nube" },
    keywords: ["git", "github", "docker", "n8n"],
  },
  {
    id: "design",
    label: { pt: "Design & Mídia", en: "Design & Media", es: "Diseño y Medios" },
    keywords: ["figma", "photoshop", "premiere", "lightroom", "adobe xd", "adobe dreamweaver", "adobe dimension", "sony vegas"],
  },
  {
    id: "testing",
    label: { pt: "Testes", en: "Testing", es: "Pruebas" },
    keywords: ["jest", "react testing library", "testing library"],
  },
  {
    id: "realtime",
    label: { pt: "Tempo Real & Pagamentos", en: "Realtime & Payments", es: "Tiempo Real y Pagos" },
    keywords: ["socket.io", "socket io", "pusher", "mercado pago", "pix", "lalamove"],
  },
  {
    id: "dataviz",
    label: { pt: "Dados & Visualização", en: "Data & Visualization", es: "Datos y Visualización" },
    keywords: ["recharts", "lightweight-charts", "lightweight charts", "mermaid", "leaflet", "react-leaflet", "pdf-lib", "pdf lib", "jspdf", "sharp", "heic2any"],
  },
  {
    id: "integrations",
    label: { pt: "Automação & Integrações", en: "Automation & Integrations", es: "Automatización e Integraciones" },
    keywords: ["next-intl", "nextintl", "@vercel/blob", "vercel blob", "rest api", "axios", "date-fns", "datefns", "nodemailer", "qrcode", "papaparse", "insomnia"],
  },
  {
    id: "tools",
    label: { pt: "Ferramentas & Plataformas", en: "Tools & Platforms", es: "Herramientas y Plataformas" },
    keywords: ["vs code", "vscode", "notion", "microsoft 365", "wordpress", "pgadmin", "cisco packet tracer"],
  },
  {
    id: "concepts",
    label: { pt: "Conceitos & Metodologias", en: "Concepts & Methodologies", es: "Conceptos y Metodologías" },
    keywords: ["clean code", "mobile first", "object orientation", "functional programming", "ui / ux", "ui ux", "accessibility", "software architecture", "information architecture", "state management", "server side rendering", "relational database", "information security", "agile", "seo", "performance optimization", "continuous learning", "analytical thinking", "code versioning", "teamwork", "self-management", "self management"],
  },
];

function matchSkill(name: string, keywords: string[]): boolean {
  const lower = name.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

export function getSkillCategory(skill: { name: string }): string {
  for (const cat of SKILL_CATEGORIES) {
    if (matchSkill(skill.name, cat.keywords)) {
      return cat.id;
    }
  }
  return "concepts";
}

export function categorizeSkills(skills: string[], lang: string, orders?: number[]): { title: string; skills: string[] }[] {
  const result = SKILL_CATEGORIES.map((cat) => {
    const catSkills = skills
      .map((s, i) => ({ name: s, order: orders?.[i] ?? i }))
      .filter((entry) => matchSkill(entry.name, cat.keywords))
      .sort((a, b) => a.order - b.order);
    return {
      title: cat.label[lang as keyof typeof cat.label] || cat.label.pt,
      skills: catSkills.map((e) => e.name),
    };
  }).filter((cat) => cat.skills.length > 0);

  return result;
}
