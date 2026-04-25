import { projectInterface } from '@/data/projects-data';
import Image from 'next/image';
import { MouseEventHandler, useEffect, useState } from 'react';
import { Button } from '../buttons';
import { ProjectInfo } from './project-layout-info';
import { projectUITranslations } from '@/data/translations/projects';

const hasGifOrVideo = (path: string) => {
  const lower = path.toLowerCase();
  return lower.endsWith('.gif') || lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov')
}

const hasVideo = (path: string) => {
  const lower = path.toLowerCase()
  return lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov')
}

interface iOpenedProject {
  theme: string;
  list: projectInterface[];
  project: string;
  language: string;
  onBack: MouseEventHandler<HTMLButtonElement>;
}

export const OpenedProject = ({ theme, list, project, language, onBack }: iOpenedProject) => {
  const selectedProject = list.find(item => item.src === project);
  
  const [mediaPath, setMediaPath] = useState(`/images/project_${project}.png`);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const checkMedia = async () => {
      const extensions = ['-full.png', '-full.gif', '-full.mp4', '-full.webm', '-full.mov', '.png', '.gif', '.mp4', '.webm', '.mov'];
      for (const ext of extensions) {
        try {
          const response = await fetch(`/images/project_${project}${ext}`);
          if (response.ok) {
            setMediaPath(`/images/project_${project}${ext}`);
            return;
          }
        } catch {}
      }
      setMediaPath(`/images/project_${project}.png`);
    };
    checkMedia();
  }, [project]);

  if (!selectedProject) {
    return null;
  }

  const lang = language as keyof typeof projectUITranslations.aboutTitle;
  const t = (key: keyof typeof projectUITranslations) => {
    return projectUITranslations[key][lang] || projectUITranslations[key].en;
  };

  return (
    <div>
      <article className='slideBottom flex flex-col gap-5 items-center px-5 relative'>
        <ProjectInfo project={selectedProject} variant='full' />

        <span className='flex gap-10 mt-10'>
          {selectedProject.site && <Button text={t('pageButton')} index={0} theme={theme} onClick={() => window.open(selectedProject.site, '_blank')} />}
          {selectedProject.repo && <Button text={t('repoButton')} index={1} theme={theme} onClick={() => window.open(selectedProject.repo, '_blank')} />}
        </span>

        <div className={`${theme === 'dark' ? 'text-white' : ''} flex flex-col pb-10 max-w-[1500px] gap-10 items-center`}>
          <h2 className='self-start lg:self-center text-2xl font-semibold uppercase mt-8'>
            {t('aboutTitle')}
          </h2>

          <p className="content-animation max-sm:leading-tight lg:text-xl text-justify lg:w-2/3 2xl:w-full">{selectedProject.abt}</p>

          <Button text={t('returnButton')} index={2} theme={theme} onClick={onBack} />
        </div>

        <div className='flex items-center justify-center rounded-lg overflow-hidden'>
          {hasGifOrVideo(mediaPath) ? (
            hasVideo(mediaPath) ? (
              <video
                src={mediaPath}
                className="max-w-full h-auto"
                autoPlay
                loop
                muted
                playsInline
                controls
              />
            ) : (
              <img src={mediaPath} alt={selectedProject.alt} className="max-w-full h-auto" />
            )
          ) : (
            <Image 
              src={mediaPath} 
              alt={selectedProject.alt} 
              width={1500} 
              height={1000} 
              className='relative z-10 hover:cursor-pointer' 
              onClick={() => selectedProject.site && window.open(selectedProject.site, '_blank')}
            />
          )}
        </div>
      </article>
    </div>
  );
};