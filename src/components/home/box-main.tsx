import Image from "next/image";
import { useTheme } from "../switchers/switchers";

export default function BoxMain() {
  const { language } = useTheme();
  const {theme} = useTheme();

  const list = [
    {
      ptBR: [
        [
          'Me chamo Elias Barão.',
          'Eu projeto e desenvolvo aplicações web.',
          'Cientista da Computação'
        ],
      ],
      enUS: [
        [
          'My name is Elias Barão',
          'I design and develop web applications.',
          'Computer Scientist'
        ]
      ]
    }
  ];

  const PhraseMain = [
    'A colaboração entre as pessoas é o que torna a tecnologia poderosa.',
    'Collaboration between people is what makes technology powerful.'
  ];

  const languageData = language === 'pt-BR' ? list[0].ptBR : list[0].enUS;

  return (
    <div className={`${theme==='dark'? 'bg-azul-pastel': 'bg-azul-claro'} 
    row-start-1 row-span-2 col-span-4 2xl:col-span-3 h-[57vh] py-7 px-14 flex flex-col rounded-2xl `}>
      <h1 className="text-[#00000090] ml-auto text-7xl pt-[5vh] tracking-wider leading-normal font-extrabold text-right max-w-[1350px]">
        {language === 'pt-BR' ? PhraseMain[0] : PhraseMain[1]}
      </h1>
      <div className="flex flex-row justify-between mt-auto">
        <span>
          {languageData.map((subArray, index) => (
            <p key={index} className={``}>
              {Array.isArray(subArray)
                ? subArray.map((text, subIndex) => (
                    <span key={subIndex} className={`home-abt-${subIndex} block`}>
                      {text}
                    </span>
                  ))
                : (
                    <span className="block">
                      {subArray}
                    </span>
                  )
              }
            </p>
          ))}
        </span>
        <span className="flex flex-row gap-5 hover:cursor-pointer mt-auto">
          <div className="bg-white rounded-full w-[70px] max-h-[70px] flex items-center">
            <Image
              className="mx-auto"
              src='/images/icon-linkedin.svg'
              alt='Ir para meu Linkedin'
              width={45}
              height={45}
            />
          </div>
          <div className="bg-white rounded-full w-[70px] max-h-[70px]">
            <Image
              className="rounded-full p-2"
              src='/images/icon-github.svg'
              alt='Ir para meu Github'
              width={70}
              height={70}
            />
          </div>
        </span>
      </div>
    </div>
  );
}
