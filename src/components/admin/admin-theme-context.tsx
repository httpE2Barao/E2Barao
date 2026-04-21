"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AdminThemeContextType {
  theme: "dark" | "light";
  isDark: boolean;
}

const AdminThemeContext = createContext<AdminThemeContextType>({ theme: "dark", isDark: true });

export const useAdminTheme = () => useContext(AdminThemeContext);

export function AdminThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("admin-theme") as "dark" | "light" | null;
    const initial = saved || "light";
    setTheme(initial);
    document.documentElement.classList.add(initial);
    if (initial === "dark") {
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("admin-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [theme, mounted]);

  return (
    <AdminThemeContext.Provider value={{ theme, isDark: theme === "dark" }}>
      {children}
    </AdminThemeContext.Provider>
  );
}

export function getAdminThemeColors(isDark: boolean) {
  return {
    bg: isDark ? "bg-gray-950" : "bg-gray-100",
    bgCard: isDark ? "bg-gray-900" : "bg-white",
    bgInput: isDark ? "bg-gray-800" : "bg-gray-50",
    bgHover: isDark ? "hover:bg-gray-800" : "hover:bg-gray-200",
    border: isDark ? "border-gray-800" : "border-gray-200",
    borderInput: isDark ? "border-gray-700" : "border-gray-300",
    text: isDark ? "text-white" : "text-gray-900",
    textMuted: isDark ? "text-gray-400" : "text-gray-600",
    textSubtle: isDark ? "text-gray-500" : "text-gray-500",
    accent: isDark ? "text-cyan-400" : "text-blue-600",
    accentBg: isDark ? "bg-cyan-500/10" : "bg-blue-500/10",
    accentBorder: isDark ? "border-cyan-500/20" : "border-blue-500/20",
  };
}