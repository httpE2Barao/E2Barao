interface iResumeAbt {
  theme: string;
  language: string;
}

export const ResumeAbt = (props: iResumeAbt) => {
  return (
    <section id="resume-abt" className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}
    text-center px-4 py-10 pt-40 mx-auto max-w-[1750px]`}>
      <p>
        Como desenvolvedor web, minha paixão pela tecnologia desde a infância me impulsiona a criar soluções inovadoras e eficientes. Com expertise em design e front-end, trabalho com as mais modernas tecnologias para oferecer resultados de alta qualidade. Estou comprometido com a aprendizagem contínua e a resolução proativa de desafios, buscando sempre superar expectativas e contribuir para o sucesso de projetos dinâmicos e desafiadores.
      </p>
    </section>
  )
}