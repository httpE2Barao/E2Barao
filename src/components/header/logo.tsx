"use client"
import Image from "next/image";
import { useTheme } from "../switchers/switchers";

export const Logo = () => {
  const { changePage, setSelected } = useTheme();

  return (
    <>
      <Image src={"/images/icon-logo.png"} alt={"Logo 'EB'"}
        className="hover:cursor-pointer lg:ml-10 max-sm:w-14 max-sm:h-10"
        width={80}
        height={100}
        onClick={() => {
          changePage(0)
          setSelected(null)
        }} />
    </>
  )
}