import { useEffect, useState } from "react";
import { SelectChangeEvent } from "@mui/material";

const getInitialLanguage = () => {
  const savedLanguage = localStorage.getItem('language');
  return typeof savedLanguage === 'string' ? savedLanguage : 'pt-BR';
};

export const useLanguage = () => {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const changeLanguage = (event: SelectChangeEvent<string>) => {
    if (event.target) {
      const selectedLanguage = event.target.value as string;
      localStorage.setItem('language', selectedLanguage);
      setLanguage(selectedLanguage);
    }
  };

  return { language, changeLanguage };
};
