import Image from "next/image";
import { projectInterface } from "./projects-list";
import { useTheme } from "../switchers/switchers";

export const ProjectInfo = ({ project }: { project:projectInterface }) => {

  const {changeProject} = useTheme();

  return (
    <>
      <div className="uppercase z-10 flex flex-col items-center gap-5 font-bold max-md:tracking-wider">
        <h3 className="font-bold text-shadow my-10 p-2 rounded bg-azul-pastel text-black hover:cursor-pointer text-3xl max-sm:text-xl md:text-4xl 4k:text-3xl"
        onClick={() => changeProject(project.src)}>
          {project.name}
        </h3>
      </div>

      <div className='flex'>
        <span className='flex flex-row gap-5'>
          {project.tags && Array.isArray(project.tags) && project.tags.map((tag, index) => {
            return (
              <div key={index}>
                <Image alt={`tecnology: ${tag}`} src={`/images/img-${tag}.png`} width={50} height={50} className='max-sm:w-10 2xl:w-10' />
              </div>
            )
          })}
        </span>
      </div>
    </>
  )
}
