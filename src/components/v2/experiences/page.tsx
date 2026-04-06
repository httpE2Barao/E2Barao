"use client"
import { useRef, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useTheme } from "@/components/switchers/switchers"

const experiences = [
  {
    period: "2023 - Present",
    role: {
      pt: "Engenheiro de Software",
      en: "Software Engineer",
      es: "Ingeniero de Software",
      fr: "Ingénieur Logiciel",
      zh: "软件工程师",
    },
    company: {
      pt: "Freelance",
      en: "Freelance",
      es: "Freelance",
      fr: "Freelance",
      zh: "自由职业",
    },
    description: {
      pt: "Construindo aplicações full-stack e soluções web para diversos clientes. Especializado em React, Next.js e tecnologias web modernas.",
      en: "Building full-stack applications and web solutions for diverse clients. Specializing in React, Next.js, and modern web technologies.",
      es: "Construyendo aplicaciones full-stack y soluciones web para diversos clientes. Especializado en React, Next.js y tecnologías web modernas.",
      fr: "Construction d'applications full-stack et de solutions web pour divers clients. Spécialisé en React, Next.js et technologies web modernes.",
      zh: "为不同客户构建全栈应用程序和Web解决方案。专注于React、Next.js和现代Web技术。",
    },
    highlight: true,
  },
  {
    period: "2022 - 2023",
    role: {
      pt: "Desenvolvedor Front-End",
      en: "Front-End Developer",
      es: "Desarrollador Front-End",
      fr: "Développeur Front-End",
      zh: "前端开发者",
    },
    company: {
      pt: "Vários Projetos",
      en: "Various Projects",
      es: "Varios Proyectos",
      fr: "Divers Projets",
      zh: "多个项目",
    },
    description: {
      pt: "Desenvolvi sites responsivos e aplicações web usando React, TypeScript e Tailwind CSS. Focado em performance e experiência do usuário.",
      en: "Developed responsive websites and web applications using React, TypeScript, and Tailwind CSS. Focused on performance and user experience.",
      es: "Desarrollé sitios web responsivos y aplicaciones web usando React, TypeScript y Tailwind CSS. Enfocado en rendimiento y experiencia del usuario.",
      fr: "Développement de sites responsifs et d'applications web avec React, TypeScript et Tailwind CSS. Axé sur la performance et l'expérience utilisateur.",
      zh: "使用React、TypeScript和Tailwind CSS开发响应式网站和Web应用程序。专注于性能和用户体验。",
    },
    highlight: false,
  },
  {
    period: "2021 - 2022",
    role: {
      pt: "Web Designer & Desenvolvedor",
      en: "Web Designer & Developer",
      es: "Diseñador Web & Desarrollador",
      fr: "Web Designer & Développeur",
      zh: "网页设计师与开发者",
    },
    company: {
      pt: "Independente",
      en: "Independent",
      es: "Independiente",
      fr: "Indépendant",
      zh: "独立",
    },
    description: {
      pt: "Criei sites personalizados e landing pages para pequenas empresas. Combinei design thinking com código limpo para entregar soluções completas.",
      en: "Created custom websites and landing pages for small businesses. Combined design thinking with clean code to deliver complete solutions.",
      es: "Creé sitios web personalizados y landing pages para pequeñas empresas. Combiné design thinking con código limpio para entregar soluciones completas.",
      fr: "Création de sites personnalisés et de landing pages pour les petites entreprises. Design thinking combiné à du code propre pour des solutions complètes.",
      zh: "为小型企业创建定制网站和着陆页。将设计思维与干净的代码相结合，提供完整的解决方案。",
    },
    highlight: false,
  },
  {
    period: "2020 - 2021",
    role: {
      pt: "Desenvolvedor Júnior",
      en: "Junior Developer",
      es: "Desarrollador Junior",
      fr: "Développeur Junior",
      zh: "初级开发者",
    },
    company: {
      pt: "Aprendendo & Crescendo",
      en: "Learning & Growing",
      es: "Aprendiendo & Creciendo",
      fr: "Apprentissage & Croissance",
      zh: "学习与成长",
    },
    description: {
      pt: "Período de estudo intensivo autodidata. Construí projetos de portfólio, aprendi o ecossistema React e contribuí para open source.",
      en: "Intensive self-study period. Built portfolio projects, learned React ecosystem, and contributed to open source.",
      es: "Período de estudio intensivo autodidacta. Construí proyectos de portafolio, aprendí el ecosistema React y contribuí a open source.",
      fr: "Période d'étude intensive autodidacte. Construction de projets de portfolio, apprentissage de l'écosystème React et contribution à l'open source.",
      zh: "密集的自学时期。构建作品集项目，学习React生态系统，并为开源项目做贡献。",
    },
    highlight: false,
  },
  {
    period: "2019 - 2020",
    role: {
      pt: "Suporte de TI & Redes",
      en: "IT Support & Networking",
      es: "Soporte de TI & Redes",
      fr: "Support IT & Réseaux",
      zh: "IT支持与网络",
    },
    company: {
      pt: "Fundação",
      en: "Foundation",
      es: "Fundación",
      fr: "Fondation",
      zh: "基础",
    },
    description: {
      pt: "Construí uma base sólida em infraestrutura de TI, redes e administração de sistemas. Certificação Cisco e experiência prática.",
      en: "Built strong foundation in IT infrastructure, networking, and systems administration. Cisco certification and hands-on experience.",
      es: "Construí una base sólida en infraestructura de TI, redes y administración de sistemas. Certificación Cisco y experiencia práctica.",
      fr: "Construction d'une base solide en infrastructure IT, réseaux et administration de systèmes. Certification Cisco et expérience pratique.",
      zh: "在IT基础设施、网络和系统管理方面建立了坚实的基础。思科认证和实践经验。",
    },
    highlight: false,
  },
]

