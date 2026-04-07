"use client";

import { useEffect, useState } from "react";

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
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Education | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [lang, setLang] = useState<"pt" | "en">("pt");

  const [formData, setFormData] = useState({
    period_start: "",
    period_end: "",
    degree_pt: "",
    degree_en: "",
    degree_es: "",
    degree_fr: "",
    degree_zh: "",
    school_pt: "",
    school_en: "",
    school_es: "",
    school_fr: "",
    school_zh: "",
    description_pt: "",
    description_en: "",
    description_es: "",
    description_fr: "",
    description_zh: "",
    display_order: 0,
  });

  useEffect(() => { fetchEducation(); }, []);

  const fetchEducation = async () => {
    try {
      const res = await fetch("/api/admin/education");
      const data = await res.json();
      setEducation(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch education:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editing ? "/api/admin/education" : "/api/admin/education";
      const method = editing ? "PUT" : "POST";
      const body = editing ? { id: editing.id, ...formData } : formData;
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) {
        setMessage({ type: "success", text: editing ? "Atualizado!" : "Criado!" });
        resetForm();
        fetchEducation();
      } else {
        setMessage({ type: "error", text: "Erro ao salvar" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao salvar" });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir esta formação?")) return;
    try {
      await fetch(`/api/admin/education?id=${id}`, { method: "DELETE" });
      setMessage({ type: "success", text: "Excluído!" });
      fetchEducation();
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao excluir" });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEdit = (edu: Education) => {
    setEditing(edu);
    setFormData({
      period_start: edu.period_start,
      period_end: edu.period_end,
      degree_pt: edu.degree_pt,
      degree_en: edu.degree_en,
      degree_es: "", degree_fr: "", degree_zh: "",
      school_pt: edu.school_pt,
      school_en: edu.school_en,
      school_es: "", school_fr: "", school_zh: "",
      description_pt: edu.description_pt,
      description_en: edu.description_en,
      description_es: "", description_fr: "", description_zh: "",
      display_order: edu.display_order,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditing(null);
    setShowForm(false);
    setFormData({ period_start: "", period_end: "", degree_pt: "", degree_en: "", degree_es: "", degree_fr: "", degree_zh: "", school_pt: "", school_en: "", school_es: "", school_fr: "", school_zh: "", description_pt: "", description_en: "", description_es: "", description_fr: "", description_zh: "", display_order: 0 });
  };

  if (loading && education.length === 0) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Educação</h1>
          <p className="text-gray-400 mt-1">{education.length} formações cadastradas</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
          + Nova Formação
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>{message.text}</div>
      )}

      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">{editing ? "Editar" : "Nova Formação"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Período Início</label>
                <input type="text" value={formData.period_start} onChange={(e) => setFormData({ ...formData, period_start: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" placeholder="May 2024" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Período Fim</label>
                <input type="text" value={formData.period_end} onChange={(e) => setFormData({ ...formData, period_end: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" placeholder="June 2028" />
              </div>
            </div>

            <div className="border-t border-gray-800 pt-4">
              <h3 className="text-sm font-semibold text-cyan-400 mb-3">Grau e Instituição</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Grau (PT)*</label>
                  <input type="text" value={formData.degree_pt} onChange={(e) => setFormData({ ...formData, degree_pt: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Grau (EN)*</label>
                  <input type="text" value={formData.degree_en} onChange={(e) => setFormData({ ...formData, degree_en: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Instituição (PT)*</label>
                  <input type="text" value={formData.school_pt} onChange={(e) => setFormData({ ...formData, school_pt: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Instituição (EN)*</label>
                  <input type="text" value={formData.school_en} onChange={(e) => setFormData({ ...formData, school_en: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" required />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-4">
              <h3 className="text-sm font-semibold text-cyan-400 mb-3">Descrição</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Descrição (PT)</label>
                  <textarea value={formData.description_pt} onChange={(e) => setFormData({ ...formData, description_pt: e.target.value })} rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm resize-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Descrição (EN)</label>
                  <textarea value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm resize-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Ordem</label>
              <input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} className="w-20 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors">{editing ? "Salvar" : "Criar"}</button>
              <button type="button" onClick={resetForm} className="text-gray-400 hover:text-white text-sm">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => setLang("pt")} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${lang === "pt" ? "bg-cyan-500/10 text-cyan-400" : "text-gray-400 hover:text-white"}`}>PT</button>
        <button onClick={() => setLang("en")} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${lang === "en" ? "bg-cyan-500/10 text-cyan-400" : "text-gray-400 hover:text-white"}`}>EN</button>
      </div>

      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <span className="text-xs text-cyan-400 font-mono">{edu.period_start} — {edu.period_end}</span>
                <h3 className="text-lg font-semibold mt-1">{lang === "pt" ? edu.degree_pt : edu.degree_en}</h3>
                <p className="text-sm text-gray-400">{lang === "pt" ? edu.school_pt : edu.school_en}</p>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{lang === "pt" ? edu.description_pt : edu.description_en}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => handleEdit(edu)} className="text-xs text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded hover:bg-gray-800">Editar</button>
                <button onClick={() => handleDelete(edu.id)} className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-gray-800">Excluir</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
