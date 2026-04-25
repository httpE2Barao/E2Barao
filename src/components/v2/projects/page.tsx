"use client"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "@/components/switchers/switchers"

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  homepage: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  updated_at: string;
  languages?: Record<string, number>;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#2b7489',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  'C#': '#178600',
  'C++': '#f34b7d',
  C: '#555555',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Scala: '#c22d40',
  R: '#198CE7',
  Shell: '#89e051',
  PowerShell: '#012456',
  Lua: '#000080',
  Perl: '#0298c3',
  Haskell: '#5e5086',
  Elixir: '#6e4a1e',
  Erlang: '#B83998',
  Clojure: '#db5855',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Sass: '#a53b70',
  Less: '#1d365d',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  JSON: '#292929',
  YAML: '#cb171e',
  TOML: '#9c4121',
  XML: '#0060ac',
  Markdown: '#083fa1',
  SQL: '#e38c00',
  GraphQL: '#e535ab',
  Dockerfile: '#384d54',
  Makefile: '#427819',
  CMake: '#064f8c',
  Nix: '#7e7eff',
  Assembly: '#6E4C13',
  'Vim script': '#199c4b',
  'Emacs Lisp': '#c065db',
  TeX: '#3D6117',
  LaTeX: '#3D6117',
}

interface GitHubStats {
  total_repos: number;
  total_lines_estimate: number;
  languages: { language: string; percentage: number }[];
}

