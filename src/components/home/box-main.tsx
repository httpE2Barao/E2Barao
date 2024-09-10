"use client"
import React from "react";
import Image from "next/image";
import { useTheme } from "../switchers/switchers";
import { BoxMainPhrase } from "./box-phrase";
import ArrowToDown from "./down-arrow";

export default function BoxMain() {
  const { language, theme } = useTheme();

  const list = [
    {
      ptBR: [
        'Olá, sou Elias Barão.',
        'Eu crio e desenvolvo sites e aplicativos.',
        'Engenheiro de Software.',
      ],
      enUS: [
        'My name is Elias Barão.',
        'I design and develop web applications.',
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

        {/* Apresentação */}
        <div className="flex flex-row-reverse text-right max-md:flex-col justify-between mt-auto font-extrabold pr-4">
          <span>
            {languageData.map((text, index) => (
              <p key={index} className={`home-abt h-abt-${index} block slideRightSlow w-[60vw]`}>
                {text}
                {index !== languageData.length - 1 && <br />}
              </p>
            ))}
          </span>

          {/* Social Buttons */}
          <span className="flex flex-row-reverse justify-end w-[95%] lg:gap-5 hover:cursor-pointer mt-auto mr-auto py-5 max-md:absolute max-md:justify-between max-md:translate-y-[150px] overflow-hidden">
            <div
              className="invert-color-hover min-w-16 bg-white rounded-full px-5 max-sm:w-16 lg:w-[100px] lg:h-[100px] flex items-center"
              onClick={() => window.open('https://www.linkedin.com/in/e2barao/', '_blank')}>
              <Image
                className="content-animation mx-auto"
                src='/images/icon-linkedin.svg'
                alt='Ver meu Linkedin'
                width={40}
                height={40}
              />
            </div>
            <div
              className="invert-color-hover min-w-16 bg-white rounded-full max-sm:w-16 lg:w-[100px] lg:h-[100px] "
              onClick={() => window.open('https://github.com/httpE2Barao', '_blank')}>
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
      </article>
      {/* <ArrowToDown /> */}
    </>
  );
}
