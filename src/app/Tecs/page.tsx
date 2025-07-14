"use client"
import { Button } from "@/components/buttons";
import { PhraseSection } from "@/components/phrase-section";
import { useTheme } from "@/components/switchers/switchers";
import TecsContainer from "@/components/tecnologies/tecs-container";
import SkillsEvolutionChart from "@/components/tecnologies/tecs-chart";
import { technologiesTranslations } from "@/data/translations/technologies";

export default function HardSkills() {
  const { language, theme } = useTheme();
  
  // Acessando as traduções do arquivo central
  const t = (key: keyof typeof technologiesTranslations) => {
    const section = technologiesTranslations[key];
    if (typeof section === 'string') return section;
    return section[language as keyof typeof section];
  };

  return (
    <article className={`max-w-[2500px] mx-auto pb-20 px-20 max-xl:px-0`}>

      <PhraseSection phrase={t('mainPhrase')} type={1} author={t('mainPhraseAuthor')} />

      <section className={`${theme === 'dark' ? 'text-white' : 'text-black'} slideTopSlow my-16`}>
        <h1 className="px-10 text-3xl font-bold tracking-wide mb-8 text-center">
          {t('skillsEvolution')}
        </h1>
        <div className="w-full max-w-5xl mx-auto bg-white/50 dark:bg-gray-800/0 rounded-2xl p-6 md:p-8">
          <SkillsEvolutionChart />
        </div>
      </section>

      <section className="flex flex-col items-center">
        <TecsContainer />
        <span className="mt-5">
          <Button text={t('studyRepo')} index={5} theme={theme} onClick={() => window.open('https://glib-quesadilla-c64.notion.site/Faculdade-12b74a78254980f1a40ef1f8ceb105a5?pvs=73', '_blank')} />
        </span>
      </section>
    </article >
  );
}