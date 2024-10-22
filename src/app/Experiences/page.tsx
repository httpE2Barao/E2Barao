"use client"
import { ChoicesContainer } from "@/components/backgrounds/choices";
import { PersonalContent } from "@/components/backgrounds/personal";
import { ProfessionalContent } from "@/components/backgrounds/professional/professional";
import { ResumeAbt } from "@/components/backgrounds/resume";
import { PhraseSection } from "@/components/phrase-section";
import { useTheme } from "@/components/switchers/switchers";
import { useEffect, useState } from "react";

export default function Backgrounds() {
  const { theme, language } = useTheme();
  const mainPhrase =
    language === "pt-BR"
      ? "A vida não é sobre esperar a tempestade passar, é aprender a dançar na chuva."
      : `Life isn't about waiting for the storm to pass, it's learning to dance in the rain.`;

  const [activeContent, setActiveContent] = useState("");

  const handleClick = (targetId: string) => {
    setActiveContent(targetId.replace("#", ""));
  };
  
  useEffect(() => {
    if (activeContent) {
      const targetElement = document.querySelector(`#${activeContent}`);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      } else {
        console.error(`Element with ID #${activeContent} not found`);
      }
    }
  }, [activeContent]);

  return (
    <>
      <article
        className={`bg-img bg-img-rain flex flex-col justify-evenly w-full gap-20
      sm:px-5 max-sm:pb-10 md:px-10 lg:px-36 2k:gap-20`}
      >
        <PhraseSection
          phrase={mainPhrase}
          type={0}
          handleClick={handleClick}
        />
        <ResumeAbt theme={theme} language={language} />
        <ChoicesContainer
          theme={theme}
          language={language}
          handleClick={handleClick}
        />
      </article>
      <article className="pb-32">
        {activeContent === "personal" && <PersonalContent />}
        {activeContent === "professional" && <ProfessionalContent />}
      </article>
    </>
  );
}
