import { tecsList } from "./tecs-list";
import { TecsGrid } from "./tecs-grid";

interface ITecItem {
  concepts?: string[];
  programs?: string[];
  tecsSrc?: string[];
}

const TecsList = ({ subList }: { subList: string[] }) => (
  <ul className="grid grid-cols-2 gap-3">
    {subList.map((subItem: string, j: number) => (
      <li key={j}>
        {subItem}
      </li>
    ))}
  </ul>
);

export const TecsContainer = ({ type }: { type?: number }) => (
  <section className={`${type == 1 ? 'col-span-3 grid-rows-1' : 'grid-cols-2 gap-4'}
  grid px-2 items-center`}>
    {tecsList.map((item: ITecItem, index: number) => {

      if (type && !item.tecsSrc) {
        return null;
      }

      return (
        <div key={index} className={`${type != 1 && 'slideTopSlower bg-azul-claro'} ${item.tecsSrc && 'col-span-2'}
        p-5 rounded-lg hover:cursor-default`} >
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
