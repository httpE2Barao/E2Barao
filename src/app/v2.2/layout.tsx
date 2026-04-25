"use client"
import { Header } from "@/components/header/header"
import ThemeProvider from "@/components/switchers/switchers"
import "@/app/globals.css"
import "@/app/styles.css"

export default function V22Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Header />
      {children}
    </ThemeProvider>
  )
}