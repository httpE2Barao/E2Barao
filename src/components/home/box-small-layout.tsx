"use client"
import { useTheme } from "../switchers/switchers";
import BoxSmall from "./box-small";

export default function BoxesSmall() {
  const { language } = useTheme();

  const languageList = [
    {
      ptBR: [
        ['responsivo', 'Design Responsivo'],
        ['codigo', 'Código limpo e Reutilizavel'],
        ['ver tudo', 'ver todas as tecnologias']
      ],
      enUS: [
        ['responsive', 'Responsive Design'],
        ['code', 'Clean and reusable code'],
        ['view all', 'view all the techlogies']
      ],
    }
  ];

  const languageData = language === 'pt-BR' ? languageList[0].ptBR : languageList[0].enUS;

  return (
    <>
      <BoxSmall
        name={'dev'}
        alt={'Developer | Desenvolvedor'}
        key={'img-home-dev'}
        bgNone={true}
      />
      {languageData.map((subArray, index) => (
        <>
          {index != languageData.length - 1
            ?
            <BoxSmall
              name={subArray[0]}
              alt={subArray[1]}
              key={`${language}-${index}`}
              index={index}
            />
            : 
            <BoxSmall 
              name={subArray[0]}
              alt={subArray[1]}
              key={`${language}-${index}`}
              index={index}
              last={true}
            />
          }
        </>
      ))}
    </>
  );
}
