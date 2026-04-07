"use client"
import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import Image from "next/image"
import { useTheme } from "@/components/switchers/switchers"

const approachSections = [
  {
    title: "Front-End",
    subtitle: "Development",
    description: {
      pt: "Construindo interfaces responsivas e performáticas com frameworks modernos. De designs pixel-perfect a aplicações interativas complexas, dou vida a designs com código limpo e manutenível.",
      en: "Building responsive, performant interfaces with modern frameworks. From pixel-perfect designs to complex interactive applications, I bring designs to life with clean, maintainable code.",
      es: "Construyendo interfaces responsivas y de alto rendimiento con frameworks modernos. De diseños pixel-perfect a aplicaciones interactivas complejas, doy vida a los diseños con código limpio y mantenible.",
      fr: "Construction d'interfaces responsives et performantes avec des frameworks modernes. Des designs pixel-perfect aux applications interactives complexes, je donne vie aux designs avec un code propre et maintenable.",
      zh: "使用现代框架构建响应式、高性能的界面。从像素级设计到复杂的交互式应用程序，我用干净、可维护的代码将设计变为现实。",
    },
    tags: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    image: "/images/modern-desktop-pop-neon.jpeg",
  },
  {
    title: "Back-End",
    subtitle: "Engineering",
    description: {
      pt: "Projetando soluções robustas do lado do servidor com arquiteturas escaláveis. Design de banco de dados, desenvolvimento de APIs e integração de sistemas para impulsionar experiências digitais perfeitas.",
      en: "Designing robust server-side solutions with scalable architectures. Database design, API development, and system integration to power seamless digital experiences.",
      es: "Diseñando soluciones robustas del lado del servidor con arquitecturas escalables. Diseño de bases de datos, desarrollo de APIs e integración de sistemas para impulsar experiencias digitales perfectas.",
      fr: "Conception de solutions serveur robustes avec des architectures évolutives. Conception de bases de données, développement d'API et intégration de systèmes pour alimenter des expériences numériques fluides.",
      zh: "使用可扩展的架构设计强大的服务器端解决方案。数据库设计、API 开发和系统集成，为无缝数字体验提供动力。",
    },
    tags: ["Node.js", "PostgreSQL", "Docker", "REST APIs"],
    image: "/images/futurist-city-modern-pop-neon-2.jpeg",
  },
  {
    title: "Design",
    subtitle: "UI / UX",
    description: {
      pt: "Criando experiências de usuário intuitivas fundamentadas em design thinking. De wireframes a protótipos de alta fidelidade, cada detalhe é considerado para máximo impacto e usabilidade.",
      en: "Crafting intuitive user experiences grounded in design thinking. From wireframes to high-fidelity prototypes, every detail is considered for maximum impact and usability.",
      es: "Creando experiencias de usuario intuitivas basadas en design thinking. De wireframes a prototipos de alta fidelidad, cada detalle es considerado para máximo impacto y usabilidad.",
      fr: "Création d'expériences utilisateur intuitives fondées sur le design thinking. Des wireframes aux prototypes haute fidélité, chaque détail est pensé pour un impact et une utilisabilité maximaux.",
      zh: "以设计思维为基础打造直观的用户体验。从线框图到高保真原型，每个细节都经过精心考虑，以实现最大的影响力和可用性。",
    },
    tags: ["Figma", "Prototyping", "Design Systems", "User Research"],
    image: "/images/img-homelife.jpeg",
  },
]

function ApproachCard({ section, index, language }: { section: typeof approachSections[0]; index: number; language: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const springProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20, restDelta: 0.001 })

  const y = useTransform(springProgress, [0, 0.5, 1], [80, 0, -80])
  const opacity = useTransform(springProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])
  const scale = useTransform(springProgress, [0, 0.15, 0.85, 1], [0.95, 1, 1, 0.95])

  const textMuted = isDark ? "text-white/50" : "text-black/50"
  const textSubtle = isDark ? "text-white/40" : "text-black/40"
  const accentColor = isDark ? "text-cyan-400" : "text-blue-600"
  const tagBg = isDark ? "bg-white/10" : "bg-black/5"
  const tagText = isDark ? "text-white/80" : "text-black/80"
  const tagBorder = isDark ? "border-white/10" : "border-black/10"

  const desc = section.description[language as keyof typeof section.description] || section.description.en

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity, scale }}
      className="relative group"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[80vh] py-20">
        <div className={`relative overflow-hidden rounded-2xl aspect-[4/3] ${index % 2 === 1 ? "lg:order-2" : ""}`}>
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"
          />
          <Image
            src={section.image}
            alt={section.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute bottom-6 left-6 right-6 z-20">
            <div className="flex flex-wrap gap-2">
              {section.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-3 py-1 ${tagBg} backdrop-blur-sm rounded-full text-xs ${tagText} border ${tagBorder}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          style={{ 
            x: useTransform(springProgress, [0, 0.5, 1], [30, 0, -30]),
          }}
          className="px-4"
        >
          <p className={`${accentColor} text-sm uppercase tracking-[0.3em] mb-4 font-mono`}>
            {section.subtitle}
          </p>
          <h3 className={`text-4xl md:text-6xl font-bold tracking-tighter mb-6`}>
            {section.title}<span className={accentColor}>.</span>
          </h3>
          <p className={`${textMuted} text-lg leading-relaxed max-w-lg`}>
            {desc}
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function V2Approach() {
  const { theme, language } = useTheme()
  const isDark = theme === "dark"
  const accentColor = isDark ? "text-cyan-400" : "text-blue-600"
  const textSubtle = isDark ? "text-white/20" : "text-black/20"
  const textMuted = isDark ? "text-white/30" : "text-black/30"
  const dotColor = isDark ? "bg-cyan-400" : "bg-blue-600"
  const borderColor = isDark ? "border-white/20" : "border-black/20"
  const dotInner = isDark ? "bg-cyan-400" : "bg-blue-600"

  const whatIDo = language === "pt" ? "O que eu faço" : language === "es" ? "Lo que hago" : language === "fr" ? "Ce que je fais" : language === "zh" ? "我做什么" : "What I do"
  const iActivate = language === "pt" ? "Eu ativo" : language === "es" ? "Yo activo" : language === "fr" ? "J'active" : language === "zh" ? "我激活" : "I activate"

  return (
    <section id="approach" className={`relative ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className="h-screen flex items-center justify-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center px-8"
        >
          <p className={`${accentColor} text-sm uppercase tracking-[0.3em] mb-6 font-mono`}>
            {whatIDo}
          </p>
          <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter">
            {iActivate}
            <br />
            <span className={textSubtle}>pixels</span>
            <span className={accentColor}>.</span>
          </h2>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`w-6 h-10 ${borderColor} border-2 rounded-full flex justify-center pt-2`}
        >
          <div className={`w-1 h-2 ${dotInner} rounded-full`} />
        </motion.div>
      </div>

      <div className="max-w-[1800px] mx-auto px-8">
        {approachSections.map((section, i) => (
          <ApproachCard key={section.title} section={section} index={i} language={language} />
        ))}
      </div>
    </section>
  )
}
