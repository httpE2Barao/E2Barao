import { useColors } from "../switchers/colors";
import { useTheme } from "../switchers/switchers";
import SelectDemo from "./language";

interface UtilsProps {
  theme: string,
  toggleTheme: any,
}

export const Utils = ( props:UtilsProps ) => {

  return (
    <span className="flex gap-8">
      <img src={props.theme === 'light' ? '/images/icon-lua.svg' : '/images/icon-sol.svg'} alt="Change Theme"
        className="w-9" onClick={props.toggleTheme}
      />
      <SelectDemo />
    </span>
  )
}