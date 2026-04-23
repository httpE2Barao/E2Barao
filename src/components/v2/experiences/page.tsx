"use client"
import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useTheme } from "@/components/switchers/switchers"
import Link from "next/link"

interface Experience {
  id: number;
  period_start: string;
  period_end: string;
  role_pt: string;
  role_en: string;
  role_es: string;
  role_fr: string;
  role_zh: string;
  company_pt: string;
  company_en: string;
  company_es: string;
  company_fr: string;
  company_zh: string;
  description_pt: string;
  description_en: string;
  description_es: string;
  description_fr: string;
  description_zh: string;
  highlight: boolean;
  display_order: number;
  github_repos?: string[];
}

interface ExperienceStats {
  repos_count: number;
  total_lines_estimate: number;
  by_language: { language: string; percentage: number; lines_estimate: number }[];
}

interface Education {
  id: number;
  period_start: string;
  period_end: string;
  degree_pt: string;
  degree_en: string;
  degree_es: string;
  degree_fr: string;
  degree_zh: string;
  school_pt: string;
  school_en: string;
  school_es: string;
  school_fr: string;
  school_zh: string;
  description_pt: string;
  description_en: string;
  description_es: string;
  description_fr: string;
  description_zh: string;
  display_order: number;
}

function TimelineItem({ exp, index, isLast, language, stats }: { exp: Experience; index: number; isLast: boolean; language: string; stats?: ExperienceStats }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  })
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const x = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -60 : 60, 0])

  const accentColor = isDark ? "text-cyan-400" : "text-blue-600"
  const borderColor = isDark ? "border-white/10" : "border-black/10"
  const lineBg = isDark ? "bg-white/10" : "bg-black/10"
  const lineActive = isDark ? "bg-cyan-400" : "bg-blue-600"
  const dotBorder = isDark ? "border-white/30" : "border-black/30"
  const dotBg = isDark ? "bg-black" : "bg-white"
  const dotHighlightBorder = isDark ? "border-cyan-400" : "border-blue-600"
  const dotHighlightBg = isDark ? "bg-cyan-400/20" : "bg-blue-600/20"
  const dotPulse = isDark ? "bg-cyan-400/30" : "bg-blue-600/30"
  const textCompany = isDark ? "text-white/40" : "text-black/40"
  const textDesc = isDark ? "text-white/60" : "text-black/60"
  const textPrimary = isDark ? "text-white" : "text-black"

  const roleKey = `role_${language}` as keyof Experience
  const companyKey = `company_${language}` as keyof Experience
  const descKey = `description_${language}` as keyof Experience

  const roleLabel = (exp as any)[roleKey] || exp.role_en
  const companyLabel = (exp as any)[companyKey] || exp.company_en
  const descLabel = (exp as any)[descKey] || exp.description_en
  const period = exp.period_start && exp.period_end ? `${exp.period_start} - ${exp.period_end}` : exp.period_start || exp.period_end || ""

  return (
    <motion.div
      ref={ref}
      style={{ opacity, x }}
      className="relative flex gap-8 mb-16 md:mb-24"
    >
      <div className="relative flex-shrink-0 w-4">
        {!isLast && (
          <div className={`absolute left-1/2 top-3 -translate-x-1/2 w-px h-full ${lineBg}`}>
            <motion.div
              className={`w-full ${lineActive} origin-top`}
              style={{ scaleY: scrollYProgress }}
            />
          </div>
        )}
        <div className={`relative z-10 w-4 h-4 rounded-full border-2 ${exp.highlight ? `${dotHighlightBorder} ${dotHighlightBg}` : `${dotBorder} ${dotBg}`}`}>
          {exp.highlight && (
            <motion.div
              className={`absolute inset-0 rounded-full ${dotPulse}`}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
      </div>

      <div className="flex-1 pt-0.5">
        <p className={`${accentColor} text-sm font-mono mb-2`}>{period}</p>
        <h3 className={`text-2xl md:text-3xl font-bold tracking-tight mb-1 ${textPrimary}`}>{roleLabel}</h3>
        <p className={`${textCompany} text-sm uppercase tracking-wider mb-4`}>{companyLabel}</p>
        <p className={`${textDesc} leading-relaxed max-w-2xl mb-4`}>{descLabel}</p>
        
        {stats && stats.by_language.length > 0 && (
          <div className={`mt-4 p-4 rounded-xl ${isDark ? "bg-white/5" : "bg-black/5"}`}>
            <p className={`text-xs font-mono mb-3 ${textCompany}`}>
              {language === "pt" ? "~" : ""}{stats.total_lines_estimate.toLocaleString()} {language === "pt" ? "linhas de código" : "lines of code"}
            </p>
            <div className="flex flex-wrap gap-2">
              {stats.by_language.slice(0, 4).map((lang, i) => (
                <div key={lang.language} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isDark ? "bg-white/10" : "bg-black/10"}`}>
                  <span className={`w-2 h-2 rounded-full ${lang.language === "TypeScript" ? "bg-blue-500" : lang.language === "JavaScript" ? "bg-yellow-500" : lang.language === "CSS" ? "bg-pink-500" : lang.language === "Python" ? "bg-green-500" : "bg-gray-500"}`} />
                  <span className={`text-xs ${textPrimary}`}>{lang.language}</span>
                  <span className={`text-xs ${textCompany}`}>{lang.percentage}%</span>
                </div>
              ))}
            </div>
            {stats.repos_count > 0 && (
              <Link
                href={`https://github.com/httpE2Barao?tab=repositories`}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 mt-3 text-xs ${accentColor} hover:underline`}
              >
                {stats.repos_count} {stats.repos_count === 1 ? "repo" : "repos"} GitHub
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function EducationItem({ edu, index, language }: { edu: Education; index: number; language: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  })
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const y = useTransform(scrollYProgress, [0, 1], [40, 0])

  const accentColor = isDark ? "text-cyan-400" : "text-blue-600"
  const bgCard = isDark ? "bg-white/5" : "bg-black/5"
  const borderColor = isDark ? "border-white/10" : "border-black/10"
  const hoverBorder = isDark ? "hover:border-cyan-400/30" : "hover:border-blue-600/30"
  const textCompany = isDark ? "text-white/40" : "text-black/40"
  const textDesc = isDark ? "text-white/60" : "text-black/60"
  const textPrimary = isDark ? "text-white" : "text-black"

  const degreeKey = `degree_${language}` as keyof Education
  const schoolKey = `school_${language}` as keyof Education
  const descKey = `description_${language}` as keyof Education

  const degreeLabel = (edu as any)[degreeKey] || edu.degree_en
  const schoolLabel = (edu as any)[schoolKey] || edu.school_en
  const descLabel = (edu as any)[descKey] || edu.description_en
  const period = edu.period_start && edu.period_end ? `${edu.period_start} - ${edu.period_end}` : edu.period_start || edu.period_end || ""

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      className={`${bgCard} backdrop-blur-sm border ${borderColor} ${hoverBorder} rounded-2xl p-8 transition-colors duration-500`}
    >
      <p className={`${accentColor} text-sm font-mono mb-2`}>{period}</p>
      <h3 className={`text-xl font-bold tracking-tight mb-1 ${textPrimary}`}>{degreeLabel}</h3>
      <p className={`${textCompany} text-sm uppercase tracking-wider mb-4`}>{schoolLabel}</p>
      <p className={`${textDesc} leading-relaxed`}>{descLabel}</p>
    </motion.div>
  )
}

export function V2ExperiencesPage() {
  const [activeTab, setActiveTab] = useState<"experience" | "education">("experience")
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [expStats, setExpStats] = useState<Record<number, ExperienceStats>>({})
  const [loading, setLoading] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const { theme, language } = useTheme()
  const isDark = theme === "dark"
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], [0, -150])

  const accentColor = isDark ? "text-cyan-400" : "text-blue-600"
  const textSubtle = isDark ? "text-white/20" : "text-black/20"
  const textMuted = isDark ? "text-white/30" : "text-black/30"
  const bgGlow = isDark ? "bg-cyan-400/5" : "bg-blue-600/5"
  const bgTab = isDark ? "bg-white/5" : "bg-black/5"
  const textTab = isDark ? "text-white/50" : "text-black/50"
  const hoverTab = isDark ? "hover:text-white hover:bg-white/10" : "hover:text-black hover:bg-black/10"
  const activeBg = isDark ? "bg-cyan-400 text-black" : "bg-blue-600 text-white"
  const textPrimary = isDark ? "text-white" : "text-black"

  const journeyLabel = language === "pt" ? "Jornada" : language === "es" ? "Trayectoria" : language === "fr" ? "Parcours" : language === "zh" ? "旅程" : "Journey"
  const experiencesTitle = language === "pt" ? "Experiências" : language === "es" ? "Experiencias" : language === "fr" ? "Expériences" : language === "zh" ? "经验" : "Experiences"
  const experiencesSubtitle = language === "pt" ? "Uma linha do tempo do meu caminho profissional, das bases ao presente." : language === "es" ? "Una línea de tiempo de mi camino profesional, desde los fundamentos hasta el presente." : language === "fr" ? "Une chronologie de mon parcours professionnel, des fondations au présent." : language === "zh" ? "我的职业道路时间线，从基础到现在。" : "A timeline of my professional path, from foundations to the present."
  const experienceTab = language === "pt" ? "Experiência" : language === "es" ? "Experiencia" : language === "fr" ? "Expérience" : language === "zh" ? "经验" : "Experience"
  const educationTab = language === "pt" ? "Educação" : language === "es" ? "Educación" : language === "fr" ? "Formation" : language === "zh" ? "教育" : "Education"

  useEffect(() => {
    async function fetchData() {
      try {
        const [expRes, eduRes] = await Promise.all([
          fetch("/api/admin/experience"),
          fetch("/api/admin/education")
        ])
        const expData = await expRes.json()
        const eduData = await eduRes.json()
        setExperiences(Array.isArray(expData) ? expData.sort((a: Experience, b: Experience) => a.display_order - b.display_order) : [])
        setEducation(Array.isArray(eduData) ? eduData.sort((a: Education, b: Education) => a.display_order - b.display_order) : [])

        if (Array.isArray(expData)) {
          for (const exp of expData) {
            if (exp.github_repos && exp.github_repos.length > 0) {
              try {
                const reposParam = exp.github_repos.join(',')
                const statsRes = await fetch(`/api/github/experience-stats?repos=${encodeURIComponent(reposParam)}`)
                if (statsRes.ok) {
                  const stats = await statsRes.json()
                  setExpStats(prev => ({
                    ...prev,
                    [exp.id]: {
                      repos_count: stats.repos_count,
                      total_lines_estimate: stats.total_lines_estimate,
                      by_language: stats.by_language.slice(0, 5),
                    }
                  }))
                }
              } catch {
                console.error("Failed to fetch stats for experience", exp.id)
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch experiences:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <section ref={ref} className={`min-h-screen pt-[5rem] pb-[60vh] md:pb-[50vh] relative overflow-visible ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      <motion.div
        style={{ y: bgY }}
        className={`absolute top-0 right-0 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] ${bgGlow} rounded-full blur-3xl pointer-events-none -translate-y-20`}
      />

      <div className="px-6 sm:px-10 lg:px-16 xl:px-24 mb-12 sm:mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <p className={`${accentColor} text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-4 font-mono`}>
            {journeyLabel}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95]">
            {experiencesTitle}
            <span className={accentColor}>.</span>
          </h1>
          <p className={`${textMuted} text-sm sm:text-base mt-4 max-w-xl leading-relaxed`}>
            {experiencesSubtitle}
          </p>
        </motion.div>
      </div>

      <div className="px-6 sm:px-10 lg:px-16 xl:px-24 mb-10">
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab("experience")}
            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all duration-300 ${
              activeTab === "experience"
                ? activeBg
                : `${bgTab} ${textTab} ${hoverTab}`
            }`}
          >
            {experienceTab}
          </button>
          <button
            onClick={() => setActiveTab("education")}
            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all duration-300 ${
              activeTab === "education"
                ? activeBg
                : `${bgTab} ${textTab} ${hoverTab}`
            }`}
          >
            {educationTab}
          </button>
        </div>
      </div>

      <div className="px-6 sm:px-10 lg:px-16 xl:px-24">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className={`w-8 h-8 border-2 ${accentColor} border-t-transparent rounded-full animate-spin`} />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === "experience" ? (
              <motion.div
                key="exp"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {experiences.length === 0 ? (
                  <p className={`${textMuted}`}>No experiences found.</p>
                ) : (
                  experiences.map((exp, i) => (
                    <TimelineItem key={exp.id} exp={exp} index={i} isLast={i === experiences.length - 1} language={language} stats={expStats[exp.id]} />
                  ))
                )}
              </motion.div>
            ) : (
              <motion.div
                key="edu"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {education.length === 0 ? (
                  <p className={`${textMuted}`}>No education found.</p>
                ) : (
                  education.map((edu, i) => (
                    <EducationItem key={edu.id} edu={edu} index={i} language={language} />
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  )
}