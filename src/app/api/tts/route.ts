import { NextResponse } from "next/server"

const FREE_TTS_ENDPOINT = "https://freetts.org/api/tts"
const FREE_TTS_AUDIO_ENDPOINT = "https://freetts.org/api/audio"

async function fetchWithRetry(url: string, options: RequestInit, retries = 3, delay = 1000) {
  let lastError: Error | null = null

  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options)
      if (res.ok) return { ok: true, res }
      if (res.status >= 500 && i < retries - 1) {
        console.log(`[API TTS] Retry ${i + 1}/${retries} after ${delay}ms`)
        await new Promise(r => setTimeout(r, delay))
        delay *= 2
        continue
      }
      return { ok: false, res }
    } catch (err) {
      lastError = err as Error
      if (i < retries - 1) {
        console.log(`[API TTS] Retry ${i + 1}/${retries} after ${delay}ms`)
        await new Promise(r => setTimeout(r, delay))
        delay *= 2
      }
    }
  }
  throw lastError
}

export async function POST(req: Request) {
  try {
    const { text, voice = "pt-BR-AntonioNeural", rate = "+0%", pitch = "+0Hz" } = await req.json()

    console.log(`[API TTS] Gerando áudio: voice=${voice}, text="${text.substring(0, 30)}..."`)

    const genResult = await fetchWithRetry(FREE_TTS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice, rate, pitch }),
    })

    if (!genResult.ok) {
      const res = genResult.res
      console.error(`[API TTS] FreeTTS generation failed: ${res.status} ${res.statusText}`)
      const errorBody = await res.text().catch(() => "")
      console.error(`[API TTS] Error body: ${errorBody}`)
      return NextResponse.json({ error: "FreeTTS generation failed" }, { status: 502 })
    }

    const genRes = genResult.res
    const { file_id } = await genRes.json()
    console.log(`[API TTS] file_id gerado: ${file_id}`)

    const audioResult = await fetchWithRetry(`${FREE_TTS_AUDIO_ENDPOINT}/${file_id}`, { cache: "no-store" })

    if (!audioResult.ok) {
      const audioRes = audioResult.res
      console.error(`[API TTS] Audio download failed: ${audioRes.status}`)
      return NextResponse.json({ error: "FreeTTS audio download failed" }, { status: 502 })
    }

    const audioRes = audioResult.res
    const audioBuffer = await audioRes.arrayBuffer()
    console.log(`[API TTS] Áudio recebido: ${audioBuffer.byteLength} bytes`)

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
        "X-Audio-Duration": audioBuffer.byteLength.toString(),
      },
    })
  } catch (err) {
    console.error("[API TTS] Erro inesperado:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
