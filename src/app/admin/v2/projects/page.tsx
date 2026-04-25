"use client";

import { useEffect, useState } from "react";
import { useAdminTheme } from "../layout";

interface Project {
  id: number;
  src: string;
  site_url: string;
  repo_url: string;
  image_urls: string[];
  tags: string[];
  name_pt: string;
  name_en: string;
  name_es: string;
  name_fr: string;
  name_zh: string;
  subtitle_pt: string;
  subtitle_en: string;
  subtitle_es: string;
  subtitle_fr: string;
  subtitle_zh: string;
  abt_pt: string;
  abt_en: string;
  abt_es: string;
  abt_fr: string;
  abt_zh: string;
  alt_pt: string;
  alt_en: string;
  alt_es: string;
  alt_fr: string;
  alt_zh: string;
  featured: boolean;
  display_order: number;
  created_at: string;
}

interface ProjectImage {
  name: string;
  url: string;
}

export default function ProjectsPage() {
  const { isDark } = useAdminTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const colors = {
    card: isDark ? "bg-gray-900" : "bg-white",
    cardBg: isDark ? "bg-gray-800" : "bg-gray-50",
    cardBgAlt: isDark ? "bg-gray-800/50" : "bg-gray-100",
    border: isDark ? "border-gray-800" : "border-gray-200",
    borderInput: isDark ? "border-gray-700" : "border-gray-300",
    text: isDark ? "text-white" : "text-gray-900",
    textMuted: isDark ? "text-gray-400" : "text-gray-600",
    textSubtle: isDark ? "text-gray-500" : "text-gray-500",
    accent: isDark ? "text-cyan-400" : "text-blue-600",
    accentBg: isDark ? "bg-cyan-500/10" : "bg-blue-500/10",
    accentBorder: isDark ? "border-cyan-500/30" : "border-blue-500/30",
    spinner: isDark ? "border-cyan-400" : "border-blue-600",
  };

const [formData, setFormData] = useState({
  src: "", site_url: "", repo_url: "",
  name_pt: "", name_en: "", name_es: "", name_fr: "", name_zh: "",
  subtitle_pt: "", subtitle_en: "", subtitle_es: "", subtitle_fr: "", subtitle_zh: "",
  abt_pt: "", abt_en: "", abt_es: "", abt_fr: "", abt_zh: "",
  alt_pt: "", alt_en: "", alt_es: "", alt_fr: "", alt_zh: "",
  tags: [] as string[], featured: false, display_order: 0,
});

  const fetchProjectImages = async () => {
    try {
      const res = await fetch('/api/admin/projects/upload');
      const data = await res.json();
      setProjectImages(Array.isArray(data) ? data : []);
    } catch { setImagesLoading(false); }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/admin/projects");
        const data = await res.json();
        const projectsData = Array.isArray(data) ? data : [];
        setProjects(projectsData);
        const tags = new Set<string>();
        projectsData.forEach((p: Project) => {
          if (Array.isArray(p.tags)) {
            p.tags.forEach((t: string) => tags.add(t));
          }
        });
        setAllTags(Array.from(tags).sort());
      } catch { setProjects([]); }
      setLoading(false);
    };
    fetchProjects();
    fetchProjectImages();
  }, []);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData({ ...formData, tags: [...formData.tags, trimmed] });
      if (!allTags.includes(trimmed)) {
        setAllTags([...allTags, trimmed].sort());
      }
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tagToRemove) });
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && !tagInput && formData.tags.length > 0) {
      removeTag(formData.tags[formData.tags.length - 1]);
    }
  };

