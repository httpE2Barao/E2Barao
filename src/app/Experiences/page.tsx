"use client"
import { Button } from "@/components/backgrounds/buttons";
import { ChoicesContainer } from "@/components/backgrounds/choices";
import { PersonalContent } from "@/components/backgrounds/personal";
import { ProfessionalContent } from "@/components/backgrounds/professional/professional";
import { ResumeAbt } from "@/components/backgrounds/resume";
import { PhraseSection } from "@/components/phraseSection";
import { useTheme } from "@/components/switchers/switchers";
import { ToTheTopButton } from "@/components/toTopBtn";
import { useEffect, useState } from "react";

export default function Backgrounds() {
  const { theme, language } = useTheme();
  const mainPhrase = language === 'pt-BR' ? 'A vida não é esperar a tempestade passar, é aprender a dançar na chuva.' : `Life isn't about waiting for the storm to pass, it's learning to dance in the rain.`;

  const [showPersonalContent, setShowPersonalContent] = useState(false);
  const [showProfessionalContent, setShowProfessionalContent] = useState(false);

  const handleClick = (targetId: string) => {
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
      <article className={`bg-img ${theme === 'light' && 'invert-color-bg'}
      flex flex-col justify-evenly w-full gap-32
      sm:px-5 max-sm:pb-10 md:px-10 lg:px-36 2xl:gap-72`}>

        <PhraseSection phrase={mainPhrase} handleClick={handleClick} />

        <ResumeAbt theme={theme} language={language} />

        <ChoicesContainer theme={theme} language={language} handleClick={handleClick} />

      </article >

      <article className="pb-32">
        {showPersonalContent && <PersonalContent />}
        {showProfessionalContent && <ProfessionalContent />}
      </article>
    </>
  );
}
