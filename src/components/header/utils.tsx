import Image from "next/image";
import SelectDemo from "./language";

interface UtilsProps {
  theme: string,
  toggleTheme: any,
}

export const Utils = ( props:UtilsProps ) => {

  return (
    <span className="flex gap-8 items-center max-md:pr-20">
      <Image src={props.theme === 'light' ? '/images/icon-lua.svg' : '/images/icon-sol.svg'} alt="Change Theme" 
      width={30} height={30} className="max-sm:w-8 max-sm:h-8" onClick={props.toggleTheme}/>
      <SelectDemo />
    </span>
  )
}