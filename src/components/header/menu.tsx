"use client"
import Image from "next/image";
import { OptionsNav } from "./options"
import { useTheme } from "../switchers/switchers";

export const MenuNav = () => {

  const { isMenuActive, changeMenuState } = useTheme();

  return (
    <nav className={`bg-[#8FFFFF] absolute top-7 right-3 z-40 p-4 w-fit rounded-2xl shadow-2xl hover:cursor-pointer md:hidden`}
      onClick={changeMenuState}>
      <Image src={'/images/icon-menu.svg'} alt="Abrir / Fechar menu" width={20} height={20}
        className={`${isMenuActive && 'hidden'} ml-auto`} onClick={changeMenuState} />
      <OptionsNav menuStyle={true} />
    </nav>
  )
}