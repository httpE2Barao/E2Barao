"use client"
import { useTheme } from "@/components/switchers/switchers"
import dynamic from "next/dynamic"
import { AnimatePresence, motion } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"
import { useInView } from "react-intersection-observer"
import { useWelcomeAudio, useSpeech } from "@/hooks/use-welcome-audio"

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => null
})

const MUTE_KEY = "e2barao-audio-muted"
const PLAYED_KEY = "e2barao-audio-played"

const loadingPhrases = {
  pt: ["Pensando", "Processando", "Analisando", "Buscando", "Calculando"],
  en: ["Thinking", "Processing", "Analyzing", "Searching", "Calculating"],
  es: ["Pensando", "Procesando", "Analizando", "Buscando", "Calculando"],
  fr: ["Réflexion", "Traitement", "Analyse", "Recherche", "Calcul"],
  zh: ["思考中", "处理中", "分析中", "搜索中", "计算中"],
}

const welcomePhrases = {
  first: {
    pt: ["Olá! Eu sou o Cógnis.", "Assistente de IA do Elias Barão.", "Pergunte-me sobre projetos, skills ou experiências.", "Interaja comigo — estou aqui para ajudar."],
    en: ["Hi! I'm Cógnis.", "Elias Barão's AI assistant.", "Ask me about projects, skills or experience.", "Interact with me — I'm here to help."],
    es: ["¡Hola! Soy Cógnis.", "Asistente de IA de Elias Barão.", "Pregúntame sobre proyectos, habilidades o experiencia.", "Interactúa conmigo — estás para ayudar."],
    fr: ["Salut ! Je suis Cógnis.", "Assistant IA d'Elias Barão.", "Demandez-moi des projets, compétences ou expériences.", "Interagissez avec moi — je suis là pour aider."],
    zh: ["你好！我是 Cógnis。", "Elias Barão 的 AI 助手。", "问我关于项目、技能或经验的问题。", "与我互动——我在这里帮助您。"],
  },
  returning: {
    pt: ["Oi de novo!", "Fico feliz em te ver de volta!", "Sobrou alguma dúvida?", "Em que posso ajudar?"],
    en: ["Hi again!", "Happy to see you back!", "Any questions?", "How can I help?"],
    es: ["¡Hola de nuevo!", "¡Me alegra verte de vuelta!", "¿Tienes alguna duda?", "¿En qué puedo ayudar?"],
    fr: ["Salut encore!", "Content de te revoir!", "Des questions?", "Comment puis-je aider?"],
    zh: ["你好 again!", "很高兴见到你回来!", "有什么问题吗?", "我能帮你什么?"],
  },
}

