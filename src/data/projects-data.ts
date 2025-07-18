export interface projectInterface {
  src: string;
  name: string;
  alt: string;
  abt: string;
  site: string;
  repo: string;
  tags?: string[];
}

// Interface para os dados brutos bilíngues
interface RawProjectData {
  src: string;
  tags?: string[];
  site: string;
  repo: string;
  name: { ptBR: string; enUS: string };
  alt: { ptBR: string; enUS: string };
  abt: { ptBR: string; enUS: string };
}

export const rawProjectsData: RawProjectData[] = [
    {
      src: 'janine-mathias',
      tags: ['typescript', 'vite', 'tailwind', 'github', 'figma', 'html', 'css', 'api'], 
      site: 'https://janine-mathias.vercel.app',
      repo: 'https://github.com/httpE2Barao/Janine-Mathias/',
      name: {
        ptBR: 'Cantora Janine Mathias',
        enUS: 'Singer Janine Mathias'
      },
      alt: {
        ptBR: 'Landing page de cadastro com formulário dinâmico',
        enUS: 'Registration landing page with dynamic form'
      },
      abt: {
        ptBR: 'Este projeto foi desenvolvido para Janine Mathias, uma cantora e compositora de música brasileira, com o objetivo de criar um portfólio digital que reflete sua carreira na arte. O projeto inclui uma interface moderna e responsiva que permite aos visitantes explorar seus álbuns diretamente do spotify, visualizar seus próximos shows e navegar por suas redes sociais de forma dinâmica.',
        enUS: 'This project is a landing page designed for resident registration, using a dynamic form that facilitates the insertion and updating of personal information. The application was built with technologies such as React, Next.js, and Tailwind CSS, providing a responsive and user-friendly interface. Additionally, API integration allows for automatic validation of the entered data, making the registration process faster and more secure. The project follows good development practices and focuses on accessibility, ensuring an efficient experience for residents.'
      }
    },
    {
        src: 'patio-monitoramento',
        tags: ['typescript', 'react', 'nextjs', 'tailwind', 'github', 'figma', 'html', 'css', 'api'], // fastify, prisma, porstgres, pgAdming4
        site: '',
        repo: 'https://github.com/httpE2Barao/Patio-Monitoramento/',
        name: {
          ptBR: 'Cadastro residêncial',
          enUS: 'Residential Registration'
        },
        alt: {
          ptBR: 'Landing page de cadastro com formulário dinâmico',
          enUS: 'Registration landing page with dynamic form'
        },
        abt: {
          ptBR: 'Este projeto é uma landing page desenvolvida para cadastro de residentes, utilizando um formulário dinâmico que facilita a inserção e atualização de informações pessoais. A aplicação foi construída com tecnologias como React, Next.js, e Tailwind CSS, proporcionando uma interface responsiva e amigável ao usuário. Além disso, a integração com APIs permite a validação automática dos dados inseridos, tornando o processo de registro mais ágil e seguro. O projeto segue boas práticas de desenvolvimento e foco em acessibilidade, garantindo uma experiência eficiente para os residentes.',
          enUS: 'This project is a landing page designed for resident registration, using a dynamic form that facilitates the insertion and updating of personal information. The application was built with technologies such as React, Next.js, and Tailwind CSS, providing a responsive and user-friendly interface. Additionally, API integration allows for automatic validation of the entered data, making the registration process faster and more secure. The project follows good development practices and focuses on accessibility, ensuring an efficient experience for residents.'
        }
      },
      {
        src: 'thiago-battista',
        tags: ['typescript', 'react', 'nextjs', 'tailwind', 'github', 'figma', 'html', 'css', 'nodejs', 'vite'], 
        site: 'https://thiagobattista.vercel.app',
        repo: 'https://github.com/httpE2Barao/webfolio-thiago_battista',
        name: {
          ptBR: 'Fotografo Thiago Battista',
          enUS: 'Photographer Thiago Battista'
        },
        alt: {
          ptBR: 'Landing page de cadastro com formulário dinâmico',
          enUS: 'Registration landing page with dynamic form'
        },
        abt: {
          ptBR: 'Este projeto é uma landing page desenvolvida para cadastro de residentes, utilizando um formulário dinâmico que facilita a inserção e atualização de informações pessoais. A aplicação foi construída com tecnologias como React, Next.js, e Tailwind CSS, proporcionando uma interface responsiva e amigável ao usuário. Além disso, a integração com APIs permite a validação automática dos dados inseridos, tornando o processo de registro mais ágil e seguro. O projeto segue boas práticas de desenvolvimento e foco em acessibilidade, garantindo uma experiência eficiente para os residentes.',
          enUS: 'This project is a landing page designed for resident registration, using a dynamic form that facilitates the insertion and updating of personal information. The application was built with technologies such as React, Next.js, and Tailwind CSS, providing a responsive and user-friendly interface. Additionally, API integration allows for automatic validation of the entered data, making the registration process faster and more secure. The project follows good development practices and focuses on accessibility, ensuring an efficient experience for residents.'
        }
      },
      {
        src: 'space-tourism',
        tags: ['javascript', 'react', 'tailwind', 'github', 'figma', 'html', 'css'],
        site: 'https://turismo-espacial-xi.vercel.app/',
        repo: 'https://github.com/httpE2Barao/SpaceTourism',
        name: {
          ptBR: 'Turismo Espacial',
          enUS: 'Space Tourism'
        },
        alt: {
          ptBR: 'Site sobre um turismo no espaço',
          enUS: 'Website about space tourism'
        },
        abt: {
          ptBR: 'Este projeto é uma aplicação web que apresenta informações sobre uma missão espacial. Utilizando o React e o Tailwind CSS, ele oferece uma interface do usuário moderna e responsiva. Possui recursos avançados do React, como os Hooks, para gerenciar o estado e os efeitos colaterais. Além disso, utiliza técnicas de otimização, como a pré-renderização de imagens, para garantir um carregamento rápido e uma experiência fluida. O código segue boas práticas de organização e estruturação, tornando-o fácil de entender e dar manutenção.',
          enUS: 'This project is a web application that presents information about a space mission. Using React and Tailwind CSS, it offers a modern and responsive user interface. It has advanced React features, such as Hooks, to manage state and side effects. It also uses optimization techniques, such as image pre-rendering, to ensure fast loading and a fluid experience. The code follows good organization and structuring practices, making it easy to understand and maintain.'
        }
      },
      {
        src: 'negociacoes',
        tags: ['typescript', 'github', 'api', 'html', 'css'],
        site: 'https://negocicoes.vercel.app/dist/index.html',
        repo: 'https://github.com/httpE2Barao/Negotiation',
        name: {
          ptBR: 'Negociação API',
          enUS: 'Negotiations API'
        },
        alt: {
          ptBR: 'Projeto escalável TypeScript',
          enUS: 'Scalable TypeScript project'
        },
        abt: {
          ptBR: 'Este é um projeto que consome uma API externa e aplica as boas práticas do Typescript. Ele garante a qualidade do código durante a compilação, não permite a geração de código com erros, usa typagem estática e orientação a objeto. Ele também utiliza decorators para adicionar funcionalidades extras às classes, métodos e propriedades. Além disso, ele trata os possíveis erros da API com um micro framework que facilita o gerenciamento de rotas, requisições e respostas.',
          enUS: 'This is a project that consumes an external API and applies the good practices of Typescript. It guarantees the quality of the code during compilation, does not allow the generation of code with errors, uses static typing and object orientation. It also uses decorators to add extra functionality to classes, methods and properties. In addition, it handles possible API errors with a micro-framework that facilitates the management of routes, requests and responses.'
        }
      },
      {
        src: 'serenatto-cafe',
        tags: ['javascript', 'bootstrap', 'css', 'github'],
        site: 'https://serenatto-ebon.vercel.app/',
        repo: 'https://github.com/httpE2Barao/Study-Repo/tree/main/Front%20End/Bootstrap/Projeto_Serenatto',
        name: {
          ptBR: 'Serenatto Café',
          enUS: 'Serenatto Coffee'
        },
        alt: {
          ptBR: 'Cafeteria Serenatto',
          enUS: 'Coffee shop website'
        },
        abt: {
          ptBR: 'O projeto é um site informativo e elegante sobre a cafeteria Serenatto, usando e aprimorando minhas habilidades com o framework Bootstrap. O site consiste na apresentação dos produtos da cafeteria, como cafés especiais, bolos, salgados e vitaminas. Também possui um botão para alternar entre o tema claro e o modo escuro, criando uma atmosfera mais aconchegante e intimista. O objetivo é oferecer uma experiência única e diferenciada para os clientes.',
          enUS: "The project is an informative and elegant website about the Serenatto coffee shop, using and improving my skills with the Bootstrap framework. The site consists of a presentation of the coffee shop's products, such as specialty coffees, cakes, snacks and smoothies. It also has a button to switch between a light and dark theme, creating a more cozy and intimate atmosphere. The aim is to offer a unique and distinctive experience for customers."
        }
      },
      {
        src: 'typing-challenge',
        tags: ['javascript', 'html', 'css', 'tailwind', 'jquery', 'api', 'github'],
        site: 'https://typing-challenge-theta.vercel.app/',
        repo: 'https://github.com/httpE2Barao/typing-challenge',
        name: {
          ptBR: 'Desafio de Digitação',
          enUS: 'Typing Challenge'
        },
        alt: {
          ptBR: 'Desafio de Digitação - palavras por minuto',
          enUS: 'Typing Challenge - words per minute'
        },
        abt: {
          ptBR: 'Este projeto combina jQuery e Tailwind CSS para criar um desafio de digitação simples. Com um contador regressivo, ele monitora o tempo de digitação e fornece feedback em tempo real sobre erros. O jQuery gerencia interações do usuário, como iniciar e reiniciar o cronômetro. Ele consume uma API externa, apresentando frases aleatórias para digitação e exibe mensagens de erro se necessário. Ao final, registra o desempenho do usuário em um placar, incluindo média de palavras por minuto e número de acertos e erros, permitindo que acompanhe seu progresso.',
          enUS: "This project combines jQuery and Tailwind CSS to create a simple typing challenge. With a countdown timer, it monitors typing time and provides real-time feedback on errors. jQuery manages user interactions such as starting and restarting the timer. By consuming an external API, it presents random phrases for typing and displays error messages if necessary. At the end, it records the user's performance on a scoreboard, including the average number of words per minute and the number of hits and misses, allowing them to track their progress"
        }
      },
      {
        src: 'stopwatch',
        tags: ['typescript', 'sass', 'html', 'css', 'github'],
        site: 'https://stopwatch-react-app0.vercel.app/',
        repo: 'https://github.com/httpE2Barao/Stopwatch-react-app',
        name: {
          ptBR: 'Temporizador',
          enUS: 'Stopwatch'
        },
        alt: {
          ptBR: 'Site sobre modelo de negociação',
          enUS: 'Website about negotiation model'
        },
        abt: {
          ptBR: 'Este projeto utiliza as tecnologias React, Typescript e Sass para oferecer uma experiência robusta e personalizável. Através de componentes reutilizáveis e gerenciamento de estado eficiente com hooks, o projeto garante flexibilidade e facilidade de manutenção. A tipagem estática do Typescript previne erros e garante a confiabilidade do código, enquanto o Sass permite estilização avançada com variáveis e adaptação a diferentes dispositivos.',
          enUS: "This project leverages React, TypeScript, and Sass to deliver a robust and customizable user experience. By utilizing reusable components and efficient state management with hooks, the project ensures flexibility and maintainability. TypeScript's static typing prevents errors and guarantees code reliability, while Sass empowers advanced styling with variables and device-agnostic adaptation."
        }
      },
      {
        src: 'moni-bank',
        tags: ['javascript', 'html', 'css'],
        site: 'https://moni-bank-omega.vercel.app/',
        repo: 'https://github.com/httpE2Barao/MoniBank',
        name: {
          ptBR: 'Banco digital',
          enUS: 'Digital bank'
        },
        alt: {
          ptBR: 'Projeto de cadastro em um banco digital',
          enUS: 'Digital Bank Account Sign-Up Project'
        },
        abt: {
          ptBR: 'O projeto usa Javascript para criar uma conta em um site de banco. Utiliza boas práticas de validação de formulários, como verificar se o usuário é maior de idade, se o CPF tem os dígitos válidos e com a funcionalidade de tirar foto pelo webcam. Ele também trata os erros que podem ocorrer com dados inválidos. O projeto é simples, e mostra como usar a lógica de programação para fazer uma aplicação web de cadastro.',
          enUS: 'The project uses Javascript to create an account on a bank website. It uses good form validation practices, such as checking that the user is of legal age, that the CPF has valid digits and with the functionality to take a photo via the webcam. It also handles errors that can occur with invalid data. The project is simple and shows how to use programming logic to make a registration web application.'
        }
      },
      {
        src: 'cadastro-inteligente',
        tags: ['javascript', 'html', 'css', 'api'],
        site: 'https://cep-auto-complete.vercel.app/',
        repo: 'https://github.com/httpE2Barao/CEP_auto-complete',
        name: {
          ptBR: 'Cadastro Autocomplete',
          enUS: 'Autocomplete Registration'
        },
        alt: {
          ptBR: 'Projeto de busca de endereço CEP',
          enUS: 'Zip code address search project'
        },
        abt: {
          ptBR: 'Este projeto utiliza JavaScript para criar uma funcionalidade de busca de endereço com base no CEP fornecido pelo usuário. A ideia é permitir que os usuários insiram um CEP e, em seguida, obtenham informações detalhadas sobre o endereço associado a esse CEP. Antes de prosseguir com a consulta, verifica se o usuário é maior de idade. Além disso, valida os dígitos do CPF para garantir que sejam válidos. Isso ajuda a evitar erros e inconsistências nos dados inseridos.',
          enUS: 'This project uses JavaScript to create an address search functionality based on the ZIP code provided by the user. The idea is to allow users to enter a ZIP code and then get detailed information about the address associated with that ZIP code. Before proceeding with the query, it checks that the user is of legal age. It also validates the CPF digits to ensure that they are valid. This helps to avoid errors and inconsistencies in the data entered.'
        }
      },
      {
        src: 'books-react',
        tags: ['javascript', 'html', 'css', 'api'],
        site: 'https://books-react-project-a.vercel.app/',
        repo: 'https://github.com/httpE2Barao/Books_react-project',
        name: {
          ptBR: 'E-Biblioteca',
          enUS: 'E-Library'
        },
        alt: {
          ptBR: 'Projeto de cadastro com busca de endereço CEP',
          enUS: 'Registration project with ZIP code address search'
        },
        abt: {
          ptBR: 'Este projeto utiliza JavaScript para criar uma funcionalidade de busca de endereço com base no CEP fornecido pelo usuário. A ideia é permitir que os usuários insiram um CEP e, em seguida, obtenham informações detalhadas sobre o endereço associado a esse CEP. Antes de prosseguir com a consulta, verifica se o usuário é maior de idade. Além disso, valida os dígitos do CPF para garantir que sejam válidos. Isso ajuda a evitar erros e inconsistências nos dados inseridos.',
          enUS: 'This project uses JavaScript to create an address search functionality based on the ZIP code provided by the user. The idea is to allow users to enter a ZIP code and then get detailed information about the address associated with that ZIP code. Before proceeding with the query, it checks that the user is of legal age. It also validates the CPF digits to ensure that they are valid. This helps to avoid errors and inconsistencies in the data entered.'
        }
      },
  ];

  export const projectsList = (language: string): projectInterface[] => {
  const renderText = (textObj: { ptBR: string; enUS:string }) => {
    return language === 'pt-BR' ? textObj.ptBR : textObj.enUS;
  };

  return rawProjectsData.map(project => ({
    ...project,
    name: renderText(project.name),
    alt: renderText(project.alt),
    abt: renderText(project.abt),
  }));
};