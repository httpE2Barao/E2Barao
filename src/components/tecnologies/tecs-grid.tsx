import Image from "next/image";
import { useTheme } from "../switchers/switchers";

interface iTecsGridProps {
  subList: string[];
  type?: number;
}

export const TecsGrid = ({ subList, type }: iTecsGridProps) => {
  const { theme } = useTheme();

  return (
    <ul className={`${type == 1 ? '' : '4k:py-10'} flex flex-wrap my-auto gap-5 items-center justify-center`}
      style={{ gridTemplateColumns: `${type == 1 ? 'repeat( ,minmax(20px, 5em))' : 'repeat(auto-fill, minmax(20px, 5em))'}` }}>
      {subList.map((subItem: string, j: number) => (
        <li key={j} className={`${type == 1 && 'grid-cols-1 '}`}>
          <Image
            src={`/images/${subItem}`}
            alt={subItem}
            width={500}
            height={500}
            className={`
            ${theme === 'light' && 'invert-color'}
            ${type == 1 && 'opacity-30 hover:opacity-100'}
              rounded-lg w-20 
              `}
          />
        </li>
      ))}
    </ul>
  );
};