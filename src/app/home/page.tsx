import BoxMain from "@/components/home/box-main";
import { BoxesSmall } from "@/components/home/layout-boxes";

export default function Home () {
  
  return (
    <main className="px-5">
      <section className="grid grid-cols-4 gap-6">
        <BoxMain />
        <BoxesSmall />
      </section>
    </main>
  )
}