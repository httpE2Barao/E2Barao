"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import { SelectChangeEvent } from "@mui/material";
import { useLanguage } from "./language";
import { useColors } from "./colors";
import { usePage } from "./pages";

interface ThemeContextProps {
  page: string;
  theme: string;
  mainTheme: string;
  altTheme: string;
  language: string;
  toggleTheme: () => void;
  changePage: ( page:string ) => void;
  changeLanguage: (event: SelectChangeEvent<string>) => void;
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
  const { page, changePage } = usePage();
  const { language, changeLanguage } = useLanguage();
  const { theme, mainTheme, altTheme, toggleTheme } = useColors();

  return (
    <ThemeContext.Provider value={{ page, theme, language, mainTheme, altTheme, toggleTheme, changePage, changeLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
