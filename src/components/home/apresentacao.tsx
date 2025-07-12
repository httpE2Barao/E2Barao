"use client"
import { PhraseSection } from "../phrase-section";
import { useTheme } from "../switchers/switchers";

const translations = {
  name: {
    pt: "Elias Edson Barão",
    en: "Elias Edson Barão",
    es: "Elias Edson Barão",
    fr: "Elias Edson Barão",
    zh: "以利亚 爱迪生 男爵", 
  },
  subtitles: {
    pt: ['Designer & Desenvolvedor', 'Engenheiro de Software'],
    en: ['Designer & Developer', 'Software Engineer'],
    es: ['Diseñador & Desarrollador', 'Ingeniero de Software'],
    fr: ['Designer & Développeur', 'Ingénieur Logiciel'],
    zh: ['设计师 & 开发者', '软件工程师'],
  }
};

export default function BoxIntro() {
  const { language, theme } = useTheme();

  // Seleciona os textos corretos com base no idioma, com fallback para inglês
  const translatedName = translations.name[language as keyof typeof translations.name] || translations.name.en;
  const languageData = translations.subtitles[language as keyof typeof translations.subtitles] || translations.subtitles.en;

  return (
    <>
      <div className="max-xl:pt-5 xl:pb-16 flex flex-col text-center slideBottom justify-center items-center max-lg:mt-auto font-extrabold">
        <span className="flex flex-col items-start max-xl:items-center max-xl:justify-center">
        {/* Agora o nome vem do nosso objeto de traduções */}
        <PhraseSection phrase={translatedName}/>
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