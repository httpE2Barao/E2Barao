"use client"
import { Button } from "@/components/backgrounds/bgs-button";
import { PhraseSection } from "@/components/backgrounds/bgs-phrase";
import { PersonalContent } from "@/components/backgrounds/personal";
// import { ProfissionalContent } from "@/components/backgrounds/profissional"; // Certifique-se de importar o componente ProfissionalContent se você tiver um
import { useTheme } from "@/components/switchers/switchers";
import { useEffect, useState } from "react";

export default function Backgrounds() {
  const { theme, language } = useTheme();
  const list = ['Profissional', 'Professional', 'Pessoal', 'Personal'];

  const [showPersonalContent, setShowPersonalContent] = useState(false);
  const [showProfissionalContent, setShowProfissionalContent] = useState(false);

  const handleClick = (targetId) => {
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
      setShowProfissionalContent(false);
    } else if (targetId === '#profissional') {
      setShowPersonalContent(false); 
      setShowProfissionalContent(true);
    }

    smoothScroll();
  };

  useEffect(() => {
    const init = () => {
      const buttonPersonal = document.getElementById('scrollButton-1');
      const buttonProfissional = document.getElementById('scrollButton-2');

      buttonPersonal?.addEventListener('click', () => handleClick('#personal'));
      buttonProfissional?.addEventListener('click', () => handleClick('#profissional'));

      return () => {
        buttonPersonal?.removeEventListener('click', () => handleClick('#personal'));
        buttonProfissional?.removeEventListener('click', () => handleClick('#profissional'));
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
      flex flex-col justify-center xl:gap-72 px-36 2xl:h-screen w-full`}>

        <PhraseSection language={language} />

        <section className="slideBottomSlow flex flex-col gap-10 items-center justify-around xl:text-3xl">
          <h3 className="text-white">
            {language === 'pt-BR' ? 'O que deseja saber?' : 'What would you like to know?'}
          </h3>

          <span className="flex gap-10">
            <Button index={0} text={language === 'pt-BR' ? list[0] : list[1]} theme={theme} onClick={() => handleClick('#personal')} />
            <Button index={1} text={language === 'pt-BR' ? list[2] : list[3]} theme={theme} onClick={() => handleClick('#profissional')} />
          </span>
        </section>
      </article>

      {showPersonalContent && <PersonalContent />}
      {/* {showProfissionalContent && <ProfissionalContent />} */}
    </>
  );
}
