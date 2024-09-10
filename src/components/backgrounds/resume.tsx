import { useTheme } from "../switchers/switchers";

interface iResumeAbt {
  theme: string;
  language: string;
}

export const ResumeAbt = (props: iResumeAbt) => {

  const {language} = useTheme();

  return (
    <section id="resume-abt" className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}
    text-center font-semibold text-xl px-4 py-10 pt-60 mx-auto max-w-[2000px]`}>
      <p>
        {language==='pt-BR' 
        ? 'Nasci em Curitiba no ano de 2002 e, desde a infância, minha paixão pela tecnologia me impulsionou a trilhar um caminho multifacetado. Além dos bits e bytes, mergulhei em conhecimentos sobre arte, filosofia e cultura. Hoje, como freelancer autônomo, tenho o privilégio de transformar vidas por meio da tecnologia, acreditando firmemente que ela pode construir um mundo melhor. Minha jornada é contínua, sempre permeada por questionamentos e aprendizados, com o compromisso de tornar o futuro mais inclusivo, justo e humano.' 
        : 'I was born in Curitiba in 2002, and since childhood, my passion for technology has driven me to follow a multifaceted path. Beyond bits and bytes, I delved into knowledge about art, philosophy, and culture. Today, as a freelance professional, I have the privilege of transforming lives through technology, firmly believing that it can build a better world. My journey is ongoing, always infused with questioning and learning, with a commitment to making the future more inclusive, fair, and humane.'}
      </p>
    </section>
  )
}