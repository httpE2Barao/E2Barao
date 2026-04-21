"use client"

async function decodeAudio(arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  return audioContext.decodeAudioData(arrayBuffer)
}

async function encodeWav(audioBuffer: AudioBuffer): Promise<Blob> {
  const numChannels = audioBuffer.numberOfChannels
  const sampleRate = audioBuffer.sampleRate
  const length = audioBuffer.length
  const bytesPerSample = 2
  const blockAlign = numChannels * bytesPerSample
  const byteRate = sampleRate * blockAlign
  const dataSize = length * blockAlign
  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i))
    }
  }

  writeString(0, "RIFF")
  view.setUint32(4, 36 + dataSize, true)
  writeString(8, "WAVE")
  writeString(12, "fmt ")
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, byteRate, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bytesPerSample * 8, true)
  writeString(36, "data")
  view.setUint32(40, dataSize, true)

  const channelData: Float32Array[] = []
  for (let c = 0; c < numChannels; c++) {
    channelData.push(audioBuffer.getChannelData(c))
  }

  let offset = 44
  for (let i = 0; i < length; i++) {
    for (let c = 0; c < numChannels; c++) {
      const sample = Math.max(-1, Math.min(1, channelData[c][i]))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
      offset += 2
    }
  }

  return new Blob([buffer], { type: "audio/wav" })
}

export async function trimAudioEnd(blob: Blob, secondsToTrim: number = 2): Promise<Blob> {
  const arrayBuffer = await blob.arrayBuffer()
  const audioBuffer = await decodeAudio(arrayBuffer)

  const sampleRate = audioBuffer.sampleRate
  const samplesToTrim = Math.floor(sampleRate * secondsToTrim)
  const newLength = Math.max(0, audioBuffer.length - samplesToTrim)

  if (newLength <= 0) return blob

  const trimmedBuffer = new (window.AudioContext || (window as any).webkitAudioContext)().createBuffer(
    audioBuffer.numberOfChannels,
    newLength,
    sampleRate
  )

  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const originalData = audioBuffer.getChannelData(channel)
    const trimmedData = trimmedBuffer.getChannelData(channel)
    trimmedData.set(originalData.subarray(0, newLength))
  }

  return encodeWav(trimmedBuffer)
}