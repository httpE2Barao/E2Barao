"use client";

import { useEffect, useState } from "react";
import { useAdminTheme } from "../layout";

interface Stats {
  projects: number;
  skills: number;
  experience: number;
  education: number;
  contactLinks: number;
  cvTemplates: number;
}

export default function DashboardPage() {
  const { isDark, toggleTheme } = useAdminTheme();
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    skills: 0,
    experience: 0,
    education: 0,
    contactLinks: 0,
    cvTemplates: 0,
  });
  const [loading, setLoading] = useState(true);

  const colors = {
    card: isDark ? "bg-gray-900" : "bg-white",
    cardHover: isDark ? "bg-gray-800" : "bg-gray-50",
    border: isDark ? "border-gray-800" : "border-gray-200",
    text: isDark ? "text-white" : "text-gray-900",
    textMuted: isDark ? "text-gray-400" : "text-gray-600",
    textSubtle: isDark ? "text-gray-500" : "text-gray-500",
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projects, skills, experience, education, contact, cvTemplates] = await Promise.all([
          fetch("/api/admin/projects").then((r) => r.json()),
          fetch("/api/admin/skills").then((r) => r.json()),
          fetch("/api/admin/experience").then((r) => r.json()),
          fetch("/api/admin/education").then((r) => r.json()),
          fetch("/api/admin/contact").then((r) => r.json()),
          fetch("/api/admin/cv-templates").then((r) => r.json()),
        ]);

        setStats({
          projects: Array.isArray(projects) ? projects.length : 0,
          skills: Array.isArray(skills) ? skills.length : 0,
          experience: Array.isArray(experience) ? experience.length : 0,
          education: Array.isArray(education) ? education.length : 0,
          contactLinks: Array.isArray(contact) ? contact.length : 0,
          cvTemplates: Array.isArray(cvTemplates) ? cvTemplates.length : 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: "Projetos", value: stats.projects, href: "/admin/v2/projects", color: "cyan" },
    { label: "Habilidades", value: stats.skills, href: "/admin/v2/skills", color: "purple" },
    { label: "Experiências", value: stats.experience, href: "/admin/v2/experience", color: "green" },
    { label: "Educação", value: stats.education, href: "/admin/v2/education", color: "blue" },
    { label: "Links de Contato", value: stats.contactLinks, href: "/admin/v2/contact", color: "orange" },
    { label: "Templates CV", value: stats.cvTemplates, href: "/admin/v2/cv-builder", color: "pink" },
  ];

  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    cyan: { bg: "bg-cyan-500/10", text: isDark ? "text-cyan-400" : "text-blue-600", border: isDark ? "border-cyan-500/20" : "border-blue-500/20" },
    purple: { bg: "bg-purple-500/10", text: isDark ? "text-purple-400" : "text-purple-600", border: isDark ? "border-purple-500/20" : "border-purple-500/20" },
    green: { bg: "bg-green-500/10", text: isDark ? "text-green-400" : "text-green-600", border: isDark ? "border-green-500/20" : "border-green-500/20" },
    blue: { bg: "bg-blue-500/10", text: isDark ? "text-blue-400" : "text-blue-600", border: isDark ? "border-blue-500/20" : "border-blue-500/20" },
    orange: { bg: "bg-orange-500/10", text: isDark ? "text-orange-400" : "text-orange-600", border: isDark ? "border-orange-500/20" : "border-orange-500/20" },
    pink: { bg: "bg-pink-500/10", text: isDark ? "text-pink-400" : "text-pink-600", border: isDark ? "border-pink-500/20" : "border-pink-500/20" },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`w-8 h-8 border-2 ${isDark ? "border-cyan-400" : "border-blue-600"} border-t-transparent rounded-full animate-spin`} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-2xl md:text-3xl font-bold ${colors.text}`}>Dashboard</h1>
        <p className={`${colors.textMuted} mt-1`}>Visão geral do seu portfólio e currículos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => {
          const c = colorMap[stat.color];
          return (
            <a
              key={stat.label}
              href={stat.href}
              className={`${c.bg} border ${c.border} rounded-xl p-5 hover:scale-[1.02] transition-transform cursor-pointer block`}
            >
              <p className={`text-3xl font-bold ${c.text}`}>{stat.value}</p>
              <p className={`text-sm ${colors.textMuted} mt-1`}>{stat.label}</p>
            </a>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${colors.card} border ${colors.border} rounded-xl p-6`}>
          <h2 className={`text-lg font-semibold mb-4 ${colors.text}`}>Ações Rápidas</h2>
          <div className="space-y-3">
            <a href="/admin/v2/projects" className={`flex items-center gap-3 p-3 rounded-lg ${colors.cardHover} ${isDark ? "hover:bg-gray-750" : "hover:bg-gray-100"} transition-colors block`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isDark ? "text-cyan-400" : "text-blue-600"}>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className={`text-sm ${colors.text}`}>Adicionar Novo Projeto</span>
            </a>
            <a href="/admin/v2/skills" className={`flex items-center gap-3 p-3 rounded-lg ${colors.cardHover} ${isDark ? "hover:bg-gray-750" : "hover:bg-gray-100"} transition-colors block`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isDark ? "text-purple-400" : "text-purple-600"}>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className={`text-sm ${colors.text}`}>Adicionar Habilidade</span>
            </a>
            <a href="/admin/v2/cv-builder" className={`flex items-center gap-3 p-3 rounded-lg ${colors.cardHover} ${isDark ? "hover:bg-gray-750" : "hover:bg-gray-100"} transition-colors block`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isDark ? "text-pink-400" : "text-pink-600"}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className={`text-sm ${colors.text}`}>Gerar Novo CV</span>
            </a>
            <a href="/api/admin/seed" className={`flex items-center gap-3 p-3 rounded-lg ${colors.cardHover} ${isDark ? "hover:bg-gray-750" : "hover:bg-gray-100"} transition-colors block`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isDark ? "text-green-400" : "text-green-600"}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span className={`text-sm ${colors.text}`}>Executar Seed do Banco</span>
            </a>
          </div>
        </div>

        <div className={`${colors.card} border ${colors.border} rounded-xl p-6`}>
          <h2 className={`text-lg font-semibold mb-4 ${colors.text}`}>Estrutura do Sistema</h2>
          <div className={`space-y-3 text-sm ${colors.textMuted}`}>
            <div className="flex items-start gap-2">
              <span className={isDark ? "text-cyan-400" : "text-blue-600"}>●</span>
              <span><strong className={colors.text}>Projetos</strong> — CRUD completo com imagens, tags e multilíngue</span>
            </div>
            <div className="flex items-start gap-2">
              <span className={isDark ? "text-purple-400" : "text-purple-600"}>●</span>
              <span><strong className={colors.text}>Habilidades</strong> — Tech, conceitos e programas com níveis</span>
            </div>
            <div className="flex items-start gap-2">
              <span className={isDark ? "text-green-400" : "text-green-600"}>●</span>
              <span><strong className={colors.text}>Experiência</strong> — Histórico profissional multilíngue</span>
            </div>
            <div className="flex items-start gap-2">
              <span className={isDark ? "text-blue-400" : "text-blue-600"}>●</span>
              <span><strong className={colors.text}>Educação</strong> — Formação acadêmica multilíngue</span>
            </div>
            <div className="flex items-start gap-2">
              <span className={isDark ? "text-orange-400" : "text-orange-600"}>●</span>
              <span><strong className={colors.text}>Conteúdo</strong> — Hero, about, phrases, footer do portfólio</span>
            </div>
            <div className="flex items-start gap-2">
              <span className={isDark ? "text-pink-400" : "text-pink-600"}>●</span>
              <span><strong className={colors.text}>CV Builder</strong> — 5 templates, preview e geração PDF</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}