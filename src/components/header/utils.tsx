import Image from "next/image";
import LanguageSelector from "./language";

interface UtilsProps {
  theme: string,
  toggleTheme: any,
}

export const Utils = ( props:UtilsProps ) => {
  return (
    <span className="flex max-sm:gap-5 gap-8 items-center max-md:pr-10">
      <button
        onClick={props.toggleTheme}
        aria-label={props.theme === 'light' ? 'Mudar para tema escuro' : 'Mudar para tema claro'}
        className="p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-azul-claro"
      >
        <Image 
          src={props.theme === 'light' ? '/images/icon-lua.svg' : '/images/icon-sol.svg'} 
          alt="Ícone de Sol ou Lua para troca de tema" 
          width={30} 
          height={30} 
          className="max-sm:w-8 max-sm:h-8"
        />
      </button>
      <LanguageSelector />
    </span>
  )
}