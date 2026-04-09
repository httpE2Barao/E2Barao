"use client"
import { createContext, useContext, useState, useEffect } from "react"

interface V2ThemeContextType {
  theme: "dark" | "light"
  toggleTheme: () => void
}

const V2ThemeContext = createContext<V2ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
})

export const useV2Theme = () => useContext(V2ThemeContext)

export function V2ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("v2-theme") as "dark" | "light" | null
      return saved || "light"
    }
    return "light"
  })

  useEffect(() => {
    localStorage.setItem("v2-theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark")
  }

  return (
    <V2ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme === "dark" ? "v2-dark" : "v2-light"}>
        {children}
      </div>
    </V2ThemeContext.Provider>
  )
}
