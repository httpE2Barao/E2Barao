"use client"
import { useTheme } from "@/components/switchers/switchers"
import dynamic from "next/dynamic"
import { AnimatePresence, motion } from "framer-motion"
import { useCallback, useEffect, useRef, useState, useMemo } from "react"
import { useInView } from "react-intersection-observer"
import { useWelcomeAudio, useSpeech } from "@/hooks/use-welcome-audio"

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => null
})

const MUTE_KEY = "e2barao-audio-muted"
const PLAYED_KEY = "e2barao-audio-played"

interface WelcomeMessage {
  greeting: string
  body: string
  cta: string
  followUp: string
}

const welcomePhrases = {
  first: {
    pt: [
      { greeting: "Olá! Tudo bem?", body: "Quer entender como o Elias trabalha?", cta: "É só digitar sim.", followUp: "Elias é proativo, lidera projetos e aprende rápido. Ele já trabalhou em projetos públicos e privados, sempre buscando resolver problemas do começo ao fim. Quer saber mais sobre algum aspecto específico?" },
      { greeting: "Bem-vindo! Sou o Cógnis.", body: "Curioso sobre o Elias? Pode perguntar.", cta: "É só digitar o que quer saber.", followUp: "O que te interessa? A experiência, os projetos, como ele lidera ou como ele aprende tão rápido?" },
      { greeting: "Olá! Eu sou o Cógnis.", body: "Posso te contar sobre o trabalho do Elias. Topa?", cta: "Sim ou não, tanto faz.", followUp: "Elias é desenvolvedor full-stack com mais de 4 anos. Ele já liderou projetos de museus a sistemas completos. O que quer saber primeiro?" },
      { greeting: "Bem-vindo ao portfólio!", body: "Quer saber quem é o Elias e como ele trabalha?", cta: "É só perguntar.", followUp: "Elias é comunicativo, trabalha bem em equipe e sabe liderar. Ele tem experiência internacional e já resolveu problemas reais com código. O que te chama atenção?" },
      { greeting: "Olá! Tudo bem?", body: "Posso te explicar como o Elias atua nos projetos dele.", cta: "Quer que eu conte?", followUp: "Elias é proativo e aprende rápido. Ele já liderou projetos públicos e privados, sempre do planejamento à entrega. Quer saber mais sobre algum deles?" },
      { greeting: "Bem-vindo! Sou o Cógnis.", body: "Se tem curiosidade sobre o Elias, é só perguntar.", cta: "O que quer saber?", followUp: "Posso te contar sobre experiência, projetos, habilidades ou como ele encara desafios. Por onde quer começar?" },
    ] as WelcomeMessage[],
    en: [
      { greeting: "Hi! How are you?", body: "Want to know how Elias works?", cta: "Just type yes.", followUp: "Elias is proactive, leads projects and learns fast. He's worked on public and private projects, always solving problems from start to finish. Want to know more about any specific aspect?" },
      { greeting: "Welcome! I'm Cógnis.", body: "Curious about Elias? Feel free to ask.", cta: "Just type what you want to know.", followUp: "What interests you? His experience, projects, how he leads, or how he learns so fast?" },
      { greeting: "Hi! I'm Cógnis.", body: "I can tell you about Elias's work. Sound good?", cta: "Yes or no, up to you.", followUp: "Elias is a full-stack developer with over 4 years of experience. He's led projects from museums to complete systems. What would you like to know first?" },
      { greeting: "Welcome to the portfolio!", body: "Want to know who Elias is and how he works?", cta: "Just ask.", followUp: "Elias is communicative, works well in teams and knows how to lead. He has international experience and has solved real problems with code. What catches your attention?" },
      { greeting: "Hi! How are you?", body: "I can explain how Elias works on his projects.", cta: "Want me to tell you?", followUp: "Elias is proactive and learns fast. He's led public and private projects, from planning to delivery. Want to know more about any of them?" },
      { greeting: "Welcome! I'm Cógnis.", body: "If you're curious about Elias, just ask.", cta: "What do you want to know?", followUp: "I can tell you about experience, projects, skills, or how he tackles challenges. Where would you like to start?" },
    ] as WelcomeMessage[],
    es: [
      { greeting: "¡Hola! ¿Qué tal?", body: "¿Quieres saber cómo trabaja Elias?", cta: "Solo escribe sí.", followUp: "Elias es proactivo, lidera proyectos y aprende rápido. Ha trabajado en proyectos públicos y privados, siempre buscando resolver problemas de principio a fin. ¿Quieres saber más sobre algún aspecto específico?" },
      { greeting: "¡Bienvenido! Soy Cógnis.", body: "¿Tienes curiosidad sobre Elias? Pregunta lo que quieras.", cta: "Solo escribe lo que quieres saber.", followUp: "¿Qué te interesa? La experiencia, los proyectos, cómo lidera o cómo aprende tan rápido?" },
      { greeting: "¡Hola! Soy Cógnis.", body: "Puedo contarte sobre el trabajo de Elias. ¿Te parece bien?", cta: "Sí o no, como quieras.", followUp: "Elias es desarrollador full-stack con más de 4 años. Ya lideró proyectos de museos a sistemas completos. ¿Qué quieres saber primero?" },
      { greeting: "¡Bienvenido al portafolio!", body: "¿Quieres saber quién es Elias y cómo trabaja?", cta: "Solo pregunta.", followUp: "Elias es comunicativo, trabaja bien en equipo y sabe liderar. Tiene experiencia internacional y ya resolvió problemas reales con código. ¿Qué te llama la atención?" },
      { greeting: "¡Hola! ¿Qué tal?", body: "Puedo explicarte cómo Elias actúa en sus proyectos.", cta: "¿Quieres que te cuente?", followUp: "Elias es proactivo y aprende rápido. Ya lideró proyectos públicos y privados, siempre de la planificación a la entrega. ¿Quieres saber más sobre alguno?" },
      { greeting: "¡Bienvenido! Soy Cógnis.", body: "Si tienes curiosidad sobre Elias, solo pregunta.", cta: "¿Qué quieres saber?", followUp: "Puedo contarte sobre experiencia, proyectos, habilidades o cómo enfrenta los desafíos. ¿Por dónde quieres empezar?" },
    ] as WelcomeMessage[],
    fr: [
      { greeting: "Bonjour ! Comment allez-vous ?", body: "Vous voulez savoir comment Elias travaille ?", cta: "Tapez simplement oui.", followUp: "Elias est proactif, mène des projets et apprend vite. Il a travaillé sur des projets publics et privés, toujours en cherchant à résoudre les problèmes de bout en bout. Vous en voulez savoir plus sur un aspect spécifique ?" },
      { greeting: "Bienvenue ! Je suis Cógnis.", body: "Curieux d'en savoir plus sur Elias ? N'hésitez pas à demander.", cta: "Tapez simplement ce que vous voulez savoir.", followUp: "Qu'est-ce qui vous intéresse ? Son expérience, ses projets, comment il lead ou comment il apprend si vite ?" },
      { greeting: "Bonjour ! Je suis Cógnis.", body: "Je peux vous parler du travail d'Elias. Ça vous dit ?", cta: "Oui ou non, comme vous voulez.", followUp: "Elias est développeur full-stack avec plus de 4 ans d'expérience. Il a mené des projets allant des musées aux systèmes complets. Qu'est-ce que vous voulez savoir en premier ?" },
      { greeting: "Bienvenue au portfolio !", body: "Vous voulez savoir qui est Elias et comment il travaille ?", cta: "Demandez simplement.", followUp: "Elias est communicatif, travaille bien en équipe et sait leader. Il a une expérience internationale et a résolu de vrais problèmes avec du code. Qu'est-ce qui vous attire ?" },
      { greeting: "Bonjour ! Comment allez-vous ?", body: "Je peux vous expliquer comment Elias intervient dans ses projets.", cta: "Vous voulez que je vous raconte ?", followUp: "Elias est proactif et apprend vite. Il a mené des projets publics et privés, de la planification à la livraison. Vous en voulez savoir plus sur l'un d'eux ?" },
      { greeting: "Bienvenue ! Je suis Cógnis.", body: "Si vous êtes curieux au sujet d'Elias, demandez simplement.", cta: "Que voulez-vous savoir ?", followUp: "Je peux vous parler de son expérience, de ses projets, de ses compétences ou de la façon dont il relève les défis. Par où voulez-vous commencer ?" },
    ] as WelcomeMessage[],
    zh: [
      { greeting: "你好！最近怎么样？", body: "想了解Elias是怎么工作的吗？", cta: "只需要输入想。", followUp: "Elias积极主动，领导项目，学习很快。他在公共和私人项目中工作过，总是从头到尾解决问题。想了解某个具体方面吗？" },
      { greeting: "欢迎！我是Cógnis。", body: "对Elias好奇吗？尽管问。", cta: "输入你想知道的就行。", followUp: "你对什么感兴趣？经验、项目、他如何领导，还是他学得这么快？" },
      { greeting: "你好！我是Cógnis。", body: "我可以告诉你Elias的工作情况。好吗？", cta: "想或不想，都可以。", followUp: "Elias是全栈开发者，有4年多经验。他领导过从博物馆到完整系统的项目。你想先知道什么？" },
      { greeting: "欢迎来到作品集！", body: "想了解Elias是谁，他是怎么工作的吗？", cta: "尽管问。", followUp: "Elias善于沟通，团队合作能力强，懂得领导。他有国际经验，用代码解决过真实问题。什么最吸引你？" },
      { greeting: "你好！最近怎么样？", body: "我可以解释Elias在项目中是怎么做的。", cta: "想让我告诉你吗？", followUp: "Elias积极主动，学习很快。他领导过公共和私人项目，从规划到交付。想了解更多吗？" },
      { greeting: "欢迎！我是Cógnis。", body: "如果对Elias好奇，尽管问。", cta: "你想知道什么？", followUp: "我可以告诉你经验、项目、技能，或者他如何面对挑战。你想从哪里开始？" },
    ] as WelcomeMessage[],
  },
  returning: {
    pt: [
      { greeting: "Oi de novo! Tudo bem?", body: "Quer saber mais sobre o Elias, ou tem uma dúvida nova?", cta: "É só digitar.", followUp: "Posso te contar sobre os projetos dele, como ele lidera, ou qualquer coisa que ficou pendente." },
      { greeting: "Fico feliz em te ver de volta!", body: "Alguma pergunta que ficou no ar?", cta: "É só perguntar.", followUp: "Quer que eu explique algo com mais detalhes, ou prefere uma pergunta nova?" },
      { greeting: "Bem-vindo de volta! Sou o Cógnis.", body: "O que te interessa sobre o Elias hoje?", cta: "Pergunta à vontade.", followUp: "Experiência, projetos, habilidades — ou algo diferente? É só escolher." },
      { greeting: "Oi! Que bom que voltou.", body: "Tô aqui se precisar. Alguma dúvida?", cta: "É só pedir.", followUp: "Posso te ajudar com qualquer coisa sobre o Elias — projetos, habilidades, experiência." },
      { greeting: "Olá novamente! Tudo bem?", body: "Quer explorar mais alguma coisa do portfólio?", cta: "O que te interessa?", followUp: "Posso te contar sobre os projetos dele, como ele trabalha, ou algo que não ficou claro antes." },
    ] as WelcomeMessage[],
    en: [
      { greeting: "Hi again! How are you?", body: "Want to know more about Elias, or got a new question?", cta: "Just type.", followUp: "I can tell you about his projects, how he leads, or anything that was left pending." },
      { greeting: "Happy to see you back!", body: "Any question that was left hanging?", cta: "Just ask.", followUp: "Want me to explain something in more detail, or prefer a new question?" },
      { greeting: "Welcome back! I'm Cógnis.", body: "What interests you about Elias today?", cta: "Ask away.", followUp: "Experience, projects, skills — or something different? Just choose." },
      { greeting: "Hi! Glad you came back.", body: "I'm here if you need anything. Any questions?", cta: "Just let me know.", followUp: "I can help with anything about Elias — projects, skills, experience." },
      { greeting: "Hello again! How are you?", body: "Want to explore more of the portfolio?", cta: "What interests you?", followUp: "I can tell you about his projects, how he works, or something that wasn't clear before." },
    ] as WelcomeMessage[],
    es: [
      { greeting: "¡Hola de nuevo! ¿Qué tal?", body: "¿Quieres saber más sobre Elias, o tienes una nueva duda?", cta: "Solo escribe.", followUp: "Puedo contarte sobre sus proyectos, cómo lidera, o cualquier cosa que quedó pendiente." },
      { greeting: "¡Me alegra verte de vuelta!", body: "¿Alguna pregunta que quedó en el aire?", cta: "Solo pregunta.", followUp: "¿Quieres que explique algo con más detalle, o prefieres una nueva pregunta?" },
      { greeting: "¡Bienvenido de vuelta! Soy Cógnis.", body: "¿Qué te interesa de Elias hoy?", cta: "Pregunta sin compromiso.", followUp: "Experiencia, proyectos, habilidades — ¿o algo diferente? Solo elige." },
      { greeting: "¡Hola! Qué bueno que volviste.", body: "Estoy aquí si necesitas algo. ¿Alguna duda?", cta: "Solo dime.", followUp: "Puedo ayudarte con cualquier cosa sobre Elias — proyectos, habilidades, experiencia." },
      { greeting: "¡Hola de nuevo! ¿Qué tal?", body: "¿Quieres explorar más del portafolio?", cta: "¿Qué te interesa?", followUp: "Puedo contarte sobre sus proyectos, cómo trabaja, o algo que no quedó claro antes." },
    ] as WelcomeMessage[],
    fr: [
      { greeting: "Salut encore ! Comment allez-vous ?", body: "Vous voulez en savoir plus sur Elias, ou vous avez une nouvelle question ?", cta: "Tapez simplement.", followUp: "Je peux vous parler de ses projets, de comment il lead, ou de tout ce qui est resté en suspens." },
      { greeting: "Content de vous revoir !", body: "Une question qui est restée en suspens ?", cta: "Demandez simplement.", followUp: "Vous voulez que j'explique quelque chose plus en détail, ou préférez-vous une nouvelle question ?" },
      { greeting: "Bienvenue de retour ! Je suis Cógnis.", body: "Qu'est-ce qui vous intéresse chez Elias aujourd'hui ?", cta: "N'hésitez pas à demander.", followUp: "Expérience, projets, compétences — ou autre chose ? Il suffit de choisir." },
      { greeting: "Salut ! Content de vous revoir.", body: "Je suis là si vous avez besoin de quoi que ce soit. Des questions ?", cta: "Dites-le simplement.", followUp: "Je peux vous aider avec n'importe quoi sur Elias — projets, compétences, expérience." },
      { greeting: "Bonjour encore ! Comment allez-vous ?", body: "Vous voulez explorer davantage le portfolio ?", cta: "Qu'est-ce qui vous intéresse ?", followUp: "Je peux vous parler de ses projets, de son travail, ou de quelque chose qui n'était pas clair avant." },
    ] as WelcomeMessage[],
    zh: [
      { greeting: "又见面了！最近怎么样？", body: "想了解更多关于Elias的信息，还是有新问题？", cta: "输入就行。", followUp: "我可以告诉你他的项目、他如何领导，或者任何悬而未决的事情。" },
      { greeting: "很高兴再次见到你！", body: "有什么问题悬而未决吗？", cta: "尽管问。", followUp: "想让我详细解释，还是换个新问题？" },
      { greeting: "欢迎回来！我是Cógnis。", body: "今天对Elias的什么感兴趣？", cta: "尽管问。", followUp: "经验、项目、技能——还是别的？选择就行。" },
      { greeting: "你好！很高兴你回来了。", body: "我在这里，需要什么都行。有什么问题吗？", cta: "说就行。", followUp: "我可以帮你了解Elias的任何事——项目、技能、经验。" },
      { greeting: "又见面了！最近怎么样？", body: "想探索更多作品集吗？", cta: "对什么感兴趣？", followUp: "我可以告诉你他的项目、他如何工作，或者之前不清楚的事情。" },
    ] as WelcomeMessage[],
  },
}

