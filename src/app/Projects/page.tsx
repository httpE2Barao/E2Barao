"use client"
import { Loader } from "@/components/projects/project-loader";
import { ProjectLayout } from "@/components/projects/project-layout";
import { projectInterface, projectsList } from "@/components/projects/projects-list";
import { useTheme } from "@/components/switchers/switchers";
import { OpenedProject } from "@/components/projects/project-opened";

export default function Projetos() {
    const {language} = useTheme()
    const list:projectInterface[] = projectsList(language);

    return (
        <>
            <Loader selector="#projetos" />
            <ProjectLayout list={list} />
            <OpenedProject list={list} />
        </>
    );
}
