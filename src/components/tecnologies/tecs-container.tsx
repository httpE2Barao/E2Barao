import React from "react";
import { tecsList } from "@/data/tecs-list";
import { TecsGrid } from "./tecs-grid";
import { useTheme } from "../switchers/switchers";
import { motion } from "framer-motion";
import Image from "next/image";

const TecsList = ({ subList }: { subList: string[] }) => (
  <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
    {subList.map((tech, index) => (
      <motion.li
        key={index}
        className="card flex items-center gap-2 p-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
      >
        <Image
          src={`/images/${tech}`}
          alt={tech}
          width={40}
          height={40}
          className="rounded-lg"
        />
        <span className="text-sm font-medium">{tech}</span>
      </motion.li>
    ))}
  </ul>
);

const TecsContainer = ({ type }: { type?: number }) => {
  const { language, theme } = useTheme();
  const languageIndex = language === 'pt-BR' ? 0 : 1;

  return (
    <section className={`${type == 1 ? 'col-span-3 grid-rows-1' : 'grid-cols-2 gap-4'}
      grid px-2 items-center`}>
      {tecsList.map((item, index) => {
        if (type && !('tecsSrc' in item)) {
          return null;
        }

        return (
          <div key={index} className={`
            ${type != 1 && !('tecsSrc' in item) && 'slideTopSlower bg-azul-claro/80 max-md:col-span-2'} 
            ${'tecsSrc' in item && 'col-span-2'}
            p-5 rounded-lg hover:cursor-default
          `}>
            {('tecsSrc' in item && item.tecsSrc) ? (
              <TecsGrid subList={item.tecsSrc} type={type}/>
            ) : (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold tracking-wide">
                  {item.concepts ? 'Concepts' : 'Programs'}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {(item.concepts ? item.concepts : item.programs)?.map((tech, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-white/20 hover:bg-white/50 transition-colors">
                      <span className="text-sm">
                        {Array.isArray(tech) ? tech[languageIndex] : tech}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
};

export default TecsContainer;
