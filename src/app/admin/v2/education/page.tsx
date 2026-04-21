"use client";

import { useEffect, useState } from "react";
import { useAdminTheme } from "../layout";

interface Education {
  id: number;
  period_start: string;
  period_end: string;
  degree_pt: string;
  degree_en: string;
  school_pt: string;
  school_en: string;
  description_pt: string;
  description_en: string;
  display_order: number;
}

export default function EducationPage() {
  const { isDark } = useAdminTheme();
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Education | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [lang, setLang] = useState<"pt" | "en">("pt");

  const colors = {
    card: isDark ? "bg-gray-900" : "bg-white",
    cardBg: isDark ? "bg-gray-800" : "bg-gray-50",
    border: isDark ? "border-gray-800" : "border-gray-200",
    borderInput: isDark ? "border-gray-700" : "border-gray-300",
    text: isDark ? "text-white" : "text-gray-900",
    textMuted: isDark ? "text-gray-400" : "text-gray-600",
    accent: isDark ? "text-cyan-400" : "text-blue-600",
    accentBg: isDark ? "bg-cyan-500/10" : "bg-blue-500/10",
    spinner: isDark ? "border-cyan-400" : "border-blue-600",
  };

  const [formData, setFormData] = useState({
    period_start: "", period_end: "", degree_pt: "", degree_en: "", school_pt: "", school_en: "", description_pt: "", description_en: "", display_order: 0,
  });

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await fetch("/api/admin/education");
        setEducation(Array.isArray(await res.json()) ? await res.json() : []);
      } catch { setEducation([]); }
      setLoading(false);
    };
    fetchEducation();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/education", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { id: editing.id, ...formData } : formData),
      });
      if (res.ok) { setMessage({ type: "success", text: editing ? "Atualizado!" : "Criado!" }); resetForm(); }
    } catch { setMessage({ type: "error", text: "Erro ao salvar" }); }
    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir?")) return;
    try {
      await fetch(`/api/admin/education?id=${id}`, { method: "DELETE" });
      setMessage({ type: "success", text: "Excluído!" });
    } catch { setMessage({ type: "error", text: "Erro ao excluir" }); }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEdit = (edu: Education) => {
    setEditing(edu);
    setFormData({ period_start: edu.period_start, period_end: edu.period_end, degree_pt: edu.degree_pt, degree_en: edu.degree_en, school_pt: edu.school_pt, school_en: edu.school_en, description_pt: edu.description_pt, description_en: edu.description_en, display_order: edu.display_order });
    setShowForm(true);
  };

  const resetForm = () => { setEditing(null); setShowForm(false); setFormData({ period_start: "", period_end: "", degree_pt: "", degree_en: "", school_pt: "", school_en: "", description_pt: "", description_en: "", display_order: 0 }); };

  if (loading && education.length === 0) return <div className="flex items-center justify-center h-64"><div className={`w-8 h-8 border-2 ${colors.spinner} border-t-transparent rounded-full animate-spin`} /></div>;

  const accentClass = isDark ? "bg-cyan-500 hover:bg-cyan-400 text-black" : "bg-blue-600 hover:bg-blue-500 text-white";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${colors.text}`}>Educação</h1>
          <p className={`${colors.textMuted} mt-1`}>{education.length} entradas</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className={`${accentClass} font-semibold px-4 py-2 rounded-lg text-sm transition-colors`}>+ Nova</button>
      </div>

      {message && <div className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>{message.text}</div>}

      {showForm && (
        <div className={`${colors.card} border ${colors.border} rounded-xl p-6`}>
          <h2 className={`text-lg font-semibold mb-4 ${colors.text}`}>{editing ? "Editar" : "Nova"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={`block text-sm ${colors.textMuted} mb-1`}>Início</label><input type="text" value={formData.period_start} onChange={(e) => setFormData({ ...formData, period_start: e.target.value })} className={`w-full ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text}`} /></div>
              <div><label className={`block text-sm ${colors.textMuted} mb-1`}>Fim</label><input type="text" value={formData.period_end} onChange={(e) => setFormData({ ...formData, period_end: e.target.value })} className={`w-full ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text}`} /></div>
            </div>
            <div className={`border-t ${colors.border} pt-4`}>
              <h3 className={`text-sm font-semibold ${colors.accent} mb-3`}>Curso / Escola</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className={`block text-xs ${colors.textMuted} mb-1`}>Curso (PT)*</label><input type="text" value={formData.degree_pt} onChange={(e) => setFormData({ ...formData, degree_pt: e.target.value })} className={`w-full ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text}`} required /></div>
                <div><label className={`block text-xs ${colors.textMuted} mb-1`}>Curso (EN)*</label><input type="text" value={formData.degree_en} onChange={(e) => setFormData({ ...formData, degree_en: e.target.value })} className={`w-full ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text}`} required /></div>
                <div><label className={`block text-xs ${colors.textMuted} mb-1`}>Escola (PT)*</label><input type="text" value={formData.school_pt} onChange={(e) => setFormData({ ...formData, school_pt: e.target.value })} className={`w-full ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text}`} required /></div>
                <div><label className={`block text-xs ${colors.textMuted} mb-1`}>Escola (EN)*</label><input type="text" value={formData.school_en} onChange={(e) => setFormData({ ...formData, school_en: e.target.value })} className={`w-full ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text}`} required /></div>
              </div>
            </div>
            <div className={`border-t ${colors.border} pt-4`}>
              <h3 className={`text-sm font-semibold ${colors.accent} mb-3`}>Descrição</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className={`block text-xs ${colors.textMuted} mb-1`}>Descrição (PT)</label><textarea value={formData.description_pt} onChange={(e) => setFormData({ ...formData, description_pt: e.target.value })} rows={2} className={`w-full ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text} resize-none`} /></div>
                <div><label className={`block text-xs ${colors.textMuted} mb-1`}>Descrição (EN)</label><textarea value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} rows={2} className={`w-full ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text} resize-none`} /></div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div><label className={`block text-xs ${colors.textMuted} mb-1`}>Ordem</label><input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} className={`w-20 ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text}`} /></div>
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" className={`${accentClass} font-semibold px-4 py-2 rounded-lg text-sm transition-colors`}>{editing ? "Salvar" : "Criar"}</button>
              <button type="button" onClick={resetForm} className={`${colors.textMuted} hover:${colors.text} text-sm`}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

<div className="flex items-center gap-2 mb-4">
        <button onClick={() => setLang("pt")} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${lang === "pt" ? colors.accentBg : ''} ${lang === "pt" ? colors.accent : colors.textMuted} ${lang !== "pt" ? `hover:${colors.text}` : ''}`}>PT</button>
        <button onClick={() => setLang("en")} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${lang === "en" ? colors.accentBg : ''} ${lang === "en" ? colors.accent : colors.textMuted} ${lang !== "en" ? `hover:${colors.text}` : ''}`}>EN</button>
      </div>

      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu.id} className={`${colors.card} border ${colors.border} rounded-xl p-5 hover:${colors.border} transition-colors`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-xs font-mono ${colors.accent}`}>{edu.period_start} — {edu.period_end}</span>
                </div>
                <h3 className={`text-lg font-semibold ${colors.text}`}>{lang === "pt" ? edu.degree_pt : edu.degree_en}</h3>
                <p className={`text-sm ${colors.textMuted}`}>{lang === "pt" ? edu.school_pt : edu.school_en}</p>
                <p className={`text-sm ${colors.textMuted} mt-2 line-clamp-2`}>{lang === "pt" ? edu.description_pt : edu.description_en}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => handleEdit(edu)} className={`text-xs ${colors.accent} px-2 py-1 rounded ${colors.cardBg}`}>Editar</button>
                <button onClick={() => handleDelete(edu.id)} className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-500/10">Excluir</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}