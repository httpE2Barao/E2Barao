import { V2HomeHero } from "@/components/v2/home/hero"
import { V2IntroText } from "@/components/v2/home/intro-text"
import { V2ProjectsSpiral } from "@/components/v2/home/projects-spiral"
import { V2Marquee } from "@/components/v2/home/marquee"
import { V2Footer } from "@/components/v2/shared/footer"

export default function V21Home() {
  return (
    <main>
      <V2HomeHero />
      <V2IntroText />
      <V2ProjectsSpiral />
      <V2Marquee />
      <V2Footer />
    </main>
  )
}
