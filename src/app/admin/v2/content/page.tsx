"use client";

import { useEffect, useState } from "react";
import { useAdminTheme } from "../layout";

interface Content {
  id: number;
  section: string;
  key: string;
  value_pt: string;
  value_en: string;
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
  const { isDark } = useAdminTheme();
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [lang, setLang] = useState<"pt" | "en">("pt");

  const colors = {
    card: isDark ? "bg-gray-900" : "bg-white",
    cardBg: isDark ? "bg-gray-800" : "bg-gray-50",
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

  const fetchContent = async () => {
    try {
      const res = await fetch(`/api/admin/content?section=${activeSection}`);
      setContent(Array.isArray(await res.json()) ? await res.json() : []);
    } catch { setContent([]); }
    setLoading(false);
  };

  useEffect(() => { fetchContent(); }, [activeSection]);

  const handleSave = async (item: Content) => {
    try {
      const res = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
      if (res.ok) setMessage({ type: "success", text: "Atualizado!" });
    } catch { setMessage({ type: "error", text: "Erro ao salvar" }); }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleInlineEdit = (id: number, field: string, value: string) => {
    setContent((prev) => prev.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className={`w-8 h-8 border-2 ${colors.spinner} border-t-transparent rounded-full animate-spin`} /></div>;

  const accentClass = isDark ? "bg-cyan-500 hover:bg-cyan-400 text-black" : "bg-blue-600 hover:bg-blue-500 text-white";

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl md:text-3xl font-bold ${colors.text}`}>Conteúdo</h1>
        <p className={`${colors.textMuted} mt-1`}>Edite textos do portfólio</p>
      </div>

      {message && <div className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>{message.text}</div>}

<div className="flex items-center gap-2 flex-wrap">
        {sections.map((section) => {
          const isActive = activeSection === section.value;
          const bgClass = isActive ? colors.accentBg : colors.card + " " + colors.border;
          const textClass = isActive ? colors.accent : colors.textMuted;
          const borderClass = isActive ? colors.accentBorder : colors.border;
          const hoverClass = isActive ? "" : "hover:" + colors.border;
          return (
          <button key={section.value} onClick={() => setActiveSection(section.value)} className={"px-4 py-2 rounded-lg text-sm font-medium transition-colors " + bgClass + " " + textClass + " " + borderClass + " " + hoverClass}>
            {section.label}
          </button>
        )})}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className={"text-xs " + colors.textSubtle}>Editar em:</span>
        {(["pt", "en"] as const).map((l) => {
          const isActive = lang === l;
          const bgClass = isActive ? colors.accentBg : "";
          const textClass = isActive ? colors.accent : colors.textSubtle;
          const hoverClass = isActive ? "" : "hover:" + colors.text;
          return (
          <button key={l} onClick={() => setLang(l)} className={"px-2 py-1 rounded text-xs font-medium transition-colors " + bgClass + " " + textClass + " " + hoverClass}>{l.toUpperCase()}</button>
        )})}
      </div>

      <div className="space-y-4">
        {content.map((item) => (
          <div key={item.id} className={`${colors.card} border ${colors.border} rounded-xl p-5`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-mono ${colors.accent}`}>{item.key}</span>
              <button onClick={() => handleSave(item)} className={`text-xs ${colors.accentBg} ${colors.accent} px-3 py-1 rounded hover:opacity-80 transition-colors`}>Salvar</button>
            </div>
            <div>
              <label className={`block text-xs ${colors.textSubtle} mb-1`}>{lang === "pt" ? "Português" : "English"}</label>
              <textarea value={item[`value_${lang}`] || ""} onChange={(e) => handleInlineEdit(item.id, `value_${lang}`, e.target.value)} rows={item.key.includes("description") || item.key.includes("phrase") ? 3 : 1} className={`w-full ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text} resize-none`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}