import React, { MouseEventHandler } from 'react';

interface ButtonProps {
  text: string;
  index: number;
  theme: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const Button: React.FC<ButtonProps> = ({ theme, index, text, onClick }) => {
  return (
    <button
      id={`scrollButton-${index}`}
      className={`btn-${index} ${theme === 'dark' ? 'text-black bg-white' : 'text-white bg-black'} 
      icon-animation rounded-full font-bold invert-color-hover py-4 px-8 text-xl max-w-fit 2xl:px-12 4k:text-3xl`}
      onClick={onClick ? onClick : () => {} }>
      <p className="content-animation">
        {text}
      </p>
    </button>
  );
};
