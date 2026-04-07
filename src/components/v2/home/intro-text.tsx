"use client"
import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useTheme } from "@/components/switchers/switchers"

export function V2IntroText() {
  const { theme, language } = useTheme()
  const isDark = theme === "dark"
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  })

  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [60, 0, 0, -40])
  const scale = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.96, 1, 1, 0.98])

  const line1Opacity = useTransform(smoothProgress, [0, 0.15], [0, 1])
  const line1Y = useTransform(smoothProgress, [0, 0.15], [30, 0])

  const line2Opacity = useTransform(smoothProgress, [0.1, 0.3], [0, 1])
  const line2Y = useTransform(smoothProgress, [0.1, 0.3], [30, 0])

  const line3Opacity = useTransform(smoothProgress, [0.25, 0.45], [0, 1])
  const line3Y = useTransform(smoothProgress, [0.25, 0.45], [30, 0])

  const ctaOpacity = useTransform(smoothProgress, [0.5, 0.7], [0, 1])
  const ctaY = useTransform(smoothProgress, [0.5, 0.7], [20, 0])

  const accentColor = isDark ? "text-cyan-400" : "text-blue-600"
  const textSubtle = isDark ? "text-white/20" : "text-black/20"
  const textMuted = isDark ? "text-white/60" : "text-black/60"

  const lines = {
    pt: {
      line1: "Full-Stack Developer",
      line2: "que cria soluções escaláveis",
      line3: "com código limpo e resultados reais.",
      cta: "Explore meu trabalho",
    },
    en: {
      line1: "Full-Stack Developer",
      line2: "who builds scalable solutions",
      line3: "with clean code and real results.",
      cta: "Explore my work",
    },
    es: {
      line1: "Desarrollador Full-Stack",
      line2: "que crea soluciones escalables",
      line3: "con código limpio y resultados reales.",
      cta: "Explora mi trabajo",
    },
    fr: {
      line1: "Développeur Full-Stack",
      line2: "qui crée des solutions évolutives",
      line3: "avec du code propre et des résultats concrets.",
      cta: "Explorez mon travail",
    },
    zh: {
      line1: "全栈开发者",
      line2: "打造可扩展的解决方案",
      line3: "用干净的代码和真实的结果。",
      cta: "探索我的作品",
    },
  }

  const lang = (["pt", "en", "es", "fr", "zh"].includes(language) ? language : "en") as keyof typeof lines
  const content = lines[lang]

  return (
    <section
      ref={ref}
      className={`relative h-[200vh] ${isDark ? "bg-black" : "bg-white"}`}
    >
      <motion.div
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
        style={{ opacity, y, scale }}
      >
        <div className="text-center px-6 sm:px-10 max-w-4xl mx-auto">
          <motion.p
            className={`text-xs sm:text-sm font-mono tracking-[0.3em] uppercase mb-6 ${accentColor}`}
            style={{ opacity: line1Opacity, y: line1Y }}
          >
            {content.line1}
          </motion.p>

          <motion.h2
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight mb-4 ${isDark ? "text-white" : "text-black"}`}
            style={{ opacity: line2Opacity, y: line2Y }}
          >
            {content.line2}
          </motion.h2>

          <motion.h2
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight mb-12 ${textSubtle}`}
            style={{ opacity: line3Opacity, y: line3Y }}
          >
            {content.line3}
          </motion.h2>

          <motion.div
            className="flex items-center justify-center gap-3"
            style={{ opacity: ctaOpacity, y: ctaY }}
          >
            <a
              href="#projects"
              className={`group inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${isDark ? "bg-white/10 hover:bg-white/20 text-white" : "bg-black/5 hover:bg-black/10 text-black"}`}
            >
              <span>{content.cta}</span>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
