import { projectInterface } from './projects-list';
import { ProjectInfo } from './project-layout-info';

export const ProjectLayout = ({ list }: { list: projectInterface[] }) => {

    return (
        <section className="slideBottom grid grid-cols-1 xl:grid-cols-2 4k:grid-cols-3 gap-4 px-4">
            {list.map((project, index) => (
                <figure key={index} className="figure relative">

                    <img src={`/images/project_${project.src}.png`} alt={project.alt} className="z-1 h-full object-cover" />

                    <figcaption className="figcaption absolute inset-0 z-2 flex flex-col items-center justify-end px-2 sm:px-10 py-7 text-white max-sm:text-[80%]">
                        <ProjectInfo project={project} />
                    </figcaption>
                </figure>
            ))}
        </section>
    );
};
