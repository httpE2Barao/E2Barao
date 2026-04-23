export interface Skill {
  id: number;
  name: string;
  category: 'tech' | 'concept' | 'program';
  level: number;
  color: string;
  icon_src: string;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExperienceEntry {
  id: number;
  period_start: string;
  period_end: string;
  role_pt: string;
  role_en: string;
  role_es: string;
  role_fr: string;
  role_zh: string;
  company_pt: string;
  company_en: string;
  company_es: string;
  company_fr: string;
  company_zh: string;
  description_pt: string;
  description_en: string;
  description_es: string;
  description_fr: string;
  description_zh: string;
  highlight: boolean;
  display_order: number;
  github_repos: string[];
  created_at: string;
  updated_at: string;
}

export interface EducationEntry {
  id: number;
  period_start: string;
  period_end: string;
  degree_pt: string;
  degree_en: string;
  degree_es: string;
  degree_fr: string;
  degree_zh: string;
  school_pt: string;
  school_en: string;
  school_es: string;
  school_fr: string;
  school_zh: string;
  description_pt: string;
  description_en: string;
  description_es: string;
  description_fr: string;
  description_zh: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface PortfolioContent {
  id: number;
  section: string;
  key: string;
  value_pt: string;
  value_en: string;
  value_es: string;
  value_fr: string;
  value_zh: string;
  display_order: number;
  updated_at: string;
}

export interface ContactInfo {
  id: number;
  label: string;
  value: string;
  icon: string;
  description_pt: string;
  description_en: string;
  description_es: string;
  description_fr: string;
  description_zh: string;
  visible: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CVTemplate {
  id: number;
  name: string;
  format: 'chronological' | 'functional' | 'combination' | 'minimal' | 'creative';
  config: CVTemplateConfig;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CVTemplateConfig {
  accentColor: string;
  fontFamily: string;
  showPhoto: boolean;
  showProjects: boolean;
  showSkills: boolean;
  showLanguages: boolean;
}

export interface CVGenerated {
  id: number;
  template_id: number | null;
  format: string;
  blob_url: string;
  language: string;
  created_at: string;
}

export interface Project {
  id: number;
  src: string;
  site_url: string;
  repo_url: string;
  image_urls: string[];
  tags: string[];
  name_pt: string;
  name_en: string;
  name_es: string;
  name_fr: string;
  name_zh: string;
  abt_pt: string;
  abt_en: string;
  abt_es: string;
  abt_fr: string;
  abt_zh: string;
  alt_pt: string;
  alt_en: string;
  alt_es: string;
  alt_fr: string;
  alt_zh: string;
  featured: boolean;
  display_order: number;
  created_at: string;
}

export type Language = 'pt' | 'en' | 'es' | 'fr' | 'zh';

export const languageLabels: Record<Language, string> = {
  pt: 'Português',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  zh: '中文',
};
