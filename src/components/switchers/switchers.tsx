"use client"
import React, { createContext, useContext } from "react";
import { SelectChangeEvent } from "@mui/material";
import { useLanguage } from "./language";
import { useColors } from "./colors";
import { usePage } from "./pages";
import { useMenu } from "./menu";

interface ThemeContextProps {
  language: string;
  changeLanguage: (event: SelectChangeEvent<string>) => void;

  theme: string;
  mainTheme: string;
  altTheme: string;
  toggleTheme: () => void;

  page: string;
  pageSelected: number | null;
  changePage: ( page:number ) => void;
  
  isMenuActive: boolean;
  changeMenuState: () => void
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
  const { theme, mainTheme, altTheme, toggleTheme } = useColors();
  const { page, pageSelected, changePage } = usePage();
  const { language, changeLanguage } = useLanguage();
  const { isMenuActive, changeMenuState } = useMenu();

  return (
    <ThemeContext.Provider value={{ page, pageSelected, language, theme, mainTheme, altTheme, isMenuActive, toggleTheme, changePage, changeLanguage, changeMenuState, }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
