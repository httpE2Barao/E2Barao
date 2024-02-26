"use client"
import { useTheme } from "../switchers/switchers"
import { ItemNav } from "./item"

interface iOptionsNav {
  menuStyle?: boolean,
}

export const OptionsNav = ( props:iOptionsNav ) => {
  const pt = ['Projetos', 'Experiências', 'Tecnologias'];
  const en = ['Projects', 'Experiences', 'Hard-skills'];
  const { theme, language, active, changePage } = useTheme()

  return (
    <div className={`${ props.menuStyle ? 'nav-menu flex-col gap-10 m-7 ' : 'md:flex hidden' } ${ active ? 'flex' : 'hidden'}
    font-semibold gap-5 lg:text-xl xl:gap-10
    `}>
      {language === 'pt-BR'
        ? pt.map((item, index) => (
          <ItemNav key={index} item={item} index={index} theme={theme} menuStyle={props.menuStyle} changePage={changePage} />
        ))
        : en.map((item, index) => (
          <ItemNav key={index} item={item} index={index} theme={theme} menuStyle={props.menuStyle} changePage={changePage} />
        ))}
    </div>
  )
}