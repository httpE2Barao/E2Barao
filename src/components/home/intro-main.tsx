"use client"
import { useTheme } from "../switchers/switchers";
import ImagemIntroducao from "./intro-img"

const IntroConteiner = () => {
    const { theme } = useTheme();
    return (
        <article id="intro" className={`${theme=='dark'?'text-white':'text-black'} intro-conteiner flex flex-row max-lg:flex-col p-5`}>
            <ImagemIntroducao />
            <p className="p-10 self-center text-xl leading-relaxed max-lg:translate-y-20">
                Como um desenvolvedor front-end freelancer, ofereço soluções inovadoras e de alta qualidade para os meus clientes. Minha paixão inabalável pela programação e design me impulsionam a criar experiências excepcionais para os usuários. Cada projeto é uma oportunidade para inovar. Busco constantemente maneiras criativas de resolver problemas e melhorar a experiência do usuário. Abaixo você pode selecionar e ver sobre as minhas experiências detalhadas sobre minha trajetória profissional e pessoal.
            </p>
        </article>
    )
}
export default IntroConteiner;