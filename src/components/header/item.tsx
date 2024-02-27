import { useTheme } from "../switchers/switchers";

interface ItemProps {
  item: string,
  index: number,
  menuStyle?: boolean,
  theme: string,
  changePage: any
}

export const ItemNav = (props: ItemProps) => {
  const { theme, selected, setSelected } = useTheme()

  return (
    <li
      key={props.index}
      onClick={() => {
        props.changePage(props.index + 1)
        setSelected(props.index)
      }}
      className={`
      ${props.menuStyle && 'p-5'}
      ${selected == props.index && 'bg-azul-claro text-black'}
      ${props.menuStyle 
        ? (selected != props.index && (theme==='dark' && 'text-dark'))
        : (selected != props.index && (theme==='dark' ? 'text-white' : 'text-dark'))
      }
      hover:text-black icon-animation-nav p-3 rounded-lg hover:cursor-pointer`}>
      <p className="content-animation-nav">
        {props.item}
      </p>
    </li>
  );
};