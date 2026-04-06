"use client"
import { useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useTheme } from "@/components/switchers/switchers"

const tecsSrc = [
  "img-html.png", "img-css.png", "img-javascript.png", "img-typescript.png",
  "img-tailwind.png", "img-sass.png", "img-bootstrap.png", "img-react.png",
  "img-nextjs.png", "img-api.png", "img-nodejs.png", "img-jquery.png",
  "img-github.png", "img-figma.png", "img-uiux.png", "img-styledcomponents.png",
  "img-visualcode.png", "img-photoshop.png", "img-lightroom.png",
  "img-microsoft365.png", "img-docker.png", "img-wordpress.png",
  "img-python.png", "img-php.png", "img-vite.png",
]

const concepts: { pt: string; en: string; es: string; fr: string; zh: string }[] = [
  { pt: "Aprendizado Contínuo", en: "Continuous Learning", es: "Aprendizaje Continuo", fr: "Apprentissage Continu", zh: "持续学习" },
  { pt: "Pensamento Analítico", en: "Analytical Thinking", es: "Pensamiento Analítico", fr: "Pensée Analytique", zh: "分析思维" },
  { pt: "Versionamento de Código", en: "Code Versioning", es: "Versionado de Código", fr: "Gestion de Versions", zh: "代码版本管理" },
  { pt: "Orientação a Objetos", en: "Object Orientation", es: "Orientación a Objetos", fr: "Orientation Objet", zh: "面向对象" },
  { pt: "Mobile First", en: "Mobile First", es: "Mobile First", fr: "Mobile First", zh: "移动优先" },
  { pt: "Código Limpo", en: "Clean Code", es: "Código Limpio", fr: "Code Propre", zh: "干净的代码" },
  { pt: "Acessibilidade", en: "Accessibility", es: "Accesibilidad", fr: "Accessibilité", zh: "无障碍" },
  { pt: "Arquitetura de Software", en: "Software Architecture", es: "Arquitectura de Software", fr: "Architecture Logicielle", zh: "软件架构" },
  { pt: "Arquitetura de Informação", en: "Information Architecture", es: "Arquitectura de Información", fr: "Architecture de l'Information", zh: "信息架构" },
  { pt: "Programação Funcional", en: "Functional Programming", es: "Programación Funcional", fr: "Programmation Fonctionnelle", zh: "函数式编程" },
  { pt: "UI / UX", en: "UI / UX", es: "UI / UX", fr: "UI / UX", zh: "UI / UX" },
  { pt: "Gerenciamento de Estado", en: "State Management", es: "Gestión de Estado", fr: "Gestion d'État", zh: "状态管理" },
  { pt: "Renderização no Servidor", en: "Server Side Render", es: "Renderizado del Lado del Servidor", fr: "Rendu Côté Serveur", zh: "服务端渲染" },
  { pt: "Banco de Dados Relacional", en: "Relational Database", es: "Base de Datos Relacional", fr: "Base de Données Relationnelle", zh: "关系型数据库" },
  { pt: "Segurança da Informação", en: "Information Security", es: "Seguridad de la Información", fr: "Sécurité de l'Information", zh: "信息安全" },
  { pt: "Trabalho em Equipe", en: "Teamwork", es: "Trabajo en Equipo", fr: "Travail d'Équipe", zh: "团队合作" },
  { pt: "Autogestão", en: "Self-Management", es: "Autogestión", fr: "Autogestion", zh: "自我管理" },
  { pt: "Desenvolvimento Ágil", en: "Agile Development", es: "Desarrollo Ágil", fr: "Développement Agile", zh: "敏捷开发" },
]

const programs = [
  "VS Code", "Git", "GitHub", "NPM", "Yarn", "Figma", "Sony Vegas",
  "Microsoft 365", "Premiere Pro", "Cisco Packet Tracer", "Adobe Lightroom",
  "PostgreSQL", "PgAdmin4", "Docker", "Notion", "Photoshop", "Wordpress",
  "Adobe XD", "Adobe Dreamweaver", "Adobe Dimension 3D",
]

const skillLevels: { skill: { pt: string; en: string; es: string; fr: string; zh: string }; level: number; color: string }[] = [
  { skill: { pt: "Desenvolvimento Front-End", en: "Front-End Development", es: "Desarrollo Front-End", fr: "Développement Front-End", zh: "前端开发" }, level: 92, color: "from-cyan-400 to-blue-500" },
  { skill: { pt: "Design UI/UX", en: "UI/UX Design", es: "Diseño UI/UX", fr: "Design UI/UX", zh: "UI/UX设计" }, level: 85, color: "from-purple-400 to-pink-500" },
  { skill: { pt: "Desenvolvimento Back-End", en: "Back-End Development", es: "Desarrollo Back-End", fr: "Développement Back-End", zh: "后端开发" }, level: 78, color: "from-green-400 to-emerald-500" },
  { skill: { pt: "Gerenciamento de Banco de Dados", en: "Database Management", es: "Gestión de Bases de Datos", fr: "Gestion de Bases de Données", zh: "数据库管理" }, level: 72, color: "from-yellow-400 to-orange-500" },
  { skill: { pt: "DevOps & Ferramentas", en: "DevOps & Tools", es: "DevOps y Herramientas", fr: "DevOps & Outils", zh: "DevOps与工具" }, level: 68, color: "from-red-400 to-rose-500" },
  { skill: { pt: "Design Gráfico", en: "Graphic Design", es: "Diseño Gráfico", fr: "Design Graphique", zh: "平面设计" }, level: 80, color: "from-indigo-400 to-violet-500" },
]

function OrbitalTech() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState(0)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div ref={containerRef} className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 mx-auto">
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${isDark ? "bg-gradient-to-br from-cyan-400 to-blue-500" : "bg-gradient-to-br from-blue-600 to-blue-800"} flex items-center justify-center ${isDark ? "text-black" : "text-white"} font-bold text-lg`}>
          EB
        </div>
      </div>

      {[0, 1, 2].map((ring) => (
        <div
          key={ring}
          className={`absolute inset-0 border ${isDark ? "border-white/10" : "border-black/10"} rounded-full`}
          style={{
            transform: `scale(${0.4 + ring * 0.3}) rotate(${rotation * (ring % 2 === 0 ? 1 : -1)}deg)`,
            transition: "transform 0.1s linear",
          }}
        />
      ))}

      {tecsSrc.slice(0, 12).map((src, i) => {
        const angle = (i / 12) * Math.PI * 2
        const radius = 100 + (i % 3) * 40
        const x = Math.cos(angle + rotation * 0.01 * (i % 2 === 0 ? 1 : -1)) * radius
        const y = Math.sin(angle + rotation * 0.01 * (i % 2 === 0 ? 1 : -1)) * radius

        return (
          <motion.div
            key={src}
            className={`absolute w-9 h-9 sm:w-10 sm:h-10 ${isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"} border rounded-lg flex items-center justify-center hover:border-cyan-400/50 transition-colors cursor-pointer`}
            style={{
              left: `calc(50% + ${x}px - 18px)`,
              top: `calc(50% + ${y}px - 18px)`,
            }}
            whileHover={{ scale: 1.2 }}
          >
            <Image
              src={`/images/${src}`}
              alt={src.replace("img-", "").replace(".png", "")}
              width={20}
              height={20}
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
            />
          </motion.div>
        )
      })}
    </div>
  )
}

function SkillBar({ skill, level, color, index, language }: { skill: { pt: string; en: string; es: string; fr: string; zh: string }; level: number; color: string; index: number; language: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  })
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const width = useTransform(scrollYProgress, [0, 1], [0, level])
  const textPrimary = isDark ? "text-white/80" : "text-black/80"
  const textMuted = isDark ? "text-white/40" : "text-black/40"
  const bgBar = isDark ? "bg-white/5" : "bg-black/5"

  const skillLabel = skill[language as keyof typeof skill] || skill.en

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="mb-4"
    >
      <div className="flex justify-between mb-1.5">
        <span className={`text-xs sm:text-sm font-medium ${textPrimary}`}>{skillLabel}</span>
        <span className={`text-xs sm:text-sm ${textMuted} font-mono`}>{level}%</span>
      </div>
      <div className={`h-1.5 sm:h-2 ${bgBar} rounded-full overflow-hidden`}>
        <motion.div
          style={{ width: `${width}%` }}
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
        />
      </div>
    </motion.div>
  )
}

export function V2TecsPage() {
  const { theme, language } = useTheme()
  const isDark = theme === "dark"

  const accentColor = isDark ? "text-cyan-400" : "text-blue-600"
  const textSubtle = isDark ? "text-white/20" : "text-black/20"
  const textMuted = isDark ? "text-white/30" : "text-black/30"
  const textPrimary = isDark ? "text-white" : "text-black"
  const bgCard = isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
  const hoverBorder = isDark ? "hover:border-cyan-400/30" : "hover:border-blue-600/30"
  const hoverText = isDark ? "hover:text-cyan-400" : "hover:text-blue-600"
  const tagBg = isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
  const tagText = isDark ? "text-white/70" : "text-black/70"
  const tagHoverBorder = isDark ? "hover:border-cyan-400/50" : "hover:border-blue-600/50"

  const title = language === "pt" ? "Tecnologias" : language === "es" ? "Tecnologías" : language === "fr" ? "Technologies" : language === "zh" ? "技术" : "Technologies"
  const proficiency = language === "pt" ? "Proficiência" : language === "es" ? "Competencia" : language === "fr" ? "Compétence" : language === "zh" ? "熟练度" : "Proficiency"
  const conceptsLabel = language === "pt" ? "Conceitos" : language === "es" ? "Conceptos" : language === "fr" ? "Concepts" : language === "zh" ? "概念" : "Concepts"
  const programsLabel = language === "pt" ? "Programas" : language === "es" ? "Programas" : language === "fr" ? "Programmes" : language === "zh" ? "程序" : "Programs"
  const subtitle = language === "pt" ? "Skills & Tools" : language === "es" ? "Habilidades y Herramientas" : language === "fr" ? "Compétences et Outils" : language === "zh" ? "技能与工具" : "Skills & Tools"
  const desc = language === "pt" ? "As ferramentas, frameworks e conceitos que uso para construir produtos digitais." : language === "es" ? "Las herramientas, frameworks y conceptos que uso para construir productos digitales." : language === "fr" ? "Les outils, frameworks et concepts que j'utilise pour créer des produits numériques." : language === "zh" ? "我用来构建数字产品的工具、框架和概念。" : "The tools, frameworks, and concepts I use to build digital products."

  return (
    <section className={`min-h-screen pt-[5rem] pb-12 sm:pb-16 ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className="px-6 sm:px-10 lg:px-16 xl:px-24 mb-10 sm:mb-14">
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

      <div className="px-6 sm:px-10 lg:px-16 xl:px-24 mb-12 sm:mb-16">
        <OrbitalTech />
      </div>

      <div className="px-6 sm:px-10 lg:px-16 xl:px-24 mb-12 sm:mb-16">
        <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight mb-8`}>
          {proficiency}<span className={accentColor}>.</span>
        </h2>
        <div className="max-w-3xl">
          {skillLevels.map((s, i) => (
            <SkillBar key={s.skill.en} skill={s.skill} level={s.level} color={s.color} index={i} language={language} />
          ))}
        </div>
      </div>

      <div className="px-6 sm:px-10 lg:px-16 xl:px-24 mb-12 sm:mb-16">
        <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight mb-8`}>
          {conceptsLabel}<span className={accentColor}>.</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {concepts.map((concept, i) => {
            const label = concept[language as keyof typeof concept] || concept.en
            return (
              <motion.span
                key={concept.en + i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 ${tagBg} border rounded-full text-xs ${tagText} ${tagHoverBorder} ${hoverText} transition-colors cursor-default`}
              >
                {label}
              </motion.span>
            )
          })}
        </div>
      </div>

      <div className="px-6 sm:px-10 lg:px-16 xl:px-24 pb-12 sm:pb-16">
        <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight mb-8`}>
          {programsLabel}<span className={accentColor}>.</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {programs.map((prog, i) => (
            <motion.div
              key={prog}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.02 }}
              whileHover={{ y: -3 }}
              className={`${bgCard} ${hoverBorder} border rounded-lg p-3 text-center hover:bg-white/10 transition-colors cursor-default`}
            >
              <p className={`text-xs ${textMuted}`}>{prog}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
