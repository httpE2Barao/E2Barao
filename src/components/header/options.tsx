"use client"
import { useTheme } from "../switchers/switchers";
import { ItemNav } from "./item";

interface iOptionsNav {
  menuStyle?: boolean,
}

export const OptionsNav = (props: iOptionsNav) => {
  const pt = ['Projetos', 'Experiências', 'Tecnologias', 'Contatos'];
  const en = ['Projects', 'Experiences', 'Hard-skills', 'Contacts'];
  const { theme, language, isMenuActive, pageSelected, changePage, handleBack } = useTheme()

  return (
    <div className={`${props.menuStyle ? 'nav-menu flex-col gap-10 m-7 ' : 'md:flex hidden'} ${isMenuActive ? 'flex' : 'hidden'}
    font-normal gap-5 lg:text-lg xl:gap-5
    `}>
      {language === 'pt-BR'
        ? pt.map((item, index) => (
          <ItemNav key={index} item={item} index={index} theme={theme} menuStyle={props.menuStyle} pageSelected={pageSelected} changePage={changePage} resetProject={handleBack}/>
        ))
        : en.map((item, index) => (
          <ItemNav key={index} item={item} index={index} theme={theme} menuStyle={props.menuStyle} pageSelected={pageSelected} changePage={changePage} resetProject={handleBack}/>
        ))}
    </div>
  )
}