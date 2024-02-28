"use client"
import { Loader } from "@/components/loader";
import { ProjectLayout } from "@/components/projects/project-layout";
import { projectsList } from "@/components/projects/projects-list";
import { useTheme } from "@/components/switchers/switchers";
import Link from "next/link";

export interface projectInterface {
    src: string,
    name: string,
    alt: string,
    abt: string,
    site: string,
    repo: string,
}

export default function Projetos() {
    const {language} = useTheme()
    const list: projectInterface[] = projectsList(language);

    return (
        <>
            <Loader selector="#projetos" />
            <ProjectLayout list={list} />
        </>
    );
}
