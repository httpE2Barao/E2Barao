"use client"
import { useTheme } from "../switchers/switchers";
import { BoxMainPhrase } from "./box-phrase";
import { SocialBtns } from "./social-btn";

export default function BoxIntro() {
  const { language, theme } = useTheme();

  const list = [
    {
      ptBR: [
        'Olá! Sou Elias Barão.',
        'Designer & Desenvolvedor.',
        'Engenheiro de Software',
      ],
      enUS: [
        'Hello! I am Elias Barão.',
        'Designer & Experience Developer.',
        'Software Engineer',
      ]
    }
  ];

  const languageData = language === 'pt-BR' ? list[0].ptBR : list[0].enUS;

  return (
    <>
      <article className={`${theme === 'dark' ? 'bg-azul-claro' : 'bg-azul-claro'} slideRight
      flex flex-col w-full row-start-1 row-span-2 col-span-4 rounded-2xl shadow-lg p-4 gap-20 lg:py-7 lg:px-10 lg:col-span-3 2xl:col-span-2`}>        
        <BoxMainPhrase language={language} />
      </article>

      {/* Apresentação */}
      <div className="flex flex-row-reverse max-md:text-center text-right max-md:flex-col justify-between mt-auto font-extrabold">
        <span>
          {languageData.map((text, index) => (
            <p key={index} className={`home-abt h-abt-${index} block slideRightSlow w-[1000px] max-md:w-full`}>
              {text}
              {index !== languageData.length - 1 && <br />}
            </p>
          ))}
        </span>
      </div>

      <SocialBtns />

      {/* <ArrowToDown /> */}
    </>
  );
}
