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
      className={`
        p-1 rounded-lg
        ${props.pageSelected == props.index && (props.theme === 'dark' ? 'bg-white' : 'bg-azul-claro')}
      `}
    >
      <button
        onClick={handleItemClick}
        // Desabilitado enquanto o projeto é resetado para evitar cliques duplos
        disabled={isResetting}
        className={`
          w-full text-left icon-animation-nav p-2 rounded-md hover:cursor-pointer
          ${props.menuStyle && 'p-4'}
          ${props.pageSelected == props.index
            ? (props.theme === 'dark' ? 'text-black' : '')
            : (props.theme === 'dark' ? 'text-white' : 'text-dark')
          }
          hover:text-black focus:text-black
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-azul-claro
        `}
      >
        <p className="content-animation-nav">
          {props.item}
        </p>
      </button>
    </li>
  );
};