import { Button } from "./buttons";

interface iChoicesContainer {
  theme: string;
  language: string;
  handleClick: (targetId: string) => void
}

const choice = ['Profissional', 'Professional', 'Pessoal', 'Personal'];

export const ChoicesContainer = ( props:iChoicesContainer ) => {
  return (
    <section className="slideBottomSlow mb-20 flex flex-col gap-5 items-center justify-around 
    sm:gap-10 ">
      <h3 className={`${props.theme === 'dark' ? 'text-white' : 'text-black'} 
      font-semibold text-2xl xl:text-4xl`}>
        {props.language === 'pt-BR' ? 'Ver trajetória:' : 'View background:'}
      </h3>

      <span className="flex gap-10 xl:gap-20 text-2xl">
        <Button index={0} text={props.language === 'pt-BR' ? choice[0] : choice[1]} theme={props.theme} onClick={() => props.handleClick('#personal')} />
        <Button index={1} text={props.language === 'pt-BR' ? choice[2] : choice[3]} theme={props.theme} onClick={() => props.handleClick('#professional')} />
      </span>
    </section>

  )
}