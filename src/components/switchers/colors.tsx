import { useEffect, useState } from "react";

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  return typeof savedTheme === 'string' ? savedTheme : 'dark';
};

export const useColors = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem('theme', theme);

    const body = document.querySelector('body');
    if (body) {
      body.style.backgroundColor = theme === 'light' ? '#ffffff' : '#000000';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const mainTheme = theme === 'light' ? 'white' : 'black';
  const altTheme = theme === 'light' ? 'black' : 'white';

  return { theme, mainTheme, altTheme, toggleTheme };
};
