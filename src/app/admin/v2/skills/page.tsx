"use client";

import { useEffect, useState } from "react";
import { useAdminTheme } from "../layout";

interface Skill {
  id: number;
  name: string;
  category: "tech" | "concept" | "program";
  level: number;
  icon_src: string;
  display_order: number;
  active: boolean;
}

export default function SkillsPage() {
  const { isDark } = useAdminTheme();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const colors = {
    card: isDark ? "bg-gray-900" : "bg-white",
    cardBg: isDark ? "bg-gray-800" : "bg-gray-50",
    cardBgAlt: isDark ? "bg-gray-800/50" : "bg-gray-100",
    border: isDark ? "border-gray-800" : "border-gray-200",
    borderInput: isDark ? "border-gray-700" : "border-gray-300",
    text: isDark ? "text-white" : "text-gray-900",
    textMuted: isDark ? "text-gray-400" : "text-gray-600",
    accent: isDark ? "text-cyan-400" : "text-blue-600",
    accentBg: isDark ? "bg-cyan-500/10" : "bg-blue-500/10",
    accentBorder: isDark ? "border-cyan-500/30" : "border-blue-500/30",
    spinner: isDark ? "border-cyan-400" : "border-blue-600",
  };

  const categoryLabels = { tech: "Tech", concept: "Conceito", program: "Programa" };
  const categoryColors = {
    tech: isDark ? "text-cyan-400 bg-cyan-500/10" : "text-blue-600 bg-blue-500/10",
    concept: isDark ? "text-purple-400 bg-purple-500/10" : "text-purple-600 bg-purple-500/10",
    program: isDark ? "text-green-400 bg-green-500/10" : "text-green-600 bg-green-500/10",
  };

  const [formData, setFormData] = useState({ name: "", category: "tech" as Skill["category"], level: 0, icon_src: "", display_order: 0, active: true });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch("/api/admin/skills");
        const data = await res.json();
        setSkills(Array.isArray(data) ? data : []);
      } catch { setSkills([]); }
      setLoading(false);
    };
    fetchSkills();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/skills", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { id: editing.id, ...formData } : formData),
      });
      if (res.ok) {
        setMessage({ type: "success", text: editing ? "Habilidade atualizada!" : "Habilidade criada!" });
        resetForm();
      }
    } catch { setMessage({ type: "error", text: "Erro ao salvar" }); }
    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir?")) return;
    try {
      await fetch(`/api/admin/skills?id=${id}`, { method: "DELETE" });
      setMessage({ type: "success", text: "Habilidade excluída!" });
    } catch { setMessage({ type: "error", text: "Erro ao excluir" }); }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEdit = (skill: Skill) => {
    setEditing(skill);
    setFormData({ name: skill.name, category: skill.category, level: skill.level, icon_src: skill.icon_src || "", display_order: skill.display_order, active: skill.active });
    setShowForm(true);
  };

  const resetForm = () => { setEditing(null); setShowForm(false); setFormData({ name: "", category: "tech", level: 0, icon_src: "", display_order: 0, active: true }); };

  const filteredSkills = filter === "all" ? skills : skills.filter((s) => s.category === filter);
  const techSkills = skills.filter((s) => s.category === "tech").length;
  const conceptSkills = skills.filter((s) => s.category === "concept").length;
  const programSkills = skills.filter((s) => s.category === "program").length;

  if (loading && skills.length === 0) return <div className="flex items-center justify-center h-64"><div className={`w-8 h-8 border-2 ${colors.spinner} border-t-transparent rounded-full animate-spin`} /></div>;

  const accentClass = isDark ? "bg-cyan-500 hover:bg-cyan-400 text-black" : "bg-blue-600 hover:bg-blue-500 text-white";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${colors.text}`}>Habilidades</h1>
          <p className={`${colors.textMuted} mt-1`}>{skills.length} habilidades</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className={`${accentClass} font-semibold px-4 py-2 rounded-lg text-sm transition-colors`}>+ Nova</button>
      </div>

      {message && <div className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>{message.text}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Todas", value: "all", count: skills.length },
          { label: "Tech", value: "tech", count: techSkills },
          { label: "Conceitos", value: "concept", count: conceptSkills },
          { label: "Programas", value: "program", count: programSkills },
        ].map((f) => {
          const isActive = filter === f.value;
          const bgClass = isActive ? colors.accentBg : colors.card + " " + colors.border;
          const textClass = isActive ? colors.accent : colors.textMuted;
          const hoverClass = isActive ? "" : "hover:" + colors.border;
          return (
          <button key={f.value} onClick={() => setFilter(f.value)} className={"p-3 rounded-lg border text-sm transition-colors " + bgClass + " " + textClass + " " + hoverClass}>
            <span className="block text-lg font-bold">{f.count}</span>
            <span className="text-xs">{f.label}</span>
          </button>
        )})}
      </div>

      {showForm && (
        <div className={`${colors.card} border ${colors.border} rounded-xl p-6`}>
          <h2 className={`text-lg font-semibold mb-4 ${colors.text}`}>{editing ? "Editar" : "Nova"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm ${colors.textMuted} mb-1`}>Nome*</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={`w-full ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text}`} required />
              </div>
              <div>
                <label className={`block text-sm ${colors.textMuted} mb-1`}>Categoria*</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as Skill["category"] })} className={`w-full ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text}`}>
                  <option value="tech">Tech</option>
                  <option value="concept">Conceito</option>
                  <option value="program">Programa</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm ${colors.textMuted} mb-1`}>Nível</label>
                <input type="number" min={0} max={100} value={formData.level} onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })} className={`w-full ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text}`} />
              </div>
              <div>
                <label className={`block text-sm ${colors.textMuted} mb-1`}>Icon Src</label>
                <input type="text" value={formData.icon_src} onChange={(e) => setFormData({ ...formData, icon_src: e.target.value })} className={`w-full ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text}`} />
              </div>
              <div>
                <label className={`block text-sm ${colors.textMuted} mb-1`}>Ordem</label>
                <input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} className={`w-full ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text}`} />
              </div>
            </div>
            <label className={`flex items-center gap-2 text-sm ${colors.text}`}>
              <input type="checkbox" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} className={`rounded ${colors.cardBg} ${colors.borderInput} ${colors.accent}`} />
              Ativo
            </label>
            <div className="flex items-center gap-3">
              <button type="submit" className={`${accentClass} font-semibold px-4 py-2 rounded-lg text-sm transition-colors`}>{editing ? "Salvar" : "Criar"}</button>
              <button type="button" onClick={resetForm} className={`${colors.textMuted} hover:${colors.text} text-sm`}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className={`${colors.card} border ${colors.border} rounded-xl overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={colors.cardBgAlt}>
              <tr>
                <th className={`text-left px-4 py-3 ${colors.textMuted} font-medium`}>Nome</th>
                <th className={`text-left px-4 py-3 ${colors.textMuted} font-medium`}>Categoria</th>
                <th className={`text-left px-4 py-3 ${colors.textMuted} font-medium`}>Nível</th>
                <th className={`text-center px-4 py-3 ${colors.textMuted} font-medium`}>Status</th>
                <th className={`text-right px-4 py-3 ${colors.textMuted} font-medium`}>Ações</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${colors.border}`}>
              {filteredSkills.map((skill) => (
                <tr key={skill.id} className={`hover:${colors.cardBg}/30`}>
                  <td className={`px-4 py-3 font-medium ${colors.text}`}>{skill.name}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded ${categoryColors[skill.category]}`}>{categoryLabels[skill.category]}</span></td>
                  <td className="px-4 py-3">
                    {skill.category === "tech" ? (
                      <div className="flex items-center gap-2">
                        <div className={`flex-1 h-1.5 ${colors.cardBg} rounded-full overflow-hidden max-w-[120px]`}><div className={`h-full ${isDark ? "bg-cyan-500" : "bg-blue-600"} rounded-full`} style={{ width: `${skill.level}%` }} /></div>
                        <span className={`text-xs ${colors.textMuted}`}>{skill.level}%</span>
                      </div>
                    ) : <span className={colors.textMuted}>—</span>}
                  </td>
                  <td className="px-4 py-3 text-center">{skill.active ? <span className="text-xs text-green-400">Ativo</span> : <span className={`text-xs ${colors.textMuted}`}>Inativo</span>}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(skill)} className={`text-xs ${colors.accent}`}>Editar</button>
                      <button onClick={() => handleDelete(skill.id)} className="text-xs text-red-400 hover:text-red-300">Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}