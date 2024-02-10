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
    icon-animation  rounded-full font-bold text-base 
    py-2 px-4 md:py-4 md:px-8 md:text-xl xl:py-7 xl:px-12 xl:text-4xl`}>
      <p className="content-animation">
        {text}
      </p>
    </button>
  );
};
