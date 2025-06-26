import { projectInterface } from '@/data/projects-data';
import { ProjectInfo } from './project-layout-info';
import { motion } from 'framer-motion';
import Image from 'next/image';

const ProjectLayout = ({ list }: { list: projectInterface[] }) => {
    return (
        // A linha abaixo foi ajustada para xl:grid-cols-3
        <section className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3 p-6">
            {list.map((project, index) => (
                <motion.figure
                    key={index}
                    className="group relative overflow-hidden rounded-xl bg-gray-900 aspect-video"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Image
                        src={`/images/project_${project.src}.png`}
                        alt={project.alt}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:opacity-30"
                        width={500}
                        height={300}
                    />
                    
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ProjectInfo project={project} variant="preview" />
                    </div>
                </motion.figure>
            ))}
        </section>
    );
};

export default ProjectLayout;