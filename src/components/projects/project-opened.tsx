import Image from 'next/image';
import { projectInterface } from './projects-list';
import { MouseEventHandler } from 'react';

interface iOpenedProject {
  list: projectInterface[];
  project: string;
  language: string;
  onBack: MouseEventHandler<HTMLButtonElement>;
}

export const OpenedProject = ({ list, project, language, onBack }: iOpenedProject) => {
  const selectedProject = list.find(item => item.src === project);

  if (!selectedProject) {
    return null;
  }

  return (
    <div className='flex flex-col gap-5'>
      <Image src={`/images/project_${selectedProject.src}.png`} alt={selectedProject.abt} width={1000} height={500} />

      <span>
        <button
          onClick={() => window.open(selectedProject.site, '_blank')}
          className="sm:text-lg invert-color-hover sm:h-[50px] px-2 sm:px-5 rounded-full bg-white text-black">
          <p className="content-animation">
            {language === 'pt-BR' ? 'Site' : 'Page'}
          </p>
        </button>
        <button
          onClick={() => window.open(selectedProject.repo, '_blank')}
          className="sm:text-lg invert-color-hover sm:h-[50px] px-2 sm:px-10 rounded-full bg-white text-black">
          <p className="content-animation">
            {language === 'pt-BR' ? 'Repositório' : 'Repository'}
          </p>
        </button>
      </span>

      <p className='text-azul-claro z-20 hover:cursor-pointer flex gap-5 items-center rounded-lg p-2'>
        {language === 'pt-BR' ? 'Detalhes' : 'Details'}
      </p>
      <div className='flex flex-col'>
        <Image src='/images/icon-down-arrow.png' className={`invert-color m-auto`} alt='seta para baixo' width={20} height={20} />
        <p className="max-sm:leading-tight lg:text-xl z-10 text-justify">{selectedProject.abt}</p>
      </div>
      <button onClick={onBack}>Voltar</button>
    </div>
  );
};
