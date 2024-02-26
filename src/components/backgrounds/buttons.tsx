import { useTheme } from "../switchers/switchers";

interface ButtonProps {
  text: string;
  index: number;
  theme: string;
  onClick: () => void;
}

export const Button: React.FC<ButtonProps> = ({ index, text, onClick }) => {

  const { theme } = useTheme();

  return (
    <button id={`scrollButton-${index}`} className={`btn-${index} ${theme==='dark' ? 'text-black bg-white' : 'text-white bg-black'} 
    icon-animation rounded-full font-bold invert-color-hover
    py-4 px-8 text-xl 2xl:px-12 4k:text-3xl`}>
      <p className="content-animation">
        {text}
      </p>
    </button>
  );
};
