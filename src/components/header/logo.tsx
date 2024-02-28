"use client"
import Image from "next/image";
import { useTheme } from "../switchers/switchers";

export const Logo = () => {
  const { changePage } = useTheme();

  return (
    <>
      <Image src={"/images/icon-logo.png"} alt={"Logo 'EB'"}
        className="hover:cursor-pointer w-16 h-16 md:w-16 md:h-16 lg:w-20 lg:h-20 4k:ml-10"
        width={100}
        height={100}
        onClick={() => {
          changePage(0)
        }} />
    </>
  )
}