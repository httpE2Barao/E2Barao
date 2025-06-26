"use client";
import React from 'react';
import Image from 'next/image';
import { useTheme } from '../switchers/switchers';
import { motion } from 'framer-motion';

interface TecsGridProps {
  subList: string[];
  theme: 'light' | 'dark';
}

const TecsGrid = ({ subList, theme }: TecsGridProps) => {
  return (
    <ul className="flex flex-wrap my-auto gap-4 md:gap-6 items-center justify-center">
      {subList.map((imageName: string, index: number) => (
        <motion.li
          // CORRIGIDO: A chave agora usa o nome e o índice para garantir que seja única.
          key={`${imageName}-${index}`}
          title={imageName.split('.')[0]}
          className={`bg-slate-200 dark:bg-slate-700/60 rounded-full h-20 w-20 md:h-24 md:w-24 flex items-center justify-center p-4 transition-all hover:scale-110 hover:shadow-lg cursor-pointer ${theme === 'light' ? 'hover:shadow-[#0000]/60' : 'hover:shadow-[#8FFFFF]/60'}`} initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, type: "spring", stiffness: 120 }}
          viewport={{ once: true }}
        >
          <Image
            src={`/images/${imageName}`}
            alt={imageName}
            width={55}
            height={55}
            className={`object-contain transition-all duration-300 ${theme === 'light' ? 'invert' : ''}`}
          />
        </motion.li>
      ))}
    </ul>
  );
};

export default TecsGrid;
