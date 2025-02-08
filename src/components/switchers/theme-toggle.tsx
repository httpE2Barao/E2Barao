import { useTheme } from "./switchers";
import Image from "next/image";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      <Image 
        src={theme === 'light' ? '/images/icon-lua.svg' : '/images/icon-sol.svg'} 
        alt="Toggle theme"
        width={30} 
        height={30} 
        className="max-sm:w-8 max-sm:h-8"
      />
    </button>
  );
}; 