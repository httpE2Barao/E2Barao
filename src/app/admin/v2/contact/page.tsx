"use client";

import { useEffect, useState } from "react";

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
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    label: "",
    value: "",
    icon: "",
    description_pt: "",
    description_en: "",
    visible: true,
    display_order: 0,
  });

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/admin/contact");
      const data = await res.json();
      setContacts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing?.id, ...formData }),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Contato atualizado!" });
        setEditing(null);
        fetchContacts();
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

  const handleEdit = (contact: Contact) => {
    setEditing(contact);
    setFormData({
      label: contact.label,
      value: contact.value,
      icon: contact.icon || "",
      description_pt: contact.description_pt || "",
      description_en: contact.description_en || "",
      visible: contact.visible,
      display_order: contact.display_order,
    });
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({ label: "", value: "", icon: "", description_pt: "", description_en: "", visible: true, display_order: 0 });
  };

  if (loading && contacts.length === 0) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Contato</h1>
        <p className="text-gray-400 mt-1">{contacts.length} links de contato</p>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>{message.text}</div>
      )}

      {editing && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Editar Contato</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Label*</label>
                <input type="text" value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Valor (URL ou texto)*</label>
                <input type="text" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Icon</label>
                <input type="text" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" placeholder="linkedin" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Descrição (PT)</label>
                <input type="text" value={formData.description_pt} onChange={(e) => setFormData({ ...formData, description_pt: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Descrição (EN)</label>
                <input type="text" value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={formData.visible} onChange={(e) => setFormData({ ...formData, visible: e.target.checked })} className="rounded bg-gray-800 border-gray-700 text-cyan-500" />
                Visível
              </label>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Ordem</label>
                <input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} className="w-20 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors">Salvar</button>
              <button type="button" onClick={resetForm} className="text-gray-400 hover:text-white text-sm">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {contacts.map((contact) => (
          <div key={contact.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <span className="text-lg font-bold">{contact.label[0]}</span>
              </div>
              <div>
                <h3 className="font-semibold">{contact.label}</h3>
                <p className="text-sm text-gray-400 font-mono">{contact.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{contact.description_pt || contact.description_en}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {contact.visible ? (
                <span className="text-xs text-green-400">Visível</span>
              ) : (
                <span className="text-xs text-gray-500">Oculto</span>
              )}
              <button onClick={() => handleEdit(contact)} className="text-xs text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded hover:bg-gray-800">Editar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
