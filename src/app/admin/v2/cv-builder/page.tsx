"use client";

import { useEffect, useState, useRef, useCallback, Component, type ReactNode } from "react";
import { pdf } from "@react-pdf/renderer";
import { useAdminTheme } from "../layout";
import { ChronologicalCV } from "@/components/cv/templates/chronological";
import { FunctionalCV } from "@/components/cv/templates/functional";
import { CombinationCV } from "@/components/cv/templates/combination";
import { MinimalCV } from "@/components/cv/templates/minimal";
import { CreativeCV } from "@/components/cv/templates/creative";
import { SKILL_CATEGORIES, getSkillCategory } from "@/lib/skill-categories";
import { ChronologicalPreview } from "@/components/cv/preview/chronological";
import { FunctionalPreview } from "@/components/cv/preview/functional";
import { CombinationPreview } from "@/components/cv/preview/combination";
import { MinimalPreview } from "@/components/cv/preview/minimal";
import { CreativePreview } from "@/components/cv/preview/creative";

type Language = "pt" | "en" | "es" | "fr" | "zh";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class PreviewErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Preview error:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface LocalizedString {
  pt: string;
  en: string;
  es: string;
  fr?: string;
  zh?: string;
}

interface Experience {
  id: number;
  role: LocalizedString;
  company: LocalizedString;
  period: string;
  description: LocalizedString;
  selected?: boolean;
}

interface Project {
  id: number;
  name: LocalizedString;
  description: LocalizedString;
  tags: string[];
}

interface Education {
  id: number;
  degree: LocalizedString;
  school: LocalizedString;
  period: string;
  description: LocalizedString;
  type?: string;
}

interface AdditionalData {
  willingnessToTravel: LocalizedString;
  willingnessToRelocate: LocalizedString;
  driverLicense: LocalizedString;
  vehicleType: LocalizedString;
}

interface CVData {
  name: LocalizedString;
  title: LocalizedString;
  email: string;
  phone: string;
  location: LocalizedString;
  linkedin: string;
  github: string;
  summary: LocalizedString;
  experience: Experience[];
  education: Education[];
  skills: LocalizedString[];
  projects: Project[];
  languages: LocalizedString[];
  objective: LocalizedString;
  additionalInfo: LocalizedString;
  additionalData: AdditionalData;
  includeExperience: boolean;
  includeEducation: boolean;
  includeSkills: boolean;
  includeProjects: boolean;
  includeLanguages: boolean;
  selectedExperienceIds: number[];
  selectedEducationIds: number[];
  selectedProjectIds: number[];
  selectedSkillIds: number[];
  maxSkills: number;
  sortSkills: string;
}

const templates = [
  { id: "chronological", name: "Chronological", desc: "Traditional, ATS-friendly" },
  { id: "functional", name: "Functional", desc: "Skills-focused layout" },
  { id: "combination", name: "Combination", desc: "Skills + experience hybrid" },
  { id: "minimal", name: "Minimal", desc: "Clean, no-frills design" },
  { id: "creative", name: "Creative", desc: "Two-column with sidebar" },
];

const defaultLocalizedString: LocalizedString = {
  pt: "",
  en: "",
  es: "",
};

export default function CVBuilderPage() {
  const { isDark } = useAdminTheme();
  
  const inputBg = isDark ? "bg-gray-900" : "bg-white";

const colors = {
    card: isDark ? "bg-gray-800" : "bg-white",
    cardBg: isDark ? "bg-gray-700" : "bg-gray-50",
    border: isDark ? "border-gray-600" : "border-gray-200",
    borderInput: isDark ? "border-gray-500" : "border-gray-300",
    text: isDark ? "text-white" : "text-gray-900",
    textMuted: isDark ? "text-gray-300" : "text-gray-600",
    textSubtle: isDark ? "text-gray-400" : "text-gray-500",
    textLabel: isDark ? "text-gray-400" : "text-gray-500",
    textSep: isDark ? "text-gray-600" : "text-gray-300",
    hoverBg: isDark ? "hover:bg-gray-700" : "hover:bg-gray-100",
    hoverText: isDark ? "hover:text-gray-300" : "hover:text-gray-500",
    disabledBg: isDark ? "disabled:bg-gray-600" : "disabled:bg-gray-300",
    accent: isDark ? "text-cyan-400" : "text-blue-600",
    accentBg: isDark ? "bg-cyan-500/10" : "bg-blue-500/10",
    accentBorder: isDark ? "border-cyan-500/30" : "border-blue-500/30",
    chipBg: isDark ? "bg-gray-700" : "bg-gray-200",
    chipText: isDark ? "text-gray-300" : "text-gray-600",
    selectedBg: isDark ? "bg-cyan-900/30" : "bg-blue-100",
    selectedText: isDark ? "text-cyan-300" : "text-blue-700",
    selectedBorder: isDark ? "border-cyan-500/50" : "border-blue-400",
    linkText: isDark ? "text-cyan-400" : "text-blue-600",
    linkHover: isDark ? "hover:text-cyan-300" : "hover:text-blue-500",
  };

  const [selectedTemplate, setSelectedTemplate] = useState("chronological");
  const [language, setLanguage] = useState<Language>("pt");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [defaultCV, setDefaultCV] = useState<any>(null);
  const [cvHistory, setCvHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [rawSkills, setRawSkills] = useState<any[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [skillSearch, setSkillSearch] = useState("");
  const [debouncedPreviewData, setDebouncedPreviewData] = useState<any>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const fetchDefaultCV = async () => {
    try {
      const [defaultRes, historyRes] = await Promise.all([
        fetch(`/api/admin/cv/save?language=${language}`),
        fetch('/api/admin/cv/save?history=true'),
      ]);
      const defaultData = await defaultRes.json();
      const historyData = await historyRes.json();
      
      if (defaultData?.config) {
        setCvData((prev) => ({
          ...prev,
          name: defaultData.config.name || prev.name,
          title: defaultData.config.title || prev.title,
          email: defaultData.config.email || prev.email,
          phone: defaultData.config.phone || prev.phone,
          location: defaultData.config.location || prev.location,
          linkedin: defaultData.config.linkedin || prev.linkedin,
          github: defaultData.config.github || prev.github,
          summary: defaultData.config.summary ?? prev.summary,
          objective: defaultData.config.objective ?? prev.objective,
          languages: defaultData.config.languages || prev.languages,
          additionalInfo: defaultData.config.additionalInfo || prev.additionalInfo,
          selectedExperienceIds: defaultData.config.selectedExperienceIds || prev.selectedExperienceIds,
          selectedEducationIds: defaultData.config.selectedEducationIds || prev.selectedEducationIds,
          selectedProjectIds: defaultData.config.selectedProjectIds || prev.selectedProjectIds,
          additionalData: defaultData.config.additionalData || prev.additionalData,
          includeExperience: defaultData.config.includeExperience ?? prev.includeExperience,
          includeEducation: defaultData.config.includeEducation ?? prev.includeEducation,
          includeSkills: defaultData.config.includeSkills ?? prev.includeSkills,
          includeProjects: defaultData.config.includeProjects ?? prev.includeProjects,
          includeLanguages: defaultData.config.includeLanguages ?? prev.includeLanguages,
          maxSkills: defaultData.config.maxSkills ?? prev.maxSkills,
          sortSkills: defaultData.config.sortSkills ?? prev.sortSkills,
          selectedSkillIds: defaultData.config.selectedSkillIds ?? prev.selectedSkillIds,
        }));
        if (defaultData.config.selectedTemplate) {
          setSelectedTemplate(defaultData.config.selectedTemplate);
        }
      }
      
      setDefaultCV(defaultData);
      setCvHistory(Array.isArray(historyData) ? historyData : []);
    } catch (error) {
      console.error("Failed to fetch CV data:", error);
    }
  };

  useEffect(() => {
    fetchDefaultCV();
  }, [language]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const [cvData, setCvData] = useState<CVData>({
    name: { pt: "Elias Edson Barão", en: "Elias Edson Barão", es: "Elias Edson Barão" },
    title: { pt: "Desenvolvedor Full-Stack", en: "Full-Stack Developer", es: "Desarrollador Full-Stack", fr: "Développeur Full-Stack", zh: "全栈开发者" },
    email: "e2barao@hotmail.com",
    phone: "+55 41 99804-6755",
    location: { pt: "Curitiba, Paraná, Brasil", en: "Curitiba, Paraná, Brazil", es: "Curitiba, Paraná, Brasil" },
    linkedin: "https://linkedin.com/in/e2barao",
    github: "https://github.com/httpE2Barao",
    summary: { pt: "", en: "", es: "" },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    languages: [
      { pt: "Português (Nativo)", en: "Portuguese (Native)", es: "Portugués (Nativo)" },
      { pt: "Inglês (Avançado)", en: "English (Advanced)", es: "Inglés (Avanzado)" },
      { pt: "Espanhol (Básico)", en: "Spanish (Basic)", es: "Español (Básico)" },
    ],
    objective: { pt: "", en: "", es: "" },
    additionalInfo: { pt: "", en: "", es: "" },
    additionalData: {
      willingnessToTravel: { pt: "Sim", en: "Yes", es: "Sí" },
      willingnessToRelocate: { pt: "Sim", en: "Yes", es: "Sí" },
      driverLicense: { pt: "B", en: "B", es: "B" },
      vehicleType: { pt: "Carro particular", en: "Personal car", es: "Coche particular" },
    },
    includeExperience: true,
    includeEducation: true,
    includeSkills: true,
    includeProjects: true,
    includeLanguages: true,
    selectedExperienceIds: [],
    selectedEducationIds: [],
    selectedProjectIds: [],
    selectedSkillIds: [],
    maxSkills: 20,
    sortSkills: "order",
  });
  const cvDataRef = useRef<CVData>(cvData);
  cvDataRef.current = cvData;

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const data = getLocalizedCVData(language);
        if (data) setDebouncedPreviewData(data);
      } catch (e) {
        console.error("Failed to build preview data:", e);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [cvData, language]);

  const saveConfig = async () => {
    const d = cvDataRef.current;
    if (!d) return;
    const res = await fetch('/api/admin/cv/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language,
        config: {
          name: d.name,
          title: d.title,
          email: d.email,
          phone: d.phone,
          location: d.location,
          linkedin: d.linkedin,
          github: d.github,
          summary: d.summary,
          objective: d.objective,
          languages: d.languages,
          additionalInfo: d.additionalInfo,
          selectedExperienceIds: d.selectedExperienceIds,
          selectedEducationIds: d.selectedEducationIds,
          selectedProjectIds: d.selectedProjectIds,
          selectedSkillIds: d.selectedSkillIds,
          additionalData: d.additionalData,
          includeExperience: d.includeExperience,
          includeEducation: d.includeEducation,
          includeSkills: d.includeSkills,
          includeProjects: d.includeProjects,
          includeLanguages: d.includeLanguages,
          maxSkills: d.maxSkills,
          sortSkills: d.sortSkills,
          selectedTemplate,
        },
      }),
    });
    if (!res.ok) {
      throw new Error(`Save failed: ${res.status}`);
    }
  };

  useEffect(() => {
    if (loading || rawSkills.length === 0) return;
    const timer = setTimeout(() => {
      saveConfig().catch((e) => console.error("Save config error:", e));
    }, 1000);
    return () => clearTimeout(timer);
  }, [cvData, language, loading, rawSkills.length]);

  const getLocalizedValue = (obj: LocalizedString | undefined, lang: Language): string => {
    if (!obj) return "";
    return obj[lang] || obj.pt || obj.en || obj.es || "";
  };

  const updateLocalizedField = (field: keyof CVData, value: LocalizedString) => {
    setCvData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (categoryId: string) => {
    const categorySkills = rawSkills
      .filter((s) => getSkillCategory(s) === categoryId)
      .map((s) => s.id);
    const allSelected = categorySkills.every((id) => cvData.selectedSkillIds.includes(id));
    const newIds = allSelected
      ? cvData.selectedSkillIds.filter((id) => !categorySkills.includes(id))
      : [...new Set([...cvData.selectedSkillIds, ...categorySkills])];
    setCvData({ ...cvData, selectedSkillIds: newIds });
  };

  const toggleSkill = (skillId: number) => {
    const newIds = cvData.selectedSkillIds.includes(skillId)
      ? cvData.selectedSkillIds.filter((id) => id !== skillId)
      : [...cvData.selectedSkillIds, skillId];
    setCvData({ ...cvData, selectedSkillIds: newIds });
  };

  const groupedSkills = SKILL_CATEGORIES.map((cat) => ({
    ...cat,
    skills: rawSkills.filter((s) => getSkillCategory(s) === cat.id),
  })).filter((cat) => cat.skills.length > 0);

const getLocalizedCVData = (lang: Language): any => {
    try {
    const selectedExp = cvData.selectedExperienceIds.length > 0
      ? cvData.experience.filter(exp => cvData.selectedExperienceIds.includes(exp.id))
      : cvData.experience;
    
    const selectedProj = cvData.selectedProjectIds.length > 0
      ? cvData.projects.filter(proj => cvData.selectedProjectIds.includes(proj.id))
      : cvData.projects;
    
    const selectedEdu = cvData.selectedEducationIds.length > 0
      ? cvData.education.filter(edu => cvData.selectedEducationIds.includes(edu.id))
      : cvData.education;
    
    const selectedSkillEntries = cvData.selectedSkillIds.length > 0
      ? cvData.skills
          .map((s, i) => ({ skill: s, order: rawSkills[i]?.display_order ?? i, rawId: rawSkills[i]?.id }))
          .filter((entry) => entry.rawId && cvData.selectedSkillIds.includes(entry.rawId))
      : cvData.skills.map((s, i) => ({ skill: s, order: rawSkills[i]?.display_order ?? i, rawId: rawSkills[i]?.id }));
    
    let sortedEntries = [...selectedSkillEntries];
    
    // Aplicar ordenação
    if (cvData.sortSkills === "alpha") {
      sortedEntries.sort((a, b) => getLocalizedValue(a.skill, lang).localeCompare(getLocalizedValue(b.skill, lang)));
    } else if (cvData.sortSkills === "reverse") {
      sortedEntries.sort((a, b) => getLocalizedValue(b.skill, lang).localeCompare(getLocalizedValue(a.skill, lang)));
    } else {
      sortedEntries.sort((a, b) => a.order - b.order);
    }
    
    // Aplicar limite máximo
    if (cvData.maxSkills > 0) {
      sortedEntries = sortedEntries.slice(0, cvData.maxSkills);
    }
    
    const sortedSkills = sortedEntries.map((e) => getLocalizedValue(e.skill, lang));
    const skillOrders = sortedEntries.map((e) => e.order);
    
    return ({
    name: getLocalizedValue(cvData.name, lang),
    title: getLocalizedValue(cvData.title, lang),
    email: cvData.email,
    phone: cvData.phone,
    location: getLocalizedValue(cvData.location, lang),
    linkedin: cvData.linkedin,
    github: cvData.github,
    summary: getLocalizedValue(cvData.summary, lang),
    objective: getLocalizedValue(cvData.objective, lang),
    experience: selectedExp.map((exp) => ({
      role: getLocalizedValue(exp.role, lang),
      company: getLocalizedValue(exp.company, lang),
      period: exp.period,
      description: getLocalizedValue(exp.description, lang),
    })),
    education: selectedEdu.map((edu) => ({
      degree: getLocalizedValue(edu.degree, lang),
      school: getLocalizedValue(edu.school, lang),
      period: edu.period,
      description: getLocalizedValue(edu.description, lang),
      type: edu.type,
    })),
    skills: sortedSkills,
    skillOrders: skillOrders,
    projects: selectedProj.map((p) => ({
      name: getLocalizedValue(p.name, lang),
      description: getLocalizedValue(p.description, lang),
      tags: p.tags || [],
    })),
    languages: cvData.languages.map((l) => getLocalizedValue(l, lang)),
    additionalInfo: getLocalizedValue(cvData.additionalInfo, lang),
    additionalData: {
      willingnessToTravel: getLocalizedValue(cvData.additionalData?.willingnessToTravel, lang),
      willingnessToRelocate: getLocalizedValue(cvData.additionalData?.willingnessToRelocate, lang),
      driverLicense: getLocalizedValue(cvData.additionalData?.driverLicense, lang),
      vehicleType: getLocalizedValue(cvData.additionalData?.vehicleType, lang),
    },
    includeExperience: cvData.includeExperience,
    includeEducation: cvData.includeEducation,
    includeSkills: cvData.includeSkills,
    includeProjects: cvData.includeProjects,
    includeLanguages: cvData.includeLanguages,
    maxSkills: cvData.maxSkills,
    language: lang,
  });
    } catch (e) {
      console.error("getLocalizedCVData error:", e);
      return null;
    }
  };

  const fetchAllData = async () => {
    try {
      const [expRes, eduRes, skillsRes, projectsRes, contactRes] = await Promise.all([
        fetch("/api/admin/experience"),
        fetch("/api/admin/education"),
        fetch("/api/admin/skills"),
        fetch("/api/admin/projects"),
        fetch("/api/admin/contact"),
      ]);

      const exp = await expRes.json();
      const edu = await eduRes.json();
      const skills = await skillsRes.json();
      const projects = await projectsRes.json();
      const contacts = await contactRes.json();

      const localizeField = (pt: string, en: string, es: string): LocalizedString => ({
        pt: pt || en || es || "",
        en: en || pt || es || "",
        es: es || en || pt || "",
      });

      const contactName = Array.isArray(contacts) ? contacts.find((c: any) => c.label === "Nome") : null;
      const contactEmail = Array.isArray(contacts) ? contacts.find((c: any) => c.label === "Email") : null;
      const contactPhone = Array.isArray(contacts) ? contacts.find((c: any) => c.label === "Telefone") : null;

      setCvData((prev) => ({
        ...prev,
        name: contactName ? { pt: contactName.value, en: contactName.value, es: contactName.value } : prev.name,
        email: contactEmail?.value || prev.email,
        phone: contactPhone?.value || prev.phone,
        experience: Array.isArray(exp)
          ? exp.map((e: any) => ({
              id: e.id,
              role: localizeField(e.role_pt, e.role_en, e.role_es),
              company: localizeField(e.company_pt, e.company_en, e.company_es),
              period: `${e.period_start} - ${e.period_end || "Atual"}`,
              description: localizeField(e.description_pt, e.description_en, e.description_es),
            }))
          : prev.experience,
        education: Array.isArray(edu)
          ? edu.map((e: any) => ({
              id: e.id,
              degree: localizeField(e.degree_pt, e.degree_en, e.degree_es),
              school: localizeField(e.school_pt, e.school_en, e.school_es),
              period: `${e.period_start} - ${e.period_end || "Atual"}`,
              description: localizeField(e.description_pt, e.description_en, e.description_es),
              type: e.education_type || "course",
            }))
          : prev.education,
        skills: Array.isArray(skills)
          ? skills
              .filter((s: any) => s.active)
              .map((s: any) => localizeField(s.name, s.name_en || s.name, s.name_es || s.name))
          : prev.skills,
        projects: Array.isArray(projects)
          ? projects.map((p: any) => ({
              id: p.id,
              name: localizeField(p.name_pt || p.name, p.name_en || p.name || p.name_pt, p.name_es || p.name_en || p.name),
              description: localizeField(p.abt_pt || p.abt, p.abt_en || p.abt || p.abt_pt, p.abt_es || p.abt_en || p.abt),
              tags: Array.isArray(p.tags) ? p.tags : [],
            }))
          : prev.projects,
      }));
      setRawSkills(Array.isArray(skills) ? skills.filter((s: any) => s.active) : []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const templateMap: Record<string, any> = {
        chronological: ChronologicalCV,
        functional: FunctionalCV,
        combination: CombinationCV,
        minimal: MinimalCV,
        creative: CreativeCV,
      };

      const Component = templateMap[selectedTemplate];
      const localizedData = getLocalizedCVData(language);
      const blob = await pdf(<Component data={localizedData} />).toBlob();

const fileName = `CV-${cvData.name.pt.replace(/\s+/g, "-")}-${selectedTemplate}-${language}.pdf`;
       
      const formData = new FormData();
      formData.append('pdf', blob, fileName);
      formData.append('templateId', selectedTemplate);
      formData.append('language', language);
      formData.append('config', JSON.stringify({
        selectedExperienceIds: cvData.selectedExperienceIds,
        selectedEducationIds: cvData.selectedEducationIds,
        selectedProjectIds: cvData.selectedProjectIds,
        additionalData: cvData.additionalData,
        includeExperience: cvData.includeExperience,
        includeEducation: cvData.includeEducation,
        includeSkills: cvData.includeSkills,
        includeProjects: cvData.includeProjects,
        includeLanguages: cvData.includeLanguages,
        maxSkills: cvData.maxSkills,
        sortSkills: cvData.sortSkills,
        selectedSkillIds: cvData.selectedSkillIds,
      }));

      await fetch('/api/admin/cv/save', {
        method: 'POST',
        body: formData,
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);

      setMessage({ type: "success", text: language === "pt" ? "PDF gerado e baixado com sucesso!" : language === "en" ? "PDF generated and downloaded successfully!" : "¡PDF generado y descargado con éxito!" });
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      setMessage({ type: "error", text: "Erro ao gerar PDF" });
    } finally {
      setGenerating(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const renderPreview = () => {
    if (!debouncedPreviewData) return <div className="flex items-center justify-center h-96 text-gray-400">Loading preview...</div>;
    const previewMap: Record<string, any> = {
      chronological: ChronologicalPreview,
      functional: FunctionalPreview,
      combination: CombinationPreview,
      minimal: MinimalPreview,
      creative: CreativePreview,
    };
    const Component = previewMap[selectedTemplate];
    return (
      <PreviewErrorBoundary key={`${selectedTemplate}-${debouncedPreviewData.name}`} fallback={
        <div className="flex flex-col items-center justify-center h-96 text-gray-400 gap-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span className="text-sm">Erro ao renderizar preview</span>
        </div>
      }>
        <Component data={debouncedPreviewData} />
      </PreviewErrorBoundary>
    );
  };

  const handleFieldChange = (field: keyof CVData, lang: Language, value: string) => {
    setCvData((prev) => {
      const current = (prev[field] as LocalizedString) || { ...defaultLocalizedString };
      return { ...prev, [field]: { ...current, [lang]: value } };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">CV Builder</h1>
          <p className={`${colors.textSubtle} mt-1`}>Selecione um template, configure e gere seu currículo em PDF</p>
          {defaultCV && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                {language === "pt" ? "CV padrão atual" : language === "en" ? "Current default CV" : "CV predeterminado actual"}
              </span>
              <span className={`text-xs ${colors.textSubtle}`}>
                {defaultCV.config?.selectedTemplate || selectedTemplate} • {new Date(defaultCV.created_at).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`${colors.cardBg} ${colors.hoverBg} border ${colors.border} ${colors.textMuted} font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {language === "pt" ? "Histórico" : language === "en" ? "History" : "Historial"}
          </button>
          <button
            onClick={async () => {
              try {
                await saveConfig();
                setMessage({ type: "success", text: language === "pt" ? "Configuração salva como padrão!" : language === "en" ? "Configuration saved as default!" : "¡Configuración guardada como predeterminada!" });
              } catch {
                setMessage({ type: "error", text: "Erro ao salvar" });
              }
              setTimeout(() => setMessage(null), 3000);
            }}
            className={`${colors.cardBg} ${colors.hoverBg} border ${colors.border} ${colors.textMuted} font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            {language === "pt" ? "Salvar Padrão" : language === "en" ? "Save Default" : "Guardar Predeterminado"}
          </button>
          <button
          onClick={generatePDF}
          disabled={generating}
          className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-400 text-black font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2"
        >
          {generating ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Gerar PDF
            </>
          )}
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-2 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)] pr-2">
          <div className={`${colors.card} ${colors.border} rounded-xl p-5`}>
            <h3 className="text-sm font-semibold mb-3">Template</h3>
            <div className="space-y-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedTemplate === t.id
                        ? `${colors.accentBg} border-${colors.accentBorder.replace('/30', '')}`
                        : `${colors.cardBg} ${colors.border} hover:${colors.border}`
                    }`}
                >
                  <span className={`text-sm font-medium ${selectedTemplate === t.id ? colors.accent : colors.text}`}>
                    {t.name}
                  </span>
                  <span className={`block text-xs ${colors.textSubtle} mt-0.5`}>{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={`${colors.card} ${colors.border} rounded-xl p-5`}>
            <h3 className="text-sm font-semibold mb-3">Idioma do CV</h3>
            <div className="flex gap-2">
              {(["pt", "en", "es"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    language === lang ? `${colors.accentBg} ${colors.accent} border ${colors.accentBorder}` : `${colors.cardBg} ${colors.textLabel} border ${colors.border}`
                  }`}
                >
                  {lang === "pt" ? "PT-BR" : lang === "en" ? "EN-US" : "ES"}
                </button>
              ))}
            </div>
          </div>

          <div className={`${colors.card} ${colors.border} rounded-xl p-5`}>
            <h3 className="text-sm font-semibold mb-3">Dados do CV</h3>
            <div className="space-y-3">
              <div>
                <div className="flex gap-1 mb-2">
                  {(["pt", "en", "es"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        language === lang ? `${colors.accentBg} ${colors.accent}` : `${colors.textLabel} ${colors.hoverText}`
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
                <label className={`block text-xs ${colors.textLabel} mb-1`}>Nome ({language.toUpperCase()})</label>
                <input
                  type="text"
                  value={cvData.name[language] || ""}
                  onChange={(e) => handleFieldChange("name", language, e.target.value)}
                  className={`w-full ${inputBg} border ${colors.border} rounded-lg px-3 py-2 text-sm ${colors.text}`}
                />
              </div>
              <div>
                <label className={`block text-xs ${colors.textLabel} mb-1`}>Título ({language.toUpperCase()})</label>
                <input
                  type="text"
                  value={cvData.title[language] || ""}
                  onChange={(e) => handleFieldChange("title", language, e.target.value)}
                  className={`w-full ${inputBg} border ${colors.border} rounded-lg px-3 py-2 text-sm ${colors.text}`}
                />
              </div>
              <div>
                <label className={`block text-xs ${colors.textLabel} mb-1`}>Resumo Profissional ({language.toUpperCase()})</label>
                <textarea
                  value={cvData.summary[language] || ""}
                  onChange={(e) => handleFieldChange("summary", language, e.target.value)}
                  rows={3}
                  className={`w-full ${inputBg} border ${colors.border} rounded-lg px-3 py-2 text-sm resize-none ${colors.text}`}
                  placeholder={language === "pt" ? "Descreva seu perfil profissional..." : language === "en" ? "Describe your professional profile..." : "Describe tu perfil profesional..."}
                />
              </div>
              <div>
                <label className={`block text-xs ${colors.textLabel} mb-1`}>Objetivo ({language.toUpperCase()})</label>
                <textarea
                  value={cvData.objective[language] || ""}
                  onChange={(e) => handleFieldChange("objective", language, e.target.value)}
                  rows={2}
                  className={`w-full ${inputBg} border ${colors.border} rounded-lg px-3 py-2 text-sm resize-none ${colors.text}`}
                  placeholder={language === "pt" ? "Descreva seu objetivo profissional..." : language === "en" ? "Describe your professional objective..." : "Describe tu objetivo profesional..."}
                />
              </div>
              <div>
                <label className={`block text-xs ${colors.textLabel} mb-1`}>Localização ({language.toUpperCase()})</label>
                <input
                  type="text"
                  value={cvData.location[language] || ""}
                  onChange={(e) => handleFieldChange("location", language, e.target.value)}
                  className={`w-full ${inputBg} border ${colors.border} rounded-lg px-3 py-2 text-sm ${colors.text}`}
                />
              </div>
              <div>
                <label className={`block text-xs ${colors.textLabel} mb-1`}>Email</label>
                <input
                  type="email"
                  value={cvData.email}
                  onChange={(e) => setCvData({ ...cvData, email: e.target.value })}
                  className={`w-full ${inputBg} border ${colors.border} rounded-lg px-3 py-2 text-sm ${colors.text}`}
                />
              </div>
              <div>
                <label className={`block text-xs ${colors.textLabel} mb-1`}>Telefone</label>
                <input
                  type="text"
                  value={cvData.phone}
                  onChange={(e) => setCvData({ ...cvData, phone: e.target.value })}
                  className={`w-full ${inputBg} border ${colors.border} rounded-lg px-3 py-2 text-sm ${colors.text}`}
                />
              </div>
              <div>
                <label className={`block text-xs ${colors.textLabel} mb-1`}>LinkedIn URL</label>
                <input
                  type="text"
                  value={cvData.linkedin}
                  onChange={(e) => setCvData({ ...cvData, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/seu-perfil"
                  className={`w-full ${inputBg} border ${colors.border} rounded-lg px-3 py-2 text-sm ${colors.text}`}
                />
              </div>
              <div>
                <label className={`block text-xs ${colors.textLabel} mb-1`}>GitHub URL</label>
                <input
                  type="text"
                  value={cvData.github}
                  onChange={(e) => setCvData({ ...cvData, github: e.target.value })}
                  placeholder="https://github.com/seu-usuario"
                  className={`w-full ${inputBg} border ${colors.border} rounded-lg px-3 py-2 text-sm ${colors.text}`}
                />
              </div>
              <div>
                <label className={`block text-xs ${colors.textLabel} mb-1`}>Informações Adicionais ({language.toUpperCase()})</label>
                <textarea
                  value={cvData.additionalInfo[language] || ""}
                  onChange={(e) => handleFieldChange("additionalInfo", language, e.target.value)}
                  rows={3}
                  className={`w-full ${inputBg} border ${colors.border} rounded-lg px-3 py-2 text-sm resize-none ${colors.text}`}
                  placeholder={language === "pt" ? "Certificações, cursos, prêmios..." : language === "en" ? "Certifications, courses, awards..." : "Certificaciones, cursos, premios..."}
                />
              </div>
            </div>
          </div>

          <div className={`${colors.card} ${colors.border} rounded-xl p-5`}>
            <h3 className="text-sm font-semibold mb-3">Dados Complementares ({language.toUpperCase()})</h3>
            <div className="space-y-3">
              <div>
                <label className={`block text-xs ${colors.textLabel} mb-1`}>
                  {language === "pt" ? "Disponibilidade para viajar" : language === "en" ? "Willingness to travel" : "Disponibilidad para viajar"}
                </label>
                <select
                  value={cvData.additionalData.willingnessToTravel[language] || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCvData((prev) => ({
                      ...prev,
                      additionalData: {
                        ...prev.additionalData,
                        willingnessToTravel: { ...prev.additionalData.willingnessToTravel, [language]: value },
                      },
                    }));
                  }}
                  className={`w-full ${inputBg} border ${colors.border} rounded-lg px-3 py-2 text-sm ${colors.text}`}
                >
                  <option value="">{language === "pt" ? "Selecione..." : language === "en" ? "Select..." : "Seleccione..."}</option>
                  <option value={language === "pt" ? "Sim" : language === "en" ? "Yes" : "Sí"}>{language === "pt" ? "Sim" : language === "en" ? "Yes" : "Sí"}</option>
                  <option value={language === "pt" ? "Não" : language === "en" ? "No" : "No"}>{language === "pt" ? "Não" : language === "en" ? "No" : "No"}</option>
                </select>
              </div>
              <div>
                <label className={`block text-xs ${colors.textLabel} mb-1`}>
                  {language === "pt" ? "Disponibilidade para mudar de residência" : language === "en" ? "Willingness to relocate" : "Disponibilidad para mudarse"}
                </label>
                <select
                  value={cvData.additionalData.willingnessToRelocate[language] || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCvData((prev) => ({
                      ...prev,
                      additionalData: {
                        ...prev.additionalData,
                        willingnessToRelocate: { ...prev.additionalData.willingnessToRelocate, [language]: value },
                      },
                    }));
                  }}
                  className={`w-full ${inputBg} border ${colors.border} rounded-lg px-3 py-2 text-sm ${colors.text}`}
                >
                  <option value="">{language === "pt" ? "Selecione..." : language === "en" ? "Select..." : "Seleccione..."}</option>
                  <option value={language === "pt" ? "Sim" : language === "en" ? "Yes" : "Sí"}>{language === "pt" ? "Sim" : language === "en" ? "Yes" : "Sí"}</option>
                  <option value={language === "pt" ? "Não" : language === "en" ? "No" : "No"}>{language === "pt" ? "Não" : language === "en" ? "No" : "No"}</option>
                </select>
              </div>
              <div>
                <label className={`block text-xs ${colors.textLabel} mb-1`}>
                  {language === "pt" ? "Carteira de Habilitação" : language === "en" ? "Driver's License" : "Licencia de Conducir"}
                </label>
                <select
                  value={cvData.additionalData.driverLicense[language] || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCvData((prev) => ({
                      ...prev,
                      additionalData: {
                        ...prev.additionalData,
                        driverLicense: { ...prev.additionalData.driverLicense, [language]: value },
                      },
                    }));
                  }}
                  className={`w-full ${inputBg} border ${colors.border} rounded-lg px-3 py-2 text-sm ${colors.text}`}
                >
                  <option value="">{language === "pt" ? "Selecione..." : language === "en" ? "Select..." : "Seleccione..."}</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value={language === "pt" ? "Não tenho" : language === "en" ? "I don't have" : "No tengo"}>{language === "pt" ? "Não tenho" : language === "en" ? "I don't have" : "No tengo"}</option>
                </select>
              </div>
              <div>
                <label className={`block text-xs ${colors.textLabel} mb-1`}>
                  {language === "pt" ? "Tipo de Veículo" : language === "en" ? "Vehicle Type" : "Tipo de Vehículo"}
                </label>
                <select
                  value={cvData.additionalData.vehicleType[language] || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCvData((prev) => ({
                      ...prev,
                      additionalData: {
                        ...prev.additionalData,
                        vehicleType: { ...prev.additionalData.vehicleType, [language]: value },
                      },
                    }));
                  }}
                  className={`w-full ${inputBg} border ${colors.border} rounded-lg px-3 py-2 text-sm ${colors.text}`}
                >
                  <option value="">{language === "pt" ? "Selecione..." : language === "en" ? "Select..." : "Seleccione..."}</option>
                  <option value={language === "pt" ? "Carro particular" : language === "en" ? "Personal car" : "Coche particular"}>{language === "pt" ? "Carro particular" : language === "en" ? "Personal car" : "Coche particular"}</option>
                  <option value={language === "pt" ? "Moto" : language === "en" ? "Motorcycle" : "Motocicleta"}>{language === "pt" ? "Moto" : language === "en" ? "Motorcycle" : "Motocicleta"}</option>
                  <option value={language === "pt" ? "Caminhão" : language === "en" ? "Truck" : "Camión"}>{language === "pt" ? "Caminhão" : language === "en" ? "Truck" : "Camión"}</option>
                  <option value={language === "pt" ? "Van / Utilitário" : language === "en" ? "Van / Utility" : "Furgoneta"}>{language === "pt" ? "Van / Utilitário" : language === "en" ? "Van / Utility" : "Furgoneta"}</option>
                  <option value={language === "pt" ? "Não tenho" : language === "en" ? "I don't have" : "No tengo"}>{language === "pt" ? "Não tenho" : language === "en" ? "I don't have" : "No tengo"}</option>
                </select>
              </div>
            </div>
          </div>

          <div className={`${colors.card} ${colors.border} rounded-xl p-5`}>
            <h3 className="text-sm font-semibold mb-3">Seções do CV</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cvData.includeExperience}
                  onChange={(e) => setCvData({ ...cvData, includeExperience: e.target.checked })}
                  className={`w-4 h-4 rounded ${colors.border} ${colors.cardBg} text-cyan-500 focus:ring-cyan-500`}
                />
                <span className={`text-sm ${colors.textMuted}`}>Experiência Profissional</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cvData.includeEducation}
                  onChange={(e) => setCvData({ ...cvData, includeEducation: e.target.checked })}
                  className={`w-4 h-4 rounded ${colors.border} ${colors.cardBg} text-cyan-500 focus:ring-cyan-500`}
                />
                <span className={`text-sm ${colors.textMuted}`}>Educação</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cvData.includeSkills}
                  onChange={(e) => setCvData({ ...cvData, includeSkills: e.target.checked })}
                  className={`w-4 h-4 rounded ${colors.border} ${colors.cardBg} text-cyan-500 focus:ring-cyan-500`}
                />
                <span className={`text-sm ${colors.textMuted}`}>Skills</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cvData.includeProjects}
                  onChange={(e) => setCvData({ ...cvData, includeProjects: e.target.checked })}
                  className={`w-4 h-4 rounded ${colors.border} ${colors.cardBg} text-cyan-500 focus:ring-cyan-500`}
                />
                <span className={`text-sm ${colors.textMuted}`}>Projetos</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cvData.includeLanguages}
                  onChange={(e) => setCvData({ ...cvData, includeLanguages: e.target.checked })}
                  className={`w-4 h-4 rounded ${colors.border} ${colors.cardBg} text-cyan-500 focus:ring-cyan-500`}
                />
                <span className={`text-sm ${colors.textMuted}`}>Idiomas</span>
              </label>
            </div>
          </div>

          {cvData.includeLanguages && (
            <div className={`${colors.card} ${colors.border} rounded-xl p-5 mt-4`}>
              <h3 className="text-sm font-semibold mb-3">
                {language === "pt" ? "Idiomas" : language === "en" ? "Languages" : "Idiomas"}
              </h3>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {cvData.languages.map((langItem, index) => (
                  <div key={index} className={`flex items-center gap-2 p-2 rounded-lg ${colors.cardBg}`}>
                    <input
                      type="text"
                      value={getLocalizedValue(langItem, language)}
                      onChange={(e) => {
                        const newLanguages = [...cvData.languages];
                        newLanguages[index] = { ...newLanguages[index], [language]: e.target.value };
                        setCvData({ ...cvData, languages: newLanguages });
                      }}
                      className={`flex-1 ${inputBg} border ${colors.border} rounded px-2 py-1 text-xs ${colors.text}`}
                      placeholder={language === "pt" ? "Ex: Português (Nativo)" : language === "en" ? "Ex: Portuguese (Native)" : "Ex: Portugués (Nativo)"}
                    />
                    <button
                      onClick={() => {
                        const newLanguages = cvData.languages.filter((_, i) => i !== index);
                        setCvData({ ...cvData, languages: newLanguages });
                      }}
                      className="text-red-400 hover:text-red-300 text-xs px-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setCvData({ ...cvData, languages: [...cvData.languages, { pt: "", en: "", es: "" }] })}
                className={`mt-2 text-xs ${colors.linkText} ${colors.linkHover}`}
              >
                + {language === "pt" ? "Adicionar idioma" : language === "en" ? "Add language" : "Agregar idioma"}
              </button>
            </div>
          )}

          {cvData.includeSkills && (
            <div className={`${colors.card} ${colors.border} rounded-xl p-5 mt-4`}>
              <h3 className="text-sm font-semibold mb-3">
                {language === "pt" ? "Configurar Skills" : language === "en" ? "Configure Skills" : "Configurar Habilidades"}
              </h3>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  placeholder={language === "pt" ? "Pesquisar skill..." : language === "en" ? "Search skill..." : "Buscar habilidad..."}
                  className={`flex-1 ${inputBg} border ${colors.border} rounded-lg px-3 py-1.5 text-xs ${colors.text}`}
                />
                <select
                  value={cvData.sortSkills}
                  onChange={(e) => setCvData({ ...cvData, sortSkills: e.target.value })}
                  className={`${inputBg} border ${colors.border} rounded-lg px-2 py-1.5 text-xs ${colors.text}`}
                >
                  <option value="order">{language === "pt" ? "Ordem DB" : language === "en" ? "DB Order" : "Orden DB"}</option>
                  <option value="alpha">A-Z</option>
                  <option value="reverse">Z-A</option>
                </select>
              </div>

              <div className="flex gap-2 mb-3">
                <div>
                  <label className={`block text-xs ${colors.textMuted} mb-1`}>
                    {language === "pt" ? "Máx." : language === "en" ? "Max." : "Máx."}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={cvData.maxSkills}
                    onChange={(e) => setCvData({ ...cvData, maxSkills: parseInt(e.target.value) || 0 })}
                    className={`w-16 ${inputBg} border ${colors.border} rounded-lg px-2 py-1.5 text-xs ${colors.text}`}
                  />
                </div>
                <div className="flex-1 flex items-end gap-2">
                  <button
                    onClick={() => setCvData({ ...cvData, selectedSkillIds: rawSkills.map((s) => s.id) })}
                    className={`text-xs ${colors.linkText} ${colors.linkHover}`}
                  >
                    {language === "pt" ? "Selecionar todas" : language === "en" ? "Select all" : "Seleccionar todas"}
                  </button>
                  <span className={`${colors.textSep}`}>|</span>
                  <button
                    onClick={() => setCvData({ ...cvData, selectedSkillIds: [] })}
                    className={`text-xs ${colors.textLabel} ${colors.hoverText}`}
                  >
                    {language === "pt" ? "Limpar" : language === "en" ? "Clear" : "Limpiar"}
                  </button>
                </div>
              </div>

              <div className={`text-xs ${colors.textSubtle} mb-3`}>
                {cvData.selectedSkillIds.length}/{rawSkills.length} {language === "pt" ? "selecionadas" : language === "en" ? "selected" : "seleccionadas"}
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {groupedSkills.map((cat) => {
                  const filteredSkills = cat.skills.filter((s) =>
                    !skillSearch || s.name.toLowerCase().includes(skillSearch.toLowerCase())
                  );
                  if (filteredSkills.length === 0) return null;
                  const allSelected = filteredSkills.every((s) => cvData.selectedSkillIds.includes(s.id));
                  const someSelected = filteredSkills.some((s) => cvData.selectedSkillIds.includes(s.id));
                  const isExpanded = expandedCategories[cat.id] ?? false;

                  return (
                    <div key={cat.id} className={`border ${colors.border} rounded-lg`}>
                      <div className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${colors.cardBg} rounded-t-lg`} onClick={() => setExpandedCategories({ ...expandedCategories, [cat.id]: !isExpanded })}>
                        <input
                          type="checkbox"
                          checked={allSelected}
                          ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                          onChange={(e) => { e.stopPropagation(); toggleCategory(cat.id); }}
                          onClick={(e) => e.stopPropagation()}
                          className={`w-4 h-4 rounded ${colors.border} ${colors.cardBg} text-cyan-500 focus:ring-cyan-500`}
                        />
                        <span className={`text-xs font-medium ${colors.text}`}>
                          {cat.label[language as keyof typeof cat.label] || cat.label.pt}
                        </span>
                        <span className={`text-xs ${colors.textMuted} ml-auto`}>
                          {filteredSkills.filter((s) => cvData.selectedSkillIds.includes(s.id)).length}/{filteredSkills.length}
                        </span>
                        <span className={`text-xs ${colors.textMuted}`}>{isExpanded ? "▲" : "▼"}</span>
                      </div>
                      {isExpanded && (
                        <div className="px-3 py-2 flex flex-wrap gap-1.5">
                          {filteredSkills.map((skill) => (
                            <label
                              key={skill.id}
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] cursor-pointer transition-colors ${
                                cvData.selectedSkillIds.includes(skill.id)
                                  ? `${colors.selectedBg} ${colors.selectedText} border ${colors.selectedBorder}`
                                  : `${colors.cardBg} ${colors.textMuted} border ${colors.border}`
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={cvData.selectedSkillIds.includes(skill.id)}
                                onChange={() => toggleSkill(skill.id)}
                                className="sr-only"
                              />
                              {skill.name}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {cvData.includeExperience && (
            <div className={`${colors.card} ${colors.border} rounded-xl p-5`}>
              <h3 className="text-sm font-semibold mb-3">Selecionar Experiências</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {cvData.experience.map((exp) => (
                  <label key={exp.id} className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cvData.selectedExperienceIds.includes(exp.id)}
                      onChange={(e) => {
                        const ids = e.target.checked
                          ? [...cvData.selectedExperienceIds, exp.id]
                          : cvData.selectedExperienceIds.filter((id) => id !== exp.id);
                        setCvData({ ...cvData, selectedExperienceIds: ids });
                      }}
                      className={`w-4 h-4 mt-0.5 rounded ${colors.border} ${colors.cardBg} text-cyan-500 focus:ring-cyan-500`}
                    />
                    <div className="text-xs">
                      <span className={`${colors.textMuted} block font-medium`}>
                        {getLocalizedValue(exp.role, language)}
                      </span>
                       <span className={`${colors.textSubtle}`}>
                        {getLocalizedValue(exp.company, language)} • {exp.period}
                      </span>
                    </div>
                  </label>
                ))}
                {cvData.experience.length === 0 && (
                  <p className={`text-xs ${colors.textSubtle}`}>Nenhuma experiência encontrada</p>
                )}
              </div>
              <div className={`mt-3 pt-3 border-t ${colors.border} flex gap-2`}>
                <button
                  onClick={() => setCvData({ ...cvData, selectedExperienceIds: cvData.experience.map(e => e.id) })}
                  className={`text-xs ${colors.linkText} ${colors.linkHover}`}
                >
                  Selecionar todas
                </button>
                <span className={`${colors.textSep}`}>|</span>
                <button
                  onClick={() => setCvData({ ...cvData, selectedExperienceIds: [] })}
                  className={`text-xs ${colors.textLabel} ${colors.hoverText}`}
                >
                  Limpar seleção
                </button>
              </div>
            </div>
          )}

          {cvData.includeEducation && (
            <div className={`${colors.card} ${colors.border} rounded-xl p-5`}>
              <h3 className="text-sm font-semibold mb-3">Selecionar Educação</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {cvData.education.map((edu) => (
                  <label key={edu.id} className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cvData.selectedEducationIds.includes(edu.id)}
                      onChange={(e) => {
                        const ids = e.target.checked
                          ? [...cvData.selectedEducationIds, edu.id]
                          : cvData.selectedEducationIds.filter((id) => id !== edu.id);
                        setCvData({ ...cvData, selectedEducationIds: ids });
                      }}
                      className={`w-4 h-4 mt-0.5 rounded ${colors.border} ${colors.cardBg} text-cyan-500 focus:ring-cyan-500`}
                    />
                    <div className="text-xs">
                      <span className={`${colors.textMuted} block font-medium`}>
                        {getLocalizedValue(edu.degree, language)}
                      </span>
                       <span className={`${colors.textSubtle}`}>
                        {getLocalizedValue(edu.school, language)} • {edu.period}
                      </span>
                    </div>
                  </label>
                ))}
                {cvData.education.length === 0 && (
                  <p className={`text-xs ${colors.textSubtle}`}>Nenhuma educação encontrada</p>
                )}
              </div>
              <div className={`mt-3 pt-3 border-t ${colors.border} flex gap-2`}>
                <button
                  onClick={() => setCvData({ ...cvData, selectedEducationIds: cvData.education.map(e => e.id) })}
                  className={`text-xs ${colors.linkText} ${colors.linkHover}`}
                >
                  Selecionar todas
                </button>
                <span className={`${colors.textSep}`}>|</span>
                <button
                  onClick={() => setCvData({ ...cvData, selectedEducationIds: [] })}
                  className={`text-xs ${colors.textLabel} ${colors.hoverText}`}
                >
                  Limpar seleção
                </button>
              </div>
            </div>
          )}

          {cvData.includeProjects && (
            <div className={`${colors.card} ${colors.border} rounded-xl p-5`}>
              <h3 className="text-sm font-semibold mb-3">Selecionar Projetos</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {cvData.projects.map((proj) => (
                  <label key={proj.id} className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cvData.selectedProjectIds.includes(proj.id)}
                      onChange={(e) => {
                        const ids = e.target.checked
                          ? [...cvData.selectedProjectIds, proj.id]
                          : cvData.selectedProjectIds.filter((id) => id !== proj.id);
                        setCvData({ ...cvData, selectedProjectIds: ids });
                      }}
                      className={`w-4 h-4 mt-0.5 rounded ${colors.border} ${colors.cardBg} text-cyan-500 focus:ring-cyan-500`}
                    />
                    <div className="text-xs">
                      <span className={`${colors.textMuted} block font-medium`}>
                        {getLocalizedValue(proj.name, language)}
                      </span>
                    </div>
                  </label>
                ))}
                {cvData.projects.length === 0 && (
                  <p className={`text-xs ${colors.textSubtle}`}>Nenhum projeto encontrado</p>
                )}
              </div>
              <div className={`mt-3 pt-3 border-t ${colors.border} flex gap-2`}>
                <button
                  onClick={() => setCvData({ ...cvData, selectedProjectIds: cvData.projects.map(p => p.id) })}
                  className={`text-xs ${colors.linkText} ${colors.linkHover}`}
                >
                  Selecionar todos
                </button>
                <span className={`${colors.textSep}`}>|</span>
                <button
                  onClick={() => setCvData({ ...cvData, selectedProjectIds: [] })}
                  className={`text-xs ${colors.textLabel} ${colors.hoverText}`}
                >
                  Limpar seleção
                </button>
              </div>
            </div>
          )}

          <div className={`${colors.card} ${colors.border} rounded-xl p-5`}>
            <h3 className="text-sm font-semibold mb-3">Resumo</h3>
            <div className={`space-y-2 text-xs ${colors.textLabel}`}>
              <div className="flex justify-between">
                <span>Experiências</span>
                <span className={`${colors.text}`}>{cvData.selectedExperienceIds.length} / {cvData.experience.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Educação</span>
                <span className={`${colors.text}`}>{cvData.selectedEducationIds.length} / {cvData.education.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Skills</span>
                <span className={`${colors.text}`}>{cvData.selectedSkillIds.length} / {rawSkills.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Projetos</span>
                <span className={`${colors.text}`}>{cvData.selectedProjectIds.length} / {cvData.projects.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Idiomas</span>
                <span className={`${colors.text}`}>{cvData.languages.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-3">
          <div className={`${colors.card} border ${colors.border} rounded-xl p-4`}>
            <h3 className="text-sm font-semibold mb-4">Preview</h3>
            <div className="w-full bg-gray-100 rounded-lg p-2">
              <div ref={previewContainerRef} className="w-full bg-white">
                {renderPreview()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${colors.card} border ${colors.border} rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden`}>
            <div className={`p-4 border-b ${colors.border} flex items-center justify-between`}>
              <h2 className="text-lg font-semibold">
                {language === "pt" ? "Histórico de CVs" : language === "en" ? "CV History" : "Historial de CVs"}
              </h2>
              <button
                onClick={() => setShowHistory(false)}
                className={`${colors.textLabel} ${colors.hoverText}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-4">
              {cvHistory.length === 0 ? (
                <p className={`${colors.textSubtle} text-center py-8`}>
                  {language === "pt" ? "Nenhum CV encontrado" : language === "en" ? "No CV found" : "No se encontró ningún CV"}
                </p>
              ) : (
                <div className="space-y-3">
                  {cvHistory.map((cv, index) => (
                    <div
                      key={cv.id}
                      className={`p-4 rounded-lg border ${
                        index === 0 ? "bg-cyan-500/10 border-cyan-500/30" : `${colors.cardBg} ${colors.border}`
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${colors.text}`}>{cv.template_id || "Template"}</span>
                            <span className={`text-xs ${colors.chipBg} px-2 py-0.5 rounded ${colors.textMuted}`}>{cv.language?.toUpperCase()}</span>
                            {index === 0 && (
                              <span className={`text-xs ${colors.accentBg} ${colors.accent} px-2 py-0.5 rounded`}>
                                {language === "pt" ? "Padrão" : language === "en" ? "Default" : "Predeterminado"}
                              </span>
                            )}
                          </div>
                          <p className={`text-xs ${colors.textSubtle} mt-1`}>
                            {new Date(cv.created_at).toLocaleString()}
                          </p>
                        </div>
                        <a
                          href={cv.blob_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${colors.linkText} ${colors.linkHover} text-sm flex items-center gap-1`}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                          {language === "pt" ? "Baixar" : language === "en" ? "Download" : "Descargar"}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
