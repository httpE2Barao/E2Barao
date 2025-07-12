import React, { MouseEventHandler } from "react";

interface ButtonProps {
  text: string;
  index: number;
  theme: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isSelected?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  theme,
  index,
  text,
  onClick,
  isSelected,
}) => {
  return (
    <button
      id={`scrollButton-${index}`}
      className={`btn-${index} ${theme === "dark" ? "text-black bg-white" : "text-white bg-black"}
        icon-animation rounded-full font-bold py-4 px-8 text-xl max-w-fit 2xl:px-12 4k:text-3xl 
        ${isSelected ? "border-4 border-[#00FFFF] bg-[#e6f7ff] text-[#007f7f]" : ""} 
        hover:invert-color-hover transition-all duration-200
+       focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00FFFF]`}
      onClick={onClick ? onClick : () => {}}
    >
      <p className="content-animation">{text}</p>
    </button>
  );
};
