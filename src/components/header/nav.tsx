"use client"
import { Utils } from "./utils";
import { useTheme } from "../switchers/switchers";
import { OptionsNav } from "./options";

export const Nav = () => {
  const { theme, toggleTheme, altTheme } = useTheme();

  return (
    <nav className={`text-${altTheme} relative flex flex-row items-center font-medium gap-5
    md:text-[90%] 2xl:text-2xl lg:mx-10 2xl:mx-20 z-40
    `}>
      
      <OptionsNav />
      
      <Utils theme={theme} toggleTheme={toggleTheme}/>
    </nav>
  );
};