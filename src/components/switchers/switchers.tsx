"use client"
import { SelectChangeEvent } from "@mui/material";
import React, { createContext, useContext, useEffect, useState, lazy, Suspense } from "react";
import { useColors } from "./colors";
import { useLanguage } from "./language";
import { useMenu } from "./menu";
import { usePage } from "./pages";
import { UseSelectedProject } from "./projects";
import { LoadingSpinner } from "../LoadingSpinner";
import Image from 'next/image';

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

// Componente separado para pré-carregamento de imagem
const PreloadImage = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const imagem = new (window.Image as any)();
    imagem.src = '/images/rain-nobg.png';
  }, []);

  if (!isMounted) return null;

  return (
    <div style={{ display: 'none' }} aria-hidden="true">
      <Image 
        src="/images/rain-nobg.png" 
        alt="preload" 
        width={1}
        height={1}
      />
    </div>
  );
};

// Implementar lazy loading para componentes pesados
const ProjectLayout = lazy(() => import('../projects/project-layout'));
const TecsContainer = lazy(() => import('../tecnologies/tecs-container'));

// Adicionar Suspense para melhor UX durante carregamento
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { isProjectOpened, currentProject, changeProject, handleBack } = UseSelectedProject();
  const { theme, mainTheme, altTheme, toggleTheme } = useColors();
  const { page, pageSelected, changePage } = usePage();
  const { language, changeLanguage } = useLanguage();
  const { isMenuActive, changeMenuState } = useMenu();

  return (
    <ThemeContext.Provider value={{ 
      page, 
      pageSelected, 
      handleBack,
      language, 
      theme, 
      mainTheme, 
      altTheme, 
      isMenuActive, 
      isProjectOpened, 
      currentProject, 
      changeProject, 
      toggleTheme, 
      changePage, 
      changeLanguage, 
      changeMenuState 
    }}>
      <Suspense fallback={<LoadingSpinner />}>
        <PreloadImage />
        {children}
      </Suspense>
    </ThemeContext.Provider>
  );
}
