import { useEffect, useState } from "react";

export const useMenu = () => {
  const [isMenuActive, setMenuActive] = useState(false);

  const changeMenuState = () => {
    setMenuActive(!isMenuActive);
    console.log(`Menu aberto?: ${isMenuActive}`)
  };

  useEffect(() => {
    localStorage.setItem('state', JSON.stringify(isMenuActive));
  }, [isMenuActive]);

  return { isMenuActive, changeMenuState };
};
