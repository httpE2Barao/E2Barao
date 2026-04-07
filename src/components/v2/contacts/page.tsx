"use client"
import { useTheme } from "@/components/switchers/switchers"
import { motion, useScroll, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"

const contactLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/e2barao/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    description: { pt: "Conexão profissional", en: "Professional connection", es: "Conexión profesional", fr: "Connexion professionnelle", zh: "职业联系" },
  },
  {
    label: "GitHub",
    href: "https://github.com/httpE2Barao",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    description: { pt: "Veja meu código", en: "Check out my code", es: "Mira mi código", fr: "Voir mon code", zh: "查看我的代码" },
  },
  {
    label: "Email",
    href: "mailto:e2barao@hotmail.com",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    description: { pt: "Envie uma mensagem", en: "Send a message", es: "Enviar un mensaje", fr: "Envoyer un message", zh: "发送消息" },
  },
]

function ContactCard({ link, index }: { link: typeof contactLinks[0]; index: number }) {
  const [copied, setCopied] = useState(false)
  const { theme, language } = useTheme()
  const isDark = theme === "dark"

  const handleClick = () => {
    if (link.label === "Email") {
      navigator.clipboard?.writeText("e2barao@hotmail.com")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const accentColor = isDark ? "text-cyan-400" : "text-blue-600"
  const accentBg = isDark ? "bg-cyan-400/10" : "bg-blue-600/10"
  const accentBgHover = isDark ? "bg-cyan-400/20" : "bg-blue-600/20"
  const textMuted = isDark ? "text-white/40" : "text-black/40"
  const textPrimary = isDark ? "text-white" : "text-black"
  const bgCard = isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
  const hoverBorder = isDark ? "hover:border-cyan-400/30" : "hover:border-blue-600/30"
  const copiedBg = isDark ? "bg-cyan-400 text-black" : "bg-blue-600 text-white"

  return (
    <motion.a
      href={link.href}
      target={link.label !== "Email" ? "_blank" : undefined}
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.01 }}
      onClick={handleClick}
      className={`relative group ${bgCard} border rounded-2xl p-5 sm:p-6 ${hoverBorder} transition-all duration-500 cursor-pointer block`}
    >
      <div className={`w-11 h-11 rounded-xl ${accentBg} flex items-center justify-center ${accentColor} mb-4 group-hover:${accentBgHover} transition-colors`}>
        {link.icon}
      </div>
      <h3 className={`text-lg sm:text-xl font-bold tracking-tight mb-1 ${textPrimary}`}>{link.label}</h3>
      <p className={`${textMuted} text-xs`}>{
        language === "pt" ? link.description.pt :
        language === "es" ? link.description.es :
        language === "fr" ? link.description.fr :
        language === "zh" ? link.description.zh :
        link.description.en
      }</p>

      {copied && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`absolute top-3 right-3 px-2.5 py-1 ${copiedBg} text-[10px] font-semibold rounded-full`}
        >
          {language === "pt" ? "Copiado!" : language === "es" ? "¡Copiado!" : language === "fr" ? "Copié !" : language === "zh" ? "已复制！" : "Copied!"}
        </motion.div>
      )}
    </motion.a>
  )
}

