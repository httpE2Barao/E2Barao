import Image from "next/image";
import { useTheme } from "../Switchers";
import React from "react";

interface BoxProps {
  name: string | string[];
  alt: string;
  index?: number;
  bgNone?: boolean;
  last?: boolean;
}

export default function BoxSmall(props: BoxProps) {
  const tecs = ['link', 'typescript', 'react', 'tailwind', 'figma', 'tailwind', 'react'];
  const { theme } = useTheme();

  return (
    <>
      <div
        className={`${theme === 'dark' ? 'bg-azul-pastel' : 'bg-azul-claro'}
          ${props.bgNone === true ? 'bg-transparent' : 'flex items-center justify-center'}
          p-5 rounded-2xl`}
      >
        {props.last !== true ? (
          <Image
            src={`/images/img-${props.name}.png`}
            alt={props.alt}
            width={400}
            height={500}
            className={`${props.bgNone === true ? 'absolute left-4 bottom-8 h-[400px] w-[350]' : 'max-h-[500px]'}`}
          />
        ) : (
          <div className="grid grid-cols-3 gap-x-6 gap-y-3">
            {tecs.map((item, index) => (
              <React.Fragment key={index}>
                {index !== 0 ? (
                  <Image
                    src={`/images/img-${item}.png`}
                    alt={item}
                    width={100}
                    height={100}
                  />
                ) : (
                  <>
                    <button className={`
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
