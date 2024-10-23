"use client"
import { PhraseSection } from "../phrase-section";
import { useTheme } from "../switchers/switchers";

export default function BoxIntro() {
  const { language, theme } = useTheme();

  const list = [
    {
      ptBR: [
        'Designer & Desenvolvedor.',
        'Engenheiro de Software',
      ],
      enUS: [
        'Designer & Experience Developer.',
        'Software Engineer',
      ]
    }
  ];

  const languageData = language === 'pt-BR' ? list[0].ptBR : list[0].enUS;

  return (
    <>
      {/* Apresentação */}
      <div className="pt-5 flex flex-col text-center slideBottom justify-center items-center mt-auto font-extrabold">
        <span className="flex flex-col items-center justify-center">
        <PhraseSection phrase="Olá! me chamo Elias Barão."/>
          {languageData.map((text, index) => (
            <p
              key={index}
              className={`home-abt h-abt-${index} block w-[1000px] max-md:w-full ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}
            >
              {text}
              {index !== languageData.length - 1 && <br />}
            </p>
          ))}
        </span>
      </div>

      {/* <SocialBtns /> */}

      {/* <ArrowToDown /> */}
    </>
  );
}
