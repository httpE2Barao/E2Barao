import Link from "next/link";
import { useState } from "react";

interface ItemProps {
  item: string,
  index: number,
  theme: string,
  togglePage: any
}

export const ItemNav = ( props:ItemProps ) => {
  const [ active, setAtive ] = useState(false)
  return (
    <li
      key={props.index}
      onClick={() => {
        props.togglePage(props.index)
        setAtive(!active)
      }}
      className={`${props.theme === 'dark' ? 'hover:bg-azul-pastel hover:text-black' : 'hover:bg-azul-claro hover:text-white'} 
      px-5 py-3 rounded-lg hover:cursor-pointer`}
    >
      {props.item}
    </li>
  );
};