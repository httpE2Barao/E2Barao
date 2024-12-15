import { useTheme } from "../switchers/switchers";

interface iResumeAbt {
  theme: string;
  language: string;
}

export const ResumeAbt = (props: iResumeAbt) => {

  const {language} = useTheme();

  return (
    <section id="resume-abt" className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}
    text-center font-semibold text-xl px-4 py-10 mx-auto max-w-[2000px]`}>
      <div>
        {language==='pt-BR' 
        ? (
          <>
            <p>
              Sou um desenvolvedor de tecnologia com experiência prática em criar soluções digitais inovadoras. Desde muito cedo, fui movido por uma paixão pela tecnologia, o que me levou a explorar áreas diversas, incluindo arte, filosofia e cultura. Essa base diversificada me permite entender como aplicar tecnologia de forma criativa e significativa para transformar negócios e impactar pessoas.
            </p><br/>
            <p>
              Atualmente, atuo como freelancer, ajudando empresas a desenvolver soluções eficientes e acessíveis. Meu foco é usar tecnologia para promover inclusão, inovação e resultados tangíveis. Acredito no poder da tecnologia para melhorar processos e criar um futuro mais justo e conectado. Se você busca um profissional comprometido com resultados e transformação, estou pronto para contribuir com o seu projeto.
            </p>
          </>
        )
        : (
          <>
            <p>
              I am a technology developer with hands-on experience in creating innovative digital solutions. From a very young age, I have been driven by a passion for technology, which led me to explore diverse areas, including art, philosophy, and culture. This diverse background allows me to understand how to apply technology creatively and meaningfully to transform businesses and impact people.
            </p><br/>
            <p>
              Currently, I work as a freelancer, helping companies develop efficient and accessible solutions. My focus is on using technology to promote inclusion, innovation, and tangible results. I believe in the power of technology to improve processes and create a more just and connected future. If you are looking for a professional committed to results and transformation, I am ready to contribute to your project.
            </p>
          </>
        )}
      </div>
    </section>
  )
}