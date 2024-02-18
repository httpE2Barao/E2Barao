"use client"
import Image from "next/image";
import { useTheme } from "../switchers/switchers";

export const Logo = () => {
  const { changePage, setSelected } = useTheme();

  return (
    <>
      <Image src={"/images/icon-logo.svg"} alt={"Logo 'EB'"}
        className="hover:cursor-pointer   
        w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 4k:ml-10"
        width={100}
        height={100}
        onClick={() => {
          changePage(0)
          setSelected(null)
        }} />
    </>
  )
}