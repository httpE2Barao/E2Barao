"use client"
import { Button } from "@/components/buttons";
import { ContactMe } from "@/components/contact-me";
import { PhraseSection } from "@/components/phrase-section";
import { useTheme } from "@/components/switchers/switchers"
import { useState } from "react";

export default function Contact() {
  const { language, theme } = useTheme();
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <article className=" mx-auto p-20 flex flex-col gap-32 items-center">

      <section className="w-full flex flex-col gap-20 items-center slideBottom">
        <div className="md:w-4/6">
          <PhraseSection type={2} phrase={language === 'pt-BR' ? 'Juntos, podemos ir mais longe.' : 'Together, we can go further.'}/>
        </div>
        <div>
          <ContactMe theme={theme}/>
        </div>
      </section>

      <section className="slideTopSlower w-full flex flex-col items-center">
        <Button
          index={4} theme={theme} onClick={() => setIsResumeOpen(!isResumeOpen)}
          text={language === 'pt-BR'
            ? `${isResumeOpen ? 'Ocultar' : 'Ver'} currículo`
            : `${isResumeOpen ? 'Hide' : 'View'} resume`}
        />
        <iframe src="/CV-2024.pdf" frameBorder="0"
          className={`${isResumeOpen ? 'block' : 'hidden'} w-full h-[1000px] max-w-[1500px] my-20`} />
      </section>

    </article>
  )
}