export function V2ProjectsPage() {
  const ref = useRef<HTMLDivElement>(null)
  const { theme, language } = useTheme()
  const isDark = theme === "dark"
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null)
  const [langLoading, setLangLoading] = useState(false)

  const lang = language === "pt-BR" ? "pt" : language === "en-US" ? "en" : language

  useEffect(() => {
    async function fetchData() {
      try {
        const [reposRes, statsRes] = await Promise.all([
          fetch("/api/github/repos?per_page=100"),
          fetch("/api/github/stats")
        ])
        const reposData = await reposRes.json()
        const statsData = await statsRes.json()
        setRepos(Array.isArray(reposData) ? reposData : [])
        setStats(statsData && !statsData.error ? statsData : null)
      } catch (error) {
        console.error("Failed to fetch GitHub data:", error)
        setRepos([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (repos.length === 0) return
    
    async function fetchLanguages() {
      setLangLoading(true)
      const repoNames = repos.map(r => r.name).join(',')
      try {
        const res = await fetch(`/api/github/languages?repos=${encodeURIComponent(repoNames)}`)
        const data = await res.json()
        
        if (Array.isArray(data)) {
          const langMap: Record<string, Record<string, number>> = {}
          data.forEach((item: { repo: string; languages: Record<string, number> }) => {
            if (item.languages) {
              const langs: Record<string, number> = {}
              const total = Object.values(item.languages).reduce((a: number, b: number) => a + b, 0) as number
              for (const [lang, bytes] of Object.entries(item.languages)) {
                langs[lang] = Math.round(((bytes as number) / total) * 100)
              }
              langMap[item.repo] = langs
            }
          })
          
          setRepos(prev => prev.map(repo => ({
            ...repo,
            languages: langMap[repo.name]
          })))
        }
      } catch (error) {
        console.error("Failed to fetch languages:", error)
      } finally {
        setLangLoading(false)
      }
    }
    
    fetchLanguages()
  }, [repos.length])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

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
  const tagBg = isDark ? "bg-cyan-400/10 text-cyan-400" : "bg-blue-600/10 text-blue-600"

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

  const allLanguages = stats?.languages?.map(l => l.language).filter(Boolean) || []
  const uniqueLanguages = [...new Set(allLanguages)]

  if (loading || !repos || repos.length === 0) {
    return (
      <section className={`min-h-screen pt-[5rem] flex items-center justify-center ${isDark ? "bg-black" : "bg-white"}`}>
        <div className={`w-8 h-8 border-2 ${accentColor} border-t-transparent rounded-full animate-spin`} />
      </section>
    )
  }

  return (
    <>
      <section ref={ref} className={`min-h-screen pt-[5rem] pb-16 sm:pb-24 relative overflow-visible ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
        <motion.div
          style={{ y: bgY }}
          className={`absolute top-0 right-0 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] ${bgGlow} rounded-full blur-3xl pointer-events-none -translate-y-20`}
        />

        <div className="px-6 sm:px-10 lg:px-16 xl:px-24 mb-12 sm:mb-16 relative z-10">
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
              { number: repos.length.toString(), label: projectsLabel },
              { number: uniqueLanguages.length.toString(), label: techLabel },
              { number: stats ? (stats.total_lines_estimate / 1000).toFixed(0) + "k" : "0", label: linesLabel },
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
            {repos.map((repo, i) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="relative group cursor-pointer"
                onClick={() => setSelectedRepo(repo)}
                whileHover={{ y: -8 }}
              >
                <div className={`relative aspect-[16/10] overflow-hidden rounded-2xl ${bgCard} border ${borderLight} ${hoverBorder} transition-colors`}>
                  <div className={`absolute inset-0 flex items-center justify-center ${isDark ? "bg-gradient-to-br from-neutral-900 to-black" : "bg-gradient-to-br from-neutral-100 to-white"}`}>
                    <div className="text-center px-6">
                      <svg className={`w-12 h-12 mx-auto mb-3 ${isDark ? "text-white/20" : "text-black/20"}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <p className={`text-lg font-bold ${isDark ? "text-white/60" : "text-black/60"}`}>{repo.name}</p>
                      {repo.language && (
                        <p className={`text-xs mt-1 ${isDark ? "text-white/30" : "text-black/30"}`}>{repo.language}</p>
                      )}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <motion.div
                    initial={false}
                    animate={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8"
                  >
                    <p className={`${accentColor} text-xs uppercase tracking-wider mb-2 font-mono`}>
                      {repo.language || "Code"}
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">{repo.name}</h3>
                    <p className="text-white/60 text-sm line-clamp-2">{repo.description}</p>
                  </motion.div>
                </div>

                <div className="mt-4 px-1">
                  <h3 className={`text-base font-semibold tracking-tight transition-colors ${isDark ? "text-white" : "text-black"}`}>
                    {repo.name}
                  </h3>
                  {repo.description && (
                    <p className={`text-sm mt-1 line-clamp-1 ${textDesc}`}>{repo.description}</p>
                  )}
                  {repo.languages && Object.keys(repo.languages).length > 0 && (
                    <div className="flex h-2 mt-3 rounded-full overflow-hidden">
                      {Object.entries(repo.languages)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                        .map(([lang, pct]) => (
                          <div
                            key={lang}
                            className="first:rounded-l-full last:rounded-r-full"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: LANGUAGE_COLORS[lang] || '#6b7280',
                            }}
                            title={`${lang}: ${pct}%`}
                          />
                        ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="https://github.com/httpE2Barao?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${btnOutline}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              {language === "pt" ? "Ver todos no GitHub" : language === "es" ? "Ver todos en GitHub" : language === "fr" ? "Voir tout sur GitHub" : language === "zh" ? "在 GitHub 上查看全部" : "View all on GitHub"}
            </Link>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedRepo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 ${overlayBg} backdrop-blur-xl`}
            onClick={() => setSelectedRepo(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto ${modalBg} border rounded-3xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedRepo(null)}
                className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full ${bgCard} backdrop-blur-sm flex items-center justify-center ${hoverBorder} transition-colors`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isDark ? "white" : "black"} strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="p-6 sm:p-8">
                <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight mb-4 ${isDark ? "text-white" : "text-black"}`}>
                  {selectedRepo.name}
                </h2>
                
                {selectedRepo.description && (
                  <p className={`${textDesc} leading-relaxed text-base mb-6`}>
                    {selectedRepo.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 mb-6">
                  {selectedRepo.language && (
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${tagBg}`}>
                      <span>{selectedRepo.language}</span>
                    </div>
                  )}
                  {selectedRepo.stargazers_count > 0 && (
                    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${isDark ? "bg-white/10 text-white/80" : "bg-black/10 text-black/80"}`}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <span>{selectedRepo.stargazers_count}</span>
                    </div>
                  )}
                  {selectedRepo.forks_count > 0 && (
                    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${isDark ? "bg-white/10 text-white/80" : "bg-black/10 text-black/80"}`}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 2C3.79 2 2 3.79 2 6v12c0 2.21 1.79 4 4 4h8v-2H6V6h8v2h2V6c0-2.21-1.79-4-4-4H6zm12 12c0 2.21-1.79 4-4 4H8v2h8c2.21 0 4-1.79 4-4V6c0-2.21-1.79-4-4-4h8v2h-8v12h8z"/>
                      </svg>
                      <span>{selectedRepo.forks_count}</span>
                    </div>
                  )}
                </div>

                {selectedRepo.topics && selectedRepo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedRepo.topics.slice(0, 8).map((topic) => (
                      <span key={topic} className={`text-xs ${tagBg} px-3 py-1 rounded-full`}>
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                {selectedRepo.languages && Object.keys(selectedRepo.languages).length > 0 && (
                  <div className="mb-6">
                    <div className="flex h-3 rounded-full overflow-hidden mb-3">
                      {Object.entries(selectedRepo.languages)
                        .sort(([, a], [, b]) => b - a)
                        .map(([lang, pct]) => (
                          <div
                            key={lang}
                            className="first:rounded-l-full last:rounded-r-full"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: LANGUAGE_COLORS[lang] || '#6b7280',
                            }}
                          />
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(selectedRepo.languages)
                        .sort(([, a], [, b]) => b - a)
                        .map(([lang, pct]) => (
                          <div key={lang} className="flex items-center gap-2 text-xs">
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: LANGUAGE_COLORS[lang] || '#6b7280' }}
                            />
                            <span className={isDark ? "text-white/80" : "text-black/80"}>{lang}</span>
                            <span className={textMuted}>{pct}%</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {selectedRepo.homepage && (
                    <a
                      href={selectedRepo.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-6 py-2.5 ${btnBg} font-semibold rounded-full transition-colors text-sm`}
                    >
                      {language === "pt" ? "Ver Projeto" : language === "es" ? "Ver Proyecto" : language === "fr" ? "Voir le Projet" : language === "zh" ? "查看项目" : "View Project"}
                    </a>
                  )}
                  <a
                    href={selectedRepo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-6 py-2.5 border ${btnOutline} rounded-full transition-colors text-sm`}
                  >
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