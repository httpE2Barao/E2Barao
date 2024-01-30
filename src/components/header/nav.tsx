import { ItemNav } from "./item";
import { Utils } from "./utils";
import { useTheme } from "../switchers/switchers";

export const Nav = () => {
  const pt = ['Tragetória', 'Projetos', 'Tecnologias'];
  const en = ['Backgrounds', 'Projects', 'Hard-skills'];
  const { theme, toggleTheme, altTheme, language, changePage } = useTheme();

 return (
    <nav className={`text-${altTheme} flex flex-row xl:gap-20 items-center md:text-xl xl:text-2xl font-medium`}>
      {language === 'pt-BR'
        ? pt.map((item, index) => (
            <ItemNav key={index} item={item} index={index} theme={theme} changePage={changePage} />
          ))
        : en.map((item, index) => (
            <ItemNav key={index} item={item} index={index} theme={theme} changePage={changePage} />
          ))}
      <Utils theme={theme} toggleTheme={toggleTheme} />
    </nav>
  );
};