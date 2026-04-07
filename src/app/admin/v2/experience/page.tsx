"use client";

import { useEffect, useState } from "react";

interface Experience {
  id: number;
  period_start: string;
  period_end: string;
  role_pt: string;
  role_en: string;
  company_pt: string;
  company_en: string;
  description_pt: string;
  description_en: string;
  highlight: boolean;
  display_order: number;
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [lang, setLang] = useState<"pt" | "en">("pt");

  const [formData, setFormData] = useState({
    period_start: "",
    period_end: "",
    role_pt: "",
    role_en: "",
    role_es: "",
    role_fr: "",
    role_zh: "",
    company_pt: "",
    company_en: "",
    company_es: "",
    company_fr: "",
    company_zh: "",
    description_pt: "",
    description_en: "",
    description_es: "",
    description_fr: "",
    description_zh: "",
    highlight: false,
    display_order: 0,
  });

  useEffect(() => { fetchExperiences(); }, []);

  const fetchExperiences = async () => {
    try {
      const res = await fetch("/api/admin/experience");
      const data = await res.json();
      setExperiences(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch experiences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editing ? "/api/admin/experience" : "/api/admin/experience";
      const method = editing ? "PUT" : "POST";
      const body = editing ? { id: editing.id, ...formData } : formData;
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) {
        setMessage({ type: "success", text: editing ? "Atualizado!" : "Criado!" });
        resetForm();
        fetchExperiences();
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
    if (!confirm("Excluir esta experiência?")) return;
    try {
      await fetch(`/api/admin/experience?id=${id}`, { method: "DELETE" });
      setMessage({ type: "success", text: "Excluído!" });
      fetchExperiences();
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao excluir" });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEdit = (exp: Experience) => {
    setEditing(exp);
    setFormData({
      period_start: exp.period_start,
      period_end: exp.period_end,
      role_pt: exp.role_pt,
      role_en: exp.role_en,
      role_es: "", role_fr: "", role_zh: "",
      company_pt: exp.company_pt,
      company_en: exp.company_en,
      company_es: "", company_fr: "", company_zh: "",
      description_pt: exp.description_pt,
      description_en: exp.description_en,
      description_es: "", description_fr: "", description_zh: "",
      highlight: exp.highlight,
      display_order: exp.display_order,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditing(null);
    setShowForm(false);
    setFormData({ period_start: "", period_end: "", role_pt: "", role_en: "", role_es: "", role_fr: "", role_zh: "", company_pt: "", company_en: "", company_es: "", company_fr: "", company_zh: "", description_pt: "", description_en: "", description_es: "", description_fr: "", description_zh: "", highlight: false, display_order: 0 });
  };

  if (loading && experiences.length === 0) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Experiência Profissional</h1>
          <p className="text-gray-400 mt-1">{experiences.length} entradas</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
          + Nova Experiência
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>{message.text}</div>
      )}

      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">{editing ? "Editar" : "Nova Experiência"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Período Início</label>
                <input type="text" value={formData.period_start} onChange={(e) => setFormData({ ...formData, period_start: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" placeholder="May 2025" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Período Fim</label>
                <input type="text" value={formData.period_end} onChange={(e) => setFormData({ ...formData, period_end: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" placeholder="Present" />
              </div>
            </div>

            <div className="border-t border-gray-800 pt-4">
              <h3 className="text-sm font-semibold text-cyan-400 mb-3">Cargo e Empresa</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Cargo (PT)*</label>
                  <input type="text" value={formData.role_pt} onChange={(e) => setFormData({ ...formData, role_pt: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Cargo (EN)*</label>
                  <input type="text" value={formData.role_en} onChange={(e) => setFormData({ ...formData, role_en: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Empresa (PT)*</label>
                  <input type="text" value={formData.company_pt} onChange={(e) => setFormData({ ...formData, company_pt: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Empresa (EN)*</label>
                  <input type="text" value={formData.company_en} onChange={(e) => setFormData({ ...formData, company_en: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" required />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-4">
              <h3 className="text-sm font-semibold text-cyan-400 mb-3">Descrição</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Descrição (PT)*</label>
                  <textarea value={formData.description_pt} onChange={(e) => setFormData({ ...formData, description_pt: e.target.value })} rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm resize-none" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Descrição (EN)*</label>
                  <textarea value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm resize-none" required />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={formData.highlight} onChange={(e) => setFormData({ ...formData, highlight: e.target.checked })} className="rounded bg-gray-800 border-gray-700 text-cyan-500" />
                Destaque
              </label>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Ordem</label>
                <input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} className="w-20 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" />
              </div>
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
        {experiences.map((exp) => (
          <div key={exp.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-cyan-400 font-mono">{exp.period_start} — {exp.period_end}</span>
                  {exp.highlight && <span className="text-xs bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded">Destaque</span>}
                </div>
                <h3 className="text-lg font-semibold">{lang === "pt" ? exp.role_pt : exp.role_en}</h3>
                <p className="text-sm text-gray-400">{lang === "pt" ? exp.company_pt : exp.company_en}</p>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{lang === "pt" ? exp.description_pt : exp.description_en}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => handleEdit(exp)} className="text-xs text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded hover:bg-gray-800">Editar</button>
                <button onClick={() => handleDelete(exp.id)} className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-gray-800">Excluir</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
