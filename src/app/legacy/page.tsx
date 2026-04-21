"use client"
import { useState, useEffect, useMemo } from "react"
import dynamic from "next/dynamic"

const V21Home = dynamic(() => import("@/app/v2.1/page"), { ssr: false })
const V22Home = dynamic(() => import("@/app/v2.2/page"), { ssr: false })

function useDeviceType() {
  const [isSmallScreen, setIsSmallScreen] = useState(true)

  useEffect(() => {
    const checkScreen = () => {
      const small = window.innerWidth < 1280
      setIsSmallScreen(small)
    }
    
    checkScreen()
    window.addEventListener("resize", checkScreen)
    return () => window.removeEventListener("resize", checkScreen)
  }, [])

  return isSmallScreen
}

export default function Home() {
  const isSmallScreen = useDeviceType()

  if (isSmallScreen) {
    return <V22Home />
  }

  return <V21Home />
}
