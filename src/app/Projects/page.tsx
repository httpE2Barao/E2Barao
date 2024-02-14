"use client"
import { Loader } from "@/components/loader";
import { ProjectLayout } from "@/components/projects/project-layout";
import { useTheme } from "@/components/switchers/switchers";

export interface projectInterface {
    src: string,
    name: string,
    alt: string,
    abt: string,
    site: string,
    repo: string,
}

const renderText = (language: string, textObj: { ptBR: string, enUS: string }) => {
    return language === 'pt-BR' ? textObj.ptBR : textObj.enUS;
};

export default function Projetos() {
    const { language } = useTheme();

    const projectsList = [
        {
            src: 'space-tourism',
            site: 'https://turismo-espacial-xi.vercel.app/',
            repo: 'https://github.com/httpE2Barao/SpaceTourism',
            name: renderText(language, {
                ptBR: 'Turismo Espacial',
                enUS: 'Space Tourism'
            }),
            alt: renderText(language, {
                ptBR: 'Site sobre um turismo no espaço',
                enUS: 'Website about space tourism'
            }),
            abt: renderText(language, {
                ptBR: 'Este projeto é uma aplicação web que apresenta informações sobre uma missão espacial. Utilizando o React e o Tailwind CSS, ele oferece uma interface do usuário moderna e responsiva. Possui recursos avançados do React, como os Hooks, para gerenciar o estado e os efeitos colaterais. Além disso, utiliza técnicas de otimização, como a pré-renderização de imagens, para garantir um carregamento rápido e uma experiência fluida. O código segue boas práticas de organização e estruturação, tornando-o fácil de entender e dar manutenção.',
                enUS: 'This project is a web application that presents information about a space mission. Using React and Tailwind CSS, it offers a modern and responsive user interface. It has advanced React features, such as Hooks, to manage state and side effects. It also uses optimization techniques, such as image pre-rendering, to ensure fast loading and a fluid experience. The code follows good organization and structuring practices, making it easy to understand and maintain.'
            })
        },
        {
            src: 'negociacoes',
            site: 'https://negocicoes.vercel.app/dist/index.html',
            repo: 'https://github.com/httpE2Barao/Code-study/tree/main/TypeScript/Negocia%C3%A7%C3%B5es',
            name: renderText(language, {
                ptBR: 'Negociações',
                enUS: 'Negotiations'
            }),
            alt: renderText(language, {
                ptBR: 'Projeto escalável TypeScript',
                enUS: 'Scalable TypeScript project'
            }),
            abt: renderText(language, {
                ptBR: 'Este é um projeto que consome uma API externa e aplica as boas práticas do Typescript. Ele garante a qualidade do código durante a compilação, não permite a geração de código com erros, usa typagem estática e orientação a objeto. Ele também utiliza decorators para adicionar funcionalidades extras às classes, métodos e propriedades. Além disso, ele trata os possíveis erros da API com um micro framework que facilita o gerenciamento de rotas, requisições e respostas.',
                enUS: 'This is a project that consumes an external API and applies the good practices of Typescript. It guarantees the quality of the code during compilation, does not allow the generation of code with errors, uses static typing and object orientation. It also uses decorators to add extra functionality to classes, methods and properties. In addition, it handles possible API errors with a micro-framework that facilitates the management of routes, requests and responses.'
            })
        },
        {
            src: 'serenatto-cafe',
            site: 'https://serenatto-ebon.vercel.app/',
            repo: 'https://github.com/httpE2Barao/Code-study/tree/main/Bootstrap/Projeto_Serenatto',
            name: renderText(language, {
                ptBR: 'Caffeteria',
                enUS: 'Coffe shop'
            }),
            alt: renderText(language, {
                ptBR: 'Cafeteria Serenatto',
                enUS: 'Coffee shop website'
            }),
            abt: renderText(language, {
                ptBR: 'O projeto é um site informativo e elegante sobre a cafeteria Serenatto, usando e aprimorando minhas habilidades com o framework Bootstrap. O site consiste na apresentação dos produtos da cafeteria, como cafés especiais, bolos, salgados e vitaminas. Também possui um botão para alternar entre o tema claro e o modo escuro, criando uma atmosfera mais aconchegante e intimista. O objetivo é oferecer uma experiência única e diferenciada para os clientes.',
                enUS: "The project is an informative and elegant website about the Serenatto coffee shop, using and improving my skills with the Bootstrap framework. The site consists of a presentation of the coffee shop's products, such as specialty coffees, cakes, snacks and smoothies. It also has a button to switch between a light and dark theme, creating a more cozy and intimate atmosphere. The aim is to offer a unique and distinctive experience for customers."
            })
        },
        {
            src: 'sincronario',
            site: 'https://sincronario.vercel.app/',
            repo: 'https://github.com/httpE2Barao/Sincronario',
            name: renderText(language, {
                ptBR: 'Calendário Maia',
                enUS: 'Mayan Calendar'
            }),
            alt: renderText(language, {
                ptBR: 'Projeto react ',
                enUS: 'Website about space tourism'
            }),
            abt: renderText(language, {
                ptBR: 'Este projeto usa React e JavaScript para criar uma interface dinâmica e interativa. Utilizando componentes React para organizar o código em partes reutilizáveis e funções do React, como useEffect e useState, para gerenciar o estado e os efeitos colaterais da aplicação. O objetivo é demonstrar as possibilidades e vantagens de usar essas tecnologias para desenvolver aplicações web modernas e responsivas.',
                enUS: 'This project uses React and JavaScript to create a dynamic and interactive interface. Using React components to organize the code into reusable parts and React functions, such as useEffect and useState, to manage the state and side effects of the application. The aim is to demonstrate the possibilities and advantages of using these technologies to develop modern, responsive web applications.'
            })
        },
        {
            src: 'codechella',
            site: 'https://codechella2023-six.vercel.app/',
            repo: 'https://github.com/httpE2Barao/CodeChella2023',
            name: renderText(language, {
                ptBR: 'Codechella',
                enUS: 'Codechella'
            }),
            alt: renderText(language, {
                ptBR: 'Site sobre modelo de negociação',
                enUS: 'Website about negotiation model'
            }),
            abt: renderText(language, {
                ptBR: 'Este é um projeto react de um festival musical com uma interface moderna e responsiva, utilizando o conceito de "mobile first" para adaptar o layout aos diferentes tamanhos de tela utilizando o figma, depois o implementei com typescript para programar os componentes e as funcionalidades. O objetivo do projeto é mostrar as informações sobre o festival, como as atrações, os ingressos, o mapa do local e também respostas para perguntas frequentes.',
                enUS: 'This is a react project for a music festival with a modern, responsive interface, using the concept of "mobile first" to adapt the layout to different screen sizes using figma, then implemented it with typescript to program the components and functionalities. The aim of the project is to display information about the festival, such as attractions, tickets, a map of the venue and answers to frequently asked questions.'
            })
        },
        {
            src: 'stopwatch',
            site: 'https://stopwatch-react-app0.vercel.app/',
            repo: 'https://github.com/httpE2Barao/Stopwatch-react-app',
            name: renderText(language, {
                ptBR: 'Temporizador',
                enUS: 'Stopwatch'
            }),
            alt: renderText(language, {
                ptBR: 'Site sobre modelo de negociação',
                enUS: 'Website about negotiation model'
            }),
            abt: renderText(language, {
                ptBR: 'Este é um projeto que usa as seguintes tecnologias: React, Typescript e Sass. Com React, criei componentes reutilizáveis que usam os hooks useState e useEffect para gerenciar o estado e os efeitos colaterais. Com Typescript, eu defini interfaces para os tipos de dados, fiz conversão deles e evitei conflitos de tipagem. Com Sass, eu estilizei os componentes com variáveis e a adaptação com Media Queries.',
                enUS: 'This is a project that uses the following technologies: React, Typescript and Sass. With React, I created reusable components that use the useState and useEffect hooks to manage state and side effects. With Typescript, I defined interfaces for the data types, converted them and avoided typing conflicts. With Sass, I styled the components with variables and the adaptation with Media Queries.'
            })
        },
    ]

    const list = projectsList;

    return (
        <>
            <Loader selector="#projetos" />
            <ProjectLayout list={list} />
        </>
    );
}
