import { useTheme } from "@/components/Switchers"
import { Button } from "@/components/backgrounds/bgs-button";
import { PhraseSection } from "@/components/backgrounds/bgs-phrase";

export default function Backgrounds() {

  const { theme, language } = useTheme();

  return (
    <article className="flex flex-col justify-center xl:gap-96 px-36 xl:h-[1000px] w-full">

      <PhraseSection
        language={language}
      />

      <section className="flex items-center justify-around xl:text-3xl">
        
        <Button text='Profissional'theme={theme}/>
        <Button text='Pessoal'theme={theme}/>
      
      </section>

    </article>
  )
}