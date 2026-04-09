"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "@/components/switchers/switchers"
import LanguageSelector from "@/components/header/language"

const navLinks = [
  { label: { pt: "Início", en: "Home", es: "Inicio", fr: "Accueil", zh: "首页" }, href: "/v2.1" },
  { label: { pt: "Projetos", en: "Projects", es: "Proyectos", fr: "Projets", zh: "项目" }, href: "/v2.1/projects" },
  { label: { pt: "Experiências", en: "Experiences", es: "Experiencias", fr: "Expériences", zh: "经验" }, href: "/v2.1/experiences" },
  { label: { pt: "Tecnologias", en: "Techs", es: "Tecnologías", fr: "Technologies", zh: "技术" }, href: "/v2.1/tecs" },
  { label: { pt: "Contatos", en: "Contacts", es: "Contactos", fr: "Contacts", zh: "联系" }, href: "/v2.1/contacts" },
]

export function V2Nav() {
  const { theme, language, toggleTheme, changePage } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const bgClass = theme === "dark" ? "bg-black/80" : "bg-white/80"
  const borderClass = theme === "dark" ? "border-white/10" : "border-black/10"
  const textMuted = theme === "dark" ? "text-white/60" : "text-black/60"
  const textMain = theme === "dark" ? "text-white" : "text-black"
  const hoverText = theme === "dark" ? "hover:text-cyan-400" : "hover:text-blue-600"
  const accentBorder = theme === "dark" ? "border-cyan-400" : "border-blue-600"
  const toggleBg = theme === "dark" ? "bg-white/10" : "bg-black/10"
  const toggleBorder = theme === "dark" ? "border-white/20" : "border-black/20"
  const toggleHover = theme === "dark" ? "hover:border-cyan-400" : "hover:border-blue-600"
  const menuBg = theme === "dark" ? "bg-black/95" : "bg-white/95"
  const menuBorder = theme === "dark" ? "border-white/10" : "border-black/10"
  const menuText = theme === "dark" ? "text-white/80" : "text-black/80"
  const lineColor = theme === "dark" ? "bg-white" : "bg-black"

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? `${bgClass} backdrop-blur-xl border-b ${borderClass}`
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1800px] mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
        {/* Logo — reutiliza V1 logo */}
        <Link href="/v2.1" className="flex-shrink-0">
          <Image
            src={`/images/icon-logo${theme === "dark" ? "-dark-clean" : ""}.png`}
            alt="Logo EB"
            width={80}
            height={80}
            className="w-12 h-12 sm:w-16 sm:h-16 hover:cursor-pointer"
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs uppercase tracking-widest ${textMuted} ${hoverText} transition-colors duration-300 relative group`}
            >
              {(link.label[language as keyof typeof link.label] as string) || link.label.en}
              <span className={`absolute -bottom-1 left-0 w-0 h-px ${theme === "dark" ? "bg-cyan-400" : "bg-blue-600"} group-hover:w-full transition-all duration-300`} />
            </Link>
          ))}
        </div>

        {/* Right side utils */}
        <div className="flex items-center gap-3">
          {/* Language selector V1 */}
          <LanguageSelector />

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-full border ${toggleBorder} ${toggleBg} flex items-center justify-center ${toggleHover} transition-colors`}
          >
            {theme === "dark" ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`w-5 h-px ${lineColor} transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1" : ""}`} />
            <span className={`w-5 h-px ${lineColor} transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-0.5" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={`md:hidden ${menuBg} backdrop-blur-xl border-t ${menuBorder}`}>
          <div className="flex flex-col p-6 gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-xl font-light ${menuText} ${hoverText} transition-colors`}
              >
                {(link.label[language as keyof typeof link.label] as string) || link.label.en}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
