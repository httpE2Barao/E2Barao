"use client"
import React, { createContext, useContext } from "react";
import { SelectChangeEvent } from "@mui/material";
import { useLanguage } from "./language";
import { useColors } from "./colors";
import { usePage } from "./pages";
import { useMenu } from "./menu";

interface ThemeContextProps {
  page: string;
  selected: number | null;
  theme: string;
  active: boolean;
  mainTheme: string;
  altTheme: string;
  language: string;
  setSelected: any;
  toggleTheme: () => void;
  changePage: ( page:number ) => void;
  changeLanguage: (event: SelectChangeEvent<string>) => void;
  changeState: () => void
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useTheme = () => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return themeContext;
};

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { page, selected, changePage, setSelected } = usePage();
  const { language, changeLanguage } = useLanguage();
  const { theme, mainTheme, altTheme, toggleTheme } = useColors();
  const { active, changeState } = useMenu();

  return (
    <ThemeContext.Provider value={{ page, selected, theme, language, mainTheme, altTheme, active, setSelected, toggleTheme, changePage, changeLanguage, changeState, }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
