"use client"
import { useEffect, useRef } from "react";
import { useTheme } from "@/components/switchers/switchers";
import Image from "next/image";
import VanillaTilt from "vanilla-tilt";
import { TecsContainer } from "@/components/tecnologies/tecsContainer";
import { PhraseSection } from "@/components/phraseSection";

export default function HardSkills() {
  const boxRef = useRef<HTMLDivElement>(null);
  const { language } = useTheme();
  const mainPhrase = language === 'pt-BR' ? 'Aquele que tem o PORQUÊ pode enfrentar qualquer COMO.' : 'They who have a WHY can bear almost any HOW.';
  const mainPhraseAuthor = 'Friedrich Nietzsche.'

  useEffect(() => {
    if (boxRef.current) {
      VanillaTilt.init(boxRef.current);
    }
  }, []);
  const { theme } = useTheme();

  return (
    <article className={``}>

      <PhraseSection phrase={mainPhrase} author={mainPhraseAuthor}/>

      <section className={`${theme === 'dark' ? 'text-white' : 'text-black'} slideTopSlow`}>
        <h1 className="px-4 text-3xl font-bold tracking-wide text-left">Overview</h1>
        <Image
          src={`${theme === 'light' ? '/images/timeline-dark.svg' : '/images/timeline-main.svg'}`}
          alt='html5 css3 sass javascript typescript bootstrap react tailwind next.js jquery mysql'
          width='1000' height='750'
          className={`pt-4 pr-2`}
        />
      </section>
          
      <TecsContainer />
    </article >
  );
}
