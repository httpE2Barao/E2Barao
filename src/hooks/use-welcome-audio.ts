"use client"

import { useRef, useCallback, useState } from "react"

const WELCOME_TEXTS: Record<string, string> = {
  pt: "Bem vindo ao portfólio digital do Elias Barão. Me chamo Cógnis, fique à vontade para interagir comigo!",
  en: "Welcome to Elias Barão's digital portfolio. My name is Cógnis, feel free to interact with me!",
  es: "Bienvenido al portafolio digital de Elias Barão. Me llamo Cógnis, siéntete libre de interactuar conmigo!",
  fr: "Bienvenue sur le portfolio numérique d'Elias Barão. Je m'appelle Cógnis, n'hésitez pas à interagir avec moi!",
  zh: "欢迎来到 Elias Barão 的数字作品集。我叫 Cógnis，请随意与我互动！",
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
    body: JSON.stringify({ text, voice, rate: "+0%", pitch: "+0Hz" }),
  })

  if (!res.ok) throw new Error(`TTS API failed: ${res.status}`)

  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  return { url, cleanup: () => URL.revokeObjectURL(url) }
}

function speakNative(text: string, lang: string) {
  console.log(`[TTS] Fallback nativo (${lang}): "${text.substring(0, 50)}..."`)
  if (typeof window === "undefined" || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = LANG_MAP[lang] || "en-US"
  utterance.rate = 0.95
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

export function useWelcomeAudio(language = "pt") {
  const hasSpoken = useRef(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)
  const [isPreloaded, setIsPreloaded] = useState(false)
  const preloadPromise = useRef<Promise<void> | null>(null)

  const welcomeText = WELCOME_TEXTS[language] || WELCOME_TEXTS["en"]

  const preload = useCallback(async () => {
    if (isPreloaded || preloadPromise.current) return
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
  }, [isPreloaded, welcomeText, language])

  const playWelcome = useCallback(async () => {
    if (hasSpoken.current) return
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
  }, [welcomeText, language])

  return { preload, playWelcome, isPreloaded }
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

  const speak = useCallback(async (text: string, lang = "pt") => {
    if (isSpeaking.current) return
    isSpeaking.current = true

    try {
      const { url, cleanup } = await fetchTTSBlob(text, lang)
      const audio = new Audio(url)
      currentAudio.current = audio
      currentCleanup.current = cleanup
      await audio.play()
      audio.onended = () => { cleanup(); isSpeaking.current = false; currentAudio.current = null; currentCleanup.current = null }
      audio.onerror = () => { cleanup(); isSpeaking.current = false; currentAudio.current = null; currentCleanup.current = null; speakNative(text, lang) }
    } catch (err) {
      console.error("[TTS] FreeTTS falhou, ativando fallback nativo:", err)
      speakNative(text, lang)
      isSpeaking.current = false
    }
  }, [])

  return { speak, stopAudio }
}