const filteredTags = allTags.filter((t) => t.toLowerCase().includes(tagInput.toLowerCase()) && !formData.tags.includes(t));

  const [translatingName, setTranslatingName] = useState(false);
  const [translatingDesc, setTranslatingDesc] = useState(false);

  const translateText = async (text: string, targetLang: string): Promise<string> => {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLang }),
    });
    if (!res.ok) throw new Error('Translation failed');
    const data = await res.json();
    return data.translatedText;
  };

  const translateName = async () => {
    if (!formData.name_pt) return;
    setTranslatingName(true);
    const langs = ['en', 'es', 'fr', 'zh'] as const;
    try {
      const results = await Promise.all(
        langs.map(async (lang) => ({ lang, text: await translateText(formData.name_pt, lang) }))
      );
      setFormData(prev => ({
        ...prev,
        name_en: results.find(r => r.lang === 'en')?.text || prev.name_en,
        name_es: results.find(r => r.lang === 'es')?.text || prev.name_es,
        name_fr: results.find(r => r.lang === 'fr')?.text || prev.name_fr,
        name_zh: results.find(r => r.lang === 'zh')?.text || prev.name_zh,
      }));
    } catch (err) {
      console.error('Erro ao traduzir nome:', err);
    } finally {
      setTranslatingName(false);
    }
  };

  const translateDesc = async () => {
    if (!formData.abt_pt) return;
    setTranslatingDesc(true);
    const langs = ['en', 'es', 'fr', 'zh'] as const;
    try {
      const results = await Promise.all(
        langs.map(async (lang) => ({ lang, text: await translateText(formData.abt_pt, lang) }))
      );
      setFormData(prev => ({
        ...prev,
        abt_en: results.find(r => r.lang === 'en')?.text || prev.abt_en,
        abt_es: results.find(r => r.lang === 'es')?.text || prev.abt_es,
        abt_fr: results.find(r => r.lang === 'fr')?.text || prev.abt_fr,
        abt_zh: results.find(r => r.lang === 'zh')?.text || prev.abt_zh,
      }));
    } catch (err) {
      console.error('Erro ao traduzir descrição:', err);
    } finally {
      setTranslatingDesc(false);
    }
  };

const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
const file = e.target.files?.[0];
    if (!file || !formData.src) {
      setMessage({ type: "error", text: "É preciso definir o src do projeto primeiro" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('projectSrc', formData.src);
      const res = await fetch('/api/admin/projects/upload', { method: 'POST', body: formDataUpload });
      if (res.ok) {
        const data = await res.json();
        setMessage({ type: "success", text: `Imagem uploadada: ${data.fileName}` });
      }
} catch { setMessage({ type: "error", text: "Erro ao fazer upload" }); }
finally { setUploading(false); setTimeout(() => setMessage(null), 3000); }
  };

  const handleDeleteImage = async (fileName: string) => {
    if (!confirm(`Excluir imagem ${fileName}?`)) return;
    try {
      const res = await fetch(`/api/admin/projects/upload?fileName=${encodeURIComponent(fileName)}`, { method: 'DELETE' });
      if (res.ok) setMessage({ type: "success", text: "Imagem excluída!" });
    } catch { setMessage({ type: "error", text: "Erro ao excluir imagem" }); }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = { ...formData };
      const res = await fetch("/api/admin/projects", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { id: editing.id, ...body } : body),
      });
      if (res.ok) {
        setMessage({ type: "success", text: editing ? "Projeto atualizado!" : "Projeto criado!" });
        resetForm();
        fetchProjectImages();
      }
    } catch { setMessage({ type: "error", text: "Erro ao salvar projeto" }); }
    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir projeto?")) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) setMessage({ type: "success", text: "Projeto excluído!" });
    } catch { setMessage({ type: "error", text: "Erro ao excluir" }); }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEdit = (project: Project) => {
    setEditing(project);
    setFormData({
      src: project.src || "", site_url: project.site_url || "", repo_url: project.repo_url || "",
      name_pt: project.name_pt || "", name_en: project.name_en || "", name_es: project.name_es || "", name_fr: project.name_fr || "", name_zh: project.name_zh || "",
      subtitle_pt: project.subtitle_pt || "", subtitle_en: project.subtitle_en || "", subtitle_es: project.subtitle_es || "", subtitle_fr: project.subtitle_fr || "", subtitle_zh: project.subtitle_zh || "",
      abt_pt: project.abt_pt || "", abt_en: project.abt_en || "", abt_es: project.abt_es || "", abt_fr: project.abt_fr || "", abt_zh: project.abt_zh || "",
      alt_pt: project.alt_pt || "", alt_en: project.alt_en || "", alt_es: project.alt_es || "", alt_fr: project.alt_fr || "", alt_zh: project.alt_zh || "",
      tags: Array.isArray(project.tags) ? project.tags : [],
      featured: project.featured || false, display_order: project.display_order || 0,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditing(null);
    setShowForm(false);
    setFormData({
      src: "", site_url: "", repo_url: "",
      name_pt: "", name_en: "", name_es: "", name_fr: "", name_zh: "",
      subtitle_pt: "", subtitle_en: "", subtitle_es: "", subtitle_fr: "", subtitle_zh: "",
      abt_pt: "", abt_en: "", abt_es: "", abt_fr: "", abt_zh: "",
      alt_pt: "", alt_en: "", alt_es: "", alt_fr: "", alt_zh: "",
      tags: [], featured: false, display_order: 0,
    });
    setTagInput("");
  };

  if (loading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`w-8 h-8 border-2 ${colors.spinner} border-t-transparent rounded-full animate-spin`} />
      </div>
    );
  }

  const accentClass = isDark ? "bg-cyan-500 hover:bg-cyan-400 text-black" : "bg-blue-600 hover:bg-blue-500 text-white";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${colors.text}`}>Projetos</h1>
          <p className={`${colors.textMuted} mt-1`}>{projects.length} projetos cadastrados</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className={`${accentClass} font-semibold px-4 py-2 rounded-lg text-sm transition-colors`}>
          + Novo Projeto
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div className={`${colors.card} border ${colors.border} rounded-xl p-6`}>
          <h2 className={`text-lg font-semibold mb-4 ${colors.text}`}>{editing ? "Editar Projeto" : "Novo Projeto"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm ${colors.textMuted} mb-1`}>Src (slug)*</label>
                <input type="text" value={formData.src} onChange={(e) => setFormData({ ...formData, src: e.target.value })} className={`w-full ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text}`} required />
              </div>
