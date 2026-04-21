"use client"
import { useEffect, useState } from "react";
import { useTheme } from "@/components/switchers/switchers";
import { projectInterface } from "@/data/projects-data";
import ProjectLayout from "@/components/projects/project-layout";
import { OpenedProject } from "@/components/projects/project-opened";
import { LoadingSpinner } from "@/components/LoadingSpinner";

// Helper: Função para buscar os dados da API.
// Definida fora do componente para clareza.
async function getProjects(language: string): Promise<projectInterface[]> {
  // Passa o idioma selecionado como um parâmetro de busca na URL
  const res = await fetch(`/api/projects?lang=${language}`, {
    cache: 'no-store' // Garante que os dados sejam sempre novos
  });

  if (!res.ok) {
    throw new Error('Falha ao buscar projetos do servidor');
  }
  
  return res.json();
}

// Componente principal da página
export default function Projetos() {
    const { theme, language, isProjectOpened, currentProject, handleBack } = useTheme();
    const [list, setList] = useState<projectInterface[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // useEffect para buscar os dados quando o componente montar ou o idioma mudar
    useEffect(() => {
      const loadProjects = async () => {
        setIsLoading(true); // Inicia o carregamento
        try {
          const projectsData = await getProjects(language);
          setList(projectsData);
          setError(null); // Limpa erros anteriores
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido');
        } finally {
          setIsLoading(false); // Finaliza o carregamento
        }
      };

      loadProjects();
    }, [language]); // Dependência: Roda novamente se o 'language' mudar

    // Renderiza o spinner durante o carregamento
    if (isLoading) {
      return <div className="mt-20"><LoadingSpinner /></div>;
    }

    // Renderiza uma mensagem de erro se a busca falhar
    if (error) {
      return <div className="text-center text-red-500 mt-20">Erro: {error}</div>;
    }

    // Renderiza o conteúdo da página
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