"use client"
import { AnimatePresence, motion } from "framer-motion";
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
    setIsVisible(currentScrollY > 300);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className={`
            fixed z-50 bottom-8 right-8
            p-6 rounded-full shadow-xl
            backdrop-blur-sm
            transition-colors duration-300
            ${theme === 'dark' 
              ? 'bg-white/50 hover:bg-white/80' 
              : 'bg-gray-800/20 hover:bg-gray-800/30'
            }
          `}
          aria-label="Voltar ao topo"
        >
          <div className="relative w-8 h-8">
            <Image
              src="/images/icon-down-arrow.png"
              alt="Voltar ao topo"
              fill
              className={`
                transform rotate-180 transition-transform duration-300
                ${theme === 'dark' ? 'brightness-200' : 'brightness-200 invert'}
              `}
            />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
