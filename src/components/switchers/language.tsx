import { SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";

const SUPPORTED_LANGS = ['pt', 'en', 'es', 'fr', 'zh'];

const getInitialLanguage = (): string => {
  if (typeof window === 'undefined') {
    return 'pt'; // Retorna um padrão para o lado do servidor
  }

  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage && SUPPORTED_LANGS.includes(savedLanguage)) {
    return savedLanguage;
  }
  
  // Pega apenas as duas primeiras letras do idioma do navegador (ex: "pt-BR" -> "pt")
  const browserLang = navigator.language.substring(0, 2);
  if (SUPPORTED_LANGS.includes(browserLang)) {
    return browserLang;
  }

  // Se o idioma do navegador não for suportado, o padrão é português
  return 'pt';
};

export const useLanguage = () => {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    // Sincroniza o estado com o localStorage quando o componente é montado no cliente
    const initialLang = getInitialLanguage();
    if (language !== initialLang) {
      setLanguage(initialLang);
    }
  }, []);

  const changeLanguage = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  return { language, changeLanguage };
};