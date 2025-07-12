import { useEffect, useState } from "react";
import { Button } from "../buttons";
import { useTheme } from "../switchers/switchers";
import { experiencesTranslations } from "@/data/translations/experiences";

interface iChoicesContainer {
  handleClick: (targetId: string) => void;
}

export const ChoicesContainer = ({ handleClick }: iChoicesContainer) => {
  const { theme, language } = useTheme();
  const [selected, setSelected] = useState<string>("#professional");
  const content = experiencesTranslations.choices;
  
  const professionalText = content.professional[language as keyof typeof content.professional] || content.professional.en;
  const personalText = content.personal[language as keyof typeof content.personal] || content.personal.en;

  return (
    <section className="mb-20 flex flex-col gap-5 items-center justify-around sm:gap-10">
      <span className="flex gap-10 xl:gap-20 text-2xl">
        <Button index={0} text={professionalText} theme={theme} isSelected={selected === "#professional"} onClick={() => { setSelected("#professional"); handleClick("#professional"); }} />
        <Button index={1} text={personalText} theme={theme} isSelected={selected === "#personal"} onClick={() => { setSelected("#personal"); handleClick("#personal"); }} />
      </span>
    </section>
  );
};