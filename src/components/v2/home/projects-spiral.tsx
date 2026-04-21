"use client"
import { useTheme } from "@/components/switchers/switchers"
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

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
    return data.filter((p: ProjectFromAPI) => p.featured).map((p: any) => ({
      ...p,
      imageUrls: typeof p.imageUrls === 'string' ? JSON.parse(p.imageUrls || '[]') : (p.imageUrls || [])
    }))
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

function SpiralProjectCard({
  project,
  index,
  total,
  rotation,
  onClick,
  radius,
  verticalGap,
  cardW,
  cardH,
}: {
  project: ProjectFromAPI
  index: number
  total: number
  rotation: number
  onClick: () => void
  radius: number
  verticalGap: number
  cardW: number
  cardH: number
}) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // layout-based values are provided via props for responsive behavior
  
  const anglePerCard = 360 / total
  const baseAngle = index * anglePerCard
  const currentAngle = baseAngle + rotation

  const rad = (currentAngle * Math.PI) / 180
  const x = Math.sin(rad) * radius
  const z = Math.cos(rad) * radius
  const y = index * verticalGap

  const normalizedAngle = ((currentAngle % 360) + 360) % 360
  const distFromCenter = Math.min(normalizedAngle, 360 - normalizedAngle)
  const isFront = distFromCenter < 45

  const opacity = isFront ? 1 : distFromCenter < 90 ? 0.5 : distFromCenter < 150 ? 0.15 : 0.03
  const scale = isFront ? 1 : distFromCenter < 90 ? 0.9 : distFromCenter < 150 ? 0.8 : 0.7

  // card dimensions come from props

  return (
    <div
      className="absolute cursor-pointer group"
      style={{
          left: "50%",
          top: "50%",
          width: 0,
          height: 0,
          transformStyle: "preserve-3d",
          transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px)`,
        opacity,
        scale,
        zIndex: Math.round(z + radius + 1000),
        transition: "opacity 0.25s ease, scale 0.25s ease",
        willChange: "transform, opacity",
        pointerEvents: isFront ? "auto" : "none",
      }}
      onClick={onClick}
    >
      {/* Image layer */}
      <div
        className="absolute"
        style={{
          width: cardW,
          height: cardH,
          marginLeft: -cardW / 2,
          marginTop: -cardH / 2,
          transform: `rotateY(${-currentAngle}deg)`,
          willChange: "transform",
        }}
      >
        <div
          className={`absolute inset-0 rounded-xl overflow-hidden ${isDark ? "shadow-2xl shadow-black/70" : "shadow-2xl shadow-black/20"}`}
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
              sizes="(max-width: 768px) 320px, 480px"
              quality={90}
            />
          )}
          <div className={`absolute inset-0 transition-opacity duration-300 ${isDark ? "bg-black/30 group-hover:bg-black/60" : "bg-white/20 group-hover:bg-black/50"}`} />
        </div>
      </div>

      {/* Text layer - centered overlay in front of the image */}
      <div
        className="absolute"
        style={{
          width: cardW,
          height: cardH,
          left: "50%",
          top: "50%",
          transformStyle: "preserve-3d",
          transform: `translate(-50%, -50%) rotateY(${-currentAngle}deg) translateZ(-100px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          textAlign: "center",
          padding: 10,
          margin: 0,
          zIndex: 50,
          pointerEvents: "none",
        }}
      >
        <div style={{ width: "100%" }}>
          <h3
            className="text-lg font-bold tracking-tight text-white"
            style={{
              textShadow: "0 2px 12px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,1)",
            }}
          >
            {project.name}
          </h3>

          <div
            className="mt-1"
            style={{ transform: "translateZ(50px)" }}
          >
            <p className={`text-[10px] font-mono tracking-[0.3em] uppercase mb-1 ${isDark ? "text-cyan-400" : "text-blue-400"}`}>
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>
            <p
              className={`text-[11px] line-clamp-2 ${isDark ? "text-white/80" : "text-white/90"}`}
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}
            >
              {project.abt}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectModal({
  project,
  index,
  total,
  onClose,
}: {
  project: ProjectFromAPI
  index: number
  total: number
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
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 40 }}
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

        <div className="relative w-full h-[50vh] md:h-[60vh]">
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
              quality={95}
            />
          )}
          <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-t from-black via-black/40 to-transparent" : "bg-gradient-to-t from-white via-white/40 to-transparent"}`} />
        </div>

        <div className="relative -mt-20 md:-mt-32 px-6 md:px-12 lg:px-20 max-w-5xl mx-auto pb-16">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className={`text-xs font-mono tracking-[0.3em] uppercase mb-3 ${isDark ? "text-cyan-400" : "text-blue-600"}`}>
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
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
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
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

export function V2ProjectsSpiral() {
  const { theme, language } = useTheme()
  const isDark = theme === "dark"
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [rotation, setRotation] = useState(0)
  const [cameraY, setCameraY] = useState(0)
  const [cameraYMax, setCameraYMax] = useState<number>(0)
  const [progress, setProgress] = useState(0)
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
 
  // Responsive layout state
  const [layout, setLayout] = useState({ radius: 520, verticalGap: 260, cardW: 560, cardH: 320, cameraBottomPadding: 120 })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    restDelta: 0.001,
  })

  // Compute responsive layout and camera travel so last item isn't cut off by viewport
  useEffect(() => {
    const computeLayout = (width: number) => {
      if (width <= 480) {
        return { radius: 360, verticalGap: 180, cardW: 320, cardH: 190, cameraBottomPadding: 90 }
      } else if (width <= 640) {
        return { radius: 420, verticalGap: 210, cardW: 420, cardH: 230, cameraBottomPadding: 100 }
      } else if (width <= 1024) {
        return { radius: 480, verticalGap: 240, cardW: 520, cardH: 290, cameraBottomPadding: 110 }
      } else {
        return { radius: 520, verticalGap: 260, cardW: 560, cardH: 320, cameraBottomPadding: 120 }
      }
    }
    const update = () => {
      const width = typeof window !== 'undefined' ? window.innerWidth : 1200
      const l = computeLayout(width)
      setLayout(l)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  // Derived values from layout
  const verticalGap = layout.verticalGap
  const cardW = layout.cardW
  const cardH = layout.cardH
  const cameraBottomPadding = layout.cameraBottomPadding
  const radiusAll = layout.radius
  const totalHeight = (projects.length - 1) * verticalGap

  useEffect(() => {
    const updateCameraBounds = () => {
      const max = totalHeight + cameraBottomPadding
      setCameraYMax(Math.max(0, max))
    }
    updateCameraBounds()
    window.addEventListener("resize", updateCameraBounds)
    return () => window.removeEventListener("resize", updateCameraBounds)
  }, [totalHeight, total, verticalGap, cameraBottomPadding])

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (v) => {
      const projectCount = projects.length
      const travelHeight = totalHeight + cameraBottomPadding
      const padding = totalHeight * 0.4
      const targetY = padding + v * (travelHeight - padding * 2)
      setCameraY(targetY)
      setProgress(v)
      if (projectCount > 1) {
        setRotation(-v * (projectCount - 1) * (360 / projectCount))
      }
    })
    return () => unsubscribe()
  }, [smoothProgress, cameraBottomPadding, projects])

  const sectionTitle = language === "pt-BR" ? "Projetos" : language === "es" ? "Proyectos" : language === "fr" ? "Projets" : language === "zh" ? "项目" : "Projects"
  const sectionSubtitle = language === "pt-BR" ? "Clique para explorar" : language === "es" ? "Haz clic para explorar" : language === "fr" ? "Cliquez pour explorer" : language === "zh" ? "点击探索" : "Click to explore"

  const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.05], [1, 0])
  const scrollIndicatorStyle = useMemo(() => ({ opacity: scrollIndicatorOpacity }), [scrollIndicatorOpacity])

  const handleSelectProject = useCallback((index: number) => {
    setSelectedProject(index)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null)
  }, [])

  const currentProjectIndex = Math.min(Math.floor(progress * total), total - 1)

  const sectionHeight = useMemo(() => {
    if (total <= 1) return "100vh"
    const minScrollPerProject = 150
    const calculatedHeight = total * minScrollPerProject
    return `${calculatedHeight}vh`
  }, [total])

  if (loading || projects.length === 0) {
    return (
      <section className={`relative ${isDark ? "bg-black" : "bg-white"}`} style={{ height: "100vh" }}>
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <div className={`text-lg ${isDark ? "text-white/50" : "text-black/50"}`}>Loading...</div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section
        id="projects"
        ref={containerRef}
        className={`relative ${isDark ? "bg-black" : "bg-white"}`}
        style={{ height: sectionHeight }}
      >
        <div
          className="sticky top-0 h-screen overflow-hidden"
          style={{ perspective: "2000px" }}
        >
          <div className="absolute top-24 md:top-28 left-6 md:left-16 z-10">
            <p className={`text-[10px] md:text-xs font-mono tracking-[0.3em] uppercase mb-1 ${isDark ? "text-cyan-400" : "text-blue-600"}`}>
              {sectionTitle}
            </p>
            <p className={`text-xs ${isDark ? "text-white/30" : "text-black/30"}`}>
              {sectionSubtitle}
            </p>
          </div>

          <div className={`absolute top-24 md:top-28 right-6 md:right-16 z-10 text-5xl md:text-7xl font-black tracking-tighter ${isDark ? "text-white/40" : "text-black/10"}`}>
            {String(currentProjectIndex + 1).padStart(2, "0")}
          </div>

          <div
            className="absolute inset-0"
            style={{
              transformStyle: "preserve-3d",
              transform: `translateY(${-cameraY}px)`,
            }}
          >
            <div
              className="absolute"
              style={{
                left: "50%",
                top: "50%",
                width: 0,
                height: 0,
                transformStyle: "preserve-3d",
              }}
            >
              {projects.map((project, index) => (
                <SpiralProjectCard
                  key={project.src}
                  project={project}
                  index={index}
                  total={total}
                  rotation={rotation}
                  onClick={() => handleSelectProject(index)}
                  radius={radiusAll}
                  verticalGap={verticalGap}
                  cardW={cardW}
                  cardH={cardH}
                />
              ))}
            </div>
          </div>

          <motion.div
            className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 ${isDark ? "text-white/20" : "text-black/20"}`}
            style={scrollIndicatorStyle}
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
            total={total}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </>
  )
}
