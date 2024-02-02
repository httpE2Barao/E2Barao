import Image from "next/image";
import { useTheme } from "../switchers/switchers";
import React from "react";

interface BoxProps {
  name: string | string[];
  alt: string;
  index?: number;
  bgNone?: boolean;
  last?: boolean;
}

export default function BoxSmall(props: BoxProps) {
  const tecs = ['link', 'typescript', 'react', 'tailwind', 'figma', 'tailwind', 'react',];
  const { theme } = useTheme();

  return (
    <>
      {/* ${props.last === true ? 'row-start-2 2xl:row-start-1 2xl:max-h-none' : 'row-start-2'} */}
      <div
        className={`${theme === 'dark' ? 'bg-azul-pastel' : 'bg-azul-claro'}
          ${props.bgNone === true && 'bg-transparent p-0'}
          ${props.last === true ? '2xl:row-start-3 2xl:col-span-3' : '2xl:col-start-4' }
          slideRightSlower flex items-center justify-center p-5 rounded-2xl max-h-[360px]
          `}
      >
        {props.last !== true ? (
          <Image
            src={`/images/img-${props.name}.png`}
            alt={props.alt}
            width={400}
            height={500}
            className={`${props.bgNone === true && ''} `}
          />
        ) : (
          // grid para as tecnologias e o botão do ultimo elemento
          <div className="grid grid-cols-3 2xl:grid-cols-10 gap-x-6 gap-y-3 last-small-box">
            {tecs.map((item, index) => (
              <React.Fragment key={index}>
                {index !== 0 ? (
                  <Image
                    src={`/images/img-${item}.png`}
                    alt={item}
                    width={300}
                    height={300}
                  />
                ) : (
                  <>
                  
                    <button className={` 2xl:hidden
                    col-span-3 row-start-2 h-24 text-3xl font-bold uppercase text-[#00000080] bg-white rounded-xl
                    hover:bg-black hover:text-white 
                    `}>
                      {props.name}
                    </button>
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
