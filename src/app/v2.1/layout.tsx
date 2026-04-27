"use client"
import { Header } from "@/components/header/header"
import "@/app/globals.css"
import "@/app/styles.css"

export default function V21Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}