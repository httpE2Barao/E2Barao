import { useTheme } from "../switchers/switchers";

interface iResumeAbt {
  theme: string;
  language: string;
}

export const ResumeAbt = (props: iResumeAbt) => {

  const {language} = useTheme();

  return (
    <section id="resume-abt" className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}
    text-center font-semibold text-xl px-4 py-10 pt-40 mx-auto max-w-[2000px]`}>
      <p>
        {language==='pt-BR' 
        ? 'A paixão pela tecnologia que se manifesta desde a infância continua, domino as ferramentas e linguagens de front-end mais modernas para criar soluções inovadoras e de alta qualidade. Com um olhar atento às últimas tendências e tecnologias, trabalho de forma proativa e dedicada, buscando aprimorar minhas habilidades e conhecimentos continuamente.' 
        : 'My lifelong passion for technology fuels my expertise in mastering the latest front-end tools and languages, allowing me to deliver innovative and high-quality solutions. I proactively monitor industry trends and technologies, working with dedication and perseverance to continuously enhance my skills and knowledge.'}
      </p>
    </section>
  )
}