"use client"
import { ItemNav } from "./item";
import { Utils } from "./utils";
import { useTheme } from "../switchers/switchers";

export const Nav = () => {
  const pt = ['Tragetória', 'Projetos', 'Tecnologias'];
  const en = ['Backgrounds', 'Projects', 'Hard-skills'];
  const { theme, toggleTheme, altTheme, language, changePage } = useTheme();

  return (
    <nav className={`text-${altTheme} flex flex-row items-center font-medium gap-5
    2xl:text-2xl lg:mx-10 2xl:mx-20 md:text-[90%]`}>
      <div className="hidden md:flex gap-5 lg:text-xl xl:gap-10 ">
        {language === 'pt-BR'
          ? pt.map((item, index) => (
            <ItemNav key={index} item={item} index={index} theme={theme} changePage={changePage} />
          ))
          : en.map((item, index) => (
            <ItemNav key={index} item={item} index={index} theme={theme} changePage={changePage} />
          ))}
      </div>
      <Utils theme={theme} toggleTheme={toggleTheme} />
    </nav>
  );
};