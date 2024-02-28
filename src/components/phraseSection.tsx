import Image from "next/image";
import { useTheme } from "./switchers/switchers"

interface SectionProps {
  phrase: string
  author?: string
  handleClick?: (targetId: string) => void
}

export const PhraseSection = (props: SectionProps) => {

  const { theme } = useTheme();

  return (
    <>
      <section className={`${props.author ? 'h-[55vh]' : 'h-[80vh]'} ${theme === 'light' ? 'text-black' : 'text-white'}
    slideBottom flex flex-col gap-20 mx-auto text-center items-center justify-center p-5 md:p-10`}>

        <h1 className={`${theme === 'light' ? 'gradient-title-white-2' : 'gradient-title-black-2'} 
      gradient-title font-bold tracking-wider leading-[8vh]
      text-3xl md:text-5xl 4k:text-7xl ultrawide:text-7xl `}>
          {props.phrase}
        </h1>

        {props.author
          ? <p className="text-right ml-auto px-5">{'- ' + props.author}</p>
          : <Image src='/images/icon-down-arrow.png' alt="seta pra baixo" width={50} height={50}
            className={`${theme === 'dark' && 'invert-color'} seta-animation mx-auto hover:cursor-pointer`} 
            onClick={() => {
              props.handleClick && props.handleClick('#resume-abt')
            }}/>
        }
      </section>
    </>
  )
}