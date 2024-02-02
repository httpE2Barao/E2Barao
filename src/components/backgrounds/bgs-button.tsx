import { useTheme } from "../switchers/switchers";

interface ButtonProps {
  text: string;
  index: number;
  theme: string;
}

export const Button = (props: ButtonProps) => {

  const { theme } = useTheme();

  return (
    <button id={`scrollButton-${props.index}`} className={`btn-${props.index} ${theme==='dark' ? 'text-black bg-white' : 'text-white bg-black'} icon-animation py-5 px-14 rounded-full font-bold`}>
      <p className="content-animation">
        {props.text}
      </p>
    </button>
  );
};
