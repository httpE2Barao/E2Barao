interface ItemProps {
  item: string,
  index: number,
  menuStyle?: boolean,
  theme: string,
  pageSelected: any,
  changePage: any
}

export const ItemNav = (props: ItemProps) => {
  return (
    <li
      key={props.index}
      onClick={() => {
        props.changePage(props.index + 1)
      }}
      className={`hover:text-black icon-animation-nav p-3 rounded-lg hover:cursor-pointer
      ${props.menuStyle && 'p-5'}
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