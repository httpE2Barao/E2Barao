"use client"
import { memo } from "react"
import Link from "next/link"
import { useTheme } from "@/components/switchers/switchers"
import { techCategories } from "@/data/v2-tecs"

const categoryGroups = {
  tech: new Set(["languages", "frameworks", "databases", "state", "ui-components", "auth", "realtime", "payments", "delivery", "media", "data-viz", "i18n", "storage", "cloud"]),
  tools: new Set(["libraries", "tools"]),
  concepts: new Set(["ai-ml", "testing", "apis"]),
}

const MAX_ITEMS = 14

const techNames = {
  tech: techCategories.filter(c => categoryGroups.tech.has(c.id)).flatMap(c => c.techs.map(t => t.name)).slice(0, MAX_ITEMS),
  tools: techCategories.filter(c => categoryGroups.tools.has(c.id)).flatMap(c => c.techs.map(t => t.name)).slice(0, MAX_ITEMS),
  concepts: techCategories.filter(c => categoryGroups.concepts.has(c.id)).flatMap(c => c.techs.map(t => t.name)).slice(0, MAX_ITEMS),
}

const MarqueeRow = memo(function MarqueeRow({ items, direction = 1, speed = 60 }: { items: string[]; direction?: number; speed?: number }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const animClass = direction > 0 ? "animate-marquee-right" : "animate-marquee-left"

  return (
    <div className="flex overflow-hidden py-4">
      <div
        className={`flex gap-8 whitespace-nowrap will-change-transform ${animClass}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="text-4xl md:text-6xl font-bold tracking-tighter cursor-default select-none shrink-0"
            style={{ color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)" }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
})

export function V2Marquee() {
  const { theme, language } = useTheme()
  const isDark = theme === "dark"
  const textMuted = isDark ? "text-white/30" : "text-black/30"
  const techStackLabel = language === "pt" ? "Stack Tecnológico" : language === "es" ? "Stack Tecnológico" : language === "fr" ? "Stack Technique" : language === "zh" ? "技术栈" : "Tech Stack"

  return (
    <Link href="/tecs" className="block cursor-pointer">
      <section id="skills" className={`py-20 overflow-hidden ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
        <div className="px-8 mb-12">
          <p className={`text-xs uppercase tracking-[0.3em] ${textMuted} mb-4`}>{techStackLabel}</p>
          <h2 className={`text-3xl md:text-5xl font-bold tracking-tighter`}>
            {language === "pt" ? "Tecnologias, Conceitos e Ferramentas" : language === "es" ? "Tecnologías, Conceptos y Herramientas" : language === "fr" ? "Technologies, Concepts et Outils" : language === "zh" ? "技术、概念和工具" : "Technologies, Concepts & Tools"}
          </h2>
        </div>

        <MarqueeRow items={techNames.tech} direction={1} speed={25} />
        <MarqueeRow items={techNames.tools} direction={-1} speed={30} />
        <MarqueeRow items={techNames.concepts} direction={1} speed={35} />
      </section>
    </Link>
  )
}
