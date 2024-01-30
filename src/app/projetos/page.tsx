import { ProjectLayout } from "@/components/projects/project-layout";

export interface projectInterface {
    name: string,
    alt: string,
    abt: string
}

const projectsList = [
    {
        ptBR: [
            {
                name: `space-tourism`,
                alt: `Site sobre um turismo no espaço`,
                abt: `Este projeto é uma aplicação web que apresenta informações sobre uma missão espacial. Utilizando o React e o Tailwind CSS, ele oferece uma interface do usuário moderna e responsiva. Possui recursos avançados do React, como os Hooks, para gerenciar o estado e os efeitos colaterais. Além disso, utiliza técnicas de otimização, como a pré-renderização de imagens, para garantir um carregamento rápido e uma experiência fluida. O código segue boas práticas de organização e estruturação, tornando-o fácil de entender e dar manutenção.`
            },
            {
                name: `negociacoes`,
                alt: `Aplicação web typescript`,
                abt: `Este é um projeto que consome uma API externa e aplica as boas práticas do Typescript. Ele garante a qualidade do código durante a compilação, não permite a geração de código com erros, usa typagem estática e orientação a objeto. Ele também utiliza decorators para adicionar funcionalidades extras às classes, métodos e propriedades. Além disso, ele trata os possíveis erros da API com um micro framework que facilita o gerenciamento de rotas, requisições e respostas.`
            },
            {
                name: `serenatto-cafe`,
                alt: `Site de uma cafeteria`,
                abt: `Este projeto é uma aplicação web que apresenta informações sobre uma missão espacial. Utilizando o React e o Tailwind CSS, ele oferece uma interface do usuário moderna e responsiva. Possui recursos avançados do React, como os Hooks, para gerenciar o estado e os efeitos colaterais. Além disso, utiliza técnicas de otimização, como a pré-renderização de imagens, para garantir um carregamento rápido e uma experiência fluida. O código segue boas práticas de organização e estruturação, tornando-o fácil de entender e dar manutenção.`
            },
            {
                name: `sincronario`,
                alt: `Site sobre um turismo no espaço`,
                abt: `Este projeto é uma aplicação web que apresenta informações sobre uma missão espacial. Utilizando o React e o Tailwind CSS, ele oferece uma interface do usuário moderna e responsiva. Possui recursos avançados do React, como os Hooks, para gerenciar o estado e os efeitos colaterais. Além disso, utiliza técnicas de otimização, como a pré-renderização de imagens, para garantir um carregamento rápido e uma experiência fluida. O código segue boas práticas de organização e estruturação, tornando-o fácil de entender e dar manutenção.`
            },
            {
                name: `codechella`,
                alt: `Site sobre modelo de negociação`,
                abt: `Este é um projeto que consome uma API externa e aplica as boas práticas do Typescript. Ele garante a qualidade do código durante a compilação, não permite a geração de código com erros, usa typagem estática e orientação a objeto. Ele também utiliza decorators para adicionar funcionalidades extras às classes, métodos e propriedades. Além disso, ele trata os possíveis erros da API com um micro framework que facilita o gerenciamento de rotas, requisições e respostas.`
            },
            {
                name: `stopwatch`,
                alt: `Site sobre modelo de negociação`,
                abt: `Este é um projeto que consome uma API externa e aplica as boas práticas do Typescript. Ele garante a qualidade do código durante a compilação, não permite a geração de código com erros, usa typagem estática e orientação a objeto. Ele também utiliza decorators para adicionar funcionalidades extras às classes, métodos e propriedades. Além disso, ele trata os possíveis erros da API com um micro framework que facilita o gerenciamento de rotas, requisições e respostas.`
            },
        ]
    }
];

export default function Projetos() {

    const list = projectsList[0].ptBR;

    return (
        <>
            <ProjectLayout list={list} />
        </>
    );
}
