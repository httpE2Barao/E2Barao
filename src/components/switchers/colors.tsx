import { useEffect, useState } from "react";

export const useColors = (defaultTheme: string = "dark") => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme || defaultTheme;
    }
    return defaultTheme;
  });

  useEffect(() => {
    const body = document.querySelector('body');
    if (body) {
      body.style.backgroundColor = theme === 'light' ? '#ffffff' : '#000000';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  const mainTheme = theme === 'light' ? 'white' : 'black';
  const altTheme = theme === 'light' ? 'black' : 'white';

  return { theme, mainTheme, altTheme, toggleTheme };
};
