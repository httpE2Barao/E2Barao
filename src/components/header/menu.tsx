"use client"
import Image from "next/image";
import { useTheme } from "../switchers/switchers";
import { OptionsNav } from "./options";

export const MenuNav = () => {

  const { isMenuActive, changeMenuState } = useTheme();

  return (
    <nav className={`bg-[#8FFFFF] absolute top-5 right-7 z-40 p-3 w-fit rounded-2xl shadow-2xl hover:cursor-pointer md:hidden`}
      onClick={changeMenuState}>
      <Image src={'/images/icon-menu.png'} alt="Abrir / Fechar menu" width={20} height={20}
        className={`${isMenuActive && 'hidden'} ml-auto`} onClick={changeMenuState} />
      <OptionsNav menuStyle={true} />
    </nav>
  )
}