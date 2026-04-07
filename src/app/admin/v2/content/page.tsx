"use client";

import { useEffect, useState } from "react";

interface Content {
  id: number;
  section: string;
  key: string;
  value_pt: string;
  value_en: string;
  value_es: string;
  value_fr: string;
  value_zh: string;
  display_order: number;
}

const sections = [
  { value: "hero", label: "Hero" },
  { value: "about", label: "Sobre Mim" },
  { value: "approach", label: "Abordagem" },
  { value: "phrases", label: "Frases" },
  { value: "footer", label: "Footer" },
];

export default function ContentPage() {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Content | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [lang, setLang] = useState<"pt" | "en" | "es" | "fr" | "zh">("pt");

  const fetchContent = async () => {
    try {
      const res = await fetch(`/api/admin/content?section=${activeSection}`);
      const data = await res.json();
      setContent(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch content:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContent(); }, [activeSection]);

  const handleSave = async (item: Content) => {
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Conteúdo atualizado!" });
        fetchContent();
      } else {
        setMessage({ type: "error", text: "Erro ao salvar" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao salvar" });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleInlineEdit = (id: number, field: string, value: string) => {
    setContent((prev) => prev.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Conteúdo do Portfólio</h1>
        <p className="text-gray-400 mt-1">Edite textos do Hero, Sobre, Abordagem, Frases e Footer</p>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>{message.text}</div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        {sections.map((section) => (
          <button
            key={section.value}
            onClick={() => setActiveSection(section.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === section.value
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                : "bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-gray-500">Editar em:</span>
        {(["pt", "en", "es", "fr", "zh"] as const).map((l) => (
          <button key={l} onClick={() => setLang(l)} className={`px-2 py-1 rounded text-xs font-medium transition-colors ${lang === l ? "bg-cyan-500/10 text-cyan-400" : "text-gray-500 hover:text-white"}`}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {content.map((item) => (
          <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-cyan-400">{item.key}</span>
              <button
                onClick={() => handleSave(item)}
                className="text-xs bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded hover:bg-cyan-500/20 transition-colors"
              >
                Salvar
              </button>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                {lang === "pt" ? "Português" : lang === "en" ? "English" : lang === "es" ? "Español" : lang === "fr" ? "Français" : "中文"}
              </label>
              <textarea
                value={item[`value_${lang}`] || ""}
                onChange={(e) => handleInlineEdit(item.id, `value_${lang}`, e.target.value)}
                rows={item.key.includes("description") || item.key.includes("phrase") ? 3 : 1}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm resize-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
