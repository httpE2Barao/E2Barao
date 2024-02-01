import { useState } from "react";
import { usePage } from "../switchers/pages";
import { useTheme } from "../switchers/switchers";

interface ItemProps {
  item: string,
  index: number,
  theme: string,
  changePage: any
}

export const ItemNav = (props: ItemProps) => {
  const { selected, setSelected } = useTheme()

  return (
    <li
      key={props.index}
      onClick={() => {
        props.changePage(props.index + 1)
        setSelected(props.index)
      }}
      className={` ${selected == props.index && 'bg-azul-claro text-black'}
      icon-animation-nav px-5 py-3 rounded-lg hover:cursor-pointer`}
    >
      <p className="content-animation-nav">
        {props.item}
      </p>
    </li>
  );
};