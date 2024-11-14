"use client"
import { PhraseSection } from "../phrase-section";
import { useTheme } from "../switchers/switchers";

export default function BoxIntro() {
  const { language, theme } = useTheme();

  const list = [
    {
      ptBR: [
        'Designer & Desenvolvedor',
        'Engenheiro de Software',
      ],
      enUS: [
        'Designer & Developer',
        'Software Engineer',
      ]
    }
  ];

  const languageData = language === 'pt-BR' ? list[0].ptBR : list[0].enUS;

  return (
    <>
      <div className="max-xl:pt-5 xl:pb-16 flex flex-col text-center slideBottom justify-center items-center max-lg:mt-auto font-extrabold">
        <span className="flex flex-col items-start max-xl:items-center max-xl:justify-center">
        <PhraseSection phrase="Elias Edson Barão"/>
          {languageData.map((text, index) => (
            <p
              key={index}
              className={`home-abt h-abt-${index} pl-10 max-xl:p-0 block max-lg:w-[1000px] max-xl:text-center max-md:w-full ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}
            >
              {text}
              {index !== languageData.length - 1 && <br />}
            </p>
          ))}
        </span>
      </div>
    </>
  );
}
