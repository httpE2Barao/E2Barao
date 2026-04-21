"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";

interface AdminThemeContextType {
  theme: "dark" | "light";
  isDark: boolean;
  toggleTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType>({ theme: "dark", isDark: true, toggleTheme: () => {} });

export const useAdminTheme = () => useContext(AdminThemeContext);

export default function AdminV2Layout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("admin-theme") as "dark" | "light" | null;
    setTheme(saved || "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("admin-theme", newTheme);
  };

  const isDark = theme === "dark";
  
  const colors = {
    bg: isDark ? "bg-gray-950" : "bg-gray-100",
    text: isDark ? "text-white" : "text-gray-900",
    headerBg: isDark ? "bg-gray-900/80" : "bg-white/80",
    border: isDark ? "border-gray-800" : "border-gray-200",
    muted: isDark ? "text-gray-400" : "text-gray-600",
  };

  if (!mounted) {
    return <div className="min-h-screen bg-gray-950 text-white" />;
  }

  return (
    <AdminThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      <div className={`min-h-screen ${colors.bg} ${colors.text} transition-colors`}>
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} theme={theme} />

        <div className="lg:ml-64">
          <header className={`sticky top-0 z-30 ${colors.headerBg} backdrop-blur-sm border-b ${colors.border} px-4 py-3 flex items-center gap-4`}>
            <button
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="flex-1" />
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-200 text-gray-700"}`}
              aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
            >
              {isDark ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            <div className="flex items-center gap-3">
              <span className={`text-sm ${colors.muted}`}>Elias Barao</span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isDark ? "bg-cyan-500/20 text-cyan-400" : "bg-blue-500/20 text-blue-600"}`}>
                EB
              </div>
            </div>
          </header>

          <main className="p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminThemeContext.Provider>
  );
}