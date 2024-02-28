"use client"
import React from "react";
import { OpenedProject } from "@/components/projects/project-opened";
import { useTheme } from "@/components/switchers/switchers";
import { projectsList } from "@/components/projects/projects-list";
import { ProjectLayout } from "@/components/projects/project-layout";

export default function Projetos() {
    const { language, isProjectOpened, currentProject, handleBack } = useTheme();
    const list = projectsList(language);

    return (
        <>
            {isProjectOpened === false && <ProjectLayout list={list} />}
            {isProjectOpened === true && (
                <OpenedProject
                    list={list}
                    project={currentProject}
                    language={language}
                    onBack={handleBack}
                />
            )}
        </>
    );
}
