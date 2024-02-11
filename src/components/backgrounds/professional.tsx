import { Chrono } from "react-chrono";
import { useTheme } from "../switchers/switchers"

export const ProfessionalContent = () => {
  const { theme, language } = useTheme();
  const languageClean = language.replace('-', '')

  const experiences = [
    {
      title: '2013-2019',
      cardTitle: 'Ensino fundamental e médio',
      cardSubtitle: `Escola e colégios públicos`,
      cardDetailedText: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium, ullam consequuntur, temporibus incidunt, sequi vitae aut voluptatem quae atque natus ipsam tenetur aliquam ut provident at accusantium. Ad, aliquid et?`
    },
    {
      title: '2019 - 2020',
      cardTitle: 'Audio-Visual & Teatro',
      url: 'https://teatrobarracaoencena.com.br/',
      cardSubtitle: `Barracão ensena`,
      cardDetailedText: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium, ullam consequuntur, temporibus incidunt, sequi vitae aut voluptatem quae atque natus ipsam tenetur aliquam ut provident at accusantium. Ad, aliquid et?`
    },
    {
      title: '2019 - 2020',
      cardTitle: 'Estágio de Concurso Público',
      url: 'https://tjpr.mestregr.com.br/',
      cardSubtitle: `Tribunal de justiça do Paraná`,
      cardDetailedText: `Estágio de concurso no setor da vice-presidência (11º andar) no departamento de saída de processos do Tribunal de Justiça. Responsabilidades incluem auxiliar na pesquisa e procuração de casos, organizações dos processos e a transição dos mesmos para outros departamentos, além de outras tarefas administrativas relacionadas. É esperado que o estagiário demonstre organização, responsabilidade de decisões e liderança no cumprimento de suas atividades sob supervisão da equipe de desembargadores do tribunal.`
    },
    {
      title: 'jan/2021 - dez/2021',
      cardTitle: 'Pré-vestibular',
      url: 'https://descomplica.com.br/',
      cardSubtitle: `Rede de ensino online Descomplica`,
      cardDetailedText: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium, ullam consequuntur, temporibus incidunt, sequi vitae aut voluptatem quae atque natus ipsam tenetur aliquam ut provident at accusantium. Ad, aliquid et?`
    },
    {
      title: 'dez/2021 - mai/2022',
      cardTitle: "Hella’s Air Temp",
      url: 'https://hellasairtemp.com/',
      cardSubtitle: `Auxiliar Financeiro`,
      cardDetailedText: `Responsável pelo controle e organização das transações financeiras da empresa de ar condicionado, garantindo as informações financeiras que estejam devidamente atualizadas. Atividades incluem verificação diária do valor atualizado pela inflação, atualização do valor no banco de dados, emissão de faturas, entre outras funções como auxiliar na organização dos produtos de saída. Espera-se que demonstre habilidades de organização, atenção aos detalhes, boa comunicação, conhecimento no Excel em sistemas financeiros, e capacidade de trabalho em equipe.`
    },
    {
      title: 'dez/2023 - fev/2024',
      cardTitle: 'Recepcionista Voluntário',
      url: 'https://www.worldpackers.com/pt-BR/users/5103646',
      cardSubtitle: 'Mambembe Hostel',
      cardDetailedText: (
        <>
          <i>Descrição:</i> <br/>
          Como voluntário em um hostel e tive várias responsabilidades no meu trabalho. Uma delas é atender os hóspedes com qualidade, fazendo o check-in e o check-out de forma eficiente. Eu também controlo o fluxo de pessoas que entram e saem do hostel, garantindo a segurança e a organização do local. Além disso, eu controlo o estoque e as vendas de produtos e serviços oferecidos pelo hostel. Outra função que eu faço é preparar e servir o café da manhã, seguindo os padrões de higiene e qualidade. Eu também esclareço as dúvidas dos hóspedes sobre o hostel, o local e as opções de turismo.
          <br/><br/>
          <i>Soft-skills:</i> Colaboração, Comunicação, Organização, Inter-relacionamento.
          <br/><br/>
          <i>Hard-skills:</i> English, Spanish, FrontDesk master Program, Excel.
          
        </>
      )
    },
    {
      title: 'out/2023 - today',
      cardTitle: 'Bacharelado Ciência da Computação',
      url: 'https://teatrobarracaoencena.com.br/',
      cardSubtitle: `Centro Universitário IBMR`,
      cardDetailedText: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium, ullam consequuntur, temporibus incidunt, sequi vitae aut voluptatem quae atque natus ipsam tenetur aliquam ut provident at accusantium. Ad, aliquid et?`
    },
  ]
  
  return (
    <section id="professional" className={`${theme === 'dark' ? 'text-white' : 'text-black'} lg:pt-20`}>
      <Chrono
        items={experiences.map((item, index) => ({
          title: item.title,
          cardTitle: item.cardTitle,
          url: item.url,
          cardSubtitle: item.cardSubtitle,
          cardDetailedText: item.cardDetailedText,
        }))}
        mode="VERTICAL_ALTERNATING"
        timelinePointDimension={35}
        cardHeight={150} 
        slideItemDuration={4000}
        slideShow
        theme={{
          primary: '#00FFFF',
          secondary: `${theme==='dark' ? 'white' : 'black' }`,
          cardTitleColor: 'blue',
          cardBgColor: 'white',
          cardForeColor: '#00FFFF',
          titleColor: `${theme==='dark' ? 'white' : 'black'}`,
          titleColorActive: 'black',
          cardDetailsColor: 'black',
        }}
      />
    </section>
  );
}