import { projectInterface } from "@/data/projects-data";
import Image from "next/image";
import { useTheme } from "../switchers/switchers";
import { PhraseSection } from "../phrase-section";

interface ProjectInfoProps {
  project: projectInterface;
  variant: 'preview' | 'full';
}

export const ProjectInfo = ({ project, variant }: ProjectInfoProps) => {
  const { theme, changeProject } = useTheme();

  if (variant === 'preview') {
    return (
      <div className="w-full h-full flex flex-col justify-end p-4 md:p-6 items-center text-center"
      onClick={() => changeProject(project.src)}>
        {/*
          AJUSTE FINAL DA FONTE: Tamanhos com mais impacto para cada layout.
          - Padrão (1 coluna): text-3xl (30px)
          - lg (2 colunas):    text-2xl (24px)
          - 2xl (3 colunas):   text-xl (20px)
        */}
        <h3 className="text-3xl lg:text-2xl 2xl:text-xl font-bold mb-3 text-white hover:text-azul-pastel transition-colors cursor-pointer">
          {project.name}
        </h3>

        <div className="flex flex-wrap gap-2 justify-center">
          {Array.isArray(project.tags) && project.tags.map((tag, index) => (
            <div key={index} className="group relative">
              <Image
                alt={`${tag}`}
                src={`/images/img-${tag}.png`}
                width={32}
                height={32}
                /*
                  Ícones com leve ajuste para equilibrar com a nova fonte.
                  - Padrão e lg: w-8 (32px)
                  - 2xl: w-7 (28px)
                */
                className={`
                  w-8 h-8 2xl:w-7 2xl:h-7
                  filter grayscale hover:grayscale-0 transition-all rounded-md
                  ${theme === "light" && "invert-color"}
                `}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Variante 'full' sem alterações
  return (
    <>
      <div className="uppercase z-10 flex flex-col items-center gap-5 font-bold max-md:tracking-wider">
        <PhraseSection phrase={`${project.name}`} />
      </div>

      <div className="flex">
        <span className="flex flex-row gap-3 md:gap-5">
          {Array.isArray(project.tags) && project.tags.map((tag, index) => (
            <div 
              key={index} 
              className="p-1 bg-white rounded group relative"
              title={tag.charAt(0).toUpperCase() + tag.slice(1)}
            >
              <Image
                alt={`${tag}`}
                src={`/images/img-${tag}.png`}
                width={48}
                height={48}
                className={`
                  w-8 h-8 md:w-10 md:h-10
                  filter grayscale contrast-200
                  ${theme === "light" && "invert-color"}
                `}
              />
              <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </span>
            </div>
          ))}
        </span>
      </div>
    </>
  );
};