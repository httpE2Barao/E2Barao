"use client";
import { useTheme } from "../switchers/switchers";
import { motion } from "framer-motion";
import TecsGrid from "./tecs-grid";
import { technologiesTranslations } from "@/data/translations/technologies"; // Importando do novo arquivo

const SkillPill = ({ name, index }: { name: string; index: number }) => (
  <motion.div
    className="border rounded-lg p-3 text-center text-sm font-medium transition-all cursor-pointer bg-slate-100 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700 text-black dark:text-white hover:border-[#8FFFFF] hover:bg-[#8FFFFF]/40 hover:text-black hover:font-black"
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.04 }}
    viewport={{ once: true }}
  >
    {name}
  </motion.div>
);

export default function TecsContainer({ type }: { type?: number }) {
  const { language, theme } = useTheme();
  const lang = language as keyof typeof technologiesTranslations.conceptsTitle;

  // Extrai os dados do objeto de tradução
  const concepts = technologiesTranslations.concepts;
  const programs = technologiesTranslations.programs;
  const techIcons = technologiesTranslations.techIcons;
  
  // Seleciona os títulos traduzidos com fallback para inglês
  const conceptsTitle = technologiesTranslations.conceptsTitle[lang] || technologiesTranslations.conceptsTitle.en;
  const programsTitle = technologiesTranslations.programsTitle[lang] || technologiesTranslations.programsTitle.en;
  const technologiesTitle = technologiesTranslations.technologiesTitle[lang] || technologiesTranslations.technologiesTitle.en;

  if (type === 1) {
    return (
      <section className="my-10 w-full">
        <TecsGrid techList={techIcons} />
      </section>
    );
  }

  return (
    <section className="my-10 space-y-16 w-full max-xl:px-10">
      <div className="flex flex-col lg:flex-row flex-wrap justify-center gap-8">
        <div className="bg-slate-50 dark:bg-gray-800/40 shadow-lg shadow-slate-300/60 dark:shadow-none border border-slate-200 dark:border-gray-700/50 rounded-2xl p-6 flex-1 min-w-[300px] lg:max-w-[48%]">
          <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-200' : 'text-black'}`}>{conceptsTitle}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {concepts.map((tech, idx) => (
              <SkillPill key={idx} name={tech[lang] || tech.en} index={idx} />
            ))}
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-gray-800/40 shadow-lg shadow-slate-300/60 dark:shadow-none border border-slate-200 dark:border-gray-700/50 rounded-2xl p-6 flex-1 min-w-[300px] lg:max-w-[48%]">
          <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-200' : 'text-black'}`}>{programsTitle}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {programs.map((tech, idx) => (
              <SkillPill key={idx} name={tech[lang] || tech.en} index={idx} />
            ))}
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-gray-200' : 'text-black'}`}>{technologiesTitle}</h2>
        <TecsGrid techList={techIcons} />
      </div>
    </section>
  );
}