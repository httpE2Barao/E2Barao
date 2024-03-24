import { useState } from "react";

interface ItemProps {
  item: string,
  index: number,
  menuStyle?: boolean,
  theme: string,
  pageSelected: number | null,
  changePage: any,
  resetProject: any,
}

export const ItemNav = (props: ItemProps) => {
  const [isResetting, setIsResetting] = useState(false);

  const handleItemClick = () => {
    props.changePage(props.index + 1);
    setIsResetting(true);
    setTimeout(() => {
      props.resetProject();
      setIsResetting(false);
    }, 1000); 
  };

  return (
    <li
      key={props.index}
      onClick={handleItemClick}
      className={`hover:text-black icon-animation-nav p-3 rounded-lg hover:cursor-pointer
      ${props.menuStyle && 'p-5' && console.log(props.pageSelected)}
      ${props.pageSelected == props.index && (props.theme === 'dark' ? 'bg-white text-black' : 'bg-azul-claro')}
      ${props.menuStyle
        ? (props.pageSelected != props.index && (props.theme === 'dark' && 'text-dark'))
        : (props.pageSelected != props.index && (props.theme === 'dark' ? 'text-white' : 'text-dark'))
      }`}>
      <p className="content-animation-nav">
        {props.item}
      </p>
    </li>
  );
};
