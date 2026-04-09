"use client"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "@/components/switchers/switchers"
import LanguageSelector from "@/components/header/language"

const navLinks = [
  { href: "/v2.1/projects", pt: "Projetos", en: "Projects", es: "Proyectos", fr: "Projets", zh: "项目" },
  { href: "/v2.1/experiences", pt: "Experiências", en: "Experiences", es: "Experiencias", fr: "Expériences", zh: "经验" },
  { href: "/v2.1/tecs", pt: "Tecnologias", en: "Hard-skills", es: "Habilidades", fr: "Compétences", zh: "技能" },
  { href: "/v2.1/contacts", pt: "Contatos", en: "Contacts", es: "Contactos", fr: "Contacts", zh: "联系" },
]

function NavItem({ href, label, isActive, theme, isMobile }: { href: string; label: string; isActive: boolean; theme: string; isMobile?: boolean }) {
  return (
    <li
      className={`rounded-lg transition-colors ${isActive ? (theme === 'dark' ? 'bg-white' : 'bg-azul-claro') : 'hover:bg-white/10'}`}
    >
      <Link
        href={href}
        className={`w-full flex items-center icon-animation-nav ${isMobile ? 'p-4' : 'px-3 py-2'} rounded-md hover:cursor-pointer
          ${isActive
            ? (theme === 'dark' ? 'text-black' : '')
            : (theme === 'dark' ? 'text-white' : 'text-dark')
          }
          hover:text-black focus:text-black
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-azul-claro`}
      >
        <p className="content-animation-nav">{label}</p>
      </Link>
    </li>
  )
}

export function V2Header() {
  const { theme, language, toggleTheme } = useTheme()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const getLabel = (link: typeof navLinks[0]) => {
    return (link[language as keyof typeof link] as string) || link.en
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-[.23rem] py-1">
      <nav className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/v2.1">
            <Image
              src={`/images/icon-logo${theme === 'dark' ? '-dark' : ''}.png`}
              alt="Logo 'EB'"
              width={100}
              height={100}
              className="hover:cursor-pointer max-sm:w-16 sm:w-20 sm:h-20 md:w-20 md:h-20 lg:w-16 lg:h-16 4k:ml-10"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className={`relative flex flex-row items-center gap-3 max-md:pr-7 md:text-[85%] 2xl:text-xl`}>
            <div className="md:flex hidden font-normal gap-3 lg:text-base xl:gap-3">
              {navLinks.map((link) => (
                <NavItem
                  key={link.href}
                  href={link.href}
                  label={getLabel(link)}
                  isActive={pathname === link.href}
                  theme={theme}
                />
              ))}
            </div>

            {/* Utils: Theme toggle + Language */}
            <span className="flex max-sm:gap-3 gap-5 items-center max-md:pr-8">
              <button
                onClick={toggleTheme}
                aria-label={theme === 'light' ? 'Mudar para tema escuro' : 'Mudar para tema claro'}
                className="p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-azul-claro"
              >
                <Image
                  src={theme === 'light' ? '/images/icon-lua.svg' : '/images/icon-sol.svg'}
                  alt="Ícone de Sol ou Lua para troca de tema"
                  width={30}
                  height={30}
                  className="max-sm:w-8 max-sm:h-8"
                />
              </button>
              <LanguageSelector />
            </span>
          </nav>

          {/* Mobile Menu Button */}
          <div
            className={`bg-[#8FFFFF] absolute top-5 right-7 z-40 p-3 w-fit rounded-2xl shadow-2xl hover:cursor-pointer md:hidden`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Image
              src={'/images/icon-menu.png'}
              alt="Abrir / Fechar menu"
              width={20}
              height={20}
              className={`${menuOpen && 'hidden'} ml-auto`}
            />
            {menuOpen && (
              <div className="nav-menu flex-col gap-10 m-7 flex font-normal gap-5 lg:text-lg xl:gap-5">
                {navLinks.map((link) => (
                  <NavItem
                    key={link.href}
                    href={link.href}
                    label={getLabel(link)}
                    isActive={pathname === link.href}
                    theme={theme}
                    isMobile
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
