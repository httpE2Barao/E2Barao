import { projectInterface } from "@/app/Projetos/page";

export const ProjectLayout = ({ list }: { list: projectInterface[] }) => {
    return (
        <section className="grid grid-cols-2 gap-4 px-4">
            {list.map((project, index) => (
                <figure key={index} className="figure relative">
                    <img src={`/images/project_${project.src}.png`} alt={project.alt} className="z-1" />
                    <figcaption className="figcaption absolute inset-0 z-2 flex flex-col items-center justify-end text-xl px-10 py-7 text-white">
                        <span className="uppercase z-10 flex flex-row items-center gap-20 font-bold tracking-wider">
                            
                            <button 
                            onClick={() => window.open(project.site, '_blank')}
                            className="h-[50px] px-10 rounded bg-azul-claro hover:bg-white text-black">
                                ver site
                            </button>

                            <h3 className="text-3xl my-10 text-azul-claro">
                                {project.name}
                            </h3>

                            <button 
                            onClick={() => window.open(project.repo, '_blank')}
                            className="h-[50px] px-10 rounded bg-azul-claro hover:bg-white text-black">
                                repositório
                            </button>

                        </span>
                        <p className="z-10 text-justify">{project.abt}</p>
                    </figcaption>
                </figure>
            ))}
        </section>
    );
};