const affirmations = ["sim", "quero", "claro", "pode", "pode ser", "conta", "bora", "manda", "topo", "isso", "true",
  "yes", "sure", "ok", "go ahead", "tell me", "yep", "yeah", "yup", "right", "please",
  "sí", "quiero", "claro", "cuéntame", "dale", "por favor",
  "oui", "c'est", "raconte", "d'accord", "s'il vous plaît",
  "想", "要", "好", "可以", "对", "请"]

const negations = ["não", "nao", "nada", "depois", "tô bem", "to bem", "nah", "no thanks", "depois eu volto", "agora não",
  "no", "nope", "nah", "not now", "later", "not really", "no thanks", "i'm good",
  "no", "nada", "después", "no gracias", "ahora no",
  "non", "pas maintenant", "non merci", "je suis bon",
  "不", "不用", "算了", "没关系", "不用了", "不需要"]

const loadingPhrases = {
  pt: ["Pensando", "Processando", "Analisando", "Buscando", "Calculando"],
  en: ["Thinking", "Processing", "Analyzing", "Searching", "Calculating"],
  es: ["Pensando", "Procesando", "Analizando", "Buscando", "Calculando"],
  fr: ["Réflexion", "Traitement", "Analyse", "Recherche", "Calcul"],
  zh: ["思考中", "处理中", "分析中", "搜索中", "计算中"],
}

const negativeReplies: Record<string, string> = {
  pt: "Sem problemas! Se mudar de ideia, é só perguntar.",
  en: "No problem! If you change your mind, just ask.",
  es: "¡Sin problema! Si cambias de opinión, solo pregunta.",
  fr: "Pas de problème ! Si vous changez d'avis, demandez simplement.",
  zh: "没问题！如果改主意了，尽管问。",
}

export function V2HomeHeroV2() {
  const { theme, language } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [aiInput, setAiInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
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
  const [pendingFollowUp, setPendingFollowUp] = useState<string | null>(null)
  const { ref: splineRef, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [hasUnmutedOnce, setHasUnmutedOnce] = useState(false)
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0)

  const getResponseFontSize = (text: string) => {
    const len = text.length
    if (len > 300) return "text-xs"
    if (len > 200) return "text-xs sm:text-sm"
    if (len > 100) return "text-sm sm:text-base"
    return "text-base"
  }

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = "auto"
    textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`
  }, [aiInput])

  const isDark = theme === "dark"

  const fullName = "Elias Edson Barão"
  
  const title = language === "pt"
    ? "Desenvolvedor\nFull-Stack"
    : language === "es"
    ? "Desarrollador\nFull-Stack"
    : language === "fr"
    ? "Développeur\nFull-Stack"
    : language === "zh"
    ? "全栈\n开发者"
    : "Full-Stack\nDeveloper"

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
    if (hasInteracted.current) return
    hasInteracted.current = true
    if (isMuted) {
      setIsMuted(false)
      localStorage.setItem(MUTE_KEY, "false")
      setHasPlayedBefore(true)
      localStorage.setItem(PLAYED_KEY, "true")
    }
    preload().then(() => playWelcome())
  }, [isMuted, preload, playWelcome])

  const selectedMessage = useMemo(() => {
    const pool = hasPlayedBefore
      ? welcomePhrases.returning[language as keyof typeof welcomePhrases.returning]
      : welcomePhrases.first[language as keyof typeof welcomePhrases.first]
    const fallback = hasPlayedBefore ? welcomePhrases.returning.en : welcomePhrases.first.en
    const phrases = pool || fallback
    const today = new Date()
    const daySeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
    return phrases[daySeed % phrases.length]
  }, [hasPlayedBefore, language])

  useEffect(() => {
    if (selectedMessage) {
      setPendingFollowUp(selectedMessage.followUp)
    }
  }, [selectedMessage])

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
    const userInput = aiInput.trim().toLowerCase()
    setAiInput("")

    if (pendingFollowUp) {
      if (affirmations.some(c => userInput.includes(c))) {
        setChatResponse(pendingFollowUp)
        setShowResponse(true)
        speak(pendingFollowUp, language)
        setPendingFollowUp(null)
        return
      }

      if (negations.some(c => userInput.includes(c))) {
        const reply = negativeReplies[language] || negativeReplies.en
        setChatResponse(reply)
        setShowResponse(true)
        speak(reply, language)
        setPendingFollowUp(null)
        return
      }
    }

    setPendingFollowUp(null)
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
  const btnOutline = isDark ? "border-white/20 text-white hover:border-cyan-400 hover:text-cyan-400 bg-white/10 hover:bg-cyan-400/10" : "border-black/20 text-black hover:border-blue-600 hover:text-blue-600 bg-white/90 hover:bg-white"
  const bubbleBg = isDark ? "bg-white/90 border-white/50" : "bg-black/90 border-black/50"
  const bubbleText = isDark ? "text-black" : "text-white"

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
        <button
          type="button"
          onClick={() => {
            const element = document.getElementById("intro")
            if (element) {
              const headerHeight = 80
              const elementPosition = element.getBoundingClientRect().top + window.scrollY
              const targetPosition = elementPosition - headerHeight
              const startPosition = window.scrollY
              const distance = targetPosition - startPosition
              const duration = 800
              let startTime: number | null = null

              const step = (currentTime: number) => {
                if (startTime === null) startTime = currentTime
                const elapsed = currentTime - startTime
                const progress = Math.min(elapsed / duration, 1)
                const easeProgress = 1 - Math.pow(1 - progress, 3)
                window.scrollTo(0, startPosition + distance * easeProgress)
                if (progress < 1) {
                  requestAnimationFrame(step)
                }
              }

              requestAnimationFrame(step)
            }
          }}
          className={`${btnBg} font-semibold rounded-full transition-colors text-[10px] sm:text-xs uppercase tracking-wider px-3 py-2 sm:px-4 sm:py-2 block text-center cursor-pointer`}
        >
            {language === "pt" ? "Descubra" : language === "es" ? "Descubra" : language === "fr" ? "Découvrir" : language === "zh" ? "了解" : "Discover"}
        </button>
        <a
          href="#projects"
          className={`border ${btnOutline} rounded-full transition-colors text-[10px] sm:text-xs uppercase tracking-wider px-3 py-2 sm:px-4 sm:py-2 block text-center cursor-pointer pointer-events-auto`}
        >
          {language === "pt" ? "Projetos" : language === "es" ? "Proyectos" : language === "fr" ? "Projets" : language === "zh" ? "项目" : "Projects"}
        </a>
        <a
          href="/contacts"
          className={`border ${btnOutline} rounded-full transition-colors text-[10px] sm:text-xs uppercase tracking-wider px-3 py-2 sm:px-4 sm:py-2 block text-center cursor-pointer pointer-events-auto`}
        >
          Contato & CV
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
                  <p className={`text-sm ${bubbleText} flex items-center justify-center gap-2`}>
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
                  <p className={`${getResponseFontSize(chatResponse)} ${bubbleText} leading-relaxed max-h-16 overflow-y-auto`}>
                    {chatResponse}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={selectedMessage.greeting}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4 }}
                  className={`${bubbleBg} backdrop-blur-sm border rounded-xl px-3 py-2 text-center relative`}
                >
                  <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 ${isDark ? "bg-white/5" : "bg-black/5"} border-t ${isDark ? "border-white/10" : "border-black/10"} border-l rotate-45`} />
                  <p className={`text-sm ${bubbleText} leading-relaxed`}>
                    {selectedMessage.greeting}
                  </p>
                  <p className={`text-xs ${textMuted} mt-1 leading-relaxed`}>
                    {selectedMessage.body}
                  </p>
                  <p className={`text-[10px] ${accentColor} mt-1`}>
                    {selectedMessage.cta}
                  </p>
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
