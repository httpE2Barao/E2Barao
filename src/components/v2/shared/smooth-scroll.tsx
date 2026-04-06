"use client"
import { useEffect, useRef } from "react"
import Lenis from "lenis"
import "lenis/dist/lenis.css"

export function V2SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      autoRaf: true,
    })

    lenisRef.current = lenis

    return () => {
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
