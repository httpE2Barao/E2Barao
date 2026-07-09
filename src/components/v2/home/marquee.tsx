"use client"
import { motion } from "framer-motion"
import { useTheme } from "@/components/switchers/switchers"
import { useEffect, useState } from "react"

interface Skill {
  id: number
  name: string
  category: string
  level: number
}

const fallbackTech = [
  "React", "Next.js", "TypeScript", "Tailwind", "Node.js",
  "PostgreSQL", "Python", "PHP", "CSS", "HTML",
]

const fallbackTools = [
  "Figma", "Photoshop", "VS Code", "Docker", "GitHub",
  "Notion", "WordPress", "Premiere Pro", "Lightroom", "Adobe XD",
]

const fallbackConcepts = [
  "Clean Code", "Mobile First", "Object Orientation", "UI / UX Design",
  "Accessibility", "Software Architecture", "Agile Development", "SEO",
  "Performance Optimization", "Teamwork",
]

function MarqueeRow({ items, direction = 1, speed }: { items: string[]; direction?: number; speed?: number }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const hoverColor = isDark ? "hover:text-cyan-400/70" : "hover:text-blue-600/70"
  const baseColor = isDark ? "text-white/[0.45]" : "text-black/[0.45]"
  
  const baseSpeed = items.length > 10 ? 50 : items.length > 5 ? 40 : 30
  const actualSpeed = speed || baseSpeed

  return (
    <div className="flex overflow-hidden py-4">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: direction > 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ x: { repeat: Infinity, duration: actualSpeed, ease: "linear" } }}
      >
        {[...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className={`text-4xl md:text-6xl font-bold tracking-tighter ${baseColor} ${hoverColor} transition-colors duration-500 cursor-default select-none`}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export function V2Marquee() {
  const { theme, language } = useTheme()
  const isDark = theme === "dark"
  const [techSkills, setTechSkills] = useState<string[]>(fallbackTech)
  const [toolSkills, setToolSkills] = useState<string[]>(fallbackTools)
  const [conceptSkills, setConceptSkills] = useState<string[]>(fallbackConcepts)

  useEffect(() => {
    fetch("/api/admin/skills")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const techCategories = ["languages", "frameworks", "styling", "database", "state", "auth", "ai"]
          const toolCategories = ["devops", "design", "tools", "testing", "realtime", "dataviz", "integrations"]
          const conceptCategories = ["concepts"]

          const techList = data.filter((s: Skill) => techCategories.includes(s.category)).map((s: Skill) => s.name)
          const toolList = data.filter((s: Skill) => toolCategories.includes(s.category)).map((s: Skill) => s.name)
          const conceptList = data.filter((s: Skill) => conceptCategories.includes(s.category)).map((s: Skill) => s.name)

          if (techList.length > 0) setTechSkills(techList)
          if (toolList.length > 0) setToolSkills(toolList)
          if (conceptList.length > 0) setConceptSkills(conceptList)
        }
      })
      .catch(() => {})
  }, [])

  const textMuted = isDark ? "text-white/30" : "text-black/30"
  const techStackLabel = language === "pt" ? "Stack Tecnológico" : language === "es" ? "Stack Tecnológico" : language === "fr" ? "Stack Technique" : language === "zh" ? "技术栈" : "Tech Stack"

  return (
    <section id="skills" className={`py-20 overflow-hidden ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className="px-8 mb-12">
        <p className={`text-xs uppercase tracking-[0.3em] ${textMuted} mb-4`}>{techStackLabel}</p>
        <h2 className={`text-3xl md:text-5xl font-bold tracking-tighter`}>
          {language === "pt" ? "Tecnologias, Conceitos e Ferramentas" : language === "es" ? "Tecnologías, Conceptos y Herramientas" : language === "fr" ? "Technologies, Concepts et Outils" : language === "zh" ? "技术、概念和工具" : "Technologies, Concepts & Tools"}
        </h2>
      </div>

      <MarqueeRow items={techSkills} direction={1} speed={60} />
      <MarqueeRow items={toolSkills} direction={-1} speed={70} />
      <MarqueeRow items={conceptSkills} direction={1} speed={80} />
    </section>
  )
}