<div>
              <label className={`block text-sm ${colors.textMuted} mb-1`}>Tags</label>
              <div className={`relative`}>
                <div className={`w-full ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text} min-h-[42px] flex flex-wrap gap-1 items-center`}>
                  {formData.tags.map((tag) => (
                    <span key={tag} className={`flex items-center gap-1 ${colors.accentBg} ${colors.accent} px-2 py-0.5 rounded text-xs`}>
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:opacity-70">×</button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder={formData.tags.length === 0 ? "Digite para buscar ou criar tags" : ""}
                    className={`flex-1 min-w-[120px] bg-transparent outline-none ${colors.text} placeholder:${colors.textSubtle}`}
                    list="tags-list"
                  />
                  <datalist id="tags-list">
                    {filteredTags.map((t) => (
                      <option key={t} value={t} />
                    ))}
                  </datalist>
                </div>
                {tagInput && filteredTags.length > 0 && (
                  <div className={`absolute z-10 w-full mt-1 ${colors.card} border ${colors.border} rounded-lg shadow-lg max-h-40 overflow-auto`}>
                    {filteredTags.map((t) => (
                      <button key={t} type="button" onClick={() => addTag(t)} className={`w-full text-left px-3 py-2 text-sm ${colors.text} hover:${colors.cardBgAlt} transition-colors`}>
                        {t}
                      </button>
                    ))}
                  </div>
                )}
                {tagInput && !filteredTags.some(t => t.toLowerCase() === tagInput.toLowerCase()) && (
                  <div className={`absolute z-10 w-full mt-1 ${colors.card} border ${colors.border} rounded-lg shadow-lg`}>
                    <button type="button" onClick={() => addTag(tagInput)} className={`w-full text-left px-3 py-2 text-sm ${colors.text} hover:${colors.cardBgAlt} transition-colors flex items-center gap-2`}>
                      <span className={`text-xs ${colors.accent}`}>+ Criar:</span> {tagInput}
                    </button>
                  </div>
                )}
              </div>
              <p className={`text-xs ${colors.textSubtle} mt-1`}>Pressione Enter para adicionar ou clique em uma opção</p>
            </div>
            </div>

            <div className={`${colors.cardBgAlt} border ${colors.border} rounded-lg p-4`}>
              <h3 className={`text-sm font-semibold ${colors.accent} mb-3`}>Upload de Imagem</h3>
              <label className={`flex items-center gap-2 cursor-pointer ${colors.accentBg} ${colors.accent} px-4 py-2 rounded-lg text-sm transition-colors border ${colors.accentBorder}`}>
                {uploading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />Enviando...</span> : <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>Selecionar Imagem/Video/GIF</>}
                <input type="file" accept="image/*,video/mp4,video/webm,video/quicktime,.gif" onChange={handleImageUpload} disabled={uploading} className="hidden" />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm ${colors.textMuted} mb-1`}>URL do Site</label>
                <input type="url" value={formData.site_url} onChange={(e) => setFormData({ ...formData, site_url: e.target.value })} className={`w-full ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text}`} />
              </div>
              <div>
                <label className={`block text-sm ${colors.textMuted} mb-1`}>URL do Repo</label>
                <input type="url" value={formData.repo_url} onChange={(e) => setFormData({ ...formData, repo_url: e.target.value })} className={`w-full ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text}`} />
              </div>
            </div>

            <div className={`border-t ${colors.border} pt-4`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-sm font-semibold ${colors.accent}`}>Nomes por Idioma</h3>
                <button
                  type="button"
                  onClick={translateName}
                  disabled={translatingName || !formData.name_pt}
                  className={`text-xs px-3 py-1.5 rounded transition-colors flex items-center gap-2 ${translatingName ? 'opacity-50 cursor-not-allowed' : ''} ${colors.accentBg} ${colors.accent} border ${colors.accentBorder} hover:${colors.cardBgAlt}`}
                >
                  {translatingName ? (
                    <><span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />Traduzindo...</>
                  ) : (
                    <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.003 7M10 21V7m-4 14a2 2 0 100-4 2 2 0 000 4z" /></svg>Traduzir Nome</>
                  )}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(["pt", "en", "es", "fr", "zh"] as const).map((lang) => (
                  <div key={lang}>
                    <label className={`block text-xs ${colors.textMuted} mb-1`}>Nome ({lang.toUpperCase()}){lang === "pt" ? "*" : ""}</label>
                    <input type="text" value={formData[`name_${lang}`]} onChange={(e) => setFormData({ ...formData, [`name_${lang}`]: e.target.value })} className={`w-full ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text}`} required={lang === "pt"} />
                  </div>
                ))}
              </div>
            </div>

            <div className={`border-t ${colors.border} pt-4`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-sm font-semibold ${colors.accent}`}>Subtítulos por Idioma</h3>
                <button
                  type="button"
                  onClick={async () => {
                    if (!formData.subtitle_pt || translatingDesc) return;
                    setTranslatingDesc(true);
                    const langs = ['en', 'es', 'fr', 'zh'] as const;
                    try {
                      const results = await Promise.all(
                        langs.map(async (lang) => ({ lang, text: await translateText(formData.subtitle_pt, lang) }))
                      );
                      setFormData(prev => ({
                        ...prev,
                        subtitle_en: results.find(r => r.lang === 'en')?.text || prev.subtitle_en,
                        subtitle_es: results.find(r => r.lang === 'es')?.text || prev.subtitle_es,
                        subtitle_fr: results.find(r => r.lang === 'fr')?.text || prev.subtitle_fr,
                        subtitle_zh: results.find(r => r.lang === 'zh')?.text || prev.subtitle_zh,
                      }));
                    } catch (err) {
                      console.error('Erro ao traduzir subtitles:', err);
                    }
                    setTranslatingDesc(false);
                  }}
                  disabled={translatingDesc || !formData.subtitle_pt}
                  className={`text-xs px-3 py-1.5 rounded transition-colors flex items-center gap-2 ${translatingDesc ? 'opacity-50 cursor-not-allowed' : ''} ${colors.accentBg} ${colors.accent} border ${colors.accentBorder} hover:${colors.cardBgAlt}`}
                >
                  {translatingDesc ? (
                    <><span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />Traduzindo...</>
                  ) : (
                    <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.003 7M10 21V7m-4 14a2 2 0 100-4 2 2 0 000 4z" /></svg>Traduzir Subtítulo</>
                  )}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(["pt", "en", "es", "fr", "zh"] as const).map((lang) => (
                  <div key={lang}>
                    <label className={`block text-xs ${colors.textMuted} mb-1`}>Subtítulo ({lang.toUpperCase()})</label>
                    <input type="text" value={formData[`subtitle_${lang}`]} onChange={(e) => setFormData({ ...formData, [`subtitle_${lang}`]: e.target.value })} className={`w-full ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text}`} />
                  </div>
                ))}
              </div>
            </div>

            <div className={`border-t ${colors.border} pt-4`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-sm font-semibold ${colors.accent}`}>Descrições por Idioma</h3>
                <button
                  type="button"
                  onClick={translateDesc}
                  disabled={translatingDesc || !formData.abt_pt}
                  className={`text-xs px-3 py-1.5 rounded transition-colors flex items-center gap-2 ${translatingDesc ? 'opacity-50 cursor-not-allowed' : ''} ${colors.accentBg} ${colors.accent} border ${colors.accentBorder} hover:${colors.cardBgAlt}`}
                >
                  {translatingDesc ? (
                    <><span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />Traduzindo...</>
                  ) : (
                    <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.003 7M10 21V7m-4 14a2 2 0 100-4 2 2 0 000 4z" /></svg>Traduzir Descrição</>
                  )}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(["pt", "en", "es", "fr", "zh"] as const).map((lang) => (
                  <div key={lang}>
                    <label className={`block text-xs ${colors.textMuted} mb-1`}>Descrição ({lang.toUpperCase()})</label>
                    <textarea value={formData[`abt_${lang}`]} onChange={(e) => setFormData({ ...formData, [`abt_${lang}`]: e.target.value })} rows={2} className={`w-full ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text} resize-none`} />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className={`flex items-center gap-2 text-sm ${colors.text}`}>
                <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className={`rounded ${colors.cardBg} ${colors.borderInput} ${colors.accent}`} />
                Destaque
              </label>
              <div>
                <label className={`block text-xs ${colors.textMuted} mb-1`}>Ordem</label>
                <input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} className={`w-20 ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text}`} />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button type="submit" className={`${accentClass} font-semibold px-4 py-2 rounded-lg text-sm transition-colors`}>{editing ? "Salvar" : "Criar"}</button>
              <button type="button" onClick={resetForm} className={`${colors.textMuted} hover:${colors.text} text-sm transition-colors`}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className={`${colors.card} border ${colors.border} rounded-xl overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={colors.cardBgAlt}>
              <tr>
                <th className={`text-left px-4 py-3 ${colors.textMuted} font-medium`}>Src</th>
                <th className={`text-left px-4 py-3 ${colors.textMuted} font-medium`}>Nome (PT)</th>
                <th className={`text-left px-4 py-3 ${colors.textMuted} font-medium`}>Tags</th>
                <th className={`text-center px-4 py-3 ${colors.textMuted} font-medium`}>Destaque</th>
                <th className={`text-right px-4 py-3 ${colors.textMuted} font-medium`}>Ações</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${colors.border}`}>
              {projects.map((project) => (
                <tr key={project.id} className={`hover:${colors.cardBg}/30`}>
                  <td className={`px-4 py-3 font-mono text-xs ${colors.textMuted}`}>{project.src}</td>
                  <td className={`px-4 py-3 ${colors.text}`}>{project.name_pt}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(project.tags) && project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className={`text-xs ${colors.cardBg} ${colors.textMuted} px-2 py-0.5 rounded`}>{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {project.featured ? <span className={`text-xs ${colors.accentBg} ${colors.accent} px-2 py-0.5 rounded`}>Sim</span> : <span className={`text-xs ${colors.textSubtle}`}>Não</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(project)} className={`text-xs ${colors.accent} hover:opacity-80`}>Editar</button>
                      <button onClick={() => handleDelete(project.id)} className="text-xs text-red-400 hover:text-red-300">Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`${colors.card} border ${colors.border} rounded-xl p-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${colors.text}`}>Imagens dos Projetos</h2>
        {imagesLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className={`w-6 h-6 border-2 ${colors.spinner} border-t-transparent rounded-full animate-spin`} />
          </div>
        ) : projectImages.length === 0 ? (
          <p className={`${colors.textSubtle} text-sm`}>Nenhuma imagem</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {projectImages.map((img) => (
              <div key={img.name} className="relative group">
                <div className={`aspect-video ${colors.cardBg} rounded-lg overflow-hidden`}>
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                </div>
                <p className={`text-xs ${colors.textMuted} mt-1 truncate`}>{img.name}</p>
                <button onClick={() => handleDeleteImage(img.name)} className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}