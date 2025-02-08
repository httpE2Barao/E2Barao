import React, { useEffect, useRef } from 'react';
import Image from "next/image";
import VanillaTilt from "vanilla-tilt";
import { useTheme } from '../switchers/switchers';
import TecsContainer from '../tecnologies/tecs-container';

interface BoxProps {
  name: string | string[];
  alt: string;
  index?: number;
  bgNone?: boolean;
  last?: boolean;
}

export default function BoxSmall(props: BoxProps) {
  const { changePage } = useTheme();
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boxRef.current && props.last) {
    } else if (boxRef.current) {
      VanillaTilt.init(boxRef.current);
    }
  }, [props.last]);

  return (
    <div
      ref={boxRef}
      className={`bg-azul-claro slideRightSlower flex justify-center rounded-2xl items-center
        ${props.bgNone === undefined && props.last === undefined && 'max-lg:col-span-2 col-span-1 shadow-lg'}
        ${props.bgNone === true && 'm-auto hidden bg-transparent p-0 lg:block row-start-3'}
        ${props.last === true
          ? 'bg-transparent flex row-start-4 col-span-4 lg:row-start-3 lg:col-span-3 2xl:col-span-2'
          : 'p-5 max-md:col-span-2'}
      `}
    >
      {props.last === true ? (
        <TecsContainer type={1} />
      ) : (
        <Image
          src={`/images/img-${props.name}.png`}
          className='min-w-[110px] m-auto'
          alt={props.alt}
          width={500}
          height={500}
          onClick={() => props.bgNone && changePage(4)}
        />
      )}
    </div>
  );
  
}
