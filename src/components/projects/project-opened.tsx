import { projectInterface } from '@/data/projects-data';
import Image from 'next/image';
import { MouseEventHandler, useEffect, useState } from 'react';
import { Button } from '../buttons';
import { ProjectInfo } from './project-layout-info';

interface iOpenedProject {
  theme: string;
  list: projectInterface[];
  project: string;
  language: string;
  onBack: MouseEventHandler<HTMLButtonElement>;
}

export const OpenedProject = ({ theme, list, project, language, onBack }: iOpenedProject) => {
  const selectedProject = list.find(item => item.src === project);
  const [imagePath, setImagePath] = useState(`/images/project_${project}.png`);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const checkImage = async () => {
      try {
        const response = await fetch(`/images/project_${project}-full.png`);
        if (response.ok) {
          setImagePath(`/images/project_${project}-full.png`);
        }
      } catch (error) {
        setImagePath(`/images/project_${project}.png`);
      }
    };

    checkImage();
  }, [project]);

  if (!selectedProject) {
    return null;
  }

  return (
    <div>
      <article className='slideBottom flex flex-col gap-5 items-center px-5 relative'>

        <ProjectInfo project={selectedProject} variant='full' />

        <span className='flex gap-10 mt-10'>
          <Button text={language === 'pt-BR' ? 'Site' : 'Page'} index={0} theme={theme} onClick={() => window.open(selectedProject.site, '_blank')} />
          <Button text={language === 'pt-BR' ? 'Repositório' : 'Repository'} index={1} theme={theme} onClick={() => window.open(selectedProject.repo, '_blank')} />
        </span>

        <div className={`${theme === 'dark' && 'text-white'} flex flex-col pb-10 max-w-[1500px] gap-10 items-center`}>
          <h2 className='self-start lg:self-center text-2xl font-semibold uppercase mt-8'>
            {language === 'pt-BR' ? 'Sobre' : 'About'}
          </h2>

          <p className="content-animation max-sm:leading-tight lg:text-xl text-justify lg:w-2/3 2xl:w-full">{selectedProject.abt}</p>

          <Button text={`${language === 'pt-BR' ? 'Voltar' : 'Return'}`} index={2} theme={theme} onClick={onBack} />

        </div>

        <div className='flex items-center justify-center rounded-lg overflow-hidden'>
          <Image src={imagePath} alt={selectedProject.abt} width={1500} height={1000} className='relative z-10 hover:cursor-pointer' 
          onClick={() => window.open(selectedProject.site, '_blank')}/>
        </div>

      </article>
    </div>
  );
};