"use client"
import { useTheme } from "../switchers/switchers";
import ImagemIntroducao from "./intro-img"

const IntroConteiner = () => {
    const { theme } = useTheme();
    return (
        <article id="intro" className={`${theme=='dark'?'text-white':'text-black'} intro-conteiner flex flex-row max-lg:flex-col p-5`}>
            <ImagemIntroducao />
            <p className="p-10 self-center text-xl leading-relaxed max-lg:translate-y-20">
                Como um desenvolvedor front-end freelancer, ofereço soluções inovadoras e de alta qualidade para os meus clientes.
            </p>
        </article>
    )
}
export default IntroConteiner;