function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const { theme, language } = useTheme()
  const isDark = theme === "dark"

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage(language === "pt" ? "Preencha todos os campos" : language === "es" ? "Complete todos los campos" : language === "fr" ? "Remplissez tous les champs" : language === "zh" ? "请填写所有字段" : "Fill in all fields")
      return
    }

    if (!validateEmail(formData.email)) {
      setErrorMessage(language === "pt" ? "Email inválido" : language === "es" ? "Email inválido" : language === "fr" ? "Email invalide" : language === "zh" ? "邮箱无效" : "Invalid email")
      return
    }

    if (formData.name.trim().length < 2) {
      setErrorMessage(language === "pt" ? "Nome deve ter pelo menos 2 caracteres" : language === "es" ? "El nombre debe tener al menos 2 caracteres" : language === "fr" ? "Le nom doit avoir au moins 2 caractères" : language === "zh" ? "姓名至少2个字符" : "Name must be at least 2 characters")
      return
    }

    if (formData.message.trim().length < 10) {
      setErrorMessage(language === "pt" ? "Mensagem deve ter pelo menos 10 caracteres" : language === "es" ? "El mensaje debe tener al menos 10 caracteres" : language === "fr" ? "Le message doit avoir au moins 10 caractères" : language === "zh" ? "消息至少10个字符" : "Message must be at least 10 characters")
      return
    }

    setStatus("loading")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar mensagem")
      }

      setStatus("success")
      setFormData({ name: "", email: "", message: "" })
      setTimeout(() => setStatus("idle"), 3000)
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : language === "pt" ? "Erro ao enviar mensagem" : language === "es" ? "Error al enviar mensaje" : language === "fr" ? "Erreur lors de l'envoi" : language === "zh" ? "发送失败" : "Failed to send message")
      setTimeout(() => {
        setStatus("idle")
        setErrorMessage("")
      }, 5000)
    }
  }

  const accentColor = isDark ? "text-cyan-400" : "text-blue-600"
  const textMuted = isDark ? "text-white/40" : "text-black/40"
  const textPrimary = isDark ? "text-white" : "text-black"
  const placeholderText = isDark ? "placeholder-white/20" : "placeholder-black/20"
  const bgInput = isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
  const focusBorder = isDark ? "focus:border-cyan-400/50" : "focus:border-blue-600/50"
  const btnBg = isDark ? "bg-cyan-400 text-black hover:bg-cyan-300" : "bg-blue-600 text-white hover:bg-blue-500"
  const btnDisabled = "opacity-60 cursor-not-allowed"
  const errorBg = isDark ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-red-50 border-red-300 text-red-600"
  const successBg = isDark ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-green-50 border-green-300 text-green-600"

  const nameLabel = language === "pt" ? "Nome" : language === "es" ? "Nombre" : language === "fr" ? "Nom" : language === "zh" ? "姓名" : "Name"
  const emailLabel = language === "pt" ? "Email" : language === "es" ? "Correo" : language === "fr" ? "Email" : language === "zh" ? "邮箱" : "Email"
  const messageLabel = language === "pt" ? "Mensagem" : language === "es" ? "Mensaje" : language === "fr" ? "Message" : language === "zh" ? "留言" : "Message"
  const namePlaceholder = language === "pt" ? "Seu nome" : language === "es" ? "Tu nombre" : language === "fr" ? "Votre nom" : language === "zh" ? "您的姓名" : "Your name"
  const emailPlaceholder = language === "pt" ? "seu@email.com" : language === "es" ? "tu@email.com" : language === "fr" ? "votre@email.com" : language === "zh" ? "您的邮箱" : "your@email.com"
  const messagePlaceholder = language === "pt" ? "Conte-me sobre seu projeto..." : language === "es" ? "Cuéntame sobre tu proyecto..." : language === "fr" ? "Parlez-moi de votre projet..." : language === "zh" ? "告诉我您的项目..." : "Tell me about your project..."
  const sendLabel = language === "pt" ? "Enviar Mensagem" : language === "es" ? "Enviar Mensaje" : language === "fr" ? "Envoyer" : language === "zh" ? "发送消息" : "Send Message"
  const sendingLabel = language === "pt" ? "Enviando..." : language === "es" ? "Enviando..." : language === "fr" ? "Envoi..." : language === "zh" ? "发送中..." : "Sending..."
  const sentLabel = language === "pt" ? "Mensagem Enviada!" : language === "es" ? "¡Mensaje Enviado!" : language === "fr" ? "Message Envoyé!" : language === "zh" ? "消息已发送！" : "Message Sent!"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === "error" && errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-xl border text-xs ${errorBg}`}
        >
          {errorMessage}
        </motion.div>
      )}

      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-xl border text-xs ${successBg}`}
        >
          {sentLabel}
        </motion.div>
      )}

      <div>
        <label className={`block text-[10px] uppercase tracking-wider ${textMuted} mb-1.5`}>{nameLabel}</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full ${bgInput} border rounded-xl px-4 py-3 ${textPrimary} ${placeholderText} outline-none ${focusBorder} transition-colors text-sm`}
          placeholder={namePlaceholder}
          disabled={status === "loading"}
        />
      </div>
      <div>
        <label className={`block text-[10px] uppercase tracking-wider ${textMuted} mb-1.5`}>{emailLabel}</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full ${bgInput} border rounded-xl px-4 py-3 ${textPrimary} ${placeholderText} outline-none ${focusBorder} transition-colors text-sm`}
          placeholder={emailPlaceholder}
          disabled={status === "loading"}
        />
      </div>
      <div>
        <label className={`block text-[10px] uppercase tracking-wider ${textMuted} mb-1.5`}>{messageLabel}</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
          className={`w-full ${bgInput} border rounded-xl px-4 py-3 ${textPrimary} ${placeholderText} outline-none ${focusBorder} transition-colors resize-none text-sm`}
          placeholder={messagePlaceholder}
          disabled={status === "loading"}
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className={`w-full py-3 ${btnBg} ${status === "loading" ? btnDisabled : ""} font-semibold rounded-xl transition-colors text-xs uppercase tracking-wider relative overflow-hidden`}
      >
        {status === "loading" ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {sendingLabel}
          </span>
        ) : status === "success" ? (
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            {sentLabel}
          </motion.span>
        ) : (
          sendLabel
        )}
      </button>
    </form>
  )
}

