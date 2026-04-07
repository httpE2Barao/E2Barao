"use client";

import { useEffect, useState } from "react";

interface Skill {
  id: number;
  name: string;
  category: "tech" | "concept" | "program";
  level: number;
  icon_src: string;
  display_order: number;
  active: boolean;
}

const categoryLabels = { tech: "Tech", concept: "Conceito", program: "Programa" };
const categoryColors = { tech: "text-cyan-400 bg-cyan-500/10", concept: "text-purple-400 bg-purple-500/10", program: "text-green-400 bg-green-500/10" };

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "tech" as Skill["category"],
    level: 0,
    icon_src: "",
    display_order: 0,
    active: true,
  });

  useEffect(() => { fetchSkills(); }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/admin/skills");
      const data = await res.json();
      setSkills(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editing ? "/api/admin/skills" : "/api/admin/skills";
      const method = editing ? "PUT" : "POST";
      const body = editing ? { id: editing.id, ...formData } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setMessage({ type: "success", text: editing ? "Habilidade atualizada!" : "Habilidade criada!" });
        resetForm();
        fetchSkills();
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
    if (!confirm("Excluir esta habilidade?")) return;
    try {
      await fetch(`/api/admin/skills?id=${id}`, { method: "DELETE" });
      setMessage({ type: "success", text: "Habilidade excluída!" });
      fetchSkills();
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao excluir" });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEdit = (skill: Skill) => {
    setEditing(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon_src: skill.icon_src || "",
      display_order: skill.display_order,
      active: skill.active,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditing(null);
    setShowForm(false);
    setFormData({ name: "", category: "tech", level: 0, icon_src: "", display_order: 0, active: true });
  };

  const filteredSkills = filter === "all" ? skills : skills.filter((s) => s.category === filter);
  const techSkills = skills.filter((s) => s.category === "tech").length;
  const conceptSkills = skills.filter((s) => s.category === "concept").length;
  const programSkills = skills.filter((s) => s.category === "program").length;

  if (loading && skills.length === 0) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Habilidades</h1>
          <p className="text-gray-400 mt-1">{skills.length} habilidades cadastradas</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
          + Nova Habilidade
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Todas", value: "all", count: skills.length },
          { label: "Tech", value: "tech", count: techSkills },
          { label: "Conceitos", value: "concept", count: conceptSkills },
          { label: "Programas", value: "program", count: programSkills },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`p-3 rounded-lg border text-sm transition-colors ${filter === f.value ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700"}`}
          >
            <span className="block text-lg font-bold">{f.count}</span>
            <span className="text-xs">{f.label}</span>
          </button>
        ))}
      </div>

      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">{editing ? "Editar Habilidade" : "Nova Habilidade"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nome*</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Categoria*</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as Skill["category"] })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
                  <option value="tech">Tech</option>
                  <option value="concept">Conceito</option>
                  <option value="program">Programa</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nível (0-100)</label>
                <input type="number" min={0} max={100} value={formData.level} onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Icon Src</label>
                <input type="text" value={formData.icon_src} onChange={(e) => setFormData({ ...formData, icon_src: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" placeholder="img-react.png" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Ordem</label>
                <input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} className="rounded bg-gray-800 border-gray-700 text-cyan-500" />
              Ativo
            </label>
            <div className="flex items-center gap-3">
              <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
                {editing ? "Salvar" : "Criar"}
              </button>
              <button type="button" onClick={resetForm} className="text-gray-400 hover:text-white text-sm">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Nome</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Categoria</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Nível</th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">Status</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredSkills.map((skill) => (
                <tr key={skill.id} className="hover:bg-gray-800/30">
                  <td className="px-4 py-3 font-medium">{skill.name}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[skill.category]}`}>
                      {categoryLabels[skill.category]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {skill.category === "tech" ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden max-w-[120px]">
                          <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${skill.level}%` }} />
                        </div>
                        <span className="text-xs text-gray-400">{skill.level}%</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {skill.active ? <span className="text-xs text-green-400">Ativo</span> : <span className="text-xs text-gray-500">Inativo</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(skill)} className="text-xs text-cyan-400 hover:text-cyan-300">Editar</button>
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
