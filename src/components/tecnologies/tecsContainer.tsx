import Image from "next/image";
import { tecsList } from "./tecsList";

interface ITecItem {
  concepts?: string[];
  programs?: string[];
  tecsSrc?: string[];
}

interface iTecsGridProps {
  subList: string[];
  type?: number;
}

const TecsGrid = ({ subList, type }: iTecsGridProps) => (

  <ul className={`grid ${type == 1 ? '' : ''} grid-cols-auto-fill gap-5 items-center`} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))' }}>
    {subList.map((subItem: string, j: number) => (
      <li key={j} className={`${type==1 && 'grid-cols-1'}`}>
        <Image src={`/images/${subItem}`} alt={subItem} width={100} height={100} className="hover:cursor-pointer invert-color-hover rounded-lg w-24" />
      </li>
    ))}
  </ul>
);

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
  <section className={`${type==1 ? 'col-span-3': 'grid grid-cols-2 gap-4'}
  px-2 
  `}>
    {tecsList.map((item: ITecItem, index: number) => {
      
      if (type && !item.tecsSrc) {
        return null;
      }

      return (
        <div key={index} className={`${type != 1 && 'slideTopSlower'} ${item.tecsSrc && 'col-span-2'}
        bg-azul-claro p-5 rounded-lg hover:cursor-default `} >
          {item.tecsSrc ? (
            <TecsGrid subList={item.tecsSrc} />
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
