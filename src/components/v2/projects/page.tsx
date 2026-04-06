"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useTheme } from "@/components/switchers/switchers"
import { rawProjectsData, featuredProjectsList } from "@/data/projects-data"

function ProjectCard({ project, index }: { project: typeof rawProjectsData[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const { theme, language } = useTheme()
  const isDark = theme === "dark"

  const name = language === "pt" ? project.name.ptBR : project.name.enUS
  const abt = language === "pt" ? project.abt.ptBR : project.abt.enUS

  const accentColor = isDark ? "text-cyan-400" : "text-blue-600"
  const textMuted = isDark ? "text-white/60" : "text-black/60"
  const borderLight = isDark ? "border-white/10" : "border-black/10"
  const bgCard = isDark ? "bg-white/5" : "bg-black/5"
  const hoverBorder = isDark ? "hover:border-cyan-400/30" : "hover:border-blue-600/30"
  const btnBg = isDark ? "bg-cyan-400 text-black hover:bg-cyan-300" : "bg-blue-600 text-white hover:bg-blue-500"
  const btnOutline = isDark ? "border-white/20 text-white hover:border-cyan-400 hover:text-cyan-400" : "border-black/20 text-black hover:border-blue-600 hover:text-blue-600"
  const overlayBg = isDark ? "bg-black/90" : "bg-white/90"
  const modalBg = isDark ? "bg-neutral-900 border-white/10" : "bg-neutral-50 border-black/10"
  const tagBgExpanded = isDark ? "bg-cyan-400/10 text-cyan-400" : "bg-blue-600/10 text-blue-600"

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.6 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsExpanded(true)}
        className="relative group cursor-pointer"
        whileHover={{ y: -8 }}
      >
        <div className={`relative aspect-[16/10] overflow-hidden rounded-2xl ${bgCard} border ${borderLight}`}>
          <Image
            src={`/images/project_${project.src}.png`}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8"
          >
            <p className={`${accentColor} text-xs uppercase tracking-wider mb-2 font-mono`}>
              {project.tags?.slice(0, 4).join(" · ")}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">{name}</h3>
            <p className="text-white/60 text-sm line-clamp-2">{abt}</p>
          </motion.div>

          <div className={`absolute top-4 right-4 w-9 h-9 rounded-full ${bgCard} backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </div>
        </div>

        <div className="mt-4 px-1">
          <h3 className={`text-base font-semibold tracking-tight transition-colors ${isDark ? "text-white" : "text-black"}`}>
            {name}
          </h3>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 ${overlayBg} backdrop-blur-xl`}
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto ${modalBg} border rounded-3xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsExpanded(false)}
                className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full ${bgCard} backdrop-blur-sm flex items-center justify-center ${hoverBorder} transition-colors`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isDark ? "white" : "black"} strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="relative aspect-[16/9]">
                <Image
                  src={`/images/project_${project.src}.png`}
                  alt={name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6 sm:p-8">
                <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight mb-4 ${isDark ? "text-white" : "text-black"}`}>{name}</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags?.map((tag) => (
                    <span key={tag} className={`text-xs ${tagBgExpanded} px-3 py-1 rounded-full`}>
                      {tag}
                    </span>
                  ))}
                </div>
                <p className={`${textMuted} leading-relaxed text-base mb-8`}>{abt}</p>

                <div className="flex gap-3">
                  {project.site && (
                    <a
                      href={project.site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-6 py-2.5 ${btnBg} font-semibold rounded-full transition-colors text-sm`}
                    >
                      {language === "pt" ? "Ver Projeto" : language === "es" ? "Ver Proyecto" : language === "fr" ? "Voir le Projet" : language === "zh" ? "查看项目" : "View Project"}
                    </a>
                  )}
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-6 py-2.5 border ${btnOutline} rounded-full transition-colors text-sm`}
                    >
                      {language === "pt" ? "Código Fonte" : language === "es" ? "Código Fuente" : language === "fr" ? "Code Source" : language === "zh" ? "源代码" : "Source Code"}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function V2ProjectsPage() {
  const { theme, language } = useTheme()
  const isDark = theme === "dark"
  const featuredProjects = featuredProjectsList(language)
  const allProjects = rawProjectsData

  const accentColor = isDark ? "text-cyan-400" : "text-blue-600"
  const textMuted = isDark ? "text-white/40" : "text-black/40"

  const title = language === "pt" ? "Projetos" : language === "es" ? "Proyectos" : language === "fr" ? "Projets" : language === "zh" ? "项目" : "Projects"
  const subtitle = language === "pt" ? "Trabalhos Selecionados" : language === "es" ? "Trabajos Seleccionados" : language === "fr" ? "Travaux Sélectionnés" : language === "zh" ? "精选作品" : "Selected Work"
  const desc = language === "pt" ? "Uma coleção curada de projetos que mostram minhas habilidades em design e desenvolvimento." : language === "es" ? "Una colección curada de proyectos que muestran mis habilidades en diseño y desarrollo." : language === "fr" ? "Une collection de projets montrant mes compétences en design et développement." : language === "zh" ? "展示我在设计和开发方面技能的精选项目集合。" : "A curated collection of projects showcasing my skills in design and development."
  const projectsLabel = language === "pt" ? "Projetos" : language === "es" ? "Proyectos" : language === "fr" ? "Projets" : language === "zh" ? "项目" : "Projects"
  const techLabel = language === "pt" ? "Tecnologias" : language === "es" ? "Tecnologías" : language === "fr" ? "Technologies" : language === "zh" ? "技术" : "Technologies"
  const yearsLabel = language === "pt" ? "Anos" : language === "es" ? "Años" : language === "fr" ? "Années" : language === "zh" ? "年" : "Years"

  const allUniqueTags = [...new Set(allProjects.flatMap(p => p.tags || []))]

  return (
    <section className={`min-h-screen pt-[5rem] pb-16 sm:pb-24 ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className="px-6 sm:px-10 lg:px-16 xl:px-24 mb-12 sm:mb-16">
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
        <div className="grid grid-cols-3 gap-6 sm:gap-10 max-w-lg">
          {[
            { number: allProjects.length.toString(), label: projectsLabel },
            { number: allUniqueTags.length.toString(), label: techLabel },
            { number: "3+", label: yearsLabel },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${accentColor}`}>{stat.number}</p>
              <p className={`${textMuted} text-[10px] sm:text-xs uppercase tracking-wider mt-1`}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="px-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          {featuredProjects.map((project, i) => {
            const rawProject = rawProjectsData.find(p => p.src === project.src)
            return rawProject ? <ProjectCard key={project.src} project={rawProject} index={i} /> : null
          })}
        </div>
      </div>
    </section>
  )
}
