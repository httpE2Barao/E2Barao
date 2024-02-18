import { useEffect, useState } from "react";


export const useMenu = () => {
  const [active, setActive] = useState(false);

  const changeState = () => {
    setActive(!active);
    console.log(`Menu aberto?: ${active}`)
  };

  useEffect(() => {
    localStorage.setItem('state', JSON.stringify(active));
  }, [active]);

  return { active, changeState };
};
