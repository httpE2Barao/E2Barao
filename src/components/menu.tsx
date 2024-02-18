"use client"
import Image from "next/image";
import { OptionsNav } from "./header/options"
import { useTheme } from "./switchers/switchers";

export const MenuNav = () => {

  const { theme, active, changeState } = useTheme();

  return (
    <nav className={`${active ? (theme === 'dark' ? 'bg-white' : 'bg-black') : (theme === 'dark' && 'bg-white')}    
   absolute top-5 right-3 z-40 p-4 w-fit rounded-2xl shadow-2xl
  hover:cursor-pointer md:hidden
    `}
      onClick={changeState}>
      <Image src={'/images/icon-menu.svg'} alt="Abrir / Fechar menu" width={30} height={30}
        className={`${active && 'hidden'} ml-auto`} onClick={changeState} />
      <OptionsNav menuStyle={true} />
    </nav>
  )
}