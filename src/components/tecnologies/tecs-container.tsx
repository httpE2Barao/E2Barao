import React from "react";
import { tecsList } from "./tecs-list";
import { TecsGrid } from "./tecs-grid";
import { useTheme } from "../switchers/switchers";

const TecsList = ({ subList }: { subList: string[] }) => (
  <ul className="grid grid-cols-2 gap-3">
    {subList.map((subItem: string, j: number) => (
      <li key={j}>
        {subItem}
      </li>
    ))}
  </ul>
);

export const TecsContainer = ({ type }: { type?: number }) => {
  const { language } = useTheme();
  const languageIndex = language === 'pt-BR' ? 0 : 1;

  return (
    <section className={`${type == 1 ? 'col-span-3 grid-rows-1' : 'grid-cols-2 gap-4'}
      grid px-2 items-center`}>
      {tecsList.map((item, index) => {
        if (type && !('tecsSrc' in item)) {
          return null;
        }

        return (
          <div key={index} className={`${type != 1 && !('tecsSrc' in item) && 'slideTopSlower bg-azul-claro'} ${'tecsSrc' in item && 'col-span-2'}
            p-5 rounded-lg hover:cursor-default`} >
            {('tecsSrc' in item && item.tecsSrc) ? (
              <TecsGrid subList={item.tecsSrc} type={type} />
            ) : (
              <>
                <h1 className="text-xl pb-4 uppercase font-bold tracking-wider">{item.concepts ? 'Concepts' : 'Programs'}</h1>
                <TecsList subList={item.concepts ? item.concepts.map(concept => concept[languageIndex]) : item.programs || []} />
              </>
            )}
          </div>
        );
      })}
    </section>
  );
};
