"use client"

import { useRef, useCallback, useState, useEffect } from "react"
import { trimAudioEnd } from "./use-audio-trimmer"

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/`{1,3}.+?`{1,3}/g, "")
    .replace(/~~(.+?)~~/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/>\s+/g, "")
    .replace(/(?:^|\n)\s*[-*+]\s+/g, " ")
    .replace(/(?:^|\n)\s*\d+\.\s+/g, " ")
    .replace(/---+/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

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

const MAX_TTS_CHARS = 800

function splitText(text: string): string[] {
  const chunks: string[] = []
  let remaining = text
  while (remaining.length > MAX_TTS_CHARS) {
    let splitAt = remaining.lastIndexOf(". ", MAX_TTS_CHARS)
    if (splitAt === -1) splitAt = remaining.lastIndexOf("! ", MAX_TTS_CHARS)
    if (splitAt === -1) splitAt = remaining.lastIndexOf("? ", MAX_TTS_CHARS)
    if (splitAt === -1) splitAt = remaining.lastIndexOf(":\n", MAX_TTS_CHARS)
    if (splitAt === -1) splitAt = remaining.lastIndexOf("\n\n", MAX_TTS_CHARS)
    if (splitAt === -1) splitAt = remaining.lastIndexOf("\n", MAX_TTS_CHARS)
    if (splitAt === -1) splitAt = remaining.lastIndexOf(", ", MAX_TTS_CHARS)
    if (splitAt === -1) splitAt = remaining.lastIndexOf(" ", MAX_TTS_CHARS)
    if (splitAt === -1) splitAt = MAX_TTS_CHARS
    chunks.push(remaining.slice(0, splitAt + 1).trim())
    remaining = remaining.slice(splitAt + 1).trim()
  }
  if (remaining) chunks.push(remaining)
  return chunks
}

async function fetchTTSBlob(text: string, lang: string): Promise<{ url: string; cleanup: () => void; ok: boolean }> {
  if (text.length > MAX_TTS_CHARS) {
    const chunks = splitText(text)
    const audioBlobs: Blob[] = []
    for (let i = 0; i < chunks.length; i++) {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: chunks[i], voice: VOICE_MAP[lang] || VOICE_MAP["en"], rate: "+30%", pitch: "+0Hz" }),
      })
      if (!res.ok) return { url: "", cleanup: () => {}, ok: false }
      const blob = await res.blob()
      audioBlobs.push(blob)
    }
    const mergedBlob = new Blob(audioBlobs, { type: "audio/mpeg" })
    const trimmedBlob = await trimAudioEnd(mergedBlob, 2.7)
    const url = URL.createObjectURL(trimmedBlob)
    return { url, cleanup: () => URL.revokeObjectURL(url), ok: true }
  }

  const voice = VOICE_MAP[lang] || VOICE_MAP["en"]

  const res = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice, rate: "+30%", pitch: "+0Hz" }),
  })

  if (!res.ok) return { url: "", cleanup: () => {}, ok: false }

  const blob = await res.blob()
  const trimmedBlob = await trimAudioEnd(blob, 2.7)
  const url = URL.createObjectURL(trimmedBlob)
  return { url, cleanup: () => URL.revokeObjectURL(url), ok: true }
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
      const cleanText = stripMarkdown(welcomeText)
      const { url, cleanup, ok } = await fetchTTSBlob(cleanText, language)
      if (!ok) return
      audioRef.current = new Audio(url)
      cleanupRef.current = cleanup
      setIsPreloaded(true)
    })()
    await preloadPromise.current
  }, [welcomeText, language])

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    hasSpoken.current = false
  }, [])

  const playWelcome = useCallback(async () => {
    if (hasSpoken.current || !userInteracted) return
    hasSpoken.current = true
    const cleanText = stripMarkdown(welcomeText)

    if (audioRef.current) {
      try {
        await audioRef.current.play()
        audioRef.current.onended = () => {
          cleanupRef.current?.()
          audioRef.current = null
          cleanupRef.current = null
        }
        return
      } catch {}
    }

    const { url, cleanup, ok } = await fetchTTSBlob(cleanText, language)
    if (!ok) { speakNative(cleanText, language); return }
    const audio = new Audio(url)
    cleanupRef.current = cleanup
    await audio.play().catch(() => { speakNative(cleanText, language); cleanup() })
    audio.onended = () => { cleanup(); audioRef.current = null; cleanupRef.current = null }
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
    const cleanText = stripMarkdown(text)

    const { url, cleanup, ok } = await fetchTTSBlob(cleanText, lang)
    if (!ok) {
      speakNative(cleanText, lang)
      isSpeaking.current = false
      onEnd?.()
      return
    }
    const audio = new Audio(url)
    currentAudio.current = audio
    currentCleanup.current = cleanup
    await audio.play().catch(() => { speakNative(cleanText, lang); cleanup() })
    audio.onended = () => { cleanup(); isSpeaking.current = false; currentAudio.current = null; currentCleanup.current = null; onEnd?.() }
    audio.onerror = () => { cleanup(); isSpeaking.current = false; currentAudio.current = null; currentCleanup.current = null; onEnd?.(); speakNative(cleanText, lang) }
  }, [])

  return { speak, stopAudio }
}
