import { V2Header } from "@/components/v2/shared/header"
import "@/app/globals.css"
import "@/app/styles.css"

export default function V22Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <V2Header />
      {children}
    </>
  )
}