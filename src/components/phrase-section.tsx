import Image from "next/image";
import { useTheme } from "./switchers/switchers"

interface SectionProps {
  phrase: string
  type?: number
  author?: string
  handleClick?: (targetId: string) => void
}

export const PhraseSection = (props: SectionProps) => {

  const { theme } = useTheme();

  return (
    <>
      <section className={`${props.type == 0 && 'h-[80vh]'} ${props.type == 1 && 'h-[55vh]'} ${props.type == 2 && 'h-[25vh]'} ${theme === 'light' ? 'text-black' : 'text-white'}
      slideBottom flex flex-col gap-20 mx-auto text-center items-center justify-center p-5 md:p-10 overflow-visible`}>

        <h1 className={`${theme === 'light' ? 'gradient-title-white-2' : 'gradient-title-black-2'} 
        gradient-title font-bold tracking-wider leading-[5rem]
        text-3xl md:text-5xl 4k:text-7xl ultrawide:text-7xl `}>
          {props.phrase}
        </h1>

        {props.type == 0 &&
          <Image src='/images/icon-down-arrow.png' alt="seta pra baixo" width={50} height={50}
            className={`${theme === 'dark' && 'invert-color'} seta-animation mx-auto hover:cursor-pointer`}
            onClick={() => {
              props.handleClick && props.handleClick('#resume-abt')
            }} />
        }

        {props.type == 1
          && <p className="text-right ml-auto px-5">{'- ' + props.author}</p>
        }

      </section>
    </>
  )
}