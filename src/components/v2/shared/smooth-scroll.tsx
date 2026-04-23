"use client"
import { useEffect, useRef } from "react"
import Lenis from "lenis"
import "lenis/dist/lenis.css"

export function V2SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      autoRaf: true,
      overscroll: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    })

    lenisRef.current = lenis

    ;(window as unknown as { lenis: Lenis }).lenis = lenis

    return () => {
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
