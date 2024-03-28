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
        ? 'Como um desenvolvedor front-end freelancer, ofereço soluções inovadoras e de alta qualidade para os meus clientes. Minha paixão inabalável pela programação e design me impulsionam a criar experiências excepcionais para os usuários. Cada projeto é uma oportunidade para inovar. Busco constantemente maneiras criativas de resolver problemas e melhorar a experiência do usuário. Abaixo você pode selecionar e ver sobre as minhas experiências detalhadas sobre minha trajetória profissional e pessoal.' 
        : 'As a freelance front-end developer, I offer innovative and high-quality solutions to my clients. My unwavering passion for programming and design drives me to create exceptional user experiences. Each project is an opportunity to innovate. I constantly seek creative ways to solve problems and improve the user experience. Below, you can select and view my detailed experiences about my professional and personal journey.'}
      </p>
    </section>
  )
}