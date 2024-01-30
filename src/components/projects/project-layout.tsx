import { projectInterface } from "@/app/Projetos/page";
import Image from "next/image";
import { useTheme } from "../switchers/switchers";

export const ProjectLayout = ({ list }: { list: projectInterface[] }) => {

    const { theme } = useTheme();

    return (
        <>
            {/* <h1 className={`${theme === 'dark' ? 'text-white' : 'text-black'}
            text-8xl mx-4 mt-8 mb-14 uppercase font-semibold`}
            >Projects</h1> */}

            <section className="grid grid-cols-2 gap-4 px-4">
                {list.map((project, index) => (
                    <>
                        <figure key={index} className={`figure relative`}>

                            <img src={`/images/project_${project.name}.png`} alt={`${project.alt}`}
                                className="z-1"
                            />

                            <figcaption className="figcaption absolute inset-0 z-2
                                flex flex-col items-center justify-end text-xl px-10 py-7 text-white
                            ">
                                <span className="uppercase z-10 flex flex-row items-center gap-20 font-bold">
                                    <button className="h-[50px] px-10 rounded bg-white hover:bg-azul-claro text-black tracking-wider
                                        ">ver site</button>
                                    <h3 className="text-3xl my-10">{project.name}</h3>
                                    <button className="h-[50px] px-10 rounded bg-white hover:bg-azul-claro text-black tracking-wider
                                        ">repositório</button>
                                </span>
                                <p className="z-10 text-justify">{project.abt}</p>
                            </figcaption>

                        </figure>
                    </>
                ))}
            </section>
        </>
    );
};
