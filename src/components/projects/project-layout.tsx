"use client"
import { useState } from 'react';
import { projectInterface } from "@/app/Projects/page";
import { useTheme } from "../switchers/switchers";
import Image from 'next/image';

export const ProjectLayout = ({ list }: { list: projectInterface[] }) => {
    const { language } = useTheme();
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
                        <span className="uppercase z-10 flex flex-row items-center gap-10 font-bold max-md:tracking-wider">
                            <h3 className="max-sm:text-base max-xl:text-4xl font-bold text-shadow my-10 p-2 rounded bg-azul-pastel text-black 4k:text-3xl">
                                {project.name}
                            </h3>
                            <button
                                onClick={() => window.open(project.site, '_blank')}
                                className="sm:text-lg invert-color-hover sm:h-[50px] px-2 sm:px-5 rounded-full bg-white text-black">
                                <p className="content-animation">
                                    {language === 'pt-BR' ? 'Site' : 'Page'}
                                </p>
                            </button>
                            <button
                                onClick={() => window.open(project.repo, '_blank')}
                                className="sm:text-lg invert-color-hover sm:h-[50px] px-2 sm:px-10 rounded-full bg-white text-black">
                                <p className="content-animation">
                                    {language === 'pt-BR' ? 'Repositório' : 'Repository'}
                                </p>
                            </button>
                        </span>
                        <p className='text-azul-claro z-20 hover:cursor-pointer flex gap-5 items-center rounded-lg p-2' >
                            {language === 'pt-BR' ? 'Detalhes' : 'Details'}
                        </p>
                        {expandedIndex === index ? (
                            <div className='flex flex-col'>
                                <Image src={'/images/icon-down-arrow.png'} className={`invert-color m-auto`} alt='seta para baixo' width={20} height={20} />
                                <p className="max-sm:leading-tight lg:text-xl z-10 text-justify">{project.abt}</p>
                            </div>
                        ) : (
                            <Image src={'/images/icon-down-arrow.png'} className={`invert-color invert-img`} alt='seta para baixo' width={20} height={20} />
                        )}
                    </figcaption>
                </figure>
            ))}
        </section>
    );
};
