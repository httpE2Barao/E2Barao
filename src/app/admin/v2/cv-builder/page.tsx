"use client";

import { useEffect, useState } from "react";
import { pdf } from "@react-pdf/renderer";
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

type Language = "pt" | "en" | "es";

interface LocalizedString {
  pt: string;
  en: string;
  es: string;
}

interface Experience {
  role: LocalizedString;
  company: LocalizedString;
  period: string;
  description: LocalizedString;
}

interface Education {
  degree: LocalizedString;
  school: LocalizedString;
  period: string;
  description: LocalizedString;
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
  projects: Array<{ name: LocalizedString; description: LocalizedString }>;
  languages: LocalizedString[];
  additionalInfo: LocalizedString;
  includeExperience: boolean;
  includeEducation: boolean;
  includeSkills: boolean;
  includeProjects: boolean;
  includeLanguages: boolean;
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
  const [selectedTemplate, setSelectedTemplate] = useState("chronological");
  const [language, setLanguage] = useState<Language>("pt");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [cvData, setCvData] = useState<CVData>({
    name: { pt: "Elias Edson Barao", en: "Elias Edson Barao", es: "Elias Edson Barao" },
    title: { pt: "Engenheiro de Software & Desenvolvedor Full-Stack", en: "Software Engineer & Full-Stack Developer", es: "Ingeniero de Software & Desarrollador Full-Stack" },
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
    includeExperience: true,
    includeEducation: true,
    includeSkills: true,
    includeProjects: true,
    includeLanguages: true,
  });

  const getLocalizedValue = (obj: LocalizedString | undefined, lang: Language): string => {
    if (!obj) return "";
    return obj[lang] || obj.pt || "";
  };

  const updateLocalizedField = (field: keyof CVData, value: LocalizedString) => {
    setCvData((prev) => ({ ...prev, [field]: value }));
  };

  const getLocalizedCVData = (lang: Language): any => ({
    name: getLocalizedValue(cvData.name, lang),
    title: getLocalizedValue(cvData.title, lang),
    email: cvData.email,
    phone: cvData.phone,
    location: getLocalizedValue(cvData.location, lang),
    linkedin: cvData.linkedin,
    github: cvData.github,
    summary: getLocalizedValue(cvData.summary, lang),
    experience: cvData.experience.map((exp) => ({
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
    projects: cvData.projects.map((p) => ({
      name: getLocalizedValue(p.name, lang),
      description: getLocalizedValue(p.description, lang),
    })),
    languages: cvData.languages.map((l) => getLocalizedValue(l, lang)),
    additionalInfo: getLocalizedValue(cvData.additionalInfo, lang),
    includeExperience: cvData.includeExperience,
    includeEducation: cvData.includeEducation,
    includeSkills: cvData.includeSkills,
    includeProjects: cvData.includeProjects,
    includeLanguages: cvData.includeLanguages,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

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
              role: localizeField(e.role_pt, e.role_en, e.role_es),
              company: localizeField(e.company_pt, e.company_en, e.company_es),
              period: `${e.period_start} - ${e.period_end || "Atual"}`,
              description: localizeField(e.description_pt, e.description_en, e.description_es),
            }))
          : [],
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
          ? projects.slice(0, 5).map((p: any) => ({
              name: localizeField(p.name_pt, p.name_en || p.name, p.name_es || p.name_en || p.name),
              description: localizeField(p.abt_pt, p.abt_en || p.abt, p.abt_es || p.abt_en || p.abt),
            }))
          : [],
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
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3">Template</h3>
            <div className="space-y-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedTemplate === t.id
                      ? "bg-cyan-500/10 border-cyan-500/30"
                      : "bg-gray-800 border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <span className={`text-sm font-medium ${selectedTemplate === t.id ? "text-cyan-400" : "text-white"}`}>
                    {t.name}
                  </span>
                  <span className="block text-xs text-gray-500 mt-0.5">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3">Idioma do CV</h3>
            <div className="flex gap-2">
              {(["pt", "en", "es"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    language === lang ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30" : "bg-gray-800 text-gray-400 border border-gray-700"
                  }`}
                >
                  {lang === "pt" ? "PT-BR" : lang === "en" ? "EN-US" : "ES"}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3">Dados do CV</h3>
            <div className="space-y-3">
              <div>
                <div className="flex gap-1 mb-2">
                  {(["pt", "en", "es"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        language === lang ? "bg-cyan-500/20 text-cyan-400" : "text-gray-500 hover:text-gray-300"
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
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Título ({language.toUpperCase()})</label>
                <input
                  type="text"
                  value={cvData.title[language] || ""}
                  onChange={(e) => handleFieldChange("title", language, e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Resumo Profissional ({language.toUpperCase()})</label>
                <textarea
                  value={cvData.summary[language] || ""}
                  onChange={(e) => handleFieldChange("summary", language, e.target.value)}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm resize-none"
                  placeholder={language === "pt" ? "Descreva seu perfil profissional..." : language === "en" ? "Describe your professional profile..." : "Describe tu perfil profesional..."}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Localização ({language.toUpperCase()})</label>
                <input
                  type="text"
                  value={cvData.location[language] || ""}
                  onChange={(e) => handleFieldChange("location", language, e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={cvData.email}
                  onChange={(e) => setCvData({ ...cvData, email: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Telefone</label>
                <input
                  type="text"
                  value={cvData.phone}
                  onChange={(e) => setCvData({ ...cvData, phone: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">LinkedIn URL</label>
                <input
                  type="text"
                  value={cvData.linkedin}
                  onChange={(e) => setCvData({ ...cvData, linkedin: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={cvData.github}
                  onChange={(e) => setCvData({ ...cvData, github: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Informações Adicionais ({language.toUpperCase()})</label>
                <textarea
                  value={cvData.additionalInfo[language] || ""}
                  onChange={(e) => handleFieldChange("additionalInfo", language, e.target.value)}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm resize-none"
                  placeholder={language === "pt" ? "Certificações, cursos, prêmios..." : language === "en" ? "Certifications, courses, awards..." : "Certificaciones, cursos, premios..."}
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3">Seções do CV</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cvData.includeExperience}
                  onChange={(e) => setCvData({ ...cvData, includeExperience: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-300">Experiência Profissional</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cvData.includeEducation}
                  onChange={(e) => setCvData({ ...cvData, includeEducation: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-300">Educação</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cvData.includeSkills}
                  onChange={(e) => setCvData({ ...cvData, includeSkills: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-300">Skills</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cvData.includeProjects}
                  onChange={(e) => setCvData({ ...cvData, includeProjects: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-300">Projetos</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cvData.includeLanguages}
                  onChange={(e) => setCvData({ ...cvData, includeLanguages: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-300">Idiomas</span>
              </label>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3">Resumo</h3>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Experiências</span>
                <span className="text-white">{cvData.experience.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Educação</span>
                <span className="text-white">{cvData.education.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Skills</span>
                <span className="text-white">{cvData.skills.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Projetos</span>
                <span className="text-white">{cvData.projects.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Idiomas</span>
                <span className="text-white">{cvData.languages.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold mb-4">Preview</h3>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg" style={{ minHeight: "800px" }}>
              <div className="overflow-auto max-h-[800px]">
                {renderPreview()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
