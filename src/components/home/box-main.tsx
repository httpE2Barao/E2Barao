import Image from "next/image";
import { useTheme } from "../switchers/switchers";

export default function BoxMain() {
  const { language, theme } = useTheme();

  const list = [
    {
      ptBR: [
        'Me chamo Elias Barão.',
        'Eu projeto e desenvolvo aplicações web.',
        'Cientista da Computação'
      ],
      enUS: [
        'My name is Elias Barão',
        'I design and develop web applications.',
        'Computer Scientist'
      ]
    }
  ];

  const PhraseMain = [
    ['Faça o que você ama,', <br />, 'ame o que você faz!'],
    ['Do what you love,', <br />, 'love what you do!']
  ];

  const languageData = language === 'pt-BR' ? list[0].ptBR : list[0].enUS;

  return (
    <div className={`${theme === 'dark' ? 'bg-azul-claro' : 'bg-azul-claro'} 
    w-full row-start-1 row-span-2 col-span-4 flex flex-col rounded-2xl shadow-lg
    p-4 md:gap-20 lg:py-7 lg:px-10 lg:col-span-3 xl:col-span-2`}>

      <h1 className="slideRight textShadow-xl text-2xl text-[#000000a8] tracking-widest leading-normal font-extrabold py-[8vh]
      md:text-4xl xl:text-5xl 2k:text-4xl 2xl:text-5xl 4k:text-6xl w-full flex flex-col justify-between">
        <span className="text-left">
          {language === 'pt-BR' ? PhraseMain[0][0] : PhraseMain[1][0]}<br/>
        </span>
        <span className="text-right lg:pt-10">
          {language === 'pt-BR' ? PhraseMain[0][2] : PhraseMain[1][2]}
        </span>
      </h1>

      <div className="flex flex-row justify-between mt-auto">
        <span>
          {languageData.map((text, index) => (
            <p key={index} className={`home-abt-${index} block slideRightSlow`}>
              {text}
            </p>
          ))}
        </span>

        <span className="flex flex-row gap-5 hover:cursor-pointer mt-auto">

          <div
            className="invert-color-hover bg-white rounded-full px-4 max-sm:w-16 lg:w-[100px] lg:h-[100px] flex items-center"
            onClick={() => window.open('https://www.linkedin.com/in/e2barao/', '_blank')}>
            <Image
              className="content-animation mx-auto"
              src='/images/icon-linkedin.svg'
              alt='Ver meu Linkedin'
              width={45}
              height={45}
            />
          </div>

          <div
            onClick={() => window.open('https://github.com/httpE2Barao', '_blank')}
            className="invert-color-hover bg-white rounded-full max-sm:w-16 lg:w-[100px] lg:h-[100px]">
            <Image
              className="content-animation m-auto pt-4 rounded-full p-2"
              src='/images/icon-github.svg'
              alt='Ver meu Github'
              width={80}
              height={80}
            />
          </div>
        </span>
      </div>
    </div>
  );
}
