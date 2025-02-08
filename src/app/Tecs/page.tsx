"use client"
import { Button } from "@/components/buttons";
import { PhraseSection } from "@/components/phrase-section";
import { useTheme } from "@/components/switchers/switchers";
import TecsContainer from "@/components/tecnologies/tecs-container";
import Image from "next/image";
import { useEffect, useRef } from "react";
import VanillaTilt from "vanilla-tilt";

export default function HardSkills() {
  const boxRef = useRef<HTMLDivElement>(null);
  const { language } = useTheme();
  const mainPhrase = language === 'pt-BR' ? 'Aquele que tem um porquê pode enfrentar qualquer como.' : 'Those who have a why can handle almost any how.';
  const mainPhraseAuthor = 'Friedrich Nietzsche.'

  useEffect(() => {
    if (boxRef.current) {
      VanillaTilt.init(boxRef.current);
    }
  }, []);
  const { theme } = useTheme();

  return (
    <article className={`max-w-[2500px] mx-auto pb-20 px-20 max-xl:px-0`}>

      <PhraseSection phrase={mainPhrase} type={1} author={mainPhraseAuthor} />

      <section className={`${theme === 'dark' ? 'text-white' : 'text-black'} slideTopSlow`}>
        <h1 className="px-4 text-3xl font-bold tracking-wide text-left">Overview</h1>
        <Image
          src={`${theme === 'light' ? '/images/timeline-dark.svg' : '/images/timeline-main.svg'}`}
          alt='html5 css3 sass javascript typescript bootstrap react tailwind next.js jquery mysql'
          width={2500} height={1700}
          className={`mx-auto pt-4 pr-2`}
        />
      </section>

      <section className="flex flex-col items-center">
        <TecsContainer type={0} />
        <span className="mt-5">
          <Button text={`${language === 'pt-BR' ? 'Repositório de estudos' : 'Study repository'}`} index={5} theme={theme} onClick={() => window.open('https://glib-quesadilla-c64.notion.site/Faculdade-12b74a78254980f1a40ef1f8ceb105a5?pvs=73', '_blank')} />
        </span>
      </section>
    </article >
  );
}
