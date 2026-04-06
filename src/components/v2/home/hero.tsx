"use client"
import { useTheme } from "@/components/switchers/switchers"
import Spline from "@splinetool/react-spline"
import { AnimatePresence, motion } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"
import { useInView } from "react-intersection-observer"
import { useWelcomeAudio, useSpeech } from "@/hooks/use-welcome-audio"

const MUTE_KEY = "e2barao-audio-muted"

const robotPhrases = [
  { pt: "Olá! Eu sou o Cógnis.", en: "Hi! I'm Cógnis.", es: "¡Hola! Soy Cógnis.", fr: "Salut ! Je suis Cógnis.", zh: "你好！我是 Cógnis。" },
  { pt: "Assistente de IA do Elias Barão.", en: "Elias Barão's AI assistant.", es: "Asistente de IA de Elias Barão.", fr: "Assistant IA d'Elias Barão.", zh: "Elias Barão 的 AI 助手。" },
  { pt: "Pergunte-me sobre projetos, skills ou experiências.", en: "Ask me about projects, skills or experience.", es: "Pregúntame sobre proyectos, habilidades o experiencia.", fr: "Demandez-moi des projets, compétences ou expériences.", zh: "问我关于项目、技能或经验的问题。" },
  { pt: "Interaja comigo — estou aqui para ajudar.", en: "Interact with me — I'm here to help.", es: "Interactúa conmigo — estoy aquí para ayudar.", fr: "Interagissez avec moi — je suis là pour aider.", zh: "与我互动——我在这里帮助您。" },
]

export function V2HomeHero() {
  const { theme, language } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [aiInput, setAiInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [showInput, setShowInput] = useState(true)
  const { preload, playWelcome } = useWelcomeAudio(language)
  const { speak, stopAudio } = useSpeech()
  const [chatResponse, setChatResponse] = useState("")
  const [showResponse, setShowResponse] = useState(false)
  const [isResponding, setIsResponding] = useState(false)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(MUTE_KEY)
      return saved !== null ? saved === "true" : true
    }
    return true
  })

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = "auto"
    textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`
  }, [aiInput])

  const isDark = theme === "dark"

  const subtitles =
    language === "pt"
      ? ["Designer & Desenvolvedor", "Engenheiro de Software"]
      : language === "es"
      ? ["Diseñador & Desarrollador", "Ingeniero de Software"]
      : language === "fr"
      ? ["Designer & Développeur", "Ingénieur Logiciel"]
      : language === "zh"
      ? ["设计师 & 开发者", "软件工程师"]
      : ["Designer & Developer", "Software Engineer"]

  const hasInteracted = useRef(false)

  const toggleMute = useCallback(async () => {
    if (!isMuted) {
      stopAudio()
    }
    setIsMuted((prev) => {
      const newValue = !prev
      localStorage.setItem(MUTE_KEY, String(newValue))
      return newValue
    })
    if (isMuted) {
      await preload()
      hasInteracted.current = true
      playWelcome()
    }
  }, [isMuted, preload, playWelcome, stopAudio])

  const handleLoad = () => {
    setIsLoading(false)
    if (!isMuted) {
      preload()
    }
  }

  // Play audio on first user interaction (click, keydown, etc.) - only if not muted
  const handleFirstInteraction = useCallback(() => {
    if (hasInteracted.current || isMuted) return
    hasInteracted.current = true
    playWelcome()
  }, [playWelcome, isMuted])

  // Auto-cycle robot phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % robotPhrases.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Show input after phrases cycle once
  useEffect(() => {
    const timer = setTimeout(() => setShowInput(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  // Listen for first user interaction to play audio
  useEffect(() => {
    const handleInteraction = () => {
      handleFirstInteraction()
      window.removeEventListener("click", handleInteraction)
      window.removeEventListener("keydown", handleInteraction)
      window.removeEventListener("touchstart", handleInteraction)
    }
    window.addEventListener("click", handleInteraction, { once: true })
    window.addEventListener("keydown", handleInteraction, { once: true })
    window.addEventListener("touchstart", handleInteraction, { once: true })
    return () => {
      window.removeEventListener("click", handleInteraction)
      window.removeEventListener("keydown", handleInteraction)
      window.removeEventListener("touchstart", handleInteraction)
    }
  }, [handleFirstInteraction])

  // When user unmutes, preload and play audio
  useEffect(() => {
    if (!isMuted && !hasInteracted.current) {
      preload().then(() => {
        hasInteracted.current = true
        playWelcome()
      })
    }
  }, [isMuted, preload, playWelcome])

  const handleSend = async () => {
    if (!aiInput.trim()) return
    const userInput = aiInput.trim()
    setAiInput("")
    setIsTyping(true)
    setShowResponse(false)
    setIsResponding(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput, language }),
      })

      if (!res.ok) throw new Error("Chat API failed")

      const data = await res.json()
      const reply = data.reply || (language === "pt"
        ? "Desculpe, não consegui processar sua mensagem."
        : language === "es"
        ? "Lo siento, no pude procesar tu mensaje."
        : language === "fr"
        ? "Désolé, je n'ai pas pu traiter votre message."
        : language === "zh"
        ? "抱歉，我无法处理您的消息。"
        : "Sorry, I couldn't process your message.")

      setIsTyping(false)
      setIsResponding(false)
      setChatResponse(reply)
      setShowResponse(true)
      speak(reply, language)
    } catch (err) {
      console.error("[Chat] Erro:", err)
      setIsTyping(false)
      setIsResponding(false)
      const fallbackReply = language === "pt"
        ? "Desculpe, estou com dificuldades no momento. Tente novamente."
        : language === "es"
        ? "Lo siento, estoy teniendo problemas en este momento. Inténtalo de nuevo."
        : language === "fr"
        ? "Désolé, je rencontre des difficultés pour le moment. Réessayez."
        : language === "zh"
        ? "抱歉，我现在遇到了困难。请再试一次。"
        : "Sorry, I'm having trouble right now. Try again."
      setChatResponse(fallbackReply)
      setShowResponse(true)
      speak(fallbackReply, language)
    }
  }

  const textSubtle = isDark ? "text-white/20" : "text-black/20"
  const textPrimary = isDark ? "text-white" : "text-black"
  const accentColor = isDark ? "text-cyan-400" : "text-blue-600"
  const textMuted = isDark ? "text-white/50" : "text-black/50"
  const btnBg = isDark ? "bg-cyan-400 hover:bg-cyan-300 text-black" : "bg-blue-600 hover:bg-blue-500 text-white"
  const btnOutline = isDark ? "border-white/20 text-white hover:border-cyan-400 hover:text-cyan-400" : "border-black/20 text-black hover:border-blue-600 hover:text-blue-600"
  const bubbleBg = isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
  const placeholderText = isDark ? "placeholder-white/20" : "placeholder-black/20"
  const scrollText = isDark ? "text-white/30" : "text-black/30"
  const scrollBar = isDark ? "from-white/30" : "from-black/30"
  const scrollDot = isDark ? "bg-cyan-400" : "bg-blue-600"

  return (
    <section className={`relative h-[calc(100vh-4.5rem)] flex flex-col lg:flex-row items-stretch overflow-hidden ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      {/* Noise overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}
      />

      {/* Left - Text */}
      <div className="relative z-10 flex flex-col justify-center px-6 sm:px-10 lg:px-12 xl:px-20 py-6 lg:py-2 flex-shrink-0 lg:w-[52%] xl:w-[50%]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className={`${accentColor} text-[10px] sm:text-xs uppercase tracking-[0.25em] mb-2 font-mono`}>
            Portfolio 2026
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tighter leading-[0.9] mb-3"
        >
          Elias
          <br />
          <span className={textSubtle}>Edson</span>
          <br />
          Barão<span className={accentColor}>.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col gap-1 mb-4"
        >
          {subtitles.map((sub, i) => (
            <motion.p
              key={sub}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className={`${textMuted} text-sm sm:text-base font-light tracking-wide`}
            >
              {sub}
            </motion.p>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap gap-2.5 items-center"
        >
          <a
            href="#approach"
            className={`px-4 py-2 ${btnBg} font-semibold rounded-full transition-colors text-[11px] sm:text-xs uppercase tracking-wider`}
          >
            {language === "pt" ? "Descubra mais" : language === "es" ? "Descubra más" : language === "fr" ? "Découvrir plus" : language === "zh" ? "了解更多" : "Discover more"}
          </a>
          <a
            href="/v2/projects"
            className={`px-4 py-2 border ${btnOutline} rounded-full transition-colors text-[11px] sm:text-xs uppercase tracking-wider`}
          >
            {language === "pt" ? "Ver projetos" : language === "es" ? "Ver proyectos" : language === "fr" ? "Voir les projets" : language === "zh" ? "查看项目" : "View projects"}
          </a>
        </motion.div>
      </div>

      {/* Right - 3D + Robot speech */}
      <div ref={ref} className="relative flex-shrink-0 lg:w-[48%] xl:w-[50%] flex flex-col items-center justify-center min-h-0">
        {/* Mute button - centered on robot */}
        <button
          onClick={toggleMute}
          className={`absolute z-20 p-4 rounded-full border ${btnOutline} transition-all hover:scale-110 active:scale-95 ${
            isMuted ? "opacity-70" : "opacity-90"
          }`}
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          title={isMuted ? (language === "pt" ? "Ativar áudio" : language === "es" ? "Activar audio" : language === "fr" ? "Activer l'audio" : language === "zh" ? "开启音频" : "Enable audio") : (language === "pt" ? "Silenciar" : language === "es" ? "Silenciar" : language === "fr" ? "Couper le son" : language === "zh" ? "静音" : "Mute")}
        >
          {isMuted ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>

        {/* 3D Model */}
        <div className="relative w-full h-[35vh] sm:h-[40vh] md:h-[45vh] lg:h-[55vh] xl:h-[60vh] flex-shrink-0">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className={`w-8 h-8 border-2 border-t-transparent ${accentColor} rounded-full animate-spin`} />
            </div>
          )}
          {inView && (
            <Spline
              scene="./scene.splinecode"
              onLoad={handleLoad}
              className="w-full h-full"
            />
          )}
        </div>

        {/* Robot speech bubble - minimalist */}
        <div className="w-full px-4 sm:px-6 lg:px-4 flex-shrink-0 -mt-2 sm:-mt-4">
          <div className="max-w-md mx-auto">
            {/* Speech bubble */}
            <AnimatePresence mode="wait">
              {isResponding ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4 }}
                  className={`${bubbleBg} backdrop-blur-sm border rounded-xl px-3 py-3 text-center relative`}
                >
                  <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 ${isDark ? "bg-white/5" : "bg-black/5"} border-t ${isDark ? "border-white/10" : "border-black/10"} border-l rotate-45`} />
                  <div className="flex justify-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className={`w-2 h-2 rounded-full ${accentColor.replace("text-", "bg-")}`}
                        animate={{ y: ["0%", "-6px", "0%"] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : showResponse ? (
                <motion.div
                  key="response"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4 }}
                  className={`${bubbleBg} backdrop-blur-sm border rounded-xl px-3 py-2 text-center relative`}
                >
                  <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 ${isDark ? "bg-white/5" : "bg-black/5"} border-t ${isDark ? "border-white/10" : "border-black/10"} border-l rotate-45`} />
                  <p className={`text-[11px] sm:text-xs ${textPrimary} leading-relaxed max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent`}>
                    {chatResponse}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={currentPhrase}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4 }}
                  className={`${bubbleBg} backdrop-blur-sm border rounded-xl px-3 py-2 text-center relative`}
                >
                  <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 ${isDark ? "bg-white/5" : "bg-black/5"} border-t ${isDark ? "border-white/10" : "border-black/10"} border-l rotate-45`} />
                  <p className={`text-[11px] sm:text-xs ${textMuted} leading-relaxed`}>
                    {language === "pt" ? robotPhrases[currentPhrase].pt : language === "es" ? robotPhrases[currentPhrase].es : language === "fr" ? robotPhrases[currentPhrase].fr : language === "zh" ? robotPhrases[currentPhrase].zh : robotPhrases[currentPhrase].en}
                  </p>
                  <div className="flex justify-center gap-1 mt-1.5">
                    {robotPhrases.map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-1 rounded-full transition-colors ${
                          i === currentPhrase ? accentColor.replace("text-", "bg-") : isDark ? "bg-white/20" : "bg-black/20"
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Minimalist input - appears after phrases */}
            {showInput && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-2"
              >
                <div
                  onClick={() => {
                    textareaRef.current?.focus()
                    if (isMuted) {
                      toggleMute()
                    }
                  }}
                  className={`flex items-end gap-2 ${isDark ? "bg-white/5 border-cyan-400/30 focus-within:border-cyan-400/60" : "bg-black/5 border-blue-600/30 focus-within:border-blue-600/60"} backdrop-blur-sm border rounded-xl px-3 py-2.5 transition-colors cursor-text`}
                >
                  <textarea
                    ref={textareaRef}
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                    placeholder={language === "pt" ? "Interaja comigo..." : language === "es" ? "Interactúa conmigo..." : language === "fr" ? "Interagissez avec moi..." : language === "zh" ? "与我互动..." : "Interact with me..."}
                    className={`flex-1 bg-transparent text-xs ${textPrimary} ${isDark ? "placeholder-cyan-400/40" : "placeholder-blue-600/40"} outline-none min-w-0 resize-none max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent leading-relaxed cursor-text`}
                    rows={1}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSend()
                    }}
                    disabled={!aiInput.trim() || isTyping}
                    className={`w-7 h-7 rounded-full ${btnBg} flex items-center justify-center disabled:opacity-30 transition-all flex-shrink-0 mb-0.5 hover:scale-110 active:scale-95`}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M22 2L11 13" />
                      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
      >
        <span className={`text-[8px] uppercase tracking-[0.3em] ${scrollText}`}>Scroll</span>
        <div className={`w-px h-6 bg-gradient-to-b ${scrollBar} to-transparent relative overflow-hidden`}>
          <motion.div
            className={`w-full h-2 ${scrollDot}`}
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  )
}
