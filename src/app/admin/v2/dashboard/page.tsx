"use client";

import { useEffect, useState } from "react";

interface Stats {
  projects: number;
  skills: number;
  experience: number;
  education: number;
  contactLinks: number;
  cvTemplates: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    skills: 0,
    experience: 0,
    education: 0,
    contactLinks: 0,
    cvTemplates: 0,
  });
  const [loading, setLoading] = useState(true);

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
    cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
    green: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20" },
    blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
    orange: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
    pink: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/20" },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400 mt-1">Visão geral do seu portfólio e currículos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => {
          const colors = colorMap[stat.color];
          return (
            <a
              key={stat.label}
              href={stat.href}
              className={`${colors.bg} border ${colors.border} rounded-xl p-5 hover:scale-[1.02] transition-transform cursor-pointer block`}
            >
              <p className={`text-3xl font-bold ${colors.text}`}>{stat.value}</p>
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </a>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
          <div className="space-y-3">
            <a href="/admin/v2/projects" className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-750 transition-colors block">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className="text-sm">Adicionar Novo Projeto</span>
            </a>
            <a href="/admin/v2/skills" className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-750 transition-colors block">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-400">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className="text-sm">Adicionar Habilidade</span>
            </a>
            <a href="/admin/v2/cv-builder" className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-750 transition-colors block">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-pink-400">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="text-sm">Gerar Novo CV</span>
            </a>
            <a href="/api/admin/seed" className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-750 transition-colors block">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span className="text-sm">Executar Seed do Banco</span>
            </a>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Estrutura do Sistema</h2>
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 mt-0.5">●</span>
              <span><strong className="text-white">Projetos</strong> — CRUD completo com imagens, tags e multilíngue</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">●</span>
              <span><strong className="text-white">Habilidades</strong> — Tech, conceitos e programas com níveis</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">●</span>
              <span><strong className="text-white">Experiência</strong> — Histórico profissional multilíngue</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">●</span>
              <span><strong className="text-white">Educação</strong> — Formação acadêmica multilíngue</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-orange-400 mt-0.5">●</span>
              <span><strong className="text-white">Conteúdo</strong> — Hero, about, phrases, footer do portfólio</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-pink-400 mt-0.5">●</span>
              <span><strong className="text-white">CV Builder</strong> — 5 templates, preview e geração PDF</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