export function V2HomeHeroV2() {
  const { theme, language } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [aiInput, setAiInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [showInput, setShowInput] = useState(true)
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(MUTE_KEY)
      return saved !== null ? saved === "true" : true
    }
    return true
  })
  const [hasPlayedBefore, setHasPlayedBefore] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(PLAYED_KEY) === "true"
    }
    return false
  })
  const { preload, playWelcome, stopAudio: stopWelcomeAudio } = useWelcomeAudio(language, hasPlayedBefore)
  const { speak, stopAudio } = useSpeech()
  const [chatResponse, setChatResponse] = useState("")
  const [showResponse, setShowResponse] = useState(false)
  const [isResponding, setIsResponding] = useState(false)
  const { ref: splineRef, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [hasUnmutedOnce, setHasUnmutedOnce] = useState(false)
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0)

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = "auto"
    textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`
  }, [aiInput])

  const isDark = theme === "dark"

  const fullName = "Elias Edson Barão"
  
  const title = language === "pt" 
    ? "Software &\nAutomation Engineer" 
    : language === "es"
    ? "Ingeniero de Software"
    : language === "fr"
    ? "Ingénieur Logiciel"
    : language === "zh"
    ? "软件工程师"
    : "Software &\nEngineer"

  const hasInteracted = useRef(false)

  const toggleMute = useCallback(async () => {
    if (!isMuted) {
      stopAudio()
      stopWelcomeAudio()
      setIsMuted(true)
      localStorage.setItem(MUTE_KEY, "true")
      return
    }
    setIsMuted(false)
    localStorage.setItem(MUTE_KEY, "false")
    if (!hasUnmutedOnce) {
      setHasUnmutedOnce(true)
    }
    localStorage.setItem(PLAYED_KEY, "true")
    setHasPlayedBefore(true)
    await preload()
    hasInteracted.current = true
    playWelcome()
  }, [isMuted, preload, playWelcome, stopAudio, stopWelcomeAudio, hasUnmutedOnce])

  useEffect(() => {
    preload()
  }, [preload])

  const handleLoad = () => {
    setIsLoading(false)
    if (!isMuted) {
      preload()
    }
  }

  const handleFirstInteraction = useCallback(() => {
    if (hasInteracted.current || isMuted) return
    hasInteracted.current = true
    playWelcome()
  }, [playWelcome, isMuted])

  const phrases = hasPlayedBefore ? welcomePhrases.returning[language as keyof typeof welcomePhrases.returning] : welcomePhrases.first[language as keyof typeof welcomePhrases.first]
  const currentPhrases = phrases || welcomePhrases.first.en

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % currentPhrases.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [currentPhrases.length])

  useEffect(() => {
    const timer = setTimeout(() => setShowInput(true), 5000)
    return () => clearTimeout(timer)
  }, [])

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

  useEffect(() => {
    if (!isResponding) {
      setLoadingPhraseIndex(0)
      return
    }
    const interval = setInterval(() => {
      setLoadingPhraseIndex((prev) => (prev + 1) % loadingPhrases[language as keyof typeof loadingPhrases].length)
    }, 2000)
    return () => clearInterval(interval)
  }, [isResponding, language])

  useEffect(() => {
    if (!isMuted && !hasInteracted.current) {
      localStorage.setItem(PLAYED_KEY, "true")
      setHasPlayedBefore(true)
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
      speak(reply, language, () => {
        setShowResponse(false)
        setChatResponse("")
      })
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
      speak(fallbackReply, language, () => {
        setShowResponse(false)
        setChatResponse("")
      })
    }
  }

  const textSubtle = isDark ? "text-white/20" : "text-black/20"
  const textPrimary = isDark ? "text-white" : "text-black"
  const accentColor = isDark ? "text-cyan-400" : "text-blue-600"
  const textMuted = isDark ? "text-white/50" : "text-black/50"
  const btnBg = isDark ? "bg-cyan-400 hover:bg-cyan-300 text-black" : "bg-blue-600 hover:bg-blue-500 text-white"
  const btnOutline = isDark ? "border-white/20 text-white hover:border-cyan-400 hover:text-cyan-400" : "border-black/20 text-black hover:border-blue-600 hover:text-blue-600"
  const bubbleBg = isDark ? "bg-white/90 border-white/50" : "bg-black/90 border-black/50"
  const bubbleText = isDark ? "text-black" : "text-white"
  const scrollDot = isDark ? "bg-cyan-400" : "bg-blue-600"

  return (
    <section className={`relative h-[calc(100vh-4.5rem)] flex flex-col overflow-hidden ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}
      />

      {/* Nome grande sutil - Topo Esquerdo */}
      <div className="absolute top-16 sm:top-20 left-3 sm:left-6 z-0 pointer-events-none overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="select-none"
        >
          <h1 className={`text-[2.5rem] sm:text-[3rem] md:text-[4rem] lg:text-[5rem] xl:text-[6rem] font-bold tracking-tighter leading-[0.9] ${textPrimary}`}>
            {fullName.split(" ").map((name, i, arr) => (
              <span key={i} className="block">
                {name}
                {i === arr.length - 1 && <span className={accentColor.replace("text-", "text-")}>.</span>}
              </span>
            ))}
          </h1>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`text-[0.7rem] sm:text-[0.8rem] md:text-[0.9rem] uppercase tracking-[0.25em] mt-2 ${textPrimary} select-none font-medium break-words max-w-[90%]`}
          >
            <span className="whitespace-pre-wrap">{title}</span>
          </motion.h2>
        </motion.div>
      </div>

      {/* 3D Model Layer */}
      <div ref={splineRef} className="relative z-10 flex-1 min-h-0">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className={`w-6 h-6 border-2 border-t-transparent ${accentColor} rounded-full animate-spin`} />
          </div>
        )}
        {inView && (
          <Spline
            scene="./scene.splinecode"
            onLoad={handleLoad}
            className="w-full h-full"
            style={{ background: "transparent" }}
          />
        )}
      </div>

      {/* Mute Button - Top right */}
      <button
        onClick={toggleMute}
        className={`absolute z-20 top-4 right-4 sm:top-5 sm:right-5 rounded-full border transition-all hover:scale-110 active:scale-95 ${
          isMuted ? "opacity-70" : "opacity-90"
        } p-2`}
        title={isMuted ? (language === "pt" ? "Ativar áudio" : "Enable audio") : (language === "pt" ? "Silenciar" : "Mute")}
      >
        {isMuted ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
      </button>

      {/* Action Buttons - Right side, vertical */}
<div className="absolute z-30 right-2 sm:right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 sm:gap-3 pointer-events-auto">
        <a
          href="#intro"
          className={`${btnBg} font-semibold rounded-full transition-colors text-[10px] sm:text-xs uppercase tracking-wider px-3 py-2 sm:px-4 sm:py-2 block text-center cursor-pointer pointer-events-auto`}
        >
          {language === "pt" ? "Descubra" : language === "es" ? "Descubra" : language === "fr" ? "Découvrir" : language === "zh" ? "了解" : "Discover"}
        </a>
        <a
          href="#projects"
          className={`border ${btnOutline} rounded-full transition-colors text-[10px] sm:text-xs uppercase tracking-wider px-3 py-2 sm:px-4 sm:py-2 block text-center cursor-pointer pointer-events-auto`}
        >
          {language === "pt" ? "Projetos" : language === "es" ? "Proyectos" : language === "fr" ? "Projets" : language === "zh" ? "项目" : "Projects"}
        </a>
      </div>

      {/* Chat Widget - Bottom, acima do header */}
      <div className="absolute bottom-16 sm:bottom-20 left-0 right-0 z-20 px-3 sm:px-6 pb-2">
        <div className="max-w-md mx-auto">
          {/* Speech bubble */}
          <div className="mb-2">
            <AnimatePresence mode="wait">
              {isResponding ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4 }}
                  className={`${bubbleBg} backdrop-blur-sm border rounded-xl px-3 py-2 text-center relative`}
                >
                  <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 ${isDark ? "bg-white/5" : "bg-black/5"} border-t ${isDark ? "border-white/10" : "border-black/10"} border-l rotate-45`} />
                  <p className={`text-[11px] ${bubbleText} flex items-center justify-center gap-2`}>
                    {loadingPhrases[language as keyof typeof loadingPhrases][loadingPhraseIndex]}...
                    <span className="flex gap-0.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${accentColor.replace("text-", "bg-")}`}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </span>
                  </p>
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
                  <p className={`text-[11px] ${bubbleText} leading-relaxed max-h-16 overflow-y-auto`}>
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
                  <p className={`text-[11px] ${bubbleText} leading-relaxed`}>
                    {currentPhrases[currentPhrase]}
                  </p>
                  <div className="flex justify-center gap-1 mt-1">
                    {currentPhrases.map((_, i) => (
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
          </div>

          {/* Input */}
          {showInput && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div
                onClick={() => {
                  textareaRef.current?.focus()
                  if (isMuted) {
                    toggleMute()
                  }
                }}
                className={`flex items-end gap-2 ${isDark ? "bg-white/90 border-white/50 focus-within:border-cyan-400" : "bg-black/90 border-black/50 focus-within:border-blue-600"} backdrop-blur-sm border rounded-xl px-3 py-2 transition-colors cursor-text`}
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
                  placeholder={language === "pt" ? "Interaja comigo..." : language === "es" ? "Interactúa comigo..." : language === "fr" ? "Interagissez avec moi..." : language === "zh" ? "与我互动..." : "Interact with me..."}
                  className={`flex-1 bg-transparent text-xs ${bubbleText} ${isDark ? "placeholder-black/50" : "placeholder-white/50"} outline-none min-w-0 resize-none max-h-16 overflow-y-auto leading-relaxed cursor-text`}
                  rows={1}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSend()
                  }}
                  disabled={!aiInput.trim() || isTyping}
                  className={`w-6 h-6 rounded-full ${btnBg} flex items-center justify-center disabled:opacity-30 transition-all flex-shrink-0 hover:scale-110 active:scale-95`}
                >
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
      >
        <span className={`text-[8px] uppercase tracking-[0.3em] ${isDark ? "text-white/30" : "text-black/30"}`}>Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`w-5 h-8 ${isDark ? "border-white/20" : "border-black/20"} border rounded-full flex justify-center pt-1.5`}
        >
          <motion.div
            className={`w-1 h-1.5 ${isDark ? "bg-cyan-400" : "bg-blue-600"} rounded-full`}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}