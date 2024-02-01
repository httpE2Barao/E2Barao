import { projectInterface } from "@/app/Projects/page";
import { useTheme } from "../switchers/switchers";

export const ProjectLayout = ({ list }: { list: projectInterface[] }) => {

    const {language} = useTheme();

    return (
        <section id="projetos" className="slideBottom grid grid-cols-2 gap-4 px-4">
            {list.map((project, index) => (
                <figure key={index} className="figure relative">
                    <img src={`/images/project_${project.src}.png`} alt={project.alt} className="z-1" />
                    <figcaption className="figcaption absolute inset-0 z-2 flex flex-col items-center justify-end text-xl px-10 py-7 text-white">
                        <span className="uppercase z-10 flex flex-row items-center gap-10 font-bold tracking-wider">

                            <h3 className="text-3xl font-bold text-shadow my-10 p-2 rounded bg-azul-pastel text-black">
                                {project.name}
                            </h3>

                            <button
                                onClick={() => window.open(project.site, '_blank')}
                                className="icon-animation h-[50px] px-5 rounded-full bg-white text-black">
                                <p className="content-animation">
                                    {language=== 'pt-BR' ? 'Site' : 'Page'}
                                </p>
                            </button>

                            <button
                                onClick={() => window.open(project.repo, '_blank')}
                                className="icon-animation h-[50px] px-10 rounded-full bg-white text-black">
                                <p className="content-animation">
                                    {language=== 'pt-BR' ? 'Repositório' : 'Repository'}
                                </p>
                            </button>

                        </span>
                        <p className="z-10 text-justify">{project.abt}</p>
                    </figcaption>
                </figure>
            ))}
        </section>
    );
};

