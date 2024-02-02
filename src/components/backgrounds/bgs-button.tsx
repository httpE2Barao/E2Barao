import { useEffect } from "react";

interface ButtonProps {
  text: string;
  index: number;
  theme: string;
}

export const Button = (props: ButtonProps) => {

  return (
    <button id={`scrollButton-${props.index}`} className={`btn-${props.index} bg-white icon-animation py-5 px-14 rounded-full font-bold`}>
      <p className="content-animation">
        {props.text}
      </p>
    </button>
  );
};
