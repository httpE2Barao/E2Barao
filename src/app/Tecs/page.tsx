"use client";
import { useTheme } from "@/components/switchers/switchers";
import Image from "next/image";
import { tecsList } from "@/components/tecnologies/tecs";

export default function HardSkills() {

  const { theme } = useTheme();

  return (
    <article className={``}>
      <section className={`${theme === 'dark' ? 'text-white' : 'text-black'} slideTop`}>
        <h1 className="px-4 text-3xl font-bold tracking-wide text-right">Front-End</h1>
        <Image
          src={`${theme === 'light' ? '/images/timeline-dark.svg' : '/images/timeline-main.svg'}`}
          alt='html5 css3 sass javascript typescript bootstrap react tailwind next.js jquery mysql'
          width='1000' height='750'
          className={`pt-4 pr-2`}
        />
      </section>

      <section className="px-2 grid grid-cols-2 gap-4">
        {tecsList.map((item, index) => {
          const category = Object.keys(item)[0];
          const subItems = Object.values(item)[0];

          return (
            <div key={index} className={`${category === 'frontEnd' ? 'col-span-2' : 'bg-azul-claro'} 
            p-5 rounded-lg hover:cursor-default`}>
              <h1 className="text-xl pb-4 uppercase font-bold tracking-wider">{category}</h1>

              {category === 'frontEnd' ? (
                <ul className="grid grid-cols-auto-fill gap-5 items-center" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))' }}>
                  {subItems.map((subItem: string, j: number) => (
                    <li key={j} className="p-2">
                      <Image src={`/images/${subItem}.svg`} alt={subItem} width={100} height={100} 
                      className="rounded-lg w-24"/>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="grid grid-cols-2 gap-3">
                  {subItems.map((subItem: string, j: number) => (
                    <li key={j} className="">
                      {subItem}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </section>
    </article>
  );
}