const education = [
  {
    period: "2020 - 2024",
    degree: {
      pt: "Ciência da Computação",
      en: "Computer Science",
      es: "Ciencias de la Computación",
      fr: "Informatique",
      zh: "计算机科学",
    },
    school: {
      pt: "Universidade",
      en: "University",
      es: "Universidad",
      fr: "Université",
      zh: "大学",
    },
    description: {
      pt: "Bacharelado em Ciência da Computação com foco em engenharia de software e tecnologias web.",
      en: "Bachelor's degree in Computer Science with focus on software engineering and web technologies.",
      es: "Licenciatura en Ciencias de la Computación con enfoque en ingeniería de software y tecnologías web.",
      fr: "Licence en informatique avec focus sur le génie logiciel et les technologies web.",
      zh: "计算机科学学士学位，专注于软件工程和Web技术。",
    },
  },
  {
    period: "2019",
    degree: {
      pt: "Redes Cisco",
      en: "Cisco Networking",
      es: "Redes Cisco",
      fr: "Réseaux Cisco",
      zh: "思科网络",
    },
    school: {
      pt: "Certificação",
      en: "Certification",
      es: "Certificación",
      fr: "Certification",
      zh: "认证",
    },
    description: {
      pt: "Certificação CCNA em fundamentos de redes, roteamento e switching.",
      en: "CCNA certification in networking fundamentals, routing, and switching.",
      es: "Certificación CCNA en fundamentos de redes, enrutamiento y switching.",
      fr: "Certification CCNA en fondamentaux des réseaux, routage et commutation.",
      zh: "CCNA认证，涵盖网络基础、路由和交换。",
    },
  },
]

function TimelineItem({ exp, index, isLast, language }: { exp: typeof experiences[0]; index: number; isLast: boolean; language: string }) {
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

  const roleLabel = exp.role[language as keyof typeof exp.role] || exp.role.en
  const companyLabel = exp.company[language as keyof typeof exp.company] || exp.company.en
  const descLabel = exp.description[language as keyof typeof exp.description] || exp.description.en

  return (
    <motion.div
      ref={ref}
      style={{ opacity, x }}
      className="relative flex gap-8 md:gap-16 mb-16 md:mb-24"
    >
      {!isLast && (
        <div className={`absolute left-0 md:left-1/2 top-0 bottom-0 w-px ${lineBg}`}>
          <motion.div
            className={`w-full ${lineActive} origin-top`}
            style={{ scaleY: scrollYProgress }}
          />
        </div>
      )}

      <div className={`relative z-10 flex-shrink-0 w-4 h-4 rounded-full border-2 ${exp.highlight ? `${dotHighlightBorder} ${dotHighlightBg}` : `${dotBorder} ${dotBg}`} mt-2`}>
        {exp.highlight && (
          <motion.div
            className={`absolute inset-0 rounded-full ${dotPulse}`}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>

      <div className="flex-1">
        <p className={`${accentColor} text-sm font-mono mb-2`}>{exp.period}</p>
        <h3 className={`text-2xl md:text-3xl font-bold tracking-tight mb-1 ${textPrimary}`}>{roleLabel}</h3>
        <p className={`${textCompany} text-sm uppercase tracking-wider mb-4`}>{companyLabel}</p>
        <p className={`${textDesc} leading-relaxed max-w-2xl`}>{descLabel}</p>
      </div>
    </motion.div>
  )
}

function EducationItem({ edu, index, language }: { edu: typeof education[0]; index: number; language: string }) {
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

  const degreeLabel = edu.degree[language as keyof typeof edu.degree] || edu.degree.en
  const schoolLabel = edu.school[language as keyof typeof edu.school] || edu.school.en
  const descLabel = edu.description[language as keyof typeof edu.description] || edu.description.en

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      className={`${bgCard} backdrop-blur-sm border ${borderColor} ${hoverBorder} rounded-2xl p-8 transition-colors duration-500`}
    >
      <p className={`${accentColor} text-sm font-mono mb-2`}>{edu.period}</p>
      <h3 className={`text-xl font-bold tracking-tight mb-1 ${textPrimary}`}>{degreeLabel}</h3>
      <p className={`${textCompany} text-sm uppercase tracking-wider mb-4`}>{schoolLabel}</p>
      <p className={`${textDesc} leading-relaxed`}>{descLabel}</p>
    </motion.div>
  )
}

export function V2ExperiencesPage() {
  const [activeTab, setActiveTab] = useState<"experience" | "education">("experience")
  const { theme, language } = useTheme()
  const isDark = theme === "dark"

  const accentColor = isDark ? "text-cyan-400" : "text-blue-600"
  const textSubtle = isDark ? "text-white/20" : "text-black/20"
  const textMuted = isDark ? "text-white/30" : "text-black/30"
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

  return (
    <section className={`min-h-screen pt-[5rem] pb-10 sm:pb-14 ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className="px-6 sm:px-10 lg:px-16 xl:px-24 mb-12 sm:mb-16">
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
        <AnimatePresence mode="wait">
          {activeTab === "experience" ? (
            <motion.div
              key="exp"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {experiences.map((exp, i) => (
                <TimelineItem key={exp.role.en} exp={exp} index={i} isLast={i === experiences.length - 1} language={language} />
              ))}
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
              {education.map((edu, i) => (
                <EducationItem key={edu.degree.en} edu={edu} index={i} language={language} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
