import { useState } from "react"

export const UseSelectedProject = () => {
  const [selectedProject, setSelectedProject] = useState()

  const changeProject = (props: any) => {
    setSelectedProject(props)
  }

  return {selectedProject, setSelectedProject}
}