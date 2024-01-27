import BoxMain from "@/components/home/box-main";
import { BoxesSmall } from "@/components/home/layout-boxes";

export default function Home () {
  
  return (
    <main className="px-5">
      <section className="grid grid-cols-4 grid-rows-2 gap-6 
      2xl:grid-col-2 2xl:grid-row-4">
        <BoxMain />
        <BoxesSmall />
      </section>
    </main>
  )
}