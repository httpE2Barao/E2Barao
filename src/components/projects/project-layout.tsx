import { projectInterface } from "@/app/projetos/page";
import Image from "next/image";

export const ProjectLayout = ({ list }: { list: projectInterface[] }) => {
    return (
        <section className="grid grid-cols-4 gap-4 px-4">

            { list.map((project, index) => (
                <div key={index} className={`${index < 2 ? 'col-span-2' : 'col-span-1'}`}>
                    <Image src={`/images/project_${project.name}.png`} alt={`${project.alt}`} width={650} height={550} />
                </div>
            ))}

        </section>
    );
};
