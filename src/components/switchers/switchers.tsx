"use client"
import React, { MouseEventHandler, createContext, useContext } from "react";
import { SelectChangeEvent } from "@mui/material";
import { useLanguage } from "./language";
import { useColors } from "./colors";
import { usePage } from "./pages";
import { useMenu } from "./menu";
import { UseSelectedProject } from "./projects";

interface ThemeContextProps {
  language: string;
  changeLanguage: (event: SelectChangeEvent<string>) => void;
  theme: string;
  mainTheme: string;
  altTheme: string;
  toggleTheme: () => void;
  page: string;
  pageSelected: number | null;
  changePage: (page: number) => void;
  isMenuActive: boolean;
  changeMenuState: () => void
  isProjectOpened: boolean
  currentProject: string
  changeProject: (props: any) => void
  handleBack: any
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
  const { isProjectOpened, currentProject, changeProject, handleBack } = UseSelectedProject();

  return (
    <ThemeContext.Provider value={{ page, pageSelected, handleBack, language, theme, mainTheme, altTheme, isMenuActive, isProjectOpened, currentProject, changeProject, toggleTheme, changePage, changeLanguage, changeMenuState }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
