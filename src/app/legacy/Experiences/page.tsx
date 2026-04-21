"use client";
import { ChoicesContainer } from "@/components/backgrounds/choices";
import { PersonalContent } from "@/components/backgrounds/personal";
import { ProfessionalContent } from "@/components/backgrounds/professional/professional";
import { ResumeAbt } from "@/components/backgrounds/resume";
import { PhraseSection } from "@/components/phrase-section";
import { useTheme } from "@/components/switchers/switchers";
import { experiencesTranslations } from "@/data/translations/experiences";
import { useEffect, useState } from "react";

export default function Backgrounds() {
  const { theme, language } = useTheme();
  const [activeContent, setActiveContent] = useState("");

  const mainPhrase = experiencesTranslations.mainPhrase[language as keyof typeof experiencesTranslations.mainPhrase] || experiencesTranslations.mainPhrase.en;

  const handleClick = (targetId: string) => {
    setActiveContent(targetId.replace("#", ""));
  };

  useEffect(() => {
    if (typeof window !== "undefined" && activeContent) {
      const targetElement = document.querySelector(`#${activeContent}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      } else {
        console.error(`Element with ID #${activeContent} not found`);
      }
    }
  }, [activeContent]);

  return (
    <>
      <article className={`bg-img bg-img-rain flex flex-col justify-evenly w-full gap-20 sm:px-5 max-sm:pb-10 md:px-10 lg:px-36 2k:gap-20`}>
        <PhraseSection phrase={mainPhrase} type={0} handleClick={handleClick} />
        <ResumeAbt />
        <ChoicesContainer handleClick={handleClick} />
      </article>
      <article className="pb-32">
        {activeContent === "personal" && <PersonalContent />}
        {activeContent === "professional" && <ProfessionalContent />}
      </article>
    </>
  );
}