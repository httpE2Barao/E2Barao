"use client"
import React, { useEffect } from "react";
import { OpenedProject } from "@/components/projects/project-opened";
import { useTheme } from "@/components/switchers/switchers";
import { projectsList } from "@/components/projects/projects-list";
import { ProjectLayout } from "@/components/projects/project-layout";

export default function Projetos() {
    const { theme, language, isProjectOpened, currentProject, handleBack } = useTheme();
    const list = projectsList(language);

    return (
        <>
            {isProjectOpened === false && <ProjectLayout list={list} />}
            {isProjectOpened === true && (
                <OpenedProject
                    theme={theme}
                    list={list}
                    project={currentProject}
                    language={language}
                    onBack={handleBack}
                />
            )}
        </>
    );
}
