"use client"
import { SelectChangeEvent } from "@mui/material";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextProps {
  theme: string;
  mainTheme: string;
  altTheme: string;
  toggleTheme: () => void;
  language: string;
  changeLanguage: (event: SelectChangeEvent<string>) => void;
}

// Criação do contexto
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Hook personalizado para acessar o contexto
export const useTheme = () => {
  const themeContext = useContext<ThemeContextProps | undefined>(ThemeContext);

  if (!themeContext) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return themeContext;
};

// Componente Provedor de Tema
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Lógica para obter e definir o tema inicial
  const savedTheme = localStorage.getItem('theme') ?? null;
  const initialTheme = typeof savedTheme === 'string' ? savedTheme : 'dark';
  const [theme, setTheme] = useState(initialTheme);
  const savedLanguage = localStorage.getItem('language') ?? null;
  const initialLanguage = typeof savedLanguage === 'string' ? savedLanguage : 'pt-BR';
  
  // Estados do tema e idioma
 
  const [language, setLanguage] = useState(initialLanguage);
  
  // Efeito para atualizar o localStorage e o estilo do corpo da página
  useEffect(() => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('language', language)
    const body = document.querySelector('body');
    body && (body.style.backgroundColor = theme === 'light' ? '#ffffff' : '#000000');
  }, [ theme, language ]);

  // Função para alternar entre os temas
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Lógica para determinar as cores principais e alternativas com base no tema
  const mainTheme = theme === 'light' ? 'white' : 'black';
  const altTheme = theme === 'light' ? 'black' : 'white';

  // Função para alterar o idioma
  const changeLanguage = ( event:SelectChangeEvent<string>)  => {
    if (event.target != null) {
      const language = event.target.value as string 
      localStorage.setItem('language', language);
      setLanguage( language );
    }
  };

  // Renderização do provedor de contexto com os valores do contexto
  return (
    <ThemeContext.Provider value={{ theme, mainTheme, altTheme, toggleTheme, language, changeLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
};
