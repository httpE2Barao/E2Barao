import Image from "next/image";
import { projectInterface } from "./projects-list";
import { useTheme } from "../switchers/switchers";

interface ProjectInfoProps {
  project: projectInterface;
  changeTheme?: boolean;
}

export const ProjectInfo = ({ project, changeTheme }: ProjectInfoProps) => {
  const { theme, changeProject } = useTheme();

  return (
    <>
      <div className="uppercase z-10 flex flex-col items-center gap-5 font-bold max-md:tracking-wider">
        <h3
          className={`${changeTheme?'text-5xl hover:cursor-default':'hover:cursor-pointer'} 
          font-bold text-shadow my-10 p-2 rounded bg-azul-pastel text-black text-3xl max-sm:text-xl md:text-4xl`}
          onClick={() => changeProject(project.src)}>
          {project.name}
        </h3>
      </div>

      <div className="flex">
        <span className="flex flex-row gap-5">
          {project.tags &&
            Array.isArray(project.tags) &&
            project.tags.map((tag, index) => (
              <div key={index}>
                <Image
                  alt={`tecnology: ${tag}`}
                  src={`/images/img-${tag}.png`}
                  width={50}
                  height={50}
                  className={`max-sm:w-10 2xl:w-10 
                  ${changeTheme && theme === "light" && "invert-color"}
                  ${changeTheme && '4k:w-16'}
                  `}
                />
              </div>
            ))}
        </span>
      </div>
    </>
  );
};
