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

interface CVData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  experience: Array<{ role: string; company: string; period: string; description: string }>;
  education: Array<{ degree: string; school: string; period: string; description: string }>;
  skills: string[];
  projects: Array<{ name: string; description: string }>;
  languages: string[];
}

const templates = [
  { id: "chronological", name: "Chronological", desc: "Traditional, ATS-friendly" },
  { id: "functional", name: "Functional", desc: "Skills-focused layout" },
  { id: "combination", name: "Combination", desc: "Skills + experience hybrid" },
  { id: "minimal", name: "Minimal", desc: "Clean, no-frills design" },
  { id: "creative", name: "Creative", desc: "Two-column with sidebar" },
];

export default function CVBuilderPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("chronological");
  const [language, setLanguage] = useState<"pt" | "en" | "es">("pt");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [cvData, setCvData] = useState<CVData>({
    name: "Elias Edson Barao",
    title: "Software Engineer & Full-Stack Developer",
    email: "e2barao@hotmail.com",
    phone: "+55 41 99804-6755",
    location: "Curitiba, Parana, Brazil",
    linkedin: "linkedin.com/in/e2barao",
    github: "github.com/httpE2Barao",
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    languages: ["Portuguese (Native)", "English (Fluent)", "Spanish (Conversational)"],
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

      setCvData((prev) => ({
        ...prev,
        experience: Array.isArray(exp)
          ? exp.map((e: any) => ({
              role: e.role_en || e.role_pt,
              company: e.company_en || e.company_pt,
              period: `${e.period_start} - ${e.period_end}`,
              description: e.description_en || e.description_pt,
            }))
          : [],
        education: Array.isArray(edu)
          ? edu.map((e: any) => ({
              degree: e.degree_en || e.degree_pt,
              school: e.school_en || e.school_pt,
              period: `${e.period_start} - ${e.period_end}`,
              description: e.description_en || e.description_pt,
            }))
          : [],
        skills: Array.isArray(skills)
          ? skills.filter((s: any) => s.active && s.category === "tech").map((s: any) => s.name)
          : [],
        projects: Array.isArray(projects)
          ? projects.slice(0, 5).map((p: any) => ({
              name: p.name_en || p.name_pt || p.name,
              description: p.abt_en || p.abt_pt || p.abt || "",
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
      const blob = await pdf(<Component data={cvData} />).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `CV-${cvData.name.replace(/\s+/g, "-")}-${selectedTemplate}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      setMessage({ type: "success", text: "PDF gerado e baixado com sucesso!" });
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
    return <Component data={cvData} />;
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
                <label className="block text-xs text-gray-400 mb-1">Nome</label>
                <input
                  type="text"
                  value={cvData.name}
                  onChange={(e) => setCvData({ ...cvData, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Título</label>
                <input
                  type="text"
                  value={cvData.title}
                  onChange={(e) => setCvData({ ...cvData, title: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Resumo Profissional</label>
                <textarea
                  value={cvData.summary}
                  onChange={(e) => setCvData({ ...cvData, summary: e.target.value })}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm resize-none"
                  placeholder="Descreva seu perfil profissional..."
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
                <label className="block text-xs text-gray-400 mb-1">Localização</label>
                <input
                  type="text"
                  value={cvData.location}
                  onChange={(e) => setCvData({ ...cvData, location: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>
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
