import { useTheme } from "../switchers/switchers";

export const Logo = () => {
  const { changePage } = useTheme();

  return (
    <img src="/images/icon-logo.png" 
    className="w-20 h-16 hover:cursor-pointer xl:ml-20" 
    alt="Logo Elias Barão" 
    onClick={() => changePage('home')  }
    />
  )
}