import { NextResponse } from "next/server"

const FREE_TTS_ENDPOINT = "https://freetts.org/api/tts"
const FREE_TTS_AUDIO_ENDPOINT = "https://freetts.org/api/audio"

export async function POST(req: Request) {
  try {
    const { text, voice = "pt-BR-AntonioNeural", rate = "+0%", pitch = "+0Hz" } = await req.json()

    console.log(`[API TTS] Gerando áudio: voice=${voice}, text="${text.substring(0, 30)}..."`)

    const genRes = await fetch(FREE_TTS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice, rate, pitch }),
    })

    if (!genRes.ok) {
      console.error(`[API TTS] FreeTTS generation failed: ${genRes.status} ${genRes.statusText}`)
      const errorBody = await genRes.text().catch(() => "")
      console.error(`[API TTS] Error body: ${errorBody}`)
      return NextResponse.json({ error: "FreeTTS generation failed" }, { status: 502 })
    }

    const { file_id } = await genRes.json()
    console.log(`[API TTS] file_id gerado: ${file_id}`)

    const audioRes = await fetch(`${FREE_TTS_AUDIO_ENDPOINT}/${file_id}`)
    if (!audioRes.ok) {
      console.error(`[API TTS] Audio download failed: ${audioRes.status}`)
      return NextResponse.json({ error: "FreeTTS audio download failed" }, { status: 502 })
    }

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
