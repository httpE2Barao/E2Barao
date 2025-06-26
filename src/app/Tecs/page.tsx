"use client"
import { Button } from "@/components/buttons";
import { PhraseSection } from "@/components/phrase-section";
import { useTheme } from "@/components/switchers/switchers";
import TecsContainer from "@/components/tecnologies/tecs-container";
import Image from "next/image";
import { useEffect, useRef } from "react";
import VanillaTilt from "vanilla-tilt";
import SkillsEvolutionChart from "@/components/tecnologies/tecs-chart";


export default function HardSkills() {
  const boxRef = useRef<HTMLDivElement>(null);
  const { language, theme } = useTheme();
  const mainPhrase = language === 'pt-BR' ? 'Aquele que tem um porquê pode enfrentar qualquer como.' : 'Those who have a why can handle almost any how.';
  const mainPhraseAuthor = 'Friedrich Nietzsche.'

  useEffect(() => {
    if (boxRef.current) {
      VanillaTilt.init(boxRef.current);
    }
  }, []);

  return (
    <article className={`max-w-[2500px] mx-auto pb-20 px-20 max-xl:px-0`}>

      <PhraseSection phrase={mainPhrase} type={1} author={mainPhraseAuthor} />

      <section className={`${theme === 'dark' ? 'text-white' : 'text-black'} slideTopSlow my-16`}>
        <h1 className="px-10 text-3xl font-bold tracking-wide mb-8 text-center">
          {language === 'pt-BR' ? 'Evolução de Habilidades' : 'Skills Evolution'}
        </h1>
        <div className="w-full max-w-5xl mx-auto bg-white/50 dark:bg-gray-800/0 rounded-2xl p-6 md:p-8">
          {/* 3. Renderize o componente do gráfico, passando o tema atual */}
          <SkillsEvolutionChart />
        </div>
      </section>

      <section className="flex flex-col items-center">
        <TecsContainer />
        <span className="mt-5">
          <Button text={`${language === 'pt-BR' ? 'Repositório de estudos' : 'Study repository'}`} index={5} theme={theme} onClick={() => window.open('https://glib-quesadilla-c64.notion.site/Faculdade-12b74a78254980f1a40ef1f8ceb105a5?pvs=73', '_blank')} />
        </span>
      </section>
    </article >
  );
}
