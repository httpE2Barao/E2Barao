"use client"
import dynamic from "next/dynamic";
const BoxMain = dynamic(
  () => import("@/components/home/box-main"),
  {
    ssr: false,
  }
)
const BoxesSmall = dynamic(
  () => import("@/components/home/layout-boxes"),
  {
    ssr: false,
  }
)

export default function Home() {

  return (
    <main className="px-1.5 md:px-5 pb-5 ">
      <section className="grid grid-col-4 gap-3 lg:gap-6 inset-0 justify-items-stretch 
        2xl:grid-row-4 ">
        <BoxMain />
        <BoxesSmall />
      </section>
    </main>
  )
}