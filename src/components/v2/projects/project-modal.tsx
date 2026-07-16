"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useTheme } from "@/components/switchers/switchers"

export const videoTimeRef: { current: Record<string, number>; currentProject: string | null } = {
  current: {},
  currentProject: null,
}

export function getVideoTime(projectSrc: string): number {
  return videoTimeRef.current[projectSrc] || 0
}

export function setVideoTime(projectSrc: string, time: number) {
  videoTimeRef.current[projectSrc] = time
}

export function useProjectMedia(projectSrc: string) {
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

export function hasGif(url: string | null): boolean {
  if (!url) return false
  return url.toLowerCase().endsWith('.gif')
}

export function hasVideo(url: string | null): boolean {
  if (!url) return false
  return url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm') || url.toLowerCase().endsWith('.mov')
}

export function getProjectImage(project: { imageUrls: string[]; src: string }): string {
  if (project.imageUrls && project.imageUrls.length > 0) {
    return project.imageUrls[0]
  }
  return `/images/project_${project.src}.png`
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#2b7489', JavaScript: '#f1e05a', Python: '#3572A5', Java: '#b07219',
  'C#': '#178600', 'C++': '#f34b7d', C: '#555555', Go: '#00ADD8', Rust: '#dea584',
  Ruby: '#701516', PHP: '#4F5D95', Swift: '#F05138', Kotlin: '#A97BFF', HTML: '#e34c26',
  CSS: '#563d7c', SCSS: '#c6538c', Vue: '#41b883', Svelte: '#ff3e00', Shell: '#89e051',
  Next: '#000000', React: '#61dafb', Angular: '#dd0031', Node: '#339933',
}

const LANGUAGE_NAMES: Record<string, string> = {
  TypeScript: 'TS', JavaScript: 'JS', Python: 'PY', Java: 'JV',
  'C#': 'C#', 'C++': 'C++', Go: 'GO', Rust: 'RS', Ruby: 'RB', PHP: 'PHP',
  HTML: 'HTML', CSS: 'CSS', SCSS: 'SC', Vue: 'VU', Svelte: 'SV', Shell: 'SH',
}

export function LanguageBars({ languages, size = 'md' }: { languages: Record<string, number>; size?: 'sm' | 'md' | 'lg' }) {
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

export interface ProjectModalData {
  src: string;
  name: string;
  subtitle?: string;
  alt: string;
  abt: string;
  tags?: string[];
  skills?: Array<{ id: number; name: string; category: string }>;
  site: string;
  repo: string;
  imageUrls: string[];
  githubLanguages?: Record<string, number>;
}

interface V2ProjectModalProps {
  project: ProjectModalData;
  index: number;
  total: number;
  onClose: () => void;
}

export function V2ProjectModal({ project, index, total, onClose }: V2ProjectModalProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const { mediaUrl, loading: mediaLoading } = useProjectMedia(project.src)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hasInitializedRef = useRef(false)

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

  useEffect(() => {
    if (videoRef.current && hasVideo(mediaUrl) && !hasInitializedRef.current) {
      const savedTime = videoTimeRef.current[project.src] || 0
      videoRef.current.currentTime = savedTime
      videoRef.current.play().catch(() => {})
      hasInitializedRef.current = true
    }
  }, [mediaUrl, project.src])

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
          className={`fixed top-4 right-4 md:top-6 md:right-6 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-colors border ${isDark ? "bg-black/70 hover:bg-black/90 text-white border-white/20" : "bg-white/80 hover:bg-white/95 text-black border-black/10"}`}
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative w-full h-[50vh] md:h-[60vh]">
          {mediaLoading ? (
            <div className="w-full h-full bg-black/20 animate-pulse" />
          ) : hasVideo(mediaUrl) ? (
            <video
              ref={videoRef}
              src={mediaUrl!}
              className="object-cover w-full h-full"
              loop
              muted
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

            <h2 className={`text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-4 ${isDark ? "text-white" : "text-black"}`}>
              {project.name}
              <span className={isDark ? "text-cyan-400" : "text-blue-600"}>.</span>
            </h2>

            {project.subtitle && (
              <p className={`text-base md:text-lg leading-relaxed max-w-2xl mb-6 ${isDark ? "text-white/60" : "text-black/60"}`}>
                {project.subtitle}
              </p>
            )}

            <p className={`text-base md:text-lg leading-relaxed max-w-2xl mb-8 ${isDark ? "text-white/70" : "text-black/70"}`}>
              {project.abt}
            </p>

            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`px-3 py-1.5 rounded-full text-xs md:text-sm ${isDark ? "bg-white/10 text-white/80 border border-white/10" : "bg-black/5 text-black/80 border border-black/10"}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {project.skills && project.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-8">
                {project.skills.map((skill) => (
                  <span key={skill.id} className={`text-[10px] px-2 py-0.5 rounded ${
                    skill.category === 'languages' ? 'text-cyan-400 bg-cyan-500/10' :
                    skill.category === 'frameworks' ? 'text-blue-400 bg-blue-500/10' :
                    skill.category === 'styling' ? 'text-pink-400 bg-pink-500/10' :
                    skill.category === 'database' ? 'text-green-400 bg-green-500/10' :
                    skill.category === 'state' ? 'text-yellow-400 bg-yellow-500/10' :
                    skill.category === 'auth' ? 'text-red-400 bg-red-500/10' :
                    skill.category === 'ai' ? 'text-purple-400 bg-purple-500/10' :
                    skill.category === 'devops' ? 'text-orange-400 bg-orange-500/10' :
                    skill.category === 'design' ? 'text-pink-400 bg-pink-500/10' :
                    skill.category === 'testing' ? 'text-teal-400 bg-teal-500/10' :
                    skill.category === 'realtime' ? 'text-amber-400 bg-amber-500/10' :
                    skill.category === 'dataviz' ? 'text-indigo-400 bg-indigo-500/10' :
                    skill.category === 'integrations' ? 'text-cyan-400 bg-cyan-500/10' :
                    skill.category === 'tools' ? 'text-gray-400 bg-gray-500/10' :
                    'text-purple-400 bg-purple-500/10'
                  }`}>{skill.name}</span>
                ))}
              </div>
            )}

            {project.githubLanguages && Object.keys(project.githubLanguages).length > 0 && (
              <div className="mb-8">
                <LanguageBars languages={project.githubLanguages} size="lg" />
              </div>
            )}

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
