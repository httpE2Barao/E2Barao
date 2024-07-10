"use client"
import Image from "next/image";
import { useTheme } from "../switchers/switchers";

export const Logo = () => {
  const { theme, changePage } = useTheme();

  return (
    <>
      <Image src={`/images/icon-logo${theme==='dark'?'-dark':''}.png`} alt={"Logo 'EB'"}
        className="hover:cursor-pointer w-16 h-16 md:w-16 md:h-16 lg:w-24 lg:h-24 4k:ml-10"
        width={100}
        height={100}
        onClick={() => {
          changePage(0)
        }} />
    </>
  )
}