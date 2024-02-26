import Image from "next/image";
import { tecsList } from "./tecsList";
import { useTheme } from "../switchers/switchers";
import { useEffect, useState } from "react"; // Import useState

interface ITecItem {
  concepts?: string[];
  programs?: string[];
  tecsSrc?: string[];
}

interface iTecsGridProps {
  subList: string[];
  type?: number;
}

const TecsGrid = ({ subList, type }: iTecsGridProps) => {
  const { theme } = useTheme();
  return (
    <ul className={`${type == 1 ? '' : '4k:py-10'} grid my-auto gap-5 items-center justify-center`}
      style={{ gridTemplateColumns: `${type == 1 ? 'repeat( ,minmax(20px, 5em))' : 'repeat(auto-fill, minmax(20px, 5em))'}` }}>
      {subList.map((subItem: string, j: number) => (
        <li key={j} className={`${type == 1 && 'grid-cols-1 '}`}>
          <Image src={`/images/${subItem}`} alt={subItem} width={500} height={500} className={`${theme === 'light' && 'invert-color'}
          rounded-lg w-20`} />
        </li>
      ))}
    </ul>
  );
};

const TecsList = ({ subList }: { subList: string[] }) => (
  <ul className="grid grid-cols-2 gap-3">
    {subList.map((subItem: string, j: number) => (
      <li key={j} className="">
        {subItem}
      </li>
    ))}
  </ul>
);

export const TecsContainer = ({ type }: { type?: number }) => (
  <section className={`${type == 1 ? 'col-span-3 grid-rows-1' : 'grid grid-cols-2 gap-4'}
  px-2 
  `}>
    {tecsList.map((item: ITecItem, index: number) => {

      if (type && !item.tecsSrc) {
        return null;
      }

      return (
        <div key={index} className={`${type != 1 && 'slideTopSlower bg-azul-claro'} ${item.tecsSrc && 'col-span-2'}
        p-5 rounded-lg hover:cursor-default `} >
          {item.tecsSrc ? (
            <TecsGrid subList={item.tecsSrc} type={type} />
          ) : (
            <>
              <h1 className="text-xl pb-4 uppercase font-bold tracking-wider">{item.concepts ? 'Concepts' : 'Programs'}</h1>
              <TecsList subList={item.concepts || item.programs || []} />
            </>
          )}
        </div>
      );
    })}
  </section>
);