export function V2ContactsPage() {
  const ref = useRef<HTMLDivElement>(null)
  const { theme, language } = useTheme()
  const isDark = theme === "dark"
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], [0, -150])
  const [cvUrl, setCvUrl] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/cv/download")
      .then((r) => r.json())
      .then((data) => {
        if (data.url) setCvUrl(data.url)
      })
      .catch(() => setCvUrl(null))
  }, [])

  const accentColor = isDark ? "text-cyan-400" : "text-blue-600"
  const textSubtle = isDark ? "text-white/20" : "text-black/20"
  const textMuted = isDark ? "text-white/40" : "text-black/40"
  const textPrimary = isDark ? "text-white" : "text-black"
  const bgGlow = isDark ? "bg-cyan-400/5" : "bg-blue-600/5"
  const bgCard = isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
  const hoverBorder = isDark ? "hover:border-cyan-400/30" : "hover:border-blue-600/30"
  const accentBg = isDark ? "bg-cyan-400/10" : "bg-blue-600/10"
  const accentBgHover = isDark ? "bg-cyan-400/20" : "bg-blue-600/20"
  const textSubtleSmall = isDark ? "text-white/40" : "text-black/40"

  const title = language === "pt" ? "Contato" : language === "es" ? "Contacto" : language === "fr" ? "Contact" : language === "zh" ? "联系" : "Contacts"
  const subtitle = language === "pt" ? "Entre em Contato" : language === "es" ? "Ponte en Contacto" : language === "fr" ? "Contactez-nous" : language === "zh" ? "取得联系" : "Get in Touch"
  const desc = language === "pt" ? "Tem um projeto em mente? Vamos criar algo incrível juntos." : language === "es" ? "¿Tienes un proyecto en mente? Creemos algo increíble juntos." : language === "fr" ? "Un projet en tête? Créons quelque chose d'incroyable ensemble." : language === "zh" ? "有项目想法？让我们一起创造精彩。" : "Have a project in mind? Let's create something amazing together."
  const connectLabel = language === "pt" ? "Conectar" : language === "es" ? "Conectar" : language === "fr" ? "Connecter" : language === "zh" ? "联系" : "Connect"
  const messageLabel = language === "pt" ? "Mensagem" : language === "es" ? "Mensaje" : language === "fr" ? "Message" : language === "zh" ? "留言" : "Message"
  const cvLabel = language === "pt" ? "Baixar CV" : language === "es" ? "Descargar CV" : language === "fr" ? "Télécharger CV" : language === "zh" ? "下载简历" : "Download CV"
  const cvFormat = language === "pt" ? "Formato PDF" : language === "es" ? "Formato PDF" : language === "fr" ? "Format PDF" : language === "zh" ? "PDF格式" : "PDF format"

  return (
    <section ref={ref} className={`min-h-screen pt-[5rem] pb-12 sm:pb-16 relative overflow-visible ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
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

      <div className="px-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <h2 className={`text-xl sm:text-2xl font-bold tracking-tight mb-6 ${textPrimary}`}>
              {connectLabel}<span className={accentColor}>.</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {contactLinks.map((link, i) => (
                <ContactCard key={link.label} link={link} index={i} />
              ))}
            </div>

            <motion.a
              href={cvUrl || "/CV-EliasBarao.pdf"}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -3 }}
              className={`mt-6 flex items-center gap-3 px-4 py-3 ${bgCard} border rounded-xl ${hoverBorder} transition-colors group`}
            >
              <div className={`w-9 h-9 rounded-lg ${accentBg} flex items-center justify-center ${accentColor} group-hover:${accentBgHover} transition-colors flex-shrink-0`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <div>
                <p className={`text-xs font-semibold ${textPrimary}`}>{cvLabel}</p>
                <p className={`text-[10px] ${textSubtleSmall}`}>{cvFormat}</p>
              </div>
            </motion.a>
          </div>

          <div>
            <h2 className={`text-xl sm:text-2xl font-bold tracking-tight mb-6 ${textPrimary}`}>
              {messageLabel}<span className={accentColor}>.</span>
            </h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
