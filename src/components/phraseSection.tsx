import { useTheme } from "./switchers/switchers"

interface SectionProps {
  phrase: string
  author?: string
}

export const PhraseSection = (props: SectionProps) => {

  const { theme } = useTheme();

  return (
    <section className={`${props.author && 'flex flex-col'} ${theme === 'light' ? 'text-black' : 'text-white'}
    slideBottom flex mx-auto text-center px-10 py-[10vh]`}>

      <h1 className={`${theme === 'light' ? 'gradient-title-white-2' : 'gradient-title-black-2'} 
      ${props.author && ''}
      gradient-title font-bold tracking-wider leading-[8vh]
       text-4xl 2xl:text-7xl ultrawide:text-9xl `}>
        {props.phrase}
      </h1>

      {props.author &&
        <p className="pt-10 text-right">{'- ' + props.author}</p>
      }

    </section>
  )
}