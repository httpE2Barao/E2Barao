"use client"
import { useTheme } from "../switchers/switchers";
import { ItemNav } from "./item";

interface iOptionsNav {
  menuStyle?: boolean,
}

// Objeto de tradução para os itens do menu
const navTranslations = {
  pt: ['Projetos', 'Experiências', 'Tecnologias', 'Contatos'],
  en: ['Projects', 'Experiences', 'Hard-skills', 'Contacts'],
  es: ['Proyectos', 'Experiencias', 'Habilidades', 'Contactos'],
  fr: ['Projets', 'Expériences', 'Compétences', 'Contacts'],
  zh: ['项目', '经验', '技能', '联系'],
};

export const OptionsNav = (props: iOptionsNav) => {
  const { theme, language, isMenuActive, pageSelected, changePage, handleBack } = useTheme();

  // Seleciona os textos corretos com base no idioma, com fallback para inglês
  const navItems = navTranslations[language as keyof typeof navTranslations] || navTranslations.en;

  return (
    <div className={`${props.menuStyle ? 'nav-menu flex-col gap-10 m-7 ' : 'md:flex hidden'} ${isMenuActive ? 'flex' : 'hidden'}
      font-normal gap-5 lg:text-lg xl:gap-5`}>
      {navItems.map((item, index) => (
        <ItemNav key={index} item={item} index={index} theme={theme} menuStyle={props.menuStyle} pageSelected={pageSelected} changePage={changePage} resetProject={handleBack}/>
      ))}
    </div>
  )
}