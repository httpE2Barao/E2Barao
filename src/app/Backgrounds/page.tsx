"use client"
import { Button } from "@/components/backgrounds/bgs-button";
import { PhraseSection } from "@/components/backgrounds/bgs-phrase";
import { PersonalContent } from "@/components/backgrounds/personal";
import { ProfessionalContent } from "@/components/backgrounds/professional";
import { useTheme } from "@/components/switchers/switchers";
import { useEffect, useState } from "react";

export default function Backgrounds() {
  const { theme, language } = useTheme();
  const list = ['Profissional', 'Professional', 'Pessoal', 'Personal'];

  const [showPersonalContent, setShowPersonalContent] = useState(false);
  const [showProfessionalContent, setShowProfessionalContent] = useState(false);

  const handleClick = ( targetId:string ) => {
    const smoothScroll = () => {
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
        });
      } else {
        console.error(`Element with ID ${targetId} not found`);
      }
    };

    if (targetId === '#personal') {
      setShowPersonalContent(true);
      setShowProfessionalContent(false);
    } if (targetId === '#professional') {
      setShowProfessionalContent(true);
      setShowPersonalContent(false); 
    }

    smoothScroll();
  };

  useEffect(() => {
    const init = () => {
      const buttonProfessional = document.getElementById('scrollButton-0');
      const buttonPersonal = document.getElementById('scrollButton-1');

      buttonPersonal?.addEventListener('click', () => handleClick('#personal'));
      buttonProfessional?.addEventListener('click', () => handleClick('#professional'));

      return () => {
        buttonPersonal?.removeEventListener('click', () => handleClick('#personal'));
        buttonProfessional?.removeEventListener('click', () => handleClick('#professional'));
      };
    };

    if (document.readyState === 'complete') {
      init();
    } else {
      document.addEventListener('DOMContentLoaded', init);
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', init);
    };
  }, []);

  return (
    <>
      <article className={`bg-img ${ theme==='light' && 'invert-color'}
      flex flex-col justify-evenly h-screen w-full
      px-5 max-sm:pb-10 sm:px-10 lg:px-36 2xl:gap-72 `}>

        <PhraseSection language={language} theme={theme}/>

        <section className="slideBottomSlow flex flex-col gap-5 items-center justify-around 
        sm:gap-10 xl:text-3xl">
          <h3 className={`${theme === 'dark' ? 'text-white' : 'text-black'} 
          sm:text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl 4k:text-8xl`}>
            {language === 'pt-BR' ? 'O que deseja saber?' : 'What would you like to know?'}
          </h3>

          <span className="flex gap-10 xl:gap-20">
            <Button index={0} text={language === 'pt-BR' ? list[0] : list[1]} theme={theme} onClick={() => handleClick('#personal')} />
            <Button index={1} text={language === 'pt-BR' ? list[2] : list[3]} theme={theme} onClick={() => handleClick('#professional')} />
          </span>
        </section>
      </article>

      {showPersonalContent && <PersonalContent />}
      {showProfessionalContent && <ProfessionalContent />}
    </>
  );
}
