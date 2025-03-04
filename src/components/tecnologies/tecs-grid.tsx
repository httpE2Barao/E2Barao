import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from '../switchers/switchers';
import { ButtonToTecs } from '../home/button-link';
import { tecsList } from "@/data/tecs-list";

interface iTecsGridProps {
  subList: string[];
  type?: number;
}

export const TecsGrid = ({ subList, type }: iTecsGridProps) => {
  const { theme, page } = useTheme();
  const [flashingDivs, setFlashingDivs] = useState<number[]>([]);
  const numberOfFlashingDivs = 7;

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const divsToFlash: number[] = [];
  //     while (divsToFlash.length < numberOfFlashingDivs) {
  //       const randomIndex = Math.floor(Math.random() * subList.length);
  //       if (!divsToFlash.includes(randomIndex)) {
  //         divsToFlash.push(randomIndex);
  //       }
  //     }
  //     setFlashingDivs(divsToFlash);
  //   }, 500);

  //   return () => clearInterval(interval);
  // }, [subList]);

  const isFlashing = (index: number) => flashingDivs.includes(index);
  const maxItems = type === 1 ? 12 : subList.length;

  return (
    <>
      {
        page === '/Tecs' && <h1 className={`text-3xl font-bold tracking-wide text-center mb-10 mt-5 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Tecnologias</h1>
      }
      <ul
        className={`${type == 1 ? '' : '4k:py-10'} flex flex-wrap my-auto gap-5 items-center justify-center`}>
        {subList.slice(0, maxItems).map((subItem: string, j: number) => (
          <li key={j}>
            <Image
              src={`/images/${subItem}`}
              alt={subItem}
              width={500}
              height={500}
              className={`rounded-lg w-20 hover:opacity-100
            ${type == 1 && `${isFlashing(j) && 'flash'} opacity-30 transition-opacity`}
            ${theme === 'light' && 'invert-color'}
          `}/>
          </li>
        ))}
      </ul>
      {type == 1 &&
        <ButtonToTecs />
      }
    </>
  );
};

