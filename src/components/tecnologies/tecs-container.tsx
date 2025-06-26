"use client";
import { tecsList } from "@/data/tecs-list";
import { useTheme } from "../switchers/switchers";
import { motion } from "framer-motion";
import TecsGrid from "./tecs-grid";

const SkillPill = ({ name, index }: { name: string, index: number }) => (
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

// CORRIGIDO: O componente agora recebe 'theme' como propriedade.
export const TecsContainer = ({ theme }: { theme: 'light' | 'dark' }) => {
    const { language } = useTheme(); 
    const languageIndex = language === 'pt-BR' ? 0 : 1;

    const concepts = tecsList.find(item => 'concepts' in item)?.concepts || [];
    const programs = tecsList.find(item => 'programs' in item)?.programs || [];
    const technologies = tecsList.find(item => 'tecsSrc' in item)?.tecsSrc || [];

    return (
        <section className="my-10 space-y-16 w-full max-xl:px-10">
            <div className="flex flex-col lg:flex-row flex-wrap justify-center gap-8">
                <div className="bg-slate-50 dark:bg-gray-800/40 shadow-lg shadow-slate-300/60 dark:shadow-none border border-slate-200 dark:border-gray-700/50 rounded-2xl p-6 flex-1 min-w-[300px] lg:max-w-[48%]">
                    <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-200' : 'text-black'}`}>{language === 'pt-BR' ? 'Conceitos' : 'Concepts'}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {concepts.map((tech, idx) => (
                            <SkillPill key={idx} name={Array.isArray(tech) ? tech[languageIndex] : tech} index={idx} />
                        ))}
                    </div>
                </div>
                <div className="bg-slate-50 dark:bg-gray-800/40 shadow-lg shadow-slate-300/60 dark:shadow-none border border-slate-200 dark:border-gray-700/50 rounded-2xl p-6 flex-1 min-w-[300px] lg:max-w-[48%]">
                    <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-200' : 'text-black'}`}>{language === 'pt-BR' ? 'Programas' : 'Programs'}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {programs.map((tech, idx) => (
                            <SkillPill key={idx} name={Array.isArray(tech) ? tech[languageIndex] : tech} index={idx} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="text-center">
                <h2 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-gray-200' : 'text-black'}`}>{language === 'pt-BR' ? 'Tecnologias' : 'Technologies'}</h2>
                {/* O 'theme' é agora passado para o TecsGrid */}
                <TecsGrid subList={technologies} theme={theme} />
            </div>
        </section>
    );
};

export default TecsContainer;