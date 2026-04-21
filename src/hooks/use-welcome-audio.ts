"use client"

import { useRef, useCallback, useState, useEffect } from "react"
import { trimAudioEnd } from "./use-audio-trimmer"

const WELCOME_TEXTS: Record<string, string> = {
  pt: "Olá! Sou o Cógnis. Posso te ajudar com projetos, skills e experiências do Elias. Vamos conversar?",
  en: "Hi! I'm Cógnis. I can help with projects, skills and Elias's experience. Let's talk?",
  es: "¡Hola! Soy Cógnis. Puedo ayudarte con proyectos, habilidades y experiencias. ¿Hablamos?",
  fr: "Salut! Je suis Cógnis. Je peux aider avec projets, compétences et expériences. Parlons?",
  zh: "你好！我是 Cógnis。我可以帮你了解项目、技能和经验。聊聊？",
}

const RETURNING_TEXTS: Record<string, string> = {
  pt: "Olá de volta! Posso te ajudar com projetos, skills ou experiências do Elias?",
  en: "Welcome back! Can I help with projects, skills or Elias's experience?",
  es: "¡Hola de nuevo! ¿Puedo ayudarte con proyectos o experiencias?",
  fr: "Content de revoir! Puis-je aider avec projets ou expériences?",
  zh: "欢迎回来！我可以帮你了解项目或经验吗？",
}

const VOICE_MAP: Record<string, string> = {
  pt: "pt-BR-AntonioNeural",
  en: "en-US-GuyNeural",
  es: "es-ES-AlvaroNeural",
  fr: "fr-FR-HenriNeural",
  zh: "zh-CN-YunxiNeural",
}

const LANG_MAP: Record<string, string> = {
  pt: "pt-BR",
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  zh: "zh-CN",
}

async function fetchTTSBlob(text: string, lang: string): Promise<{ url: string; cleanup: () => void }> {
  const voice = VOICE_MAP[lang] || VOICE_MAP["en"]

  console.log(`[TTS] Gerando áudio: voice=${voice}, lang=${lang}`)

  const res = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice, rate: "+30%", pitch: "+0Hz" }),
  })

  if (!res.ok) throw new Error(`TTS API failed: ${res.status}`)

  const blob = await res.blob()
  const trimmedBlob = await trimAudioEnd(blob, 2.7)
  const url = URL.createObjectURL(trimmedBlob)
  return { url, cleanup: () => URL.revokeObjectURL(url) }
}

function speakNative(text: string, lang: string) {
  console.log(`[TTS] Fallback nativo (${lang}): "${text.substring(0, 50)}..."`)
  if (typeof window === "undefined" || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = LANG_MAP[lang] || "en-US"
  utterance.rate = 1.3
  utterance.pitch = 0.9
  const voices = window.speechSynthesis.getVoices()
  const targetLang = LANG_MAP[lang] || "en"
  const matchedVoice = voices.find((v) => v.lang.startsWith(targetLang.split("-")[0]))
  if (matchedVoice) {
    utterance.voice = matchedVoice
    console.log(`[TTS] Voz nativa selecionada: ${matchedVoice.name}`)
  }
  window.speechSynthesis.speak(utterance)
}

export function useWelcomeAudio(language = "pt", isReturning = false) {
  const hasSpoken = useRef(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)
  const [isPreloaded, setIsPreloaded] = useState(false)
  const preloadPromise = useRef<Promise<void> | null>(null)
  const [userInteracted, setUserInteracted] = useState(false)

  const welcomeText = isReturning 
    ? (RETURNING_TEXTS[language] || RETURNING_TEXTS["en"])
    : (WELCOME_TEXTS[language] || WELCOME_TEXTS["en"])

  useEffect(() => {
    const handleInteraction = () => {
      if (!userInteracted) {
        setUserInteracted(true)
        preload()
      }
    }
    window.addEventListener('click', handleInteraction, { once: true })
    window.addEventListener('scroll', handleInteraction, { once: true })
    window.addEventListener('keydown', handleInteraction, { once: true })
    return () => {
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('scroll', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
    }
  }, [userInteracted])

  const preload = useCallback(async () => {
    if (preloadPromise.current) return
    preloadPromise.current = (async () => {
      console.log("[TTS] Pré-carregando audio...")
      try {
        const { url, cleanup } = await fetchTTSBlob(welcomeText, language)
        audioRef.current = new Audio(url)
        cleanupRef.current = cleanup
        setIsPreloaded(true)
        console.log("[TTS] Audio pré-carregado com sucesso")
      } catch (err) {
        console.error("[TTS] Falha ao pré-carregar:", err)
      }
    })()
    await preloadPromise.current
  }, [welcomeText, language])

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    hasSpoken.current = false
    console.log("[TTS] Audio pausado")
  }, [])

  const playWelcome = useCallback(async () => {
    if (hasSpoken.current || !userInteracted) return
    hasSpoken.current = true
    console.log("[TTS] === Iniciando boas-vindas ===")

    if (audioRef.current) {
      try {
        await audioRef.current.play()
        audioRef.current.onended = () => {
          cleanupRef.current?.()
          audioRef.current = null
          cleanupRef.current = null
          console.log("[TTS] Boas-vindas finalizado")
        }
        return
      } catch (err) {
        console.error("[TTS] Playback do preloaded falhou:", err)
      }
    }

    try {
      const { url, cleanup } = await fetchTTSBlob(welcomeText, language)
      const audio = new Audio(url)
      await audio.play()
      audio.onended = () => { cleanup(); console.log("[TTS] Boas-vindas finalizado (on-demand)") }
    } catch (err) {
      console.error("[TTS] Tudo falhou, sem fallback:", err)
    }
  }, [welcomeText, language, userInteracted])

  return { preload, playWelcome, isPreloaded, stopAudio }
}

export function useSpeech() {
  const isSpeaking = useRef(false)
  const currentAudio = useRef<HTMLAudioElement | null>(null)
  const currentCleanup = useRef<(() => void) | null>(null)

  const stopAudio = useCallback(() => {
    if (currentAudio.current) {
      currentAudio.current.pause()
      currentAudio.current.currentTime = 0
    }
    if (currentCleanup.current) {
      currentCleanup.current()
      currentCleanup.current = null
    }
    currentAudio.current = null
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    isSpeaking.current = false
  }, [])

  const speak = useCallback(async (text: string, lang = "pt", onEnd?: () => void) => {
    if (isSpeaking.current) return
    isSpeaking.current = true

    try {
      const { url, cleanup } = await fetchTTSBlob(text, lang)
      const audio = new Audio(url)
      currentAudio.current = audio
      currentCleanup.current = cleanup
      await audio.play()
      audio.onended = () => { cleanup(); isSpeaking.current = false; currentAudio.current = null; currentCleanup.current = null; onEnd?.() }
      audio.onerror = () => { cleanup(); isSpeaking.current = false; currentAudio.current = null; currentCleanup.current = null; onEnd?.(); speakNative(text, lang) }
    } catch (err) {
      console.error("[TTS] FreeTTS falhou, ativando fallback nativo:", err)
      speakNative(text, lang)
      onEnd?.()
      isSpeaking.current = false
    }
  }, [])

  return { speak, stopAudio }
}
