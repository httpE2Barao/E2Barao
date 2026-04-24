"use client";

import { useEffect, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { useAdminTheme } from "../layout";
import { ChronologicalCV } from "@/components/cv/templates/chronological";
import { FunctionalCV } from "@/components/cv/templates/functional";
import { CombinationCV } from "@/components/cv/templates/combination";
import { MinimalCV } from "@/components/cv/templates/minimal";
import { CreativeCV } from "@/components/cv/templates/creative";
import { ChronologicalPreview } from "@/components/cv/preview/chronological";
import { FunctionalPreview } from "@/components/cv/preview/functional";
import { CombinationPreview } from "@/components/cv/preview/combination";
import { MinimalPreview } from "@/components/cv/preview/minimal";
import { CreativePreview } from "@/components/cv/preview/creative";

type Language = "pt" | "en" | "es" | "fr" | "zh";

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
}

interface Education {
  degree: LocalizedString;
  school: LocalizedString;
  period: string;
  description: LocalizedString;
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
  additionalInfo: LocalizedString;
  additionalData: AdditionalData;
  includeExperience: boolean;
  includeEducation: boolean;
  includeSkills: boolean;
  includeProjects: boolean;
  includeLanguages: boolean;
  selectedExperienceIds: number[];
  selectedProjectIds: number[];
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
  
  const colors = {
    card: isDark ? "{colors.card}" : "bg-white",
    cardBg: isDark ? "{colors.cardBg}" : "bg-gray-50",
    border: isDark ? "{colors.border}" : "border-gray-200",
    borderInput: isDark ? "{colors.border}" : "border-gray-300",
    text: isDark ? "{colors.text}" : "text-gray-900",
    textMuted: isDark ? "{colors.textMuted}" : "text-gray-600",
    textSubtle: isDark ? "text-gray-400" : "text-gray-500",
    accent: isDark ? "text-cyan-400" : "text-blue-600",
    accentBg: isDark ? "bg-cyan-500/10" : "bg-blue-500/10",
    accentBorder: isDark ? "border-cyan-500/30" : "border-blue-500/30",
  };

  const [selectedTemplate, setSelectedTemplate] = useState("chronological");
  const [language, setLanguage] = useState<Language>("pt");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [defaultCV, setDefaultCV] = useState<any>(null);
  const [cvHistory, setCvHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [cvData, setCvData] = useState<CVData>({
    name: { pt: "Elias Edson Barao", en: "Elias Edson Barao", es: "Elias Edson Barao" },
    title: { pt: "Desenvolvedor Full-Stack", en: "Full-Stack Developer", es: "Desarrollador Full-Stack", fr: "Développeur Full-Stack", zh: "全栈开发者" },
    email: "e2barao@hotmail.com",
    phone: "+55 41 99804-6755",
    location: { pt: "Curitiba, Paraná, Brasil", en: "Curitiba, Paraná, Brazil", es: "Curitiba, Paraná, Brasil" },
    linkedin: "linkedin.com/in/e2barao",
    github: "github.com/httpE2Barao",
    summary: { pt: "", en: "", es: "" },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    languages: [
      { pt: "Português (Nativo)", en: "Portuguese (Native)", es: "Portugués (Nativo)" },
      { pt: "Inglês (Fluente)", en: "English (Fluent)", es: "Inglés (Fluido)" },
      { pt: "Espanhol (Conversacional)", en: "Spanish (Conversational)", es: "Español (Conversacional)" },
    ],
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
    selectedProjectIds: [],
  });

  const getLocalizedValue = (obj: LocalizedString | undefined, lang: Language): string => {
    if (!obj) return "";
    return obj[lang] || obj.pt || "";
  };

  const updateLocalizedField = (field: keyof CVData, value: LocalizedString) => {
    setCvData((prev) => ({ ...prev, [field]: value }));
  };

  const getLocalizedCVData = (lang: Language): any => {
    const selectedExp = cvData.selectedExperienceIds.length > 0
      ? cvData.experience.filter(exp => cvData.selectedExperienceIds.includes(exp.id))
      : cvData.experience;
    
    const selectedProj = cvData.selectedProjectIds.length > 0
      ? cvData.projects.filter(proj => cvData.selectedProjectIds.includes(proj.id))
      : cvData.projects;
    
    return ({
    name: getLocalizedValue(cvData.name, lang),
    title: getLocalizedValue(cvData.title, lang),
    email: cvData.email,
    phone: cvData.phone,
    location: getLocalizedValue(cvData.location, lang),
    linkedin: cvData.linkedin,
    github: cvData.github,
    summary: getLocalizedValue(cvData.summary, lang),
    experience: selectedExp.map((exp) => ({
      role: getLocalizedValue(exp.role, lang),
      company: getLocalizedValue(exp.company, lang),
      period: exp.period,
      description: getLocalizedValue(exp.description, lang),
    })),
    education: cvData.education.map((edu) => ({
      degree: getLocalizedValue(edu.degree, lang),
      school: getLocalizedValue(edu.school, lang),
      period: edu.period,
      description: getLocalizedValue(edu.description, lang),
    })),
    skills: cvData.skills.map((s) => getLocalizedValue(s, lang)),
    projects: selectedProj.map((p) => ({
      name: getLocalizedValue(p.name, lang),
      description: getLocalizedValue(p.description, lang),
    })),
    languages: cvData.languages.map((l) => getLocalizedValue(l, lang)),
    additionalInfo: getLocalizedValue(cvData.additionalInfo, lang),
    additionalData: {
      willingnessToTravel: getLocalizedValue(cvData.additionalData.willingnessToTravel, lang),
      willingnessToRelocate: getLocalizedValue(cvData.additionalData.willingnessToRelocate, lang),
      driverLicense: getLocalizedValue(cvData.additionalData.driverLicense, lang),
      vehicleType: getLocalizedValue(cvData.additionalData.vehicleType, lang),
    },
    includeExperience: cvData.includeExperience,
    includeEducation: cvData.includeEducation,
    includeSkills: cvData.includeSkills,
    includeProjects: cvData.includeProjects,
    includeLanguages: cvData.includeLanguages,
    language: lang,
  });};

  useEffect(() => {
    fetchAllData();
    fetchDefaultCV();
  }, []);

  const fetchDefaultCV = async () => {
    try {
      const [defaultRes, historyRes] = await Promise.all([
        fetch('/api/admin/cv/save'),
        fetch('/api/admin/cv/save?history=true'),
      ]);
      const defaultData = await defaultRes.json();
      const historyData = await historyRes.json();
      
      setDefaultCV(defaultData);
      setCvHistory(Array.isArray(historyData) ? historyData : []);
    } catch (error) {
      console.error("Failed to fetch CV data:", error);
    }
  };

  const fetchAllData = async () => {
    try {
      const [expRes, eduRes, skillsRes, projectsRes] = await Promise.all([
        fetch("/api/admin/experience"),
        fetch("/api/admin/education"),
        fetch("/api/admin/skills"),
        fetch("/api/admin/projects"),
      ]);

      const exp = await expRes.json();
      const edu = await eduRes.json();
      const skills = await skillsRes.json();
      const projects = await projectsRes.json();

      const localizeField = (pt: string, en: string, es: string): LocalizedString => ({
        pt: pt || "",
        en: en || pt || "",
        es: es || en || pt || "",
      });

      setCvData((prev) => ({
        ...prev,
        experience: Array.isArray(exp)
          ? exp.map((e: any) => ({
              id: e.id,
              role: localizeField(e.role_pt, e.role_en, e.role_es),
              company: localizeField(e.company_pt, e.company_en, e.company_es),
              period: `${e.period_start} - ${e.period_end || "Atual"}`,
              description: localizeField(e.description_pt, e.description_en, e.description_es),
            }))
          : [],
        selectedExperienceIds: Array.isArray(exp) ? exp.map((e: any) => e.id) : [],
        education: Array.isArray(edu)
          ? edu.map((e: any) => ({
              degree: localizeField(e.degree_pt, e.degree_en, e.degree_es),
              school: localizeField(e.school_pt, e.school_en, e.school_es),
              period: `${e.period_start} - ${e.period_end || "Atual"}`,
              description: localizeField(e.description_pt, e.description_en, e.description_es),
            }))
          : [],
        skills: Array.isArray(skills)
          ? skills
              .filter((s: any) => s.active && s.category === "tech")
              .map((s: any) => localizeField(s.name, s.name_en || s.name, s.name_es || s.name))
          : [],
        projects: Array.isArray(projects)
          ? projects.map((p: any) => ({
              id: p.id,
              name: localizeField(p.name_pt, p.name_en || p.name, p.name_es || p.name_en || p.name),
              description: localizeField(p.abt_pt, p.abt_en || p.abt, p.abt_es || p.abt_en || p.abt),
            }))
          : [],
        selectedProjectIds: Array.isArray(projects) ? projects.map((p: any) => p.id) : [],
      }));
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
        selectedProjectIds: cvData.selectedProjectIds,
        additionalData: cvData.additionalData,
        includeExperience: cvData.includeExperience,
        includeEducation: cvData.includeEducation,
        includeSkills: cvData.includeSkills,
        includeProjects: cvData.includeProjects,
        includeLanguages: cvData.includeLanguages,
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
    const previewMap: Record<string, any> = {
      chronological: ChronologicalPreview,
      functional: FunctionalPreview,
      combination: CombinationPreview,
      minimal: MinimalPreview,
      creative: CreativePreview,
    };
    const Component = previewMap[selectedTemplate];
    const localizedData = getLocalizedCVData(language);
    return <Component data={localizedData} />;
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
          <p className="text-gray-400 mt-1">Selecione um template, configure e gere seu currículo em PDF</p>
          {defaultCV && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                {language === "pt" ? "CV padrão atual" : language === "en" ? "Current default CV" : "CV predeterminado actual"}
              </span>
              <span className="text-xs text-gray-500">
                {defaultCV.template_id} • {defaultCV.language?.toUpperCase()} • {new Date(defaultCV.created_at).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="{colors.cardBg} hover:bg-gray-700 border {colors.border} {colors.textMuted} font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {language === "pt" ? "Histórico" : language === "en" ? "History" : "Historial"}
          </button>
          <button
          onClick={generatePDF}
          disabled={generating}
          className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-600 text-black font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2"
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)] pr-2">
          <div className="{colors.card} border {colors.border} rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3">Template</h3>
            <div className="space-y-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedTemplate === t.id
                      ? "bg-cyan-500/10 border-cyan-500/30"
                      : "{colors.cardBg} {colors.border} hover:{colors.border}"
                  }`}
                >
                  <span className={`text-sm font-medium ${selectedTemplate === t.id ? "text-cyan-400" : "{colors.text}"}`}>
                    {t.name}
                  </span>
                  <span className="block text-xs text-gray-500 mt-0.5">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="{colors.card} border {colors.border} rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3">Idioma do CV</h3>
            <div className="flex gap-2">
              {(["pt", "en", "es"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    language === lang ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30" : "{colors.cardBg} text-gray-400 border {colors.border}"
                  }`}
                >
                  {lang === "pt" ? "PT-BR" : lang === "en" ? "EN-US" : "ES"}
                </button>
              ))}
            </div>
          </div>

          <div className="{colors.card} border {colors.border} rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3">Dados do CV</h3>
            <div className="space-y-3">
              <div>
                <div className="flex gap-1 mb-2">
                  {(["pt", "en", "es"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        language === lang ? "bg-cyan-500/20 text-cyan-400" : "text-gray-500 hover:{colors.textMuted}"
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
                <label className="block text-xs text-gray-400 mb-1">Nome ({language.toUpperCase()})</label>
                <input
                  type="text"
                  value={cvData.name[language] || ""}
                  onChange={(e) => handleFieldChange("name", language, e.target.value)}
                  className="w-full {colors.cardBg} border {colors.border} rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Título ({language.toUpperCase()})</label>
                <input
                  type="text"
                  value={cvData.title[language] || ""}
                  onChange={(e) => handleFieldChange("title", language, e.target.value)}
                  className="w-full {colors.cardBg} border {colors.border} rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Resumo Profissional ({language.toUpperCase()})</label>
                <textarea
                  value={cvData.summary[language] || ""}
                  onChange={(e) => handleFieldChange("summary", language, e.target.value)}
                  rows={3}
                  className="w-full {colors.cardBg} border {colors.border} rounded-lg px-3 py-2 text-sm resize-none"
                  placeholder={language === "pt" ? "Descreva seu perfil profissional..." : language === "en" ? "Describe your professional profile..." : "Describe tu perfil profesional..."}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Localização ({language.toUpperCase()})</label>
                <input
                  type="text"
                  value={cvData.location[language] || ""}
                  onChange={(e) => handleFieldChange("location", language, e.target.value)}
                  className="w-full {colors.cardBg} border {colors.border} rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={cvData.email}
                  onChange={(e) => setCvData({ ...cvData, email: e.target.value })}
                  className="w-full {colors.cardBg} border {colors.border} rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Telefone</label>
                <input
                  type="text"
                  value={cvData.phone}
                  onChange={(e) => setCvData({ ...cvData, phone: e.target.value })}
                  className="w-full {colors.cardBg} border {colors.border} rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">LinkedIn URL</label>
                <input
                  type="text"
                  value={cvData.linkedin}
                  onChange={(e) => setCvData({ ...cvData, linkedin: e.target.value })}
                  className="w-full {colors.cardBg} border {colors.border} rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={cvData.github}
                  onChange={(e) => setCvData({ ...cvData, github: e.target.value })}
                  className="w-full {colors.cardBg} border {colors.border} rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Informações Adicionais ({language.toUpperCase()})</label>
                <textarea
                  value={cvData.additionalInfo[language] || ""}
                  onChange={(e) => handleFieldChange("additionalInfo", language, e.target.value)}
                  rows={3}
                  className="w-full {colors.cardBg} border {colors.border} rounded-lg px-3 py-2 text-sm resize-none"
                  placeholder={language === "pt" ? "Certificações, cursos, prêmios..." : language === "en" ? "Certifications, courses, awards..." : "Certificaciones, cursos, premios..."}
                />
              </div>
            </div>
          </div>

          <div className="{colors.card} border {colors.border} rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3">Dados Complementares ({language.toUpperCase()})</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">
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
                  className="w-full {colors.cardBg} border {colors.border} rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">{language === "pt" ? "Selecione..." : language === "en" ? "Select..." : "Seleccione..."}</option>
                  <option value={language === "pt" ? "Sim" : language === "en" ? "Yes" : "Sí"}>{language === "pt" ? "Sim" : language === "en" ? "Yes" : "Sí"}</option>
                  <option value={language === "pt" ? "Não" : language === "en" ? "No" : "No"}>{language === "pt" ? "Não" : language === "en" ? "No" : "No"}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
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
                  className="w-full {colors.cardBg} border {colors.border} rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">{language === "pt" ? "Selecione..." : language === "en" ? "Select..." : "Seleccione..."}</option>
                  <option value={language === "pt" ? "Sim" : language === "en" ? "Yes" : "Sí"}>{language === "pt" ? "Sim" : language === "en" ? "Yes" : "Sí"}</option>
                  <option value={language === "pt" ? "Não" : language === "en" ? "No" : "No"}>{language === "pt" ? "Não" : language === "en" ? "No" : "No"}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
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
                  className="w-full {colors.cardBg} border {colors.border} rounded-lg px-3 py-2 text-sm"
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
                <label className="block text-xs text-gray-400 mb-1">
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
                  className="w-full {colors.cardBg} border {colors.border} rounded-lg px-3 py-2 text-sm"
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

          <div className="{colors.card} border {colors.border} rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3">Seções do CV</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cvData.includeExperience}
                  onChange={(e) => setCvData({ ...cvData, includeExperience: e.target.checked })}
                  className="w-4 h-4 rounded {colors.border} {colors.cardBg} text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-sm {colors.textMuted}">Experiência Profissional</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cvData.includeEducation}
                  onChange={(e) => setCvData({ ...cvData, includeEducation: e.target.checked })}
                  className="w-4 h-4 rounded {colors.border} {colors.cardBg} text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-sm {colors.textMuted}">Educação</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cvData.includeSkills}
                  onChange={(e) => setCvData({ ...cvData, includeSkills: e.target.checked })}
                  className="w-4 h-4 rounded {colors.border} {colors.cardBg} text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-sm {colors.textMuted}">Skills</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cvData.includeProjects}
                  onChange={(e) => setCvData({ ...cvData, includeProjects: e.target.checked })}
                  className="w-4 h-4 rounded {colors.border} {colors.cardBg} text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-sm {colors.textMuted}">Projetos</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cvData.includeLanguages}
                  onChange={(e) => setCvData({ ...cvData, includeLanguages: e.target.checked })}
                  className="w-4 h-4 rounded {colors.border} {colors.cardBg} text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-sm {colors.textMuted}">Idiomas</span>
              </label>
            </div>
          </div>

          {cvData.includeExperience && (
            <div className="{colors.card} border {colors.border} rounded-xl p-5">
              <h3 className="text-sm font-semibold mb-3">Selecionar Experiências</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
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
                      className="w-4 h-4 mt-0.5 rounded {colors.border} {colors.cardBg} text-cyan-500 focus:ring-cyan-500"
                    />
                    <div className="text-xs">
                      <span className="{colors.textMuted} block font-medium">
                        {getLocalizedValue(exp.role, language)}
                      </span>
                      <span className="text-gray-500">
                        {getLocalizedValue(exp.company, language)} • {exp.period}
                      </span>
                    </div>
                  </label>
                ))}
                {cvData.experience.length === 0 && (
                  <p className="text-xs text-gray-500">Nenhuma experiência encontrada</p>
                )}
              </div>
              <div className="mt-3 pt-3 border-t {colors.border} flex gap-2">
                <button
                  onClick={() => setCvData({ ...cvData, selectedExperienceIds: cvData.experience.map(e => e.id) })}
                  className="text-xs text-cyan-400 hover:text-cyan-300"
                >
                  Selecionar todas
                </button>
                <span className="text-gray-600">|</span>
                <button
                  onClick={() => setCvData({ ...cvData, selectedExperienceIds: [] })}
                  className="text-xs text-gray-400 hover:{colors.textMuted}"
                >
                  Limpar seleção
                </button>
              </div>
            </div>
          )}

          {cvData.includeProjects && (
            <div className="{colors.card} border {colors.border} rounded-xl p-5">
              <h3 className="text-sm font-semibold mb-3">Selecionar Projetos</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
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
                      className="w-4 h-4 mt-0.5 rounded {colors.border} {colors.cardBg} text-cyan-500 focus:ring-cyan-500"
                    />
                    <div className="text-xs">
                      <span className="{colors.textMuted} block font-medium">
                        {getLocalizedValue(proj.name, language)}
                      </span>
                    </div>
                  </label>
                ))}
                {cvData.projects.length === 0 && (
                  <p className="text-xs text-gray-500">Nenhum projeto encontrado</p>
                )}
              </div>
              <div className="mt-3 pt-3 border-t {colors.border} flex gap-2">
                <button
                  onClick={() => setCvData({ ...cvData, selectedProjectIds: cvData.projects.map(p => p.id) })}
                  className="text-xs text-cyan-400 hover:text-cyan-300"
                >
                  Selecionar todos
                </button>
                <span className="text-gray-600">|</span>
                <button
                  onClick={() => setCvData({ ...cvData, selectedProjectIds: [] })}
                  className="text-xs text-gray-400 hover:{colors.textMuted}"
                >
                  Limpar seleção
                </button>
              </div>
            </div>
          )}

          <div className="{colors.card} border {colors.border} rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3">Resumo</h3>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Experiências</span>
                <span className="{colors.text}">{cvData.selectedExperienceIds.length} / {cvData.experience.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Educação</span>
                <span className="{colors.text}">{cvData.education.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Skills</span>
                <span className="{colors.text}">{cvData.skills.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Projetos</span>
                <span className="{colors.text}">{cvData.selectedProjectIds.length} / {cvData.projects.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Idiomas</span>
                <span className="{colors.text}">{cvData.languages.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2">
          <div className="{colors.card} border {colors.border} rounded-xl p-4 sticky top-0">
            <h3 className="text-sm font-semibold mb-4">Preview</h3>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg min-h-[600px]">
              <div className="overflow-auto">
                {renderPreview()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="{colors.card} border {colors.border} rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b {colors.border} flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {language === "pt" ? "Histórico de CVs" : language === "en" ? "CV History" : "Historial de CVs"}
              </h2>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:{colors.text}"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-4">
              {cvHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {language === "pt" ? "Nenhum CV encontrado" : language === "en" ? "No CV found" : "No se encontró ningún CV"}
                </p>
              ) : (
                <div className="space-y-3">
                  {cvHistory.map((cv, index) => (
                    <div
                      key={cv.id}
                      className={`p-4 rounded-lg border ${
                        index === 0 ? "bg-cyan-500/10 border-cyan-500/30" : "{colors.cardBg} {colors.border}"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium {colors.text}">{cv.template_id || "Template"}</span>
                            <span className="text-xs bg-gray-700 px-2 py-0.5 rounded {colors.textMuted}">{cv.language?.toUpperCase()}</span>
                            {index === 0 && (
                              <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded">
                                {language === "pt" ? "Padrão" : language === "en" ? "Default" : "Predeterminado"}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(cv.created_at).toLocaleString()}
                          </p>
                        </div>
                        <a
                          href={cv.blob_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"
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
