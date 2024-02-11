"use client"
import Image from "next/image";
import { useTheme } from "../switchers/switchers";

export const Logo = () => {
  const { changePage, setSelected } = useTheme();

  return (
    <>
      <Image src={"/images/icon-logo.svg"} alt={"Logo 'EB'"}
        className="hover:cursor-pointer lg:ml-10 max-sm:w-14 max-sm:h-10"
        width={100}
        height={100}
        onClick={() => {
          changePage(0)
          setSelected(null)
        }} />
    </>
  )
}