import { useEffect, useState } from "react";

// const getInitialTheme = () => {
//   if (typeof window !== 'undefined') {
//     const savedTheme = localStorage.getItem('theme');
//     return typeof savedTheme === 'string' ? savedTheme : 'dark';
//   }
//   return 'dark'
// };

export const useColors = () => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const body = document.querySelector('body');
    if (body) {
      body.style.backgroundColor = theme === 'light' ? '#ccfbf1' : '#000000';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    localStorage.setItem('theme', theme);
    console.log(localStorage.getItem('theme'))
  };

  const mainTheme = theme === 'light' ? 'white' : 'black';
  const altTheme = theme === 'light' ? 'black' : 'white';

  return { theme, mainTheme, altTheme, toggleTheme };
};
