"use client"
import { useState } from "react";
import { useTheme } from "@/components/switchers/switchers";
import { Button } from "@/components/buttons";
import { ContactMe } from "@/components/contact-me";
import { PhraseSection } from "@/components/phrase-section";
import { contactsTranslations } from "@/data/translations/contacts";

export default function Contact() {
  const { language, theme } = useTheme();
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const lang = language as keyof typeof contactsTranslations.mainPhrase;

  // Selecionando os textos traduzidos
  const mainPhrase = contactsTranslations.mainPhrase[lang] || contactsTranslations.mainPhrase.en;
  const resumeButtonContent = contactsTranslations.resumeButton;

  // Construindo o texto do botão dinamicamente com as traduções
  const buttonText = `${isResumeOpen 
    ? (resumeButtonContent.hide[lang] || resumeButtonContent.hide.en) 
    : (resumeButtonContent.view[lang] || resumeButtonContent.view.en)
  } ${resumeButtonContent.resume[lang] || resumeButtonContent.resume.en}`;

  return (
    <article className="mx-auto p-4 md:p-20 flex flex-col gap-32 items-center">
      <section className="w-full flex flex-col gap-20 items-center slideBottom">
        <div>
          <PhraseSection type={2} phrase={mainPhrase} />
        </div>
        <div>
          <ContactMe />
        </div>
      </section>

      <section className="slideTopSlower w-full flex flex-col items-center">
        <Button
          index={4} 
          theme={theme} 
          onClick={() => setIsResumeOpen(!isResumeOpen)}
          text={buttonText}
        />
        <iframe src="/CV-EliasBarao.pdf" frameBorder="0" title="Currículo de Elias Barão"
          className={`${isResumeOpen ? 'block' : 'hidden'} w-full h-[1000px] max-w-[1500px] my-20`} />
      </section>
    </article>
  );
}