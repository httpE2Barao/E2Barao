import Image from "next/image";
import { useTheme } from "./switchers/switchers"

interface SectionProps {
  phrase: string
  author?: string
}

export const PhraseSection = (props: SectionProps) => {

  const { theme } = useTheme();

  return (
    <>
      <section className={`${props.author ? 'h-[40vh]' : 'h-[80vh]'} ${theme === 'light' ? 'text-black' : 'text-white'}
    slideBottom flex flex-col gap-20 mx-auto text-center  items-center justify-center p-10`}>

        <h1 className={`${theme === 'light' ? 'gradient-title-white-2' : 'gradient-title-black-2'} 
      gradient-title font-bold tracking-wider leading-[8vh]
      text-4xl 2xl:text-7xl ultrawide:text-9xl `}>
          {props.phrase}
        </h1>

        {props.author
          ? <p className="text-right ml-auto">{'- ' + props.author}</p>
          : <Image src='/images/icon-down-arrow.png' alt="seta apontando pra baixo" width={50} height={50}
            className={`${theme === 'dark' && 'invert-color'} seta-animation mx-auto`} />
        }

      </section>
    </>
  )
}