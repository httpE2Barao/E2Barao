import { useState } from "react";
import { SelectChangeEvent } from "@mui/material";

// const getInitialLanguage = () => {
  // if (typeof window !== 'undefined') {
  //   const savedLanguage = localStorage.getItem('language');
  //   return typeof savedLanguage === 'string' ? savedLanguage : 'pt-BR';
  // }
  // return 'pt-BR';
  // };

  export const useLanguage = () => {
    const [language, setLanguage] = useState('pt-BR');

    const changeLanguage = (event: SelectChangeEvent<string>) => {
      if (event.target) {
        const selectedLanguage = event.target.value as string;
        setLanguage(selectedLanguage);
        localStorage.setItem('language', selectedLanguage);
      }
    };

    return { language, changeLanguage };
  };
