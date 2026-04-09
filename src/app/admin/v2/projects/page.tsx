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

interface ProjectImage {
  name: string;
  url: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [imagesLoading, setImagesLoading] = useState(true);

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

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData.src) {
      setMessage({ type: "error", text: "É preciso definir o src do projeto primeiro" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('projectSrc', formData.src);

      const res = await fetch('/api/admin/projects/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        setMessage({ type: "success", text: `Imagem uploadada: ${data.fileName}` });
      } else {
        const error = await res.json();
        setMessage({ type: "error", text: error.error || "Erro ao fazer upload" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao fazer upload" });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDeleteImage = async (fileName: string) => {
    if (!confirm(`Excluir imagem ${fileName}?`)) return;

    try {
      const res = await fetch(`/api/admin/projects/upload?fileName=${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Imagem excluída!" });
      } else {
        setMessage({ type: "error", text: "Erro ao excluir imagem" });
      }
    } catch {
      setMessage({ type: "error", text: "Erro ao excluir imagem" });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const fetchProjectImages = async () => {
    try {
      const res = await fetch('/api/admin/projects/upload');
      const data = await res.json();
      setProjectImages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setImagesLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchProjectImages();
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
      const url = editing ? "/api/admin/projects" : "/api/admin/projects";
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
        fetchProjectImages();
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
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
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

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-cyan-400 mb-3">Upload de Imagem do Projeto</h3>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-lg text-sm transition-colors border border-cyan-500/30">
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Selecionar Imagem
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-gray-500">PNG, JPG, WebP, GIF (max 5MB). O nome será: project_{formData.src || '[src]'}.png</span>
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

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Imagens dos Projetos</h2>
        {imagesLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projectImages.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhuma imagem encontrada</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {projectImages.map((img) => (
              <div key={img.name} className="relative group">
                <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-gray-400 mt-1 truncate">{img.name}</p>
                <button
                  onClick={() => handleDeleteImage(img.name)}
                  className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
