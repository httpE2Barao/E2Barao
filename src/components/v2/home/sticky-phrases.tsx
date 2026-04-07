"use client"
import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion"
import { useTheme } from "@/components/switchers/switchers"

const phraseSets = {
  block1: {
    pt: [
      { text: "Full-Stack Developer", accent: true },
      { text: "que transforma", accent: false },
      { text: "idéias complexas", accent: false },
      { text: "em aplicações web", accent: true },
      { text: "de alta performance.", accent: true },
    ],
    en: [
      { text: "Full-Stack Developer", accent: true },
      { text: "who transforms", accent: false },
      { text: "complex ideas", accent: false },
      { text: "into high-performance", accent: true },
      { text: "web applications.", accent: true },
    ],
    es: [
      { text: "Desarrollador Full-Stack", accent: true },
      { text: "que transforma", accent: false },
      { text: "ideas complejas", accent: false },
      { text: "en aplicaciones web", accent: true },
      { text: "de alto rendimiento.", accent: true },
    ],
    fr: [
      { text: "Développeur Full-Stack", accent: true },
      { text: "qui transforme", accent: false },
      { text: "les idées complexes", accent: false },
      { text: "en applications web", accent: true },
      { text: "haute performance.", accent: true },
    ],
    zh: [
      { text: "全栈开发者", accent: true },
      { text: "将复杂的想法", accent: false },
      { text: "转化为", accent: false },
      { text: "高性能的", accent: true },
      { text: "Web应用。", accent: true },
    ],
  },
  block2: {
    pt: [
      { text: "Do back-end ao front-end.", accent: false },
      { text: "Do banco de dados", accent: false },
      { text: "à experiência do usuário.", accent: true },
      { text: "Código limpo.", accent: true },
      { text: "Resultados reais.", accent: true },
    ],
    en: [
      { text: "From back-end to front-end.", accent: false },
      { text: "From database", accent: false },
      { text: "to user experience.", accent: true },
      { text: "Clean code.", accent: true },
      { text: "Real results.", accent: true },
    ],
    es: [
      { text: "Del back-end al front-end.", accent: false },
      { text: "De la base de datos", accent: false },
      { text: "a la experiencia del usuario.", accent: true },
      { text: "Código limpio.", accent: true },
      { text: "Resultados reales.", accent: true },
    ],
    fr: [
      { text: "Du back-end au front-end.", accent: false },
      { text: "De la base de données", accent: false },
      { text: "à l'expérience utilisateur.", accent: true },
      { text: "Code propre.", accent: true },
      { text: "Résultats concrets.", accent: true },
    ],
    zh: [
      { text: "从后端到前端。", accent: false },
      { text: "从数据库", accent: false },
      { text: "到用户体验。", accent: true },
      { text: "干净的代码。", accent: true },
      { text: "真实的结果。", accent: true },
    ],
  },
  block3: {
    pt: [
      { text: "Escalável.", accent: true },
      { text: "Otimizado para SEO.", accent: false },
      { text: "Rápido.", accent: true },
      { text: "Feito para crescer", accent: false },
      { text: "com o seu negócio.", accent: true },
    ],
    en: [
      { text: "Scalable.", accent: true },
      { text: "SEO optimized.", accent: false },
      { text: "Fast.", accent: true },
      { text: "Built to grow", accent: false },
      { text: "with your business.", accent: true },
    ],
    es: [
      { text: "Escalable.", accent: true },
      { text: "Optimizado para SEO.", accent: false },
      { text: "Rápido.", accent: true },
      { text: "Construido para crecer", accent: false },
      { text: "con tu negocio.", accent: true },
    ],
    fr: [
      { text: "Évolutif.", accent: true },
      { text: "Optimisé SEO.", accent: false },
      { text: "Rapide.", accent: true },
      { text: "Conçu pour grandir", accent: false },
      { text: "avec votre entreprise.", accent: true },
    ],
    zh: [
      { text: "可扩展。", accent: true },
      { text: "SEO优化。", accent: false },
      { text: "快速。", accent: true },
      { text: "为您的业务", accent: false },
      { text: "增长而构建。", accent: true },
    ],
  },
}

function AnimatedWord({ text, accent, scrollProgress, index, total }: {
  text: string
  accent: boolean
  scrollProgress: MotionValue<number>
  index: number
  total: number
}) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const progressPerItem = 1 / total
  const startFadeIn = index * progressPerItem
  const endFadeIn = startFadeIn + progressPerItem * 0.3
  const startFadeOut = startFadeIn + progressPerItem * 0.7
  const endFadeOut = startFadeIn + progressPerItem

  const opacity = useTransform(scrollProgress, [startFadeIn - 0.1, startFadeIn, endFadeIn, startFadeOut, endFadeOut], [0, 1, 1, 1, 0])
  const y = useTransform(scrollProgress, [startFadeIn - 0.1, startFadeIn, endFadeIn, startFadeOut], [40, 0, 0, -20])
  const scale = useTransform(scrollProgress, [startFadeIn - 0.1, startFadeIn, endFadeIn], [0.92, 1, 1])
  const blur = useTransform(scrollProgress, [startFadeIn - 0.1, startFadeIn], [6, 0])

  const glowOpacity = useTransform(scrollProgress, [startFadeIn, endFadeIn, startFadeOut], [0, 0.5, 0])
  const glowBlur = useTransform(scrollProgress, [startFadeIn, endFadeIn], [15, 0])

  const glowColor = isDark ? "rgba(34, 211, 238," : "rgba(37, 99, 235,"

  const blurFilter = useTransform(blur, (v) => `blur(${v}px)`)
  const glowBlurFilter = useTransform(glowBlur, (v) => `blur(${v}px)`)

  const sizeClass = accent
    ? "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter"
    : "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"

  return (
    <div className="relative mb-3 sm:mb-4">
      {accent && (
        <motion.div
          style={{ opacity: glowOpacity, y, scale, filter: glowBlurFilter }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span
            className={`${sizeClass} blur-xl`}
            style={{ color: `${glowColor}0.25)` }}
          >
            {text}
          </span>
        </motion.div>
      )}
      <motion.div
        style={{ opacity, y, scale, filter: blurFilter }}
        className={`relative ${sizeClass} ${accent ? "" : isDark ? "text-white/90" : "text-black/90"}`}
      >
        {accent ? (
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: isDark
                ? "linear-gradient(135deg, #22d3ee 0%, #a78bfa 50%, #22d3ee 100%)"
                : "linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #2563eb 100%)",
              backgroundSize: "200% 200%",
              animation: "gradientShift 3s ease infinite",
            }}
          >
            {text}
          </span>
        ) : (
          text
        )}
      </motion.div>
    </div>
  )
}

function StickyPhraseBlock({ phrases }: { phrases: { text: string; accent: boolean }[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 60, 
    damping: 20, 
    restDelta: 0.001,
    restSpeed: 0.001
  })

  const bgOpacity = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], [0, 0.04, 0.06, 0.04, 0])
  const bgGradient = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    isDark
      ? ["radial-gradient(ellipse at center, transparent 0%, black 70%)", "radial-gradient(ellipse at center, rgba(34,211,238,0.04) 0%, black 70%)", "radial-gradient(ellipse at center, transparent 0%, black 70%)"]
      : ["radial-gradient(ellipse at center, transparent 0%, white 70%)", "radial-gradient(ellipse at center, rgba(37,99,235,0.04) 0%, white 70%)", "radial-gradient(ellipse at center, transparent 0%, white 70%)"]
  )

  const containerY = useTransform(smoothProgress, [0, 0.5, 1], [30, 0, -30])
  const containerOpacity = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])

  return (
    <div ref={ref} className="relative h-[280vh]">
      <motion.div
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
        style={{ background: bgGradient }}
      >
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: bgOpacity }}
        >
          <div className={`absolute inset-0 ${isDark ? "bg-cyan-400" : "bg-blue-600"}`} />
        </motion.div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className={`absolute top-1/4 left-0 right-0 h-px ${isDark ? "bg-white/[0.03]" : "bg-black/[0.03]"}`} />
          <div className={`absolute top-2/4 left-0 right-0 h-px ${isDark ? "bg-white/[0.03]" : "bg-black/[0.03]"}`} />
          <div className={`absolute top-3/4 left-0 right-0 h-px ${isDark ? "bg-white/[0.03]" : "bg-black/[0.03]"}`} />
          <div className={`absolute top-0 bottom-0 left-1/4 w-px ${isDark ? "bg-white/[0.03]" : "bg-black/[0.03]"}`} />
          <div className={`absolute top-0 bottom-0 left-2/4 w-px ${isDark ? "bg-white/[0.03]" : "bg-black/[0.03]"}`} />
          <div className={`absolute top-0 bottom-0 left-3/4 w-px ${isDark ? "bg-white/[0.03]" : "bg-black/[0.03]"}`} />
        </div>

        <motion.div
          style={{ y: containerY, opacity: containerOpacity }}
          className="relative z-10 text-center px-6 sm:px-10 w-full max-w-5xl mx-auto"
        >
          {phrases.map((phrase, i) => (
            <AnimatedWord
              key={phrase.text + i}
              text={phrase.text}
              accent={phrase.accent}
              scrollProgress={smoothProgress}
              index={i}
              total={phrases.length}
            />
          ))}
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-px overflow-hidden"
          style={{ opacity: useTransform(smoothProgress, [0, 0.1], [0, 0.2]) }}
        >
          <motion.div
            className={`h-full ${isDark ? "bg-cyan-400" : "bg-blue-600"}`}
            style={{ width: useTransform(smoothProgress, [0, 1], ["0%", "100%"]) }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

export function V2StickyPhrases() {
  const { theme, language } = useTheme()
  const isDark = theme === "dark"
  const lang = (["pt", "en", "es", "fr", "zh"].includes(language) ? language : "en") as keyof typeof phraseSets.block1
  const dividerColor = isDark ? "via-white/10" : "via-black/10"

  return (
    <section className={`relative ${isDark ? "bg-black" : "bg-white"}`}>
      <div className={`h-px bg-gradient-to-r from-transparent ${dividerColor} to-transparent`} />

      <div className="h-[40vh]" />

      <StickyPhraseBlock phrases={phraseSets.block1[lang]} />

      <div className="h-[40vh]" />

      <StickyPhraseBlock phrases={phraseSets.block2[lang]} />

      <div className="h-[40vh]" />

      <StickyPhraseBlock phrases={phraseSets.block3[lang]} />

      <div className="h-[40vh]" />

      <div className={`h-px bg-gradient-to-r from-transparent ${dividerColor} to-transparent`} />

      <style jsx global>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  )
}
