import React, { useEffect, useRef } from 'react';
import Image from "next/image";
import VanillaTilt from "vanilla-tilt";
import { TecsContainer } from '../tecnologies/tecsContainer';

interface BoxProps {
  name: string | string[];
  alt: string;
  index?: number;
  bgNone?: boolean;
  last?: boolean;
}

export default function BoxSmall(props: BoxProps) {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boxRef.current) {
      VanillaTilt.init(boxRef.current);
    }
  }, []);

  return (
    <>
      <div ref={boxRef}
        className={`
          ${props.bgNone === true && 'hidden bg-transparent p-0 md:block'}
          ${props.last === true ? 'col-span-4 max-lg:row-start-4' : '2xl:col-start-4 max-md:col-span-2'}
          bg-azul-claro slideRightSlower justify-center p-5 rounded-2xl 
          `}
      >
        {props.last !== true ? (
          <Image
            src={`/images/img-${props.name}.png`}
            className='min-w-[110px]'
            alt={props.alt}
            width={400}
            height={500}
          />
        ) : (
          <TecsContainer type={1}/>
        )}
      </div>
    </>
  );
}
