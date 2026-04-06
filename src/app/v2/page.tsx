import { V2HomeHero } from "@/components/v2/home/hero"
import { V2StickyPhrases } from "@/components/v2/home/sticky-phrases"
import { V2Marquee } from "@/components/v2/home/marquee"
import { V2Approach } from "@/components/v2/home/approach"
import { V2Footer } from "@/components/v2/shared/footer"

export default function V2Home() {
  return (
    <main>
      <V2HomeHero />
      <V2StickyPhrases />
      <V2Approach />
      <V2Marquee />
      <V2Footer />
    </main>
  )
}
