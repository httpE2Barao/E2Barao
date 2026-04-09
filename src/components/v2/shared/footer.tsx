"use client"
import { useTheme } from "@/components/switchers/switchers"
import Link from "next/link"

const footerLinks = {
  home: { pt: "Início", en: "Home", es: "Inicio", fr: "Accueil", zh: "首页" },
  projects: { pt: "Projetos", en: "Projects", es: "Proyectos", fr: "Projets", zh: "项目" },
  experiences: { pt: "Experiências", en: "Experiences", es: "Experiencias", fr: "Expériences", zh: "经验" },
  techs: { pt: "Tecnologias", en: "Techs", es: "Tecnologías", fr: "Technologies", zh: "技术" },
  contacts: { pt: "Contatos", en: "Contacts", es: "Contactos", fr: "Contacts", zh: "联系" },
}

const socials = [
  { label: "GitHub", href: "https://github.com/httpE2Barao" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/e2barao/" },
]

export function V2Footer() {
  const { theme, language } = useTheme()
  const isDark = theme === "dark"
  const textMuted = isDark ? "text-white/30" : "text-black/30"
  const textSubtle = isDark ? "text-white/40" : "text-black/40"
  const textLink = isDark ? "text-white/70 hover:text-cyan-400" : "text-black/70 hover:text-blue-600"
  const borderColor = isDark ? "border-white/10" : "border-black/10"
  const accentColor = isDark ? "text-cyan-400" : "text-blue-600"
  const textPrimary = isDark ? "text-white" : "text-black"

  const ctaTitle = language === "pt" ? "Vamos criar" : language === "es" ? "Vamos crear" : language === "fr" ? "Créons" : language === "zh" ? "让我们一起创造" : "Let's build"
  const ctaSub = language === "pt" ? "algo incrível." : language === "es" ? "algo increíble." : language === "fr" ? "quelque chose d'incroyable." : language === "zh" ? "一些不可思议的东西。" : "something great."
  const navLabel = language === "pt" ? "Navegar" : language === "es" ? "Navegar" : language === "fr" ? "Naviguer" : language === "zh" ? "导航" : "Navigate"
  const connectLabel = language === "pt" ? "Conectar" : language === "es" ? "Conectar" : language === "fr" ? "Connecter" : language === "zh" ? "联系" : "Connect"
  const desc = language === "pt" ? "Designer, Desenvolvedor & Engenheiro de Software criando experiências digitais que marcam." : language === "es" ? "Diseñador, Desarrollador e Ingeniero de Software creando experiencias digitales que marcan." : language === "fr" ? "Designer, Développeur & Ingénieur Logiciel créant des expériences numériques marquantes." : language === "zh" ? "设计师、开发者和软件工程师，打造令人难忘的数字体验。" : "Designer, Developer & Software Engineer crafting digital experiences that leave a mark."

  const allRights = language === "pt" ? "Todos os direitos reservados." : language === "es" ? "Todos los derechos reservados." : language === "fr" ? "Tous droits réservés." : language === "zh" ? "版权所有。" : "All rights reserved."
  const designedBuilt = language === "pt" ? "Desenhado & Construído com precisão" : language === "es" ? "Diseñado & Construido con precisión" : language === "fr" ? "Conçu & Réalisé avec précision" : language === "zh" ? "精心设计与构建" : "Designed & Built with precision"

  return (
    <footer className={`relative ${isDark ? "bg-black text-white" : "bg-white text-black"} ${borderColor} border-t`}>
      <div className="max-w-[1800px] mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <h3 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
              {ctaTitle}
              <br />
              {ctaSub.split(" ").slice(0, -1).join(" ")} <span className={accentColor}>{ctaSub.split(" ").pop()}</span>
            </h3>
            <p className={`${textMuted} max-w-md text-lg`}>
              {desc}
            </p>
          </div>

          <div>
            <h4 className={`text-xs uppercase tracking-widest ${textSubtle} mb-6`}>
              {navLabel}
            </h4>
            <div className="flex flex-col gap-3">
              <Link href="/v2.1" className={`${textLink} transition-colors text-lg`}>{footerLinks.home[language as keyof typeof footerLinks.home] || footerLinks.home.en}</Link>
              <Link href="/v2.1/projects" className={`${textLink} transition-colors text-lg`}>{footerLinks.projects[language as keyof typeof footerLinks.projects] || footerLinks.projects.en}</Link>
              <Link href="/v2.1/experiences" className={`${textLink} transition-colors text-lg`}>{footerLinks.experiences[language as keyof typeof footerLinks.experiences] || footerLinks.experiences.en}</Link>
              <Link href="/v2.1/tecs" className={`${textLink} transition-colors text-lg`}>{footerLinks.techs[language as keyof typeof footerLinks.techs] || footerLinks.techs.en}</Link>
              <Link href="/v2.1/contacts" className={`${textLink} transition-colors text-lg`}>{footerLinks.contacts[language as keyof typeof footerLinks.contacts] || footerLinks.contacts.en}</Link>
            </div>
          </div>

          <div>
            <h4 className={`text-xs uppercase tracking-widest ${textSubtle} mb-6`}>
              {connectLabel}
            </h4>
            <div className="flex flex-col gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${textLink} transition-colors text-lg`}
                >
                  {s.label}
                </a>
              ))}
              <a
                href="mailto:e2barao@hotmail.com"
                className={`${textLink} transition-colors text-lg`}
              >
                Email
              </a>
            </div>
          </div>
        </div>

        <div className={`${borderColor} border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4`}>
          <p className={textMuted}>
            © {new Date().getFullYear()} Elias Edson Barão. {allRights}
          </p>
          <p className={textMuted}>
            {designedBuilt}
          </p>
        </div>
      </div>
    </footer>
  )
}
