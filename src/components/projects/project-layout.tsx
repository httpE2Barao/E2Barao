import { useState } from 'react';
import { projectInterface } from './projects-list';
import Image from 'next/image';

export const ProjectLayout = ({ list }: { list: projectInterface[] }) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleExpand = (index: number) => {
        if (expandedIndex === index) {
            setExpandedIndex(null);
        } else {
            setExpandedIndex(index);
        }
    };

    return (
        <section id="projetos" className="slideBottom grid grid-cols-1 xl:grid-cols-2 4k:grid-cols-3 gap-4 px-4 ">
            {list.map((project, index) => (
                <figure key={index} className="figure relative" onClick={() => toggleExpand(index)}>

                    <img src={`/images/project_${project.src}.png`} alt={project.alt} className="z-1 h-full object-cover" />

                    <figcaption className="figcaption absolute inset-0 z-2 flex flex-col items-center justify-end px-2 sm:px-10 py-7 text-white max-sm:text-[80%]">
                        <div className="uppercase z-10 flex flex-col items-center gap-5 font-bold max-md:tracking-wider">
                            <h3 className="max-sm:text-base max-xl:text-4xl font-bold text-shadow my-10 p-2 rounded bg-azul-pastel text-black 4k:text-3xl hover:cursor-pointer">
                                {project.name}
                            </h3>
                        </div>

                        <div className='flex'>
                            <span className='flex flex-row gap-5'>
                                {project.tags && Array.isArray(project.tags) && project.tags.map((project, index) => {
                                    return (
                                        <div >
                                            <Image key={index} alt={`tecnology: ${project}`} src={`/images/img-${project}.png`} width={50} height={50} />
                                        </ div>
                                    )
                                })}
                            </span>
                        </div>
                    </figcaption>
                </figure>
            ))}
        </section>
    );
};
