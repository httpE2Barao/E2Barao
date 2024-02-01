import { useState } from "react";
import { usePage } from "../switchers/pages";

interface ItemProps {
  item: string,
  index: number,
  theme: string,
  changePage: any
}

export const ItemNav = ( props:ItemProps ) => {
  const [ active, setAtive ] = useState(false)

  return (
    <li
      key={props.index}
      onClick={() => {
        props.changePage(props.index + 1)
        setAtive(!active)
      }}
      className={`${props.theme === 'dark' ? 'hover:bg-azul-pastel hover:text-black' : 'hover:bg-azul-claro hover:text-white'} 
      px-5 py-3 rounded-lg hover:cursor-pointer`}
    >
      {props.item}
    </li>
  );
};