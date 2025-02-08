import { SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";

const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) return savedLanguage;
    
    const browserLang = navigator.language;
    return browserLang.includes('pt') ? 'pt-BR' : 'en-US';
  }
  return 'pt-BR';
};

export const useLanguage = () => {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage) setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  return { language, changeLanguage };
};
