"use client"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "@/components/switchers/switchers"

function useProjectMedia(projectSrc: string) {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!projectSrc) return
    const checkMedia = async () => {
      const extensions = ['.mp4', '.webm', '.mov', '.gif', '.png', '.jpg']
      for (const ext of extensions) {
        const path = `/images/project_${projectSrc}${ext}`
        try {
          const res = await fetch(path, { method: 'HEAD' })
          if (res.ok) { setMediaUrl(path); setLoading(false); return }
        } catch (_e) { }
      }
      setMediaUrl(`/images/project_${projectSrc}.png`)
      setLoading(false)
    }
    checkMedia()
  }, [projectSrc])

  return { mediaUrl, loading }
}

function hasVideo(url: string | null): boolean {
  if (!url) return false
  return url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm') || url.toLowerCase().endsWith('.mov')
}

interface ProjectData {
  id: number;
  src: string;
  site: string;
  repo: string;
  tags: string[];
  imageUrls: string[];
  name: string;
  subtitle: string;
  alt: string;
  abt: string;
  featured: boolean;
  display_order: number;
  hasLocalMedia: boolean;
  githubLanguages: Record<string, number>;
  stars: number;
  forks: number;
  isPrivate?: boolean;
}

interface ProjectsResponse {
  featuredProjects: ProjectData[];
  showcaseProjects: ProjectData[];
  spiralProjects: ProjectData[];
  githubOnlyProjects: ProjectData[];
  total: number;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#2b7489', JavaScript: '#f1e05a', Python: '#3572A5', Java: '#b07219',
  'C#': '#178600', 'C++': '#f34b7d', C: '#555555', Go: '#00ADD8', Rust: '#dea584',
  Ruby: '#701516', PHP: '#4F5D95', Swift: '#F05138', Kotlin: '#A97BFF', HTML: '#e34c26',
  CSS: '#563d7c', SCSS: '#c6538c', Vue: '#41b883', Svelte: '#ff3e00', Shell: '#89e051',
  Next: '#000000', React: '#61dafb', Angular: '#dd0031', Node: '#339933',
};

const LANGUAGE_NAMES: Record<string, string> = {
  TypeScript: 'TS', JavaScript: 'JS', Python: 'PY', Java: 'JV',
  'C#': 'C#', 'C++': 'C++', Go: 'GO', Rust: 'RS', Ruby: 'RB', PHP: 'PHP',
  HTML: 'HTML', CSS: 'CSS', SCSS: 'SC', Vue: 'VU', Svelte: 'SV', Shell: 'SH',
};

function LanguageBars({ languages, size = 'md' }: { languages: Record<string, number>; size?: 'sm' | 'md' | 'lg' }) {
  if (!languages || Object.keys(languages).length === 0) return null
  const sorted = Object.entries(languages).sort(([, a], [, b]) => b - a).slice(0, 8)
  const barHeight = size === 'lg' ? 'h-2' : size === 'md' ? 'h-1.5' : 'h-1'
  return (
    <div className="space-y-1">
      <div className={`flex ${barHeight} rounded-full overflow-hidden`}>
        {sorted.map(([lang, pct]) => (
          <div key={lang} style={{ width: `${pct}%`, backgroundColor: LANGUAGE_COLORS[lang] || '#6b7280' }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {sorted.map(([lang, pct]) => (
          <div key={lang} className="flex items-center gap-1 text-[10px]">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: LANGUAGE_COLORS[lang] || '#6b7280' }} />
            <span className="text-gray-500">{LANGUAGE_NAMES[lang] || lang}</span>
            <span className="text-cyan-600 font-medium">{pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function V2ProjectsPage() {
  const ref = useRef<HTMLDivElement>(null)
  const { theme, language } = useTheme()
  const isDark = theme === "dark"
  const [data, setData] = useState<ProjectsResponse | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsRes, statsRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/github/stats")
        ])
        const projectsData = await projectsRes.json()
        const statsData = await statsRes.json()
        
        const normalizeData = (projects: any[]): ProjectData[] => {
          return (projects || []).map(p => ({
            ...p,
            imageUrls: Array.isArray(p.imageUrls) ? p.imageUrls : [],
          }))
        }
        
        setData({
          featuredProjects: normalizeData(projectsData.featuredProjects || []),
          showcaseProjects: normalizeData(projectsData.showcaseProjects || []),
          spiralProjects: normalizeData(projectsData.spiralProjects || []),
          githubOnlyProjects: normalizeData(projectsData.githubOnlyProjects || []),
          total: projectsData.total || 0,
        })
        setStats(statsData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -150])

  const accentColor = isDark ? "text-cyan-400" : "text-blue-600"
  const textMuted = isDark ? "text-white/40" : "text-black/40"
  const textDesc = isDark ? "text-white/60" : "text-black/60"
  const bgGlow = isDark ? "bg-cyan-400/5" : "bg-blue-600/5"
  const bgCard = isDark ? "bg-white/5" : "bg-black/5"
  const borderLight = isDark ? "border-white/10" : "border-black/10"
  const hoverBorder = isDark ? "hover:border-cyan-400/30" : "hover:border-blue-600/30"
  const btnBg = isDark ? "bg-cyan-400 text-black hover:bg-cyan-300" : "bg-blue-600 text-white hover:bg-blue-500"
  const btnOutline = isDark ? "border-white/20 text-white hover:border-cyan-400 hover:text-cyan-400" : "border-black/20 text-black hover:border-blue-600 hover:text-blue-600"
  const overlayBg = isDark ? "bg-black/90" : "bg-white/90"
  const modalBg = isDark ? "bg-neutral-900 border-white/10" : "bg-neutral-50 border-black/10"

  const title = language === "pt" ? "Projetos" : language === "es" ? "Proyectos" : language === "fr" ? "Projets" : language === "zh" ? "项目" : "Projects"
  const subtitle = language === "pt" ? "Do GitHub" : language === "es" ? "Desde GitHub" : language === "fr" ? "Depuis GitHub" : language === "zh" ? "来自 GitHub" : "From GitHub"
  const desc = language === "pt" ? "Uma coleção de todos os projetos públicos no meu GitHub, demonstrando habilidades em design e desenvolvimento."
    : language === "es" ? "Una colección de todos los proyectos públicos en mi GitHub, demostrando habilidades en diseño y desarrollo."
    : language === "fr" ? "Une collection de tous les projets publics sur mon GitHub, démontrant des compétences en design et développement."
    : language === "zh" ? "我在 GitHub 上的所有公共项目集合，展示设计和开发技能。"
    : "A collection of all public projects on my GitHub, showcasing skills in design and development."
  const projectsLabel = language === "pt" ? "Projetos" : language === "es" ? "Proyectos" : language === "fr" ? "Projets" : language === "zh" ? "项目" : "Projects"
  const techLabel = language === "pt" ? "Linguagens" : language === "es" ? "Lenguajes" : language === "fr" ? "Langages" : language === "zh" ? "语言" : "Languages"
  const linesLabel = language === "pt" ? "Linhas" : language === "es" ? "Líneas" : language === "fr" ? "Lignes" : language === "zh" ? "代码行" : "Lines"
  const featuredLabel = language === "pt" ? "Destaque" : language === "es" ? "Destacado" : language === "fr" ? "En vedette" : language === "zh" ? "精选" : "Featured"
  const otherProjectsLabel = language === "pt" ? "Outros Projetos" : language === "es" ? "Otros Proyectos" : language === "fr" ? "Autres Projets" : language === "zh" ? "其他项目" : "Other Projects"

  const featuredProjects = data?.featuredProjects || []
  const showcaseProjects = data?.showcaseProjects || []
  const githubProjects = data?.githubOnlyProjects || []

  if (loading) {
    return (
      <section className={`min-h-screen pt-[5rem] flex items-center justify-center ${isDark ? "bg-black" : "bg-white"}`}>
        <div className={`w-8 h-8 border-2 ${accentColor} border-t-transparent rounded-full animate-spin`} />
      </section>
    )
  }

  return (
    <>
      <section ref={ref} className={`min-h-screen pt-[5rem] pb-16 sm:pb-24 relative overflow-visible ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
        <motion.div style={{ y: bgY }} className={`absolute top-0 right-0 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] ${bgGlow} rounded-full blur-3xl pointer-events-none -translate-y-20`} />

        <div className="px-6 sm:px-10 lg:px-16 xl:px-24 mb-12 sm:mb-16 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl">
            <p className={`${accentColor} text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-4 font-mono`}>{subtitle}</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95]">{title}<span className="text-cyan-400">.</span></h1>
            <p className={`${textMuted} text-sm sm:text-base mt-4 max-w-xl leading-relaxed`}>{desc}</p>
          </motion.div>
        </div>

        <div className="px-6 sm:px-10 lg:px-16 xl:px-24 mb-12 sm:mb-16">
          <div className="grid grid-cols-3 gap-6 sm:gap-10 max-w-lg">
            {[
              { number: data?.total?.toString() || "0", label: projectsLabel },
              { number: stats?.languages?.length?.toString() || "0", label: techLabel },
              { number: stats ? Math.round(stats.total_lines_estimate / 1000).toString() + "k" : "0", label: linesLabel },
            ].map((stat) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <p className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight ${accentColor}`}>{stat.number}</p>
                <p className={`${textMuted} text-[10px] sm:text-xs uppercase tracking-wider mt-1`}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {featuredProjects.length > 0 && (
          <div className="px-6 sm:px-10 lg:px-16 xl:px-24 mb-8">
            <h2 className={`text-lg sm:text-xl font-semibold mb-6 flex items-center gap-3`}>
              <span className={accentColor}>{featuredLabel}</span>
              <span className={`h-px flex-1 ${borderLight}`} />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
              {featuredProjects.map((project, i) => (
                <FeaturedProjectCard key={project.id} project={project} index={i} onClick={() => setSelectedProject(project)} isDark={isDark} />
              ))}
            </div>
          </div>
        )}

        {showcaseProjects.length > 0 && (
          <div className="px-6 sm:px-10 lg:px-16 xl:px-24 mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {showcaseProjects.map((project, i) => (
                <AdminProjectCard key={project.id} project={project} index={i} onClick={() => setSelectedProject(project)} isDark={isDark} />
              ))}
            </div>
          </div>
        )}

        {githubProjects.length > 0 && (
          <div className="px-6 sm:px-10 lg:px-16 xl:px-24">
            <h2 className={`text-lg sm:text-xl font-semibold mb-6 flex items-center gap-3`}>
              <span className={accentColor}>{otherProjectsLabel}</span>
              <span className={`h-px flex-1 ${borderLight}`} />
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {githubProjects.map((project, i) => (
                <GithubOnlyCard key={project.src} project={project} index={i} onClick={() => setSelectedProject(project)} isDark={isDark} textMuted={textMuted} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 text-center px-6 sm:px-10 lg:px-16 xl:px-24">
          <Link href="https://github.com/httpE2Barao?tab=repositories" target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${btnOutline}`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            {language === "pt" ? "Ver todos no GitHub" : language === "es" ? "Ver todos en GitHub" : language === "fr" ? "Voir tout sur GitHub" : language === "zh" ? "在 GitHub 上查看全部" : "View all on GitHub"}
          </Link>
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 ${overlayBg} backdrop-blur-xl`} onClick={() => setSelectedProject(null)}>
            <motion.div initial={{ scale: 0.96, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0, y: 30 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto ${modalBg} border rounded-3xl`} onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedProject(null)} className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full ${bgCard} backdrop-blur-sm flex items-center justify-center ${hoverBorder} transition-colors`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isDark ? "white" : "black"} strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>

              <div className="p-6 sm:p-8">
                <ProjectMedia project={selectedProject} isDark={isDark} />
                
                <h2 className="text-2xl sm:text-3xl font-black tracking-tighter mt-6 mb-4">{selectedProject.name}<span className="text-cyan-400">.</span></h2>
                
                {selectedProject.subtitle && <p className={`${textDesc} leading-relaxed text-base mb-4`}>{selectedProject.subtitle}</p>}
                {selectedProject.abt && <p className={`${textMuted} leading-relaxed text-sm mb-6`}>{selectedProject.abt}</p>}

                {selectedProject.githubLanguages && Object.keys(selectedProject.githubLanguages).length > 0 && (
                  <div className="mb-6">
                    <LanguageBars languages={selectedProject.githubLanguages} size="lg" />
                  </div>
                )}

                <div className="flex gap-3">
                  {selectedProject.site && (
                    <a href={selectedProject.site} target="_blank" rel="noopener noreferrer" className={`px-6 py-2.5 ${btnBg} font-semibold rounded-full transition-colors text-sm`}>
                      {language === "pt" ? "Ver Projeto" : language === "es" ? "Ver Proyecto" : language === "fr" ? "Voir le Projet" : language === "zh" ? "查看项目" : "View Project"}
                    </a>
                  )}
                  <a href={selectedProject.repo} target="_blank" rel="noopener noreferrer" className={`px-6 py-2.5 border ${btnOutline} rounded-full transition-colors text-sm`}>
                    {language === "pt" ? "Código Fonte" : language === "es" ? "Código Fuente" : language === "fr" ? "Code Source" : language === "zh" ? "源代码" : "Source Code"}
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function ProjectMedia({ project, isDark, autoPlay = false }: { project: ProjectData; isDark: boolean; autoPlay?: boolean }) {
  const { mediaUrl, loading } = useProjectMedia(project.src)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  useEffect(() => {
    if (!videoRef.current || !hasVideo(mediaUrl)) return
    if (autoPlay || isHovered) {
      videoRef.current.play().catch(() => {})
    } else {
      videoRef.current.pause()
    }
  }, [mediaUrl, autoPlay, isHovered])

  if (loading) {
    return <div className={`relative aspect-video rounded-2xl bg-neutral-800 animate-pulse`} />
  }

  if (hasVideo(mediaUrl)) {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <video ref={videoRef} src={mediaUrl!} className="object-cover w-full h-full" muted loop playsInline />
      </div>
    )
  }

  if (mediaUrl) {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden">
        <Image src={mediaUrl} alt={project.alt || project.name} fill className="object-cover" />
      </div>
    )
  }

  return (
    <div className={`relative aspect-video rounded-2xl bg-gradient-to-br from-neutral-900 to-black flex items-center justify-center`}>
      <svg className={`w-16 h-16 text-white/20`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    </div>
  )
}

function FeaturedProjectCard({ project, index, onClick, isDark }: { project: ProjectData; index: number; onClick: () => void; isDark: boolean }) {
  const { mediaUrl, loading } = useProjectMedia(project.src)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  useEffect(() => {
    if (!videoRef.current || !hasVideo(mediaUrl)) return
    if (isHovered) {
      videoRef.current.play().catch(() => {})
    } else {
      videoRef.current.pause()
    }
  }, [mediaUrl, isHovered])
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative group cursor-pointer"
      onClick={onClick}
      whileHover={{ y: -8 }}
    >
      <div className={`relative aspect-[16/9] overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-colors`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        {loading ? (
          <div className="absolute inset-0 bg-neutral-800 animate-pulse" />
        ) : hasVideo(mediaUrl) ? (
          <video ref={videoRef} src={mediaUrl!} className="object-cover w-full h-full" muted loop playsInline />
        ) : mediaUrl ? (
          <Image src={mediaUrl!} alt={project.alt || project.name} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black flex items-center justify-center">
            <svg className={`w-16 h-16 text-white/20`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl md:text-3xl font-black tracking-tighter" style={{ textShadow: isDark ? "0 2px 12px rgba(0,0,0,0.9)" : "0 2px 4px rgba(255,255,255,0.3)" }}>
            {project.name}<span className="text-cyan-400">.</span>
          </h3>
          {project.subtitle && (
            <p className="text-sm mt-1" style={{ textShadow: isDark ? "0 1px 4px rgba(0,0,0,0.9)" : "0 1px 2px rgba(255,255,255,0.2)" }}>{project.subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function AdminProjectCard({ project, index, onClick, isDark }: { project: ProjectData; index: number; onClick: () => void; isDark: boolean }) {
  const { mediaUrl, loading } = useProjectMedia(project.src)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  useEffect(() => {
    if (!videoRef.current || !hasVideo(mediaUrl)) return
    if (isHovered) {
      videoRef.current.play().catch(() => {})
    } else {
      videoRef.current.pause()
    }
  }, [mediaUrl, isHovered])
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="relative group cursor-pointer"
      onClick={onClick}
      whileHover={{ y: -4 }}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-colors" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        {loading ? (
          <div className="absolute inset-0 bg-neutral-800 animate-pulse" />
        ) : hasVideo(mediaUrl) ? (
          <video ref={videoRef} src={mediaUrl!} className="object-cover w-full h-full" muted loop playsInline />
        ) : mediaUrl ? (
          <Image src={mediaUrl!} alt={project.alt || project.name} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black flex items-center justify-center">
            <svg className="w-12 h-12 text-white/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      <div className="mt-3">
        <h3 className="text-lg font-black tracking-tighter">{project.name}<span className="text-cyan-400">.</span></h3>
        {project.subtitle && <p className={`text-xs mt-0.5 ${isDark ? "text-white/60" : "text-black/60"} line-clamp-1`}>{project.subtitle}</p>}
        {project.githubLanguages && Object.keys(project.githubLanguages).length > 0 && (
          <div className="mt-2">
            <LanguageBars languages={project.githubLanguages} size="md" />
          </div>
        )}
      </div>
    </motion.div>
  )
}

function GithubOnlyCard({ project, index, onClick, isDark, textMuted }: {
  project: ProjectData;
  index: number;
  onClick: () => void;
  isDark: boolean;
  textMuted: string;
}) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
      className={`relative p-4 rounded-xl ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10"} border ${borderLight(isDark)} ${hoverBorder(isDark)} transition-colors cursor-pointer group`}
    >
      <div className="mb-3">
        <svg className={`w-5 h-5 ${isDark ? "text-white/40" : "text-black/40"}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </div>
      
      <h3 className="text-sm font-black tracking-tight mb-2">{project.name}<span className="text-cyan-400">.</span></h3>
      
      {project.subtitle && (
        <p className={`text-[10px] mb-3 ${textMuted} line-clamp-2`}>{project.subtitle}</p>
      )}

      {project.githubLanguages && Object.keys(project.githubLanguages).length > 0 && (
        <LanguageBars languages={project.githubLanguages} size="md" />
      )}
    </motion.div>
  )
}

function borderLight(isDark: boolean) { return isDark ? "border-white/10" : "border-black/10" }
function hoverBorder(isDark: boolean) { return isDark ? "hover:border-cyan-400/30" : "hover:border-blue-600/30" }