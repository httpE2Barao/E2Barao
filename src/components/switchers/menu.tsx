import { useEffect, useState } from "react";

export const useMenu = () => {
  const [isMenuActive, setMenuActive] = useState(false);
  const [isClient, setIsClient] = useState(false); 

  const changeMenuState = () => {
    setMenuActive(!isMenuActive);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const savedState = localStorage.getItem("state");
      if (savedState !== null) {
        setMenuActive(JSON.parse(savedState));
      }
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("state", JSON.stringify(isMenuActive));
    }
  }, [isMenuActive, isClient]);

  useEffect(() => {
    if (isClient) {
      const currentPath = window.location.pathname;
      console.log(currentPath);
      if (currentPath === "/") {
        setMenuActive(true);
      } else {
        setMenuActive(false);
      }
    }
  }, [isClient]);

  return { isMenuActive, changeMenuState };
};
