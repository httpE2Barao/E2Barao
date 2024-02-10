import { useTheme } from "../switchers/switchers";

interface ButtonProps {
  text: string;
  index: number;
  theme: string;
}

export const Button = (props: ButtonProps) => {

  const { theme } = useTheme();

  return (
    <button id={`scrollButton-${props.index}`} className={`btn-${props.index} ${theme==='dark' ? 'text-black bg-white' : 'text-white bg-black'} 
    icon-animation  rounded-full font-bold text-base 
    py-2 px-4 md:py-4 md:px-8 md:text-xl xl:py-7 xl:px-12 xl:text-4xl`}>
      <p className="content-animation">
        {props.text}
      </p>
    </button>
  );
};
