"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "./switchers/switchers";

export const ToTheTopButton = () => {
  const {theme} = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" 
    });
  };

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`invert-img z-50 bottom-5 right-5 ml-auto w-fit p-5 bg-azul-claro rounded-full hover:cursor-pointer overflow-hidden
      ${theme==='dark' ? 'ring-black' : 'ring-white'}
      ${isVisible ? 'visible' : 'invisible'}`}
      onClick={scrollToTop}
      style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.5s ease-in-out", position: "fixed" }}
    >
      <Image
        src={'/images/icon-down-arrow.png'}
        alt="ir para o topo"
        width={100}
        height={50}
        style={{ transform: 'scaleX(-1)' }}
        className="seta-animation pt-5 w-10 max-w-20"
      />
    </div>
  );
};
