"use client"
import { useTheme } from "@/components/switchers/switchers"
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"

interface ProjectFromAPI {
  id: number;
  src: string;
  site: string;
  repo: string;
  tags: string[];
  name: string;
  alt: string;
  abt: string;
  featured: boolean;
  imageUrls: string[];
}

async function fetchFeaturedProjects(lang: string): Promise<ProjectFromAPI[]> {
  try {
    const res = await fetch(`/api/projects?lang=${lang}`)
    const data = await res.json()
    return data.filter((p: ProjectFromAPI) => p.featured)
  } catch (err) {
    console.error('Erro ao buscar projetos:', err)
    return []
  }
}

function getProjectImage(project: ProjectFromAPI): string {
  if (project.imageUrls && project.imageUrls.length > 0) {
    return project.imageUrls[0]
  }
  return `/images/project_${project.src}.png`
}

function hasGif(project: ProjectFromAPI): boolean {
  const img = getProjectImage(project)
  return img.toLowerCase().endsWith('.gif')
}

function ProjectCard({
  project,
  index,
  total,
  carouselRotation,
  onClick,
}: {
  project: ProjectFromAPI
  index: number
  total: number
  carouselRotation: number
  onClick: () => void
}) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [radius, setRadius] = useState(600)

  useEffect(() => {
    const update = () => setRadius(window.innerWidth < 768 ? 420 : 600)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const angleStep = 360 / total
  const fixedAngle = index * angleStep
  const currentAngle = fixedAngle + carouselRotation

  return (
    <div
      className="absolute cursor-pointer"
      style={{
        left: "50%",
        top: "50%",
        transformStyle: "preserve-3d",
        transform: `translate(-50%, -50%) rotateY(${currentAngle}deg) translateZ(${radius}px)`,
      }}
      onClick={onClick}
    >
      <div
        className={`relative w-[260px] h-[360px] md:w-[340px] md:h-[460px] rounded-2xl overflow-hidden ${isDark ? "shadow-2xl shadow-black/60" : "shadow-2xl shadow-black/20"}`}
        style={{
          transform: `rotateY(${-currentAngle}deg)`,
        }}
      >
        {hasGif(project) ? (
          <img
            src={getProjectImage(project)}
            alt={project.name}
            className="object-cover"
          />
        ) : (
          <Image
            src={getProjectImage(project)}
            alt={project.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 260px, 340px"
          />
        )}

        <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-t from-black/95 via-black/40 to-transparent" : "bg-gradient-to-t from-white/95 via-white/40 to-transparent"}`} />

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className={`text-[10px] font-mono tracking-[0.3em] uppercase mb-2 ${isDark ? "text-cyan-400" : "text-blue-600"}`}>
            {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className={`text-xl md:text-2xl font-bold tracking-tight mb-2 ${isDark ? "text-white" : "text-black"}`}>
            {project.name}
          </h3>
          <p className={`text-xs md:text-sm line-clamp-2 ${isDark ? "text-white/60" : "text-black/60"}`}>
            {project.abt}
          </p>
        </div>

        <div className={`absolute inset-0 border-2 rounded-2xl pointer-events-none ${isDark ? "border-white/10" : "border-black/10"}`} />
      </div>
    </div>
  )
}

function ProjectModal({
  project,
  index,
  onClose,
}: {
  project: ProjectFromAPI
  index: number
  onClose: () => void
}) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEsc)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = ""
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed inset-0 z-[9999] flex items-center justify-center ${isDark ? "bg-black" : "bg-white"}`}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full h-full overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={`fixed top-4 right-4 md:top-6 md:right-6 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${isDark ? "bg-white/10 hover:bg-white/20 text-white" : "bg-black/10 hover:bg-black/20 text-black"}`}
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative w-full h-[50vh] md:h-[65vh]">
          {hasGif(project) ? (
            <img
              src={getProjectImage(project)}
              alt={project.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <Image
              src={getProjectImage(project)}
              alt={project.name}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          )}
          <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-t from-black via-black/40 to-transparent" : "bg-gradient-to-t from-white via-white/40 to-transparent"}`} />
        </div>

        <div className="relative -mt-24 md:-mt-40 px-6 md:px-12 lg:px-20 max-w-5xl mx-auto pb-16">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className={`text-xs font-mono tracking-[0.3em] uppercase mb-3 ${isDark ? "text-cyan-400" : "text-blue-600"}`}>
              {String(index + 1).padStart(2, "0")} / {String(6).padStart(2, "0")}
            </p>

            <h2 className={`text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 ${isDark ? "text-white" : "text-black"}`}>
              {project.name}
              <span className={isDark ? "text-cyan-400" : "text-blue-600"}>.</span>
            </h2>

            <p className={`text-base md:text-lg leading-relaxed max-w-2xl mb-8 ${isDark ? "text-white/70" : "text-black/70"}`}>
              {project.abt}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags?.map((tag) => (
                <span
                  key={tag}
                  className={`px-3 py-1.5 rounded-full text-xs md:text-sm ${isDark ? "bg-white/10 text-white/80 border border-white/10" : "bg-black/5 text-black/80 border border-black/10"}`}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              {project.site && (
                <Link
                  href={project.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${isDark ? "bg-white/10 hover:bg-white/20 text-white" : "bg-black/5 hover:bg-black/10 text-black"}`}
                >
                  <span>Visitar</span>
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
              {project.repo && (
                <Link
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${isDark ? "bg-white/10 hover:bg-white/20 text-white" : "bg-black/5 hover:bg-black/10 text-black"}`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>Source</span>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function V2ProjectsScroll() {
  const { theme, language } = useTheme()
  const isDark = theme === "dark"
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [carouselRotation, setCarouselRotation] = useState(0)
  const [projects, setProjects] = useState<ProjectFromAPI[]>([])

  const lang = language === "pt-BR" ? "pt" : language === "en-US" ? "en" : language
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProjects(lang).then((data) => {
      setProjects(data)
      setLoading(false)
    })
  }, [lang])

  const total = projects.length

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    restDelta: 0.001,
  })

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (v) => {
      setCarouselRotation(v * 360)
    })
    return () => unsubscribe()
  }, [smoothProgress])

  const sectionTitle = language === "pt-BR" ? "Projetos" : language === "es" ? "Proyectos" : language === "fr" ? "Projets" : language === "zh" ? "项目" : "Projects"
  const sectionSubtitle = language === "pt-BR" ? "Clique para explorar" : language === "es" ? "Haz clic para explorar" : language === "fr" ? "Cliquez pour explorer" : language === "zh" ? "点击探索" : "Click to explore"

  const handleSelectProject = useCallback((index: number) => {
    setSelectedProject(index)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null)
  }, [])

  return (
    <>
      <section
        ref={containerRef}
        className={`relative ${isDark ? "bg-black" : "bg-white"}`}
        style={{ height: "600vh" }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="absolute top-8 left-6 md:top-12 md:left-16 z-10">
            <p className={`text-[10px] md:text-xs font-mono tracking-[0.3em] uppercase mb-1 ${isDark ? "text-cyan-400" : "text-blue-600"}`}>
              {sectionTitle}
            </p>
            <p className={`text-xs ${isDark ? "text-white/30" : "text-black/30"}`}>
              {sectionSubtitle}
            </p>
          </div>

          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ perspective: "1200px" }}
          >
            {projects.map((project, index) => (
              <ProjectCard
                key={project.src}
                project={project}
                index={index}
                total={total}
                carouselRotation={carouselRotation}
                onClick={() => handleSelectProject(index)}
              />
            ))}
          </div>

          <motion.div
            className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 ${isDark ? "text-white/20" : "text-black/20"}`}
            style={{
              opacity: useTransform(smoothProgress, [0, 0.05], [1, 0]),
            }}
          >
            <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span className="text-[10px] font-mono tracking-widest">SCROLL</span>
          </motion.div>

          <div className={`absolute bottom-0 left-0 right-0 h-px ${isDark ? "bg-white/5" : "bg-black/5"}`} />
        </div>
      </section>

      <AnimatePresence>
        {selectedProject !== null && (
          <ProjectModal
            project={projects[selectedProject]}
            index={selectedProject}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </>
  )
}
