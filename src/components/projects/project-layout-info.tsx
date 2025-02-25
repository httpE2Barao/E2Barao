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
      <div className="w-full h-full flex flex-col justify-end p-6 items-center"
      onClick={() => changeProject(project.src)}>
        <h3 className="text-3xl font-bold mb-4 text-white hover:text-azul-pastel transition-colors cursor-pointer">
          {project.name}
        </h3>

        <div className="flex flex-wrap gap-2">
          {Array.isArray(project.tags) && project.tags.map((tag, index) => (
            <div key={index} className="group relative">
              <Image
                alt={`${tag}`}
                src={`/images/img-${tag}.png`}
                width={40}
                height={40}
                className={`
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

  return (
    <>
      <div className="uppercase z-10 flex flex-col items-center gap-5 font-bold max-md:tracking-wider">
        <PhraseSection phrase={`${project.name}`} />
      </div>

      <div className="flex">
        <span className="flex flex-row gap-5">
          {Array.isArray(project.tags) && project.tags.map((tag, index) => (
            <div 
              key={index} 
              className="p-1 bg-white rounded group relative"
              title={tag.charAt(0).toUpperCase() + tag.slice(1)}
            >
              <Image
                alt={`${tag}`}
                src={`/images/img-${tag}.png`}
                width={50}
                height={50}
                className={`
                  max-w-[100px] min-w-[32px] w-[5vw]
                  max-sm:w-8 2xl:w-10 4k:w-12
                  filter grayscale contrast-200
                  ${theme === "light" && "invert-color"}
                `}
              />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </span>
            </div>
          ))}
        </span>
      </div>
    </>
  );
};
