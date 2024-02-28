"use client"
import Image from 'next/image';
import { projectInterface } from './projects-list';

export const OpenedProject = ({ list }: { list: projectInterface[] }) => {

  return (
    <></>
    // <span className='flex gap-5'>
    //   <button
    //     onClick={() => window.open(project.site, '_blank')}
    //     className="sm:text-lg invert-color-hover sm:h-[50px] px-2 sm:px-5 rounded-full bg-white text-black">
    //     <p className="content-animation">
    //       {language === 'pt-BR' ? 'Site' : 'Page'}
    //     </p>
    //   </button>
    //   <button
    //     onClick={() => window.open(project.repo, '_blank')}
    //     className="sm:text-lg invert-color-hover sm:h-[50px] px-2 sm:px-10 rounded-full bg-white text-black">
    //     <p className="content-animation">
    //       {language === 'pt-BR' ? 'Repositório' : 'Repository'}
    //     </p>
    //   </button>

    //   <p className='text-azul-claro z-20 hover:cursor-pointer flex gap-5 items-center rounded-lg p-2' >
    //     {language === 'pt-BR' ? 'Detalhes' : 'Details'}
    //   </p>
    //   {expandedIndex === index ? (
    //     <div className='flex flex-col'>
    //       <Image src={'/images/icon-down-arrow.png'} className={`invert-color m-auto`} alt='seta para baixo' width={20} height={20} />
    //       <p className="max-sm:leading-tight lg:text-xl z-10 text-justify">{project.abt}</p>
    //     </div>
    //   ) : (
    //     <Image src={'/images/icon-down-arrow.png'} className={`invert-color invert-img`} alt='seta para baixo' width={20} height={20} />
    //   )}
    // </span>
  )
}