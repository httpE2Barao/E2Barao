"use client";

interface CVData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  language: string;
  experience: Array<{ role: string; company: string; period: string; description: string }>;
  education: Array<{ degree: string; school: string; period: string; description: string }>;
  skills: string[];
  projects: Array<{ name: string; description: string }>;
  languages: string[];
  additionalInfo: string;
  additionalData: {
    willingnessToTravel: string;
    willingnessToRelocate: string;
    driverLicense: string;
    vehicleType: string;
  };
  includeExperience: boolean;
  includeEducation: boolean;
  includeSkills: boolean;
  includeProjects: boolean;
  includeLanguages: boolean;
}

export function CombinationPreview({ data }: { data: CVData }) {
  const lang = data.language || "pt";
  const t = {
    professionalSummary: lang === "pt" ? "Resumo Profissional" : lang === "en" ? "Professional Summary" : "Resumen Profesional",
    coreSkills: lang === "pt" ? "Habilidades Principais" : lang === "en" ? "Core Skills" : "Habilidades Principales",
    experience: lang === "pt" ? "Experiência Profissional" : lang === "en" ? "Work Experience" : "Experiencia Laboral",
    education: lang === "pt" ? "Educação" : lang === "en" ? "Education" : "Educación",
    projects: lang === "pt" ? "Projetos" : lang === "en" ? "Projects" : "Proyectos",
    languages: lang === "pt" ? "Idiomas" : lang === "en" ? "Languages" : "Idiomas",
    additionalData: lang === "pt" ? "Dados Complementares" : lang === "en" ? "Additional Data" : "Datos Adicionales",
    willingnessToTravel: lang === "pt" ? "Disponibilidade para viajar" : lang === "en" ? "Willingness to travel" : "Disponibilidad para viajar",
    willingnessToRelocate: lang === "pt" ? "Disponibilidade para mudar de residência" : lang === "en" ? "Willingness to relocate" : "Disponibilidad para mudarse",
    driverLicense: lang === "pt" ? "Carteira de Habilitação" : lang === "en" ? "Driver's License" : "Licencia de Conducir",
    vehicle: lang === "pt" ? "Veículo" : lang === "en" ? "Vehicle" : "Vehículo",
    linkedinLabel: "LinkedIn",
    githubLabel: "GitHub",
  };

  return (
    <div className="bg-white text-gray-900 p-8 text-[10px] leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="mb-4 pb-3 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">{data.name}</h1>
        <p className="text-[11px] text-gray-500 mb-2">{data.title}</p>
        <div className="flex flex-wrap gap-3 text-[9px] text-gray-600">
          {data.email && <a href={`mailto:${data.email}`} className="text-blue-600 hover:underline">{data.email}</a>}
          {data.phone && <a href={`tel:${data.phone}`} className="text-blue-600 hover:underline">{data.phone}</a>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{t.linkedinLabel}</a>}
          {data.github && <a href={data.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{t.githubLabel}</a>}
          <a href="https://e2-barao.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Portfolio</a>
        </div>
      </div>

      {data.summary && (
        <div className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b border-gray-200">{t.professionalSummary}</h2>
          <p className="text-[10px] text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b border-gray-200">{t.coreSkills}</h2>
        <div className="flex flex-wrap gap-1">
          {data.skills.map((skill, i) => (
            <span key={i} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[9px]">{skill}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b border-gray-200">{t.experience}</h2>
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[11px] text-gray-800">{exp.role}</span>
                <span className="text-[9px] text-gray-500">{exp.period}</span>
              </div>
              <p className="text-[10px] text-gray-600 italic">{exp.company}</p>
              <p className="text-[9px] text-gray-700 mt-1 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b border-gray-200">{t.education}</h2>
          {data.education.map((edu, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[11px] text-gray-800">{edu.degree}</span>
                <span className="text-[9px] text-gray-500">{edu.period}</span>
              </div>
              <p className="text-[10px] text-gray-600 italic">{edu.school}</p>
              {edu.description && <p className="text-[9px] text-gray-700 mt-1">{edu.description}</p>}
            </div>
          ))}

          {data.projects.length > 0 && (
            <div className="mt-4">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b border-gray-200">{t.projects}</h2>
              {data.projects.slice(0, 3).map((project, i) => (
                <div key={i} className="mb-2">
                  <p className="text-[10px] font-semibold text-gray-800">{project.name}</p>
                  <p className="text-[8px] text-gray-600 leading-relaxed">{project.description}</p>
                </div>
              ))}
            </div>
          )}

          {data.languages.length > 0 && (
            <div className="mt-4">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b border-gray-200">{t.languages}</h2>
              <p className="text-[10px] text-gray-700">{data.languages.join(" • ")}</p>
            </div>
          )}

          {(data.additionalData?.willingnessToTravel || data.additionalData?.willingnessToRelocate || data.additionalData?.driverLicense || data.additionalData?.vehicleType) && (
            <div className="mt-4">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b border-gray-200">{t.additionalData}</h2>
              <div className="text-[9px] text-gray-700 space-y-0.5">
                {data.additionalData.willingnessToTravel && <p>• {t.willingnessToTravel}: {data.additionalData.willingnessToTravel}</p>}
                {data.additionalData.willingnessToRelocate && <p>• {t.willingnessToRelocate}: {data.additionalData.willingnessToRelocate}</p>}
                {data.additionalData.driverLicense && <p>• {t.driverLicense}: {data.additionalData.driverLicense}</p>}
                {data.additionalData.vehicleType && <p>• {t.vehicle}: {data.additionalData.vehicleType}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
