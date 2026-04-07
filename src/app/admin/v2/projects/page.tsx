"use client";

import { useEffect, useState } from "react";

interface Project {
  id: number;
  src: string;
  site_url: string;
  repo_url: string;
  image_urls: string[];
  tags: string[];
  name_pt: string;
  name_en: string;
  featured: boolean;
  display_order: number;
  created_at: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    src: "",
    site_url: "",
    repo_url: "",
    name_pt: "",
    name_en: "",
    name_es: "",
    name_fr: "",
    name_zh: "",
    abt_pt: "",
    abt_en: "",
    abt_es: "",
    abt_fr: "",
    abt_zh: "",
    alt_pt: "",
    alt_en: "",
    alt_es: "",
    alt_fr: "",
    alt_zh: "",
    tags: "",
    featured: false,
    display_order: 0,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editing ? "/api/projects" : "/api/projects";
      const method = editing ? "PUT" : "POST";

      const body = editing
        ? { id: editing.id, ...formData, tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean) }
        : { ...formData, tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean) };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setMessage({ type: "success", text: editing ? "Projeto atualizado!" : "Projeto criado!" });
        resetForm();
        fetchProjects();
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Erro ao salvar projeto" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao salvar projeto" });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;

    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage({ type: "success", text: "Projeto excluído!" });
        fetchProjects();
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao excluir projeto" });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEdit = (project: Project) => {
    setEditing(project);
    setFormData({
      src: project.src || "",
      site_url: project.site_url || "",
      repo_url: project.repo_url || "",
      name_pt: project.name_pt || "",
      name_en: project.name_en || "",
      name_es: "",
      name_fr: "",
      name_zh: "",
      abt_pt: "",
      abt_en: "",
      abt_es: "",
      abt_fr: "",
      abt_zh: "",
      alt_pt: "",
      alt_en: "",
      alt_es: "",
      alt_fr: "",
      alt_zh: "",
      tags: Array.isArray(project.tags) ? project.tags.join(", ") : "",
      featured: project.featured || false,
      display_order: project.display_order || 0,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditing(null);
    setShowForm(false);
    setFormData({
      src: "",
      site_url: "",
      repo_url: "",
      name_pt: "",
      name_en: "",
      name_es: "",
      name_fr: "",
      name_zh: "",
      abt_pt: "",
      abt_en: "",
      abt_es: "",
      abt_fr: "",
      abt_zh: "",
      alt_pt: "",
      alt_en: "",
      alt_es: "",
      alt_fr: "",
      alt_zh: "",
      tags: "",
      featured: false,
      display_order: 0,
    });
  };

  if (loading && projects.length === 0) {
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
          <h1 className="text-2xl md:text-3xl font-bold">Projetos</h1>
          <p className="text-gray-400 mt-1">{projects.length} projetos cadastrados</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          + Novo Projeto
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">{editing ? "Editar Projeto" : "Novo Projeto"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Src (slug)*</label>
                <input
                  type="text"
                  value={formData.src}
                  onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                  placeholder="react, nextjs, typescript"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">URL do Site</label>
                <input
                  type="url"
                  value={formData.site_url}
                  onChange={(e) => setFormData({ ...formData, site_url: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">URL do Repo</label>
                <input
                  type="url"
                  value={formData.repo_url}
                  onChange={(e) => setFormData({ ...formData, repo_url: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="border-t border-gray-800 pt-4">
              <h3 className="text-sm font-semibold text-cyan-400 mb-3">Nomes por Idioma</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(["pt", "en", "es", "fr", "zh"] as const).map((lang) => (
                  <div key={lang}>
                    <label className="block text-xs text-gray-400 mb-1">Nome ({lang.toUpperCase()}){lang === "pt" || lang === "en" ? "*" : ""}</label>
                    <input
                      type="text"
                      value={formData[`name_${lang}`]}
                      onChange={(e) => setFormData({ ...formData, [`name_${lang}`]: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                      required={lang === "pt" || lang === "en"}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-800 pt-4">
              <h3 className="text-sm font-semibold text-cyan-400 mb-3">Descrições por Idioma</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(["pt", "en", "es", "fr", "zh"] as const).map((lang) => (
                  <div key={lang}>
                    <label className="block text-xs text-gray-400 mb-1">Descrição ({lang.toUpperCase()})</label>
                    <textarea
                      value={formData[`abt_${lang}`]}
                      onChange={(e) => setFormData({ ...formData, [`abt_${lang}`]: e.target.value })}
                      rows={2}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded bg-gray-800 border-gray-700 text-cyan-500"
                />
                Destaque
              </label>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Ordem</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="w-20 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
                {editing ? "Salvar Alterações" : "Criar Projeto"}
              </button>
              <button type="button" onClick={resetForm} className="text-gray-400 hover:text-white text-sm transition-colors">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Src</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Nome (PT)</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Tags</th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">Destaque</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-800/30">
                  <td className="px-4 py-3 font-mono text-xs">{project.src}</td>
                  <td className="px-4 py-3">{project.name_pt}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(project.tags) && project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                      {Array.isArray(project.tags) && project.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{project.tags.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {project.featured ? (
                      <span className="text-xs bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded">Sim</span>
                    ) : (
                      <span className="text-xs text-gray-500">Não</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(project)} className="text-xs text-cyan-400 hover:text-cyan-300">
                        Editar
                      </button>
                      <button onClick={() => handleDelete(project.id)} className="text-xs text-red-400 hover:text-red-300">
                        Excluir
                      </button>
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
