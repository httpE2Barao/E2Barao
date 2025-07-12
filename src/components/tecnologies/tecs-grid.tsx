"use client";
import React from 'react';
import Image from 'next/image';
import { useTheme } from '../switchers/switchers';
import { motion } from 'framer-motion';

// Interface para um único ícone de tecnologia
interface TechIcon {
  src: string;
  name: { [key: string]: string };
}

// Props do componente
interface TecsGridProps {
  techList: TechIcon[];
}

const TecsGrid = ({ techList }: TecsGridProps) => {
  const { theme, language } = useTheme();

  return (
    <ul className="flex flex-wrap my-auto gap-4 md:gap-6 items-center justify-center">
      {/* Adicionamos o tipo explícito 'TechIcon' para a variável 'tech' */}
      {techList.map((tech: TechIcon, index: number) => {
        const lang = language as keyof typeof tech.name;
        const translatedName = tech.name[lang] || tech.name.en; // Fallback para inglês
        
        return (
          <motion.li
            key={`${tech.src}-${index}`}
            title={translatedName} 
            className={`bg-slate-200 dark:bg-slate-700/60 rounded-full h-20 w-20 md:h-24 md:w-24 flex items-center justify-center p-4 transition-all hover:scale-110 hover:shadow-lg cursor-pointer ${theme === 'light' ? 'hover:shadow-[#0000]/60' : 'hover:shadow-[#8FFFFF]/60'}`}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 120 }}
            viewport={{ once: true }}
          >
            <Image
              src={`/images/${tech.src}`}
              alt={translatedName} 
              width={55}
              height={55}
              className={`object-contain transition-all duration-300 ${theme === 'light' ? 'invert' : ''}`}
            />
          </motion.li>
        );
      })}
    </ul>
  );
};

export default TecsGrid;