"use client"
import { Button } from "@/components/backgrounds/choices";
import { PersonalContent } from "@/components/backgrounds/personal";
import { ProfessionalContent } from "@/components/backgrounds/professional/professional";
import { PhraseSection } from "@/components/phraseSection";
import { useTheme } from "@/components/switchers/switchers";
import { useEffect, useState } from "react";

export default function Backgrounds() {
  const { theme, language } = useTheme();
  const choice = ['Profissional', 'Professional', 'Pessoal', 'Personal'];
  const mainPhrase = language === 'pt-BR' ? 'A vida não é esperar a tempestade passar, é aprender a dançar na chuva.' : `Life isn't about waiting for the storm to pass, it's learning to dance in the rain.`;

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
      flex flex-col justify-evenly h-[90vh] w-full
      sm:px-5 max-sm:pb-10 md:px-10 lg:px-36 2xl:gap-72 `}>

        <PhraseSection phrase={mainPhrase}/>

        <section className="slideBottomSlow flex flex-col gap-5 items-center justify-around 
        sm:gap-10 ">
          <h3 className={`${theme === 'dark' ? 'text-white' : 'text-black'} 
          font-semibold text-2xl xl:text-5xl`}>
            {language === 'pt-BR' ? 'O que deseja saber?' : 'What would you like to know?'}
          </h3>

          <span className="flex gap-10 xl:gap-20 text-2xl">
            <Button index={0} text={language === 'pt-BR' ? choice[0] : choice[1]} theme={theme} onClick={() => handleClick('#personal')} />
            <Button index={1} text={language === 'pt-BR' ? choice[2] : choice[3]} theme={theme} onClick={() => handleClick('#professional')} />
          </span>
        </section>
      </article>

      {showPersonalContent && <PersonalContent />}
      {showProfessionalContent && <ProfessionalContent />}
    </>
  );
}
