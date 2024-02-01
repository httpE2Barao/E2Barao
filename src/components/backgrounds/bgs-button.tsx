
interface ButtonProps {
  text: string,
  theme: string
}

export const Button = (props: ButtonProps) => {
  return (
    <button className={`${props.theme === 'dark' ? `bg-white text-black` : `bg-black text-white`}
      icon-animation py-5 px-14 rounded-full font-bold
    `}>
      <p className="content-animation">
        {props.text}
      </p>
    </button>
  )
}