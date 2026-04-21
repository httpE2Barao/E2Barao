import { V2HomeHeroV2 } from "@/components/v2/home/hero-v2"
import { V2IntroText } from "@/components/v2/home/intro-text"
import { V2ProjectsSpiral } from "@/components/v2/home/projects-spiral"
import { V2Marquee } from "@/components/v2/home/marquee"
import { V2Footer } from "@/components/v2/shared/footer"

export default function V22Home() {
  return (
    <main>
      <V2HomeHeroV2 />
      <V2IntroText />
      <V2ProjectsSpiral />
      <V2Marquee />
      <V2Footer />
    </main>
  )
}