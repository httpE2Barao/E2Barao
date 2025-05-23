import Image from "next/image";
import { useTheme } from "../switchers/switchers";
import { useInView } from "react-intersection-observer";

export const PersonalContent = () => {

  const { theme, language } = useTheme();
  const languageConverted = language.replace('-', '')
  const [ref0, inView0] = useInView();
  const [ref1, inView1] = useInView();
  const [ref2, inView2] = useInView();

  const listRoot = [
    { // tirulo , src , text1? , text2
      ptBR: [
        ['TECNOLOGIA, ARTE E ESPIRITUALIDADE.', 'img-homelife.jpeg', "O primeiro contato com a tecnologia que tive foi na infância onde acendeu a chama da curiosidade e do fascínio pelo mundo digital. A visão otimista da realidade e o idealismo moral se fortaleceram, guiando meus passos em busca de um mundo mais justo e igualitário. Na adolescência, a incompreensão e o preconceito marcaram minha jornada. A identidade de gênero, ainda incerta, gerou conflitos e sofrimento. Mas foi nesse período que a paixão pelo teatro e pelo audiovisual floresceu, abrindo caminho para a expressão artística e a conexão com pessoas que compartilhavam das mesmas experiências. Um intercâmbio internacional representou um divisor de águas. A imersão em novas culturas expandiu meus horizontes, aprimorou o domínio do inglês e proporcionou novas perspectivas sobre a sociedade. O conhecimento se consolidou como ferramenta de empoderamento, a empatia se tornou um valor fundamental e a fraternidade social se ergueu como bandeira. Ao retornar ao Brasil, a luta pela igualdade se intensificou. A paixão pela diversidade natural e social do país se entrelaçou com a defesa incansável de um mundo livre de preconceitos e discriminações.", "Uma jornada de autodescoberta, superação e transformação que demonstra a força do conhecimento, da tecnologia, da arte e da espiritualidade. Que resultou na constante luta por um mundo melhor."],
        ['BRASIL CORAÇÃO DO MUNDO.', 'img-rj-city.png', 'Atualmente, eu resido em Curitiba, onde estudo Engenharia de Software no Centro Universitário Descomplica, impulsionado pela eterna busca pelo conhecimento e pela inovação. O conhecimento em design e desenvolvimento front e back end se traduz em projetos freelance autônomos, utilizando tecnologias modernas para criar aplicações online que refletem meu potêncial e criatividade. A inteligência artificial se torna uma aliada fundamental por um futuro transformador. A crença no potencial positivo da IA para todas as áreas da vida se alia à convicção de que os avanços tecnológicos devem ser direcionados para o bem-estar social. A identidade não-binária e pansexual se consolida como parte essencial de quem eu sou, alimentando a luta contra o preconceito e a intolerância. A imersão na umbanda brasileira aprofunda a conexão com a espiritualidade, a consciência naturalista e a ancestralidade.'],
        ['POR DENTRO SOMOS TODOS CAVEIRAS.', 'img-futurist-city.jpeg', 'O futuro se desenha como um horizonte de possibilidades. A visão de um adulto consciente na utilização de tecnologias inovadoras como IA e computadores quânticos para revolucionar a vida em sociedade, se torna cada vez mais nítida. A luta pela igualdade se intensifica, defendendo o direito fundamental de todos a oportunidades e condições de vida dignas. A convicção de que somos todos iguais, independentemente de diferenças, se transforma em um mantra que norteia minhas ações. A peregrinação pelo mundo continua, impulsionada pela sede de conhecimento e pelo desejo de aprender e crescer. A gratidão pelas experiências vividas e a superação dos desafios se traduzem em um presente de constante metamorfose e amadurecimento. O otimismo em relação ao futuro se entrelaça com a esperança de um mundo melhor. A postura de guerreiro da paz se fortalece, defendendo a igualdade, a justiça e a harmonia. O orgulho de ser quem eu sou se torna um símbolo de força e resiliência. ']
      ], 
      enUS: [
        ['KNOWLEDGE, ART AND SPIRITUALITY.', 'img-homelife.jpeg', "My first contact with technology was in childhood, which ignited a spark of curiosity and fascination for the digital world. My optimistic outlook on reality and moral idealism were strengthened, guiding my steps towards a more just and equalitarian world. In adolescence, misunderstanding and prejudice marked my journey. My gender identity, still uncertain, generated conflict and suffering. But it was during this period that my passion for theater and audiovisual blossomed, opening the way for artistic expression and connection with people who shared similar experiences An international exchange program was a turning point. Immersing myself in new cultures expanded my horizons, improved my English language proficiency, and provided new perspectives on society. Knowledge became a tool for empowerment, empathy became a fundamental value, and social fraternity became my banner Upon returning to Brazil, my fight for equality intensified. My passion for the country's natural and social diversity intertwined with the tireless defense of a world free from prejudice and discrimination."],
        ['BRAZIL HEART OF THE WORLD.', 'img-rj-city.png', "Currently, I live in Curitiba, where I study Software at Descomplica college, driven by an eternal quest for knowledge and innovation. My knowledge in design and full-stack development translates into freelance projects, using modern technologies to create online applications that reflect my potential and creativity. Artificial intelligence becomes a fundamental ally for a transformative future My belief in the positive potential of AI for all areas of life aligns with my conviction that technological advancements should be directed towards social well-being. My non-binary and pansexual identity consolidates itself as an essential part of who I am, fueling the fight against prejudice and intolerance. My immersion in Brazilian religian called umbanda deepens my connection with spirituality, naturalist consciousness, and ancestry."],
        ['DEEP DOWN WE ARE ALL SKULLS.', 'img-futurist-city.jpeg', 'The future looms as a horizon of possibilities. The vision of a conscious adult using innovative technologies like AI and quantum computers to revolutionize life in society becomes increasingly clear. The fight for equality intensifies, defending the fundamental right of all to opportunities and decent living conditions. The conviction that we are all equal, regardless of differences, becomes a mantra that guides my actions. The pilgrimage through the world continues, driven by a thirst for knowledge and a desire to learn and grow. Gratitude for the experiences lived and the overcoming of challenges translate into a present of constant metamorphosis and maturation. Optimism about the future is intertwined with the hope for a better world. The stance of a warrior of peace is strengthened, defending equality, justice and harmony. The pride of being who I am becomes a symbol of strength and resilience.']      ]
    }
  ]

  const addAnimationClass = (index:number) => {
    return inView0 && index === 0 ||
      inView1 && index === 1 ||
      inView2 && index === 2
      ? 'animate'
      : '';
  };

  return (
    <section id="personal" className={`${theme === 'dark' ? 'text-white' : 'text-black'}
       flex-col gap-20 p-4 lg:pt-60 mx-auto max-w-[2350px] 
       pt-20 max-sm:text-center sm:pr-11 lg:p-20`}
    >
      {listRoot[0][languageConverted as keyof typeof listRoot[0]].map((item: string[], index: number) => (
        <div
          key={languageConverted + index}
          ref={index === 0 ? ref0 : index === 1 ? ref1 : ref2}
          className={`overflow-visible flex-conteiner g-container-${index} mb-52 mx-auto xl:pb-32 ${addAnimationClass(index)}
          `}
        >
          <h1
            className={`
              gradient-title
              ${theme === 'dark' ? `gradient-title-black-${index}` : `gradient-title-white-${index}`} 
              text-3xl pb-5 md:text-4xl lg:text-6xl lg:pb-8 tracking-wider
              leading-lg 
            `}
          >
            {item[0]}
          </h1>

          {index === 0
            && <p className="grid-span pb-4 md:text-left md:text-base lg:text-lg xl:text-lg 2xl:text-xl">
              {item[3]}</p>
          }

          <p className={`md:text-left lg:pt-5 md:text-base lg:text-lg xl:text-lg 2xl:text-xl`}>
            
            <Image src={`/images/${item[1]}`}
            className={`grid-img g-img-${index} pt-3 w-1/2 float-start rounded-2xl ${addAnimationClass(index)}`}
            alt={item[1]} width={700} height={700} />

            {item[2]}

          </p>

        </div>
      ))}
    </section>
  )
}