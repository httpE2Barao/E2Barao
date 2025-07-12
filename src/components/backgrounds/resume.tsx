import { useTheme } from "../switchers/switchers";
import { experiencesTranslations } from "@/data/translations/experiences";

export const ResumeAbt = () => {
  const { theme, language } = useTheme();
  const content = experiencesTranslations.resume;

  return (
    <section id="resume-abt" className={`${theme === 'dark' ? 'text-white' : 'text-black'} text-center font-semibold text-xl px-4 py-10 mx-auto max-w-[2000px]`}>
      <div>
        <p>{content.p1[language as keyof typeof content.p1] || content.p1.en}</p>
        <br/>
        <p>{content.p2[language as keyof typeof content.p2] || content.p2.en}</p>
      </div>
    </section>
  );
}