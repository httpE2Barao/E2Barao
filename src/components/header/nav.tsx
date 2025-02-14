"use client"
import { useTheme } from "../switchers/switchers";
import { OptionsNav } from "./options";
import { Utils } from "./utils";

export const Nav = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <nav className={`relative flex flex-row items-center gap-5 max-md:pr-7 md:text-[90%] 2xl:text-2xl`}>
      <OptionsNav />
      <Utils theme={theme} toggleTheme={toggleTheme}/>
    </nav>
  );
};