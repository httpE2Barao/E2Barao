"use client"
import { useTheme } from "@/components/switchers/switchers"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { V2ProjectModal } from "@/components/v2/projects/project-modal"

const videoTimeRef = { current: {} as Record<string, number>, currentProject: null as string | null }

function getVideoTime(projectSrc: string) { return videoTimeRef.current[projectSrc] || 0 }
function setVideoTime(projectSrc: string, time: number) { videoTimeRef.current[projectSrc] = time }

function useProjectMedia(projectSrc: string) {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!projectSrc) return
    const checkMedia = async () => {
      const extensions = ['.mp4', '.png', '.webm', '.mov', '.gif', '.jpg']
      for (const ext of extensions) {
        const path = `/images/project_${projectSrc}${ext}`
        try {
          const res = await fetch(path, { method: 'HEAD' })
          if (res.ok) {
            setMediaUrl(path)
            setLoading(false)
            return
          }
        } catch (_e) { /* empty */ }
      }
      setMediaUrl(`/images/project_${projectSrc}.png`)
      setLoading(false)
    }
    checkMedia()
  }, [projectSrc])

  return { mediaUrl, loading }
}

function hasGif(url: string | null): boolean {
  if (!url) return false
  return url.toLowerCase().endsWith('.gif')
}

function hasVideo(url: string | null): boolean {
  if (!url) return false
  const lower = url.toLowerCase()
  return lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov')
}

function getProjectImage(project: ProjectFromAPI): string {
  if (project.imageUrls && project.imageUrls.length > 0) {
    return project.imageUrls[0]
  }
  return `/images/project_${project.src}.png`
}

// Hook que calcula progresso baseado na posição do elemento com smooth
function useElementScrollProgress() {
  const [localProgress, setLocalProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [elementRef, setElementRef] = useState<HTMLElement | null>(null)
  const frozenProgress = useRef(0)
  const lastProgress = useRef(0)

  const refCallback = useCallback((node: HTMLElement | null) => {
    setElementRef(node)
  }, [])

  useEffect(() => {
    if (!elementRef) return

    let rafId: number
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200

    const calculateProgress = () => {
      const rect = elementRef.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      const visible = rect.top < viewportHeight && rect.bottom > 0
      setIsVisible(visible)

      const scrollTravelDistance = rect.height - viewportHeight

      if (scrollTravelDistance <= 0) {
        setLocalProgress(0)
        frozenProgress.current = 0
        return
      }

      const rawProgress = -rect.top / scrollTravelDistance
      const clamped = Math.max(0, Math.min(1, rawProgress))

      // Smooth interpolation - smaller value = slower/smoother
      let maxChange = 0.015
      if (viewportWidth <= 480) maxChange = 0.008
      else if (viewportWidth <= 1024) maxChange = 0.012
      else if (viewportWidth <= 1440) maxChange = 0.015
      else maxChange = 0.02

      const diff = clamped - lastProgress.current
      const change = Math.max(-maxChange, Math.min(maxChange, diff))
      const smoothed = lastProgress.current + change
      lastProgress.current = smoothed

      setLocalProgress(smoothed)
      frozenProgress.current = smoothed

      rafId = requestAnimationFrame(calculateProgress)
    }

    window.addEventListener("scroll", calculateProgress, { passive: true })
    calculateProgress()

    return () => {
      window.removeEventListener("scroll", calculateProgress)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [elementRef])

  const effectiveProgress = isVisible ? localProgress : frozenProgress.current

  return { ref: refCallback, progress: effectiveProgress, isVisible, rawProgress: localProgress }
}

interface ProjectFromAPI {
  id: number;
  src: string;
  site: string;
  repo: string;
  tags: string[];
  name: string;
  subtitle?: string;
  alt: string;
  abt: string;
  featured: boolean;
  imageUrls: string[];
}

async function fetchFeaturedProjects(lang: string): Promise<ProjectFromAPI[]> {
  try {
    const res = await fetch(`/api/projects?lang=${lang}`)
    const data = await res.json()
    const projects = data.spiralProjects || data.featuredProjects || data.showcaseProjects || data.githubOnlyProjects || (Array.isArray(data) ? data : []) || []
    return projects.map((p: any) => ({
      ...p,
      imageUrls: typeof p.imageUrls === 'string' 
        ? JSON.parse(p.imageUrls || '[]') 
        : (Array.isArray(p.imageUrls) ? p.imageUrls : [])
    }))
  } catch (err) {
    console.error('Erro ao buscar projetos:', err)
    return []
  }
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
  isCurrentProject,
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
  isCurrentProject: boolean
}) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const { mediaUrl, loading: mediaLoading } = useProjectMedia(project.src)
const videoRef = useRef<HTMLVideoElement>(null)

  useLayoutEffect(() => {
    if (!videoRef.current || !mediaUrl) return
    
    const attemptPlay = () => {
      const savedTime = videoTimeRef.current[project.src] || 0
      videoRef.current!.currentTime = savedTime
      videoRef.current!.play().catch(() => {})
      videoTimeRef.currentProject = project.src
    }
    
    const attemptPause = () => {
      videoRef.current!.pause()
      videoTimeRef.current[project.src] = videoRef.current!.currentTime
    }
    
    if (isCurrentProject) {
      if (videoRef.current.readyState >= 1) {
        attemptPlay()
      } else {
        videoRef.current.addEventListener('canplay', attemptPlay, { once: true })
      }
    } else {
      attemptPause()
    }
  }, [isCurrentProject, project.src, mediaUrl])

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

  const opacity = isCurrentProject ? 1 : distFromCenter < 90 ? 0.5 : distFromCenter < 150 ? 0.15 : 0.03
  const scale = isCurrentProject ? 1 : distFromCenter < 90 ? 0.9 : distFromCenter < 150 ? 0.8 : 0.7

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
        pointerEvents: isCurrentProject ? "auto" : "none",
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
          {mediaLoading ? (
            <div className="w-full h-full bg-black/20 animate-pulse" />
          ) : hasVideo(mediaUrl) ? (
            <video
              ref={videoRef}
              src={mediaUrl!}
              className="object-cover w-full h-full"
              muted
              loop
              playsInline
            />
          ) : hasGif(mediaUrl) ? (
            <img
              src={mediaUrl!}
              alt={project.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <Image
              src={mediaUrl || getProjectImage(project)}
              alt={project.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 320px, 480px"
              quality={90}
            />
          )}
          <div className={`absolute inset-0 transition-opacity duration-300 ${isCurrentProject ? "" : (isDark ? "bg-black/30 group-hover:bg-black/60" : "bg-white/20 group-hover:bg-black/50")}`} />
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
            className="text-xl md:text-2xl font-black tracking-tighter text-white"
            style={{
              textShadow: "0 2px 12px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,1)",
            }}
          >
            {project.name}
            <span className="text-cyan-400">.</span>
          </h3>
        </div>
      </div>

      {isCurrentProject && (project as any).subtitle && (
        <div
          className="absolute"
          style={{
            width: cardW,
            height: cardH,
            left: "50%",
            top: "50%",
            transformStyle: "preserve-3d",
            transform: `translate(-50%, -50%) rotateY(${-currentAngle}deg) translateZ(-80px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            textAlign: "center",
            padding: "30px 10px 10px",
            margin: 0,
            zIndex: 51,
            pointerEvents: "none",
          }}
        >
          <p className="text-xs text-white/70" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
            {(project as any).subtitle}
          </p>
        </div>
      )}
    </div>
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

  const [layout, setLayout] = useState({ radius: 520, verticalGap: 260, cardW: 560, cardH: 320, cameraBottomPadding: 120 })

  useEffect(() => {
    fetchFeaturedProjects(lang).then((data) => {
      setProjects(data)
      setLoading(false)
    })
  }, [lang])

const total = projects.length

  const { ref: sectionRef, progress: scrollProgress, isVisible } = useElementScrollProgress()

  useEffect(() => {
    if (total > 0) {
      setCameraY(0)
      setRotation(0)
      setProgress(0)
    }
  }, [total])

// Compute responsive layout and camera travel so last item isn't cut off by viewport
  useEffect(() => {
    const computeLayout = (width: number) => {
      // Larger sizes for bigger screens, smaller for tiny screens
      if (width <= 380) {
        return { radius: 120, verticalGap: 150, cardW: 140, cardH: 100, cameraBottomPadding: 160 }
      } else if (width <= 480) {
        return { radius: 160, verticalGap: 140, cardW: 180, cardH: 120, cameraBottomPadding: 180 }
      } else if (width <= 640) {
        return { radius: 200, verticalGap: 130, cardW: 240, cardH: 150, cameraBottomPadding: 200 }
      } else if (width <= 1024) {
        return { radius: 320, verticalGap: 120, cardW: 400, cardH: 240, cameraBottomPadding: 160 }
      } else if (width <= 1440) {
        return { radius: 420, verticalGap: 120, cardW: 520, cardH: 300, cameraBottomPadding: 140 }
      } else {
        return { radius: 500, verticalGap: 140, cardW: 600, cardH: 340, cameraBottomPadding: 120 }
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
  const totalHeight = (total - 1) * verticalGap

  useEffect(() => {
    const updateCameraBounds = () => {
      const max = totalHeight
      setCameraYMax(Math.max(0, max))
    }
    updateCameraBounds()
    window.addEventListener("resize", updateCameraBounds)
    return () => window.removeEventListener("resize", updateCameraBounds)
}, [totalHeight, total])

  useEffect(() => {
    if (total <= 1) return
    if (!isVisible) return

    const clampedV = Math.max(0, Math.min(1, scrollProgress))

    const anglePerProject = 360 / total
    const newRotation = -clampedV * (total - 1) * anglePerProject

    const heightPerProject = layout.verticalGap
    const travelHeight = (total - 1) * heightPerProject
    const target = clampedV * travelHeight
    const clamped = Math.max(0, Math.min(cameraYMax, target))

    setRotation(newRotation)
    setCameraY(clamped)
    setProgress(clampedV)
  }, [scrollProgress, isVisible, total, cameraYMax, layout.verticalGap])

  const sectionTitle = language === "pt-BR" ? "Projetos" : language === "es" ? "Proyectos" : language === "fr" ? "Projets" : language === "zh" ? "项目" : "Projects"
  const sectionSubtitle = language === "pt-BR" ? "Clique para explorar" : language === "es" ? "Haz clic para explorar" : language === "fr" ? "Cliquez pour explorer" : language === "zh" ? "点击探索" : "Click to explore"

  const scrollIndicatorOpacity = isVisible ? 0 : 1
  const scrollIndicatorStyle = useMemo(() => ({ opacity: scrollIndicatorOpacity }), [scrollIndicatorOpacity])

  const handleSelectProject = useCallback((index: number) => {
    setSelectedProject(index)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null)
  }, [])

  const currentProjectIndex = Math.min(Math.floor(progress * total), total - 1)

  // Header offset - smaller for mobile
  const headerOffset = typeof window !== 'undefined' && window.innerWidth <= 480 ? 50 : 60

  const sectionHeight = useMemo(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 640) {
      // Shorter section for small/medium screens so last project doesn't overlap button
      if (total <= 3) return "250vh"
      if (total <= 5) return "300vh"
      return "350vh"
    }
    if (total <= 1) return "100vh"
    if (total <= 3) return "200vh"
    if (total <= 5) return "250vh"
    return "300vh"
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
        ref={sectionRef}
        className={`relative ${isDark ? "bg-black" : "bg-white"}`}
        style={{ height: sectionHeight }}
      >
        <div
          className="sticky top-0 h-screen overflow-hidden pt-20 md:pt-24"
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
            transform: `translateY(${-cameraY + headerOffset}px)`,
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
                  isCurrentProject={index === currentProjectIndex}
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

      {/* View all projects - below spiral section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: progress > 0.94 ? 1 : 0,
          y: progress > 0.94 ? -20 : 0
        }}
        transition={{ duration: 0.5 }}
        className={`relative ${isDark ? "bg-black" : "bg-white"}`}
        style={{ height: "80px" }}
      >
        <div className="flex items-center justify-center h-full">
          <Link
            href="/projects"
            className={`group inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold tracking-wide transition-all duration-500 ${
              isDark 
                ? "bg-cyan-400/90 hover:bg-cyan-400 text-black hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]" 
                : "bg-blue-600/90 hover:bg-blue-600 text-white hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
            }`}
          >
            <span>
              {(() => {
                const labels: Record<string, string> = {
                  "pt-BR": "Ver todos os projetos",
                  "pt": "Ver todos os projetos",
                  "en-US": "View all projects",
                  "en": "View all projects",
                  "es": "Ver todos los proyectos",
                  "fr": "Voir tous les projets",
                  "zh": "查看全部项目"
                }
                return labels[language] || "View all projects"
              })()}
            </span>
            <svg 
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedProject !== null && (
          <V2ProjectModal
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
