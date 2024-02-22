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
    { // highlight , src , text1? , text2
      ptBR: [
        ['CONHECIMENTO, ARTE E ESPIRITUALIDADE.', 'img-homelife.jpeg', "Na infância, eu ganhei um computador velho da minha irmã, sendo o meu primeiro contato com a tecnologia. Eu passava horas explorando o mundo virtual, aprendendo coisas novas e me divertindo. Eu tinha uma visão otimista da realidade e um idealismo moral muito forte. Na adolescência, eu sofri muito preconceito do machismo devido à minha identidade de gênero, que eu não compreendia. Eu me sentia rejeitado pela sociedade e pela minha família, que não me aceitavam como eu era. Foi nessa fase que eu me apaixonei pelo teatro e pelo audiovisual, que me permitiram expressar os meus sentimentos e me conectar com outras pessoas que compartilhavam das mesmas paixões. A vida me deu uma chance de mudar de cenário quando eu fui fazer um intercâmbio internacional. Foi uma experiência incrível, que me abriu os olhos para outras culturas, me ensinou inglês avançado e me trouxe novas perspectivas sobre a sociedade. Aprendi a importância do conhecimento, da empatia e da fraternidade social. Ao voltar ao Brasil, levantei a bandeira da igualdade e fiquei cada vez mais apaixonado pela nossa diversidade natural e social.", "A minha vida é uma história de obstáculos, superação e crescimento. Eu nasci com uma alma curiosa, criativa e sonhadora, que se encantava com a tecnologia e com o mundo. Mas eu também enfrentei muitos desafios, como a discriminação, a violência e a incompreensão. Eu busquei refúgio no conhecimento, na arte e na espiritualidade, que me deram força, expressão e propósito."],
        ['BRASIL CORAÇÃO DO MUNDO.', 'img-rj-city.png', 'Atualmente me mudei para o Rio de Janeiro, onde estudo ciência da computação no centro universitário IBMR na Barra da Tijuca, continuando minha eterna busca pelo novo. Com forte conhecimento em design e desenvolvimento front-end, atuo como free-lancer autônomo. Usando tecnologias modernas de desenvolvimento e design para criar aplicações online. Hoje, eu sou um jovem determinado, criativo, adaptável, pró-ativo e independente. Eu me aceito como sou, homem não-binário e pansexual, e luto contra o preconceito e a intolerância. Também mergulhei na complexa umbanda brasileira, trazendo uma visão de empatia social e consciência naturalista. Adquiri os conhecimentos dos corpos extrafísicos, o propósito cósmico e o anti-materialismo. A Inteligência Artificial se tornou uma grande aliada nos meus estudos. Eu acredito plenamente que a IA veio para transformar completamente  todas as áreas de nossas vidas. Eu estou aqui para defender que os  avanços sejam positivos na sociedade.'],
        ['POR DENTRO SOMOS TODOS CAVEIRAS.', 'img-futurist-city.jpeg', 'Amanhã, eu me vejo como um adulto consciente. Usando novas tecnologias como a IA e também os surpreendentes computadores quânticos para transformar de uma vez a maneira como vivemos. Me vejo lutando para encontrarmos uma solução democrática. Eu acredito que a igualdade é um direito humano fundamental e estou disposto a trabalhar duro para garantir que todos tenham as mesmas oportunidades na vida. Porque afinal somos todos caveiras por dentro e viemos da mesma fonte criadora. Pretendo continuar minha peregrinação e viajar pelo mundo, aprendendo cada vez mais. Essa é a minha vida, que é uma história de constante metamorfose, aprendizado e crescimento. Eu sou grato por tudo que vivi, que me fez ser quem eu sou hoje. Eu sou otimista em relação ao futuro, que me reserva muitas surpresas e oportunidades. Sou um guerreiro da paz e vou lutar enquanto não estivermos melhor do que começamos. Eu sou o que sou, e eu tenho orgulho disso.']
      ], enUS: [
        ['KNOWLEDGE, ART AND SPIRITUALITY.', 'img-homelife.jpeg', "In childhood, I got an old computer from my sister, which was my first contact with technology. I spent hours exploring the virtual world, learning new things and having fun. I had an optimistic view of reality and a very strong moral idealism. As a teenager, I suffered a lot of prejudice from machismo because of my gender identity, which I didn't understand. I felt rejected by society and my family, who didn't accept me for who I was. It was during this phase that I fell in love with theater and audiovisuals, which allowed me to express my feelings and connect with other people who shared the same passions. Life gave me a chance to change scenery when I went on an international exchange. It was an incredible experience that opened my eyes to other cultures, taught me advanced English and gave me new perspectives on society. I learned the importance of knowledge, empathy and social fraternity. When I returned to Brazil, I raised the banner of equality and became increasingly passionate about our natural and social diversity.", "My life is a story of obstacles, overcoming and growth. I was born with a curious, creative and dreamy soul, who was enchanted by technology and the world. But I also faced many challenges, such as discrimination, violence and misunderstanding. I sought refuge in knowledge, art and spirituality, which gave me strength, expression and purpose."],
        ['BRAZIL HEART OF THE WORLD.', 'img-rj-city.png', "I've now moved to Rio de Janeiro, where I'm studying computer science at the IBMR university center in Barra da Tijuca, continuing my eternal search for the new. With a strong background in design and front-end development, I work as an independent freelancer. Using modern development and design technologies to create online applications. Today, I am a determined, creative, adaptable, proactive and independent young man. I accept myself as I am, a non-binary, pansexual man, and I fight against prejudice and intolerance. I also immersed myself in the complex Brazilian umbanda, bringing a vision of social empathy and naturalistic awareness. I acquired the knowledge of extraphysical bodies, cosmic purpose and anti-materialism. Artificial Intelligence has become a great ally in my studies. I fully believe that AI has come to completely transform all areas of our lives. I'm here to advocate for positive advances in society."],
        ["INSIDE WE'RE ALL SKULLS.", 'img-futurist-city.jpeg', "Tomorrow, I see myself as a conscious adult. Using new technologies like AI and also the amazing quantum computers to transform the way we live once and for all. I see myself fighting to find a democratic solution. I believe that equality is a fundamental human right and I'm willing to work hard to ensure that everyone has the same opportunities in life. Because after all, we are all skulls inside and we come from the same creative source. I intend to continue my pilgrimage and travel the world, learning more and more. This is my life, a story of constant metamorphosis, learning and growth. I am grateful for everything I have experienced, which has made me who I am today. I am optimistic about the future, which holds many surprises and opportunities. I am a warrior for peace and I will fight until we are better than where we started. I am who I am, and I'm proud of it."]
      ]
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
       flex-col gap-20 p-4 lg:pt-60 mx-auto max-w-[2500px] 
       pt-20 sm:pr-11 lg:p-20`}
    >
      {listRoot[0][languageConverted as keyof typeof listRoot[0]].map((item: string[], index: number) => (
        <div
          key={languageConverted + index}
          ref={index === 0 ? ref0 : index === 1 ? ref1 : ref2}
          className={`max-sm:text-center grid-container g-container-${index} mb-52 mx-auto xl:pb-32 ${addAnimationClass(index)}
          `}
        >
          <h1 className={`gradient-title ${theme==='dark' ? `gradient-title-black-${index}` : `gradient-title-white-${index}` } 
          text-3xl md:text-4xl lg:text-6xl lg:pb-8 tracking-wider leading-loose
          `}
          >{item[0]}</h1>

          {index === 0
            && <p className="grid-span md:text-left lg:text-base xl:text-lg 2xl:text-2xl">
              {item[3]}</p>
          }

          <p className={`md:grid-cols-2 md:text-left lg:pt-5 lg:text-base xl:text-lg 2xl:text-2xl`}
          >{item[2]}</p>

          <Image src={`/images/${item[1]}`}
            className={`grid-img g-img-${index} rounded-xl ${addAnimationClass(index)}`}
            alt={item[1]} width={700} height={700} />

        </div>
      ))}
    </section>
  )
}