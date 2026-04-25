"use client";

import { useEffect, useState } from "react";
import { useAdminTheme } from "../layout";

interface Contact {
  id: number;
  label: string;
  value: string;
  icon: string;
  description_pt: string;
  description_en: string;
  visible: boolean;
  display_order: number;
}

export default function ContactPage() {
  const { isDark } = useAdminTheme();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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
    spinner: isDark ? "border-cyan-400" : "border-blue-600",
  };

  const [formData, setFormData] = useState({ label: "", value: "", icon: "", description_pt: "", description_en: "", visible: true, display_order: 0 });

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch("/api/admin/contact");
        const data = await res.json();
        setContacts(Array.isArray(data) ? data : []);
      } catch { setContacts([]); }
      setLoading(false);
    };
    fetchContacts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contact", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing?.id, ...formData }) });
      if (res.ok) { setMessage({ type: "success", text: "Atualizado!" }); setEditing(null); }
    } catch { setMessage({ type: "error", text: "Erro ao salvar" }); }
    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEdit = (contact: Contact) => {
    setEditing(contact);
    setFormData({ label: contact.label, value: contact.value, icon: contact.icon || "", description_pt: contact.description_pt || "", description_en: contact.description_en || "", visible: contact.visible, display_order: contact.display_order });
  };

  const resetForm = () => { setEditing(null); setFormData({ label: "", value: "", icon: "", description_pt: "", description_en: "", visible: true, display_order: 0 }); };

  if (loading && contacts.length === 0) return <div className="flex items-center justify-center h-64"><div className={`w-8 h-8 border-2 ${colors.spinner} border-t-transparent rounded-full animate-spin`} /></div>;

  const accentClass = isDark ? "bg-cyan-500 hover:bg-cyan-400 text-black" : "bg-blue-600 hover:bg-blue-500 text-white";

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl md:text-3xl font-bold ${colors.text}`}>Contato</h1>
        <p className={`${colors.textMuted} mt-1`}>{contacts.length} links</p>
        <a
          href="https://e2-barao.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 mt-3 text-sm ${colors.accent} hover:underline`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          Ver portfólio online →
        </a>
      </div>

      {message && <div className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>{message.text}</div>}

      {editing && (
        <div className={`${colors.card} border ${colors.border} rounded-xl p-6`}>
          <h2 className={`text-lg font-semibold mb-4 ${colors.text}`}>Editar</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={`block text-sm ${colors.textMuted} mb-1`}>Label*</label><input type="text" value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} className={`w-full ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text}`} required /></div>
              <div><label className={`block text-sm ${colors.textMuted} mb-1`}>Valor*</label><input type="text" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} className={`w-full ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text}`} required /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className={`block text-sm ${colors.textMuted} mb-1`}>Icon</label><input type="text" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className={`w-full ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text}`} /></div>
              <div><label className={`block text-sm ${colors.textMuted} mb-1`}>Descrição (PT)</label><input type="text" value={formData.description_pt} onChange={(e) => setFormData({ ...formData, description_pt: e.target.value })} className={`w-full ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text}`} /></div>
              <div><label className={`block text-sm ${colors.textMuted} mb-1`}>Descrição (EN)</label><input type="text" value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} className={`w-full ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text}`} /></div>
            </div>
            <div className="flex items-center gap-4">
              <label className={`flex items-center gap-2 text-sm ${colors.text}`}><input type="checkbox" checked={formData.visible} onChange={(e) => setFormData({ ...formData, visible: e.target.checked })} className={`rounded ${colors.cardBg} ${colors.borderInput} ${colors.accent}`} />Visível</label>
              <div><label className={`block text-xs ${colors.textMuted} mb-1`}>Ordem</label><input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} className={`w-20 ${colors.cardBg} border ${colors.borderInput} rounded-lg px-3 py-2 text-sm ${colors.text}`} /></div>
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" className={`${accentClass} font-semibold px-4 py-2 rounded-lg text-sm transition-colors`}>Salvar</button>
              <button type="button" onClick={resetForm} className={`${colors.textMuted} hover:${colors.text} text-sm`}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {contacts.map((contact) => (
          <div key={contact.id} className={`${colors.card} border ${colors.border} rounded-xl p-5 flex items-center justify-between`}>
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg ${colors.accentBg} flex items-center justify-center ${colors.accent}`}><span className="text-lg font-bold">{contact.label[0]}</span></div>
              <div>
                <h3 className={`font-semibold ${colors.text}`}>{contact.label}</h3>
                <p className={`text-sm ${colors.textMuted} font-mono`}>{contact.value}</p>
                <p className={`text-xs ${colors.textSubtle} mt-0.5`}>{contact.description_pt || contact.description_en}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {contact.visible ? <span className="text-xs text-green-400">Visível</span> : <span className={`text-xs ${colors.textSubtle}`}>Oculto</span>}
              <button onClick={() => handleEdit(contact)} className={`text-xs ${colors.accent} px-2 py-1 rounded ${colors.cardBg}`}>Editar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}