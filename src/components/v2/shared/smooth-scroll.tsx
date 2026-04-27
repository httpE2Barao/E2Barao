"use client"
import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Lenis from "lenis"
import "lenis/dist/lenis.css"

export function V2SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()

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

  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true })
  }, [pathname])

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return <>{children}</>
}
