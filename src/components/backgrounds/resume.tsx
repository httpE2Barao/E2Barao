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
        ? 'Movido por uma paixão inabalável pela tecnologia, sou um desenvolvedor front-end altamente proficiente que domina as ferramentas e linguagens mais recentes para criar soluções inovadoras e de alta qualidade. Anseio por novos desafios e mantenho-me atualizado com as últimas tendências e tecnologias, sempre buscando aprimorar minhas habilidades e conhecimentos de forma proativa e dedicada.' 
        : 'Driven by an unwavering passion for technology, I am a highly proficient front-end developer who masters the latest tools and languages to create innovative and high-quality solutions. I crave new challenges and keep myself updated with the latest trends and technologies, always striving to improve my skills and knowledge proactively and dedicatedly.'}
      </p>
    </section>
  )
}