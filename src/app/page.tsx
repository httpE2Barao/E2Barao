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
    <main className="px-5 pb-5">
      <section className="grid grid-cols-4 grid-rows-2 gap-6 inset-0
       2xl:grid-col-2 2xl:grid-row-4 ">
        <BoxMain />
        <BoxesSmall />
      </section>
    </main>
  )
}