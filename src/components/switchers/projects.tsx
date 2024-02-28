"use client"
import { useState } from "react"

export const UseSelectedProject = () => {
  const [isProjectOpened, setIsProjectOpened] = useState(false);
  const [currentProject, setCurrentProject] = useState('seeAll')

  function changeProject(props: string) {
    setIsProjectOpened(true)
    setCurrentProject(props)
  }

  const handleBack = () => {
    setIsProjectOpened(false)
    setCurrentProject('seeAll')
  };

  return { isProjectOpened, currentProject, changeProject, handleBack }
}