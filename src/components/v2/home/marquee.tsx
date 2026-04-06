"use client"
import { motion } from "framer-motion"
import { useTheme } from "@/components/switchers/switchers"

const techItems = [
  "React", "Next.js", "TypeScript", "Tailwind", "Node.js",
  "Figma", "PostgreSQL", "Docker", "Python", "PHP",
  "Vite", "Git", "APIs", "CSS", "HTML",
]

const techItems2 = [
  "UI/UX", "Sass", "Bootstrap", "jQuery", "WordPress",
  "Photoshop", "Lightroom", "Styled Components", "REST", "SQL",
]

function MarqueeRow({ items, direction = 1, speed = 30 }: { items: string[]; direction?: number; speed?: number }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const hoverColor = isDark ? "hover:text-cyan-400/70" : "hover:text-blue-600/70"
  const baseColor = isDark ? "text-white/[0.45]" : "text-black/[0.45]"

  return (
    <div className="flex overflow-hidden py-4">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: direction > 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ x: { repeat: Infinity, duration: speed, ease: "linear" } }}
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
  const textMuted = isDark ? "text-white/30" : "text-black/30"
  const textPrimary = isDark ? "text-white" : "text-black"
  const accentColor = isDark ? "text-cyan-400" : "text-blue-600"
  const title = language === "pt" ? "Ferramentas que eu uso" : language === "es" ? "Herramientas que uso" : language === "fr" ? "Outils que j'utilise" : language === "zh" ? "我使用的工具" : "Tools I work with"
  const techStackLabel = language === "pt" ? "Tech Stack" : language === "es" ? "Stack Tecnológico" : language === "fr" ? "Stack Technique" : language === "zh" ? "技术栈" : "Tech Stack"

  return (
    <section className={`py-20 overflow-hidden ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className="px-8 mb-12">
        <p className={`text-xs uppercase tracking-[0.3em] ${textMuted} mb-4`}>{techStackLabel}</p>
        <h2 className={`text-3xl md:text-5xl font-bold tracking-tighter`}>
          {title.split(" ").slice(0, -1).join(" ")} <span className={accentColor}>{title.split(" ").pop()}</span>
        </h2>
      </div>

      <MarqueeRow items={techItems} direction={1} speed={35} />
      <MarqueeRow items={techItems2} direction={-1} speed={40} />
      <MarqueeRow items={techItems} direction={1} speed={30} />
    </section>
  )
}
