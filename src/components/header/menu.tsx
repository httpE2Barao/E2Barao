"use client"
import Image from "next/image";
import { OptionsNav } from "./options"
import { useTheme } from "../switchers/switchers";

export const MenuNav = () => {

  const { theme, active, changeState } = useTheme();

  return (
    <nav className={`${active ? 'bg-white' : (theme === 'dark' && 'bg-white')}    
   absolute top-7 right-3 z-40 p-4 w-fit rounded-2xl shadow-2xl
  hover:cursor-pointer md:hidden
    `}
      onClick={changeState}>
      <Image src={'/images/icon-menu.svg'} alt="Abrir / Fechar menu" width={20} height={20}
        className={`${active && 'hidden'} ml-auto`} onClick={changeState} />
      <OptionsNav menuStyle={true} />
    </nav>
  )
}