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
    'A colaboração entre as pessoas é o que torna a tecnologia poderosa.',
    'Collaboration between people is what makes technology powerful.'
  ];

  const languageData = language === 'pt-BR' ? list[0].ptBR : list[0].enUS;

  return (
    <div className={`${theme === 'dark' ? 'bg-azul-pastel' : 'bg-azul-claro'} 
    row-start-1 row-span-2 col-span-4 2xl:col-span-3 py-7 px-14 flex flex-col rounded-2xl min-h-[700px]`}>
      <h1 className="slideRight text-[#00000090] ml-auto text-7xl pt-[5vh] tracking-wider leading-normal font-extrabold text-right max-w-[1350px]">
        {language === 'pt-BR' ? PhraseMain[0] : PhraseMain[1]}
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
            className="icon-animation bg-white rounded-full w-[100px] h-[100px] flex items-center"
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
            className="icon-animation bg-white rounded-full w-[100px] h-[100px]">
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
