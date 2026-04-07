"use client"
import { useRef, useState, useMemo } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import dynamic from "next/dynamic"
import { useTheme } from "@/components/switchers/switchers"
import { techCategories } from "@/data/v2-tecs"
import TechCards from "./tech-cards"

const TechOrbital3D = dynamic(() => import("./orbital-3d"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] sm:h-[500px] flex items-center justify-center">
      <div className={`w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin`} />
    </div>
  )
})

export function V2TecsPage() {
  const ref = useRef<HTMLDivElement>(null)
  const { theme, language } = useTheme()
  const isDark = theme === "dark"
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], [0, -150])

  const accentColor = isDark ? "text-cyan-400" : "text-blue-600"
  const bgGlow = isDark ? "bg-cyan-400/5" : "bg-blue-600/5"
  const textMuted = isDark ? "text-white/30" : "text-black/30"
  const textPrimary = isDark ? "text-white" : "text-black"
  
  const title = language === "pt" ? "Tecnologias" : language === "es" ? "Tecnologías" : language === "fr" ? "Technologies" : language === "zh" ? "技术" : "Technologies"
  const subtitle = language === "pt" ? "Stack & Expertise" : language === "es" ? "Stack y Experiencia" : language === "fr" ? "Stack et Expertise" : language === "zh" ? "技术栈与专业" : "Stack & Expertise"
  const desc = language === "pt" ? "Uma visão completa das ferramentas, linguagens e frameworks que utilizo para construir soluções digitais de alta qualidade." : language === "es" ? "Una visión completa de las herramientas, lenguajes y frameworks que utilizo." : language === "fr" ? "Une vue complète des outils, langages et frameworks que j'utilise." : language === "zh" ? "我使用的工具、语言和框架的完整视图。" : "A complete view of the tools, languages, and frameworks I use to build high-quality digital solutions."

  const categoriesLabel = language === "pt" ? "Categorias" : language === "es" ? "Categorías" : language === "fr" ? "Catégories" : language === "zh" ? "分类" : "Categories"

  const categoryLabels = useMemo(() => {
    return techCategories.map(cat => ({
      id: cat.id,
      name: cat.name[language as keyof typeof cat.name] || cat.name.en,
      icon: cat.icon,
      count: cat.techs.length,
    }))
  }, [language])

  const handleCategoryChange = (categoryId: string | null) => {
    setActiveCategory(categoryId === activeCategory ? null : categoryId)
  }

  return (
    <section ref={ref} className={`min-h-screen pt-[5rem] pb-12 sm:pb-16 ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      <motion.div
        style={{ y: bgY }}
        className={`absolute top-0 right-0 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] ${bgGlow} rounded-full blur-3xl pointer-events-none`}
      />

      <div className="px-6 sm:px-10 lg:px-16 xl:px-24 mb-8 sm:mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <p className={`${accentColor} text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-4 font-mono`}>
            {subtitle}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95]">
            {title}
            <span className={accentColor}>.</span>
          </h1>
          <p className={`${textMuted} text-sm sm:text-base mt-4 max-w-xl leading-relaxed`}>
            {desc}
          </p>
        </motion.div>
      </div>

      <div className="px-6 sm:px-10 lg:px-16 xl:px-24 mb-10 sm:mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <p className={`text-xs uppercase tracking-widest ${textMuted} mb-4`}>{categoriesLabel}</p>
          <div className="flex flex-wrap gap-2">
            <motion.button
              onClick={() => handleCategoryChange(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === null
                  ? isDark 
                    ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/50" 
                    : "bg-blue-500/20 text-blue-600 border border-blue-500/50"
                  : isDark 
                    ? "bg-white/5 text-white/60 border border-white/10 hover:border-white/30" 
                    : "bg-black/5 text-black/60 border border-black/10 hover:border-black/30"
              }`}
            >
              {language === "pt" ? "Todas" : language === "es" ? "Todas" : language === "fr" ? "Toutes" : language === "zh" ? "全部" : "All"}
              <span className="ml-1 opacity-60">
                ({techCategories.reduce((acc, cat) => acc + cat.techs.length, 0)})
              </span>
            </motion.button>
            {categoryLabels.map((cat, i) => (
              <motion.button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? isDark 
                      ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/50" 
                      : "bg-blue-500/20 text-blue-600 border border-blue-500/50"
                    : isDark 
                      ? "bg-white/5 text-white/60 border border-white/10 hover:border-white/30" 
                      : "bg-black/5 text-black/60 border border-black/10 hover:border-black/30"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className="opacity-60">({cat.count})</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <TechOrbital3D 
          activeCategory={activeCategory}
        />
      </div>

      <div className="px-6 sm:px-10 lg:px-16 xl:px-24">
        <TechCards categories={techCategories} />
      </div>
    </section>
  )
}