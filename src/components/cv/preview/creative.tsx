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
  objective: string;
  language: string;
  experience: Array<{ role: string; company: string; period: string; description: string }>;
  education: Array<{ degree: string; school: string; period: string; description: string; type?: string }>;
  skills: string[];
  projects: Array<{ name: string; description: string; tags?: string[] }>;
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

export function CreativePreview({ data }: { data: CVData }) {
  const lang = data.language || "pt";
  const t = {
    objective: lang === "pt" ? "Objetivo" : lang === "en" ? "Objective" : "Objetivo",
    graduation: lang === "pt" ? "Educação (Graduação)" : lang === "en" ? "Education (Graduation)" : "Educación (Graduación)",
    complementaryCourses: lang === "pt" ? "Cursos Complementares" : lang === "en" ? "Complementary Courses" : "Cursos Complementarios",
    contact: lang === "pt" ? "Contato" : lang === "en" ? "Contact" : "Contacto",
    skills: lang === "pt" ? "Habilidades" : lang === "en" ? "Skills" : "Habilidades",
    languages: lang === "pt" ? "Idiomas" : lang === "en" ? "Languages" : "Idiomas",
    profile: lang === "pt" ? "Perfil" : lang === "en" ? "Profile" : "Perfil",
    experience: lang === "pt" ? "Experiência Profissional" : lang === "en" ? "Work Experience" : "Experiencia Laboral",
    education: lang === "pt" ? "Educação" : lang === "en" ? "Education" : "Educación",
    keyProjects: lang === "pt" ? "Projetos Principais" : lang === "en" ? "Key Projects" : "Proyectos Principales",
    additionalData: lang === "pt" ? "Complementares" : lang === "en" ? "Additional Data" : "Complementarios",
    willingnessToTravel: lang === "pt" ? "Viajar" : lang === "en" ? "Travel" : "Viajar",
    willingnessToRelocate: lang === "pt" ? "Mudar residência" : lang === "en" ? "Relocate" : "Mudarse",
    driverLicense: lang === "pt" ? "CNH" : lang === "en" ? "License" : "Licencia",
    vehicle: lang === "pt" ? "Veículo" : lang === "en" ? "Vehicle" : "Vehículo",
    linkedinLabel: "LinkedIn",
    githubLabel: "GitHub",
  };

  return (
    <div className="bg-white flex text-[10px]" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="w-44 bg-slate-800 text-slate-200 p-5 flex-shrink-0">
        <h1 className="text-lg font-bold text-white mb-1">{data.name}</h1>
        <p className="text-[10px] text-amber-400 mb-4">{data.title}</p>

        {data.summary && (
          <div className="mb-5">
            <p className="text-[8.5px] text-slate-300 leading-relaxed">{data.summary}</p>
          </div>
        )}

        {data.objective && (
          <div className="mb-5">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-2 pb-1 border-b border-amber-400">{t.objective}</h3>
            <p className="text-[8.5px] text-slate-300 leading-relaxed">{data.objective}</p>
          </div>
        )}

        <div className="mb-5">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-2 pb-1 border-b border-amber-400">{t.contact}</h3>
          {data.email && <a href={`mailto:${data.email}`} className="text-[9px] text-amber-400 hover:underline block mb-1">{data.email}</a>}
          {data.phone && <a href={`tel:${data.phone}`} className="text-[9px] text-amber-400 hover:underline block mb-1">{data.phone}</a>}
          {data.location && <p className="text-[9px] text-slate-300 mb-1">{data.location}</p>}
          {data.linkedin && <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-[9px] text-amber-400 hover:underline block mb-1">{t.linkedinLabel}</a>}
          {data.github && <a href={data.github} target="_blank" rel="noopener noreferrer" className="text-[9px] text-amber-400 hover:underline block mb-1">{t.githubLabel}</a>}
          <a href="https://e2-barao.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-[9px] text-amber-400 hover:underline block mb-1">Portfolio</a>
        </div>

        {data.languages.length > 0 && (
          <div className="mb-5">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-2 pb-1 border-b border-amber-400">{t.languages}</h3>
            {data.languages.map((langItem, i) => (
              <p key={i} className="text-[9px] text-slate-300 mb-0.5">{langItem}</p>
            ))}
          </div>
        )}

        {data.education.length > 0 && (
          <div className="mb-5">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-2 pb-1 border-b border-amber-400">{t.education}</h3>
            {(() => {
              const graduations = data.education.filter(e => e.type === "graduation");
              const courses = data.education.filter(e => e.type !== "graduation");
              return (
                <>
                  {graduations.length > 0 && (
                    <div className="mb-2">
                      <p className="text-[8px] font-semibold text-amber-400 mb-1">{t.graduation}</p>
                      {graduations.map((edu, i) => (
                        <div key={i} className="mb-2">
                          <p className="text-[9px] font-semibold text-white">{edu.degree}</p>
                          <p className="text-[9px] text-slate-300">{edu.school}</p>
                          <p className="text-[8px] text-slate-400">{edu.period}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {courses.length > 0 && (
                    <div>
                      <p className="text-[8px] font-semibold text-amber-400 mb-1">{t.complementaryCourses}</p>
                      {courses.map((edu, i) => (
                        <div key={i} className="mb-2">
                          <p className="text-[9px] font-semibold text-white">{edu.degree}</p>
                          <p className="text-[9px] text-slate-300">{edu.school}</p>
                          <p className="text-[8px] text-slate-400">{edu.period}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {(data.additionalData?.willingnessToTravel || data.additionalData?.willingnessToRelocate || data.additionalData?.driverLicense || data.additionalData?.vehicleType) && (
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-2 pb-1 border-b border-amber-400">{t.additionalData}</h3>
            <div className="text-[8.5px] text-slate-300 space-y-0.5">
              {data.additionalData.willingnessToTravel && <p>• {t.willingnessToTravel}: {data.additionalData.willingnessToTravel}</p>}
              {data.additionalData.willingnessToRelocate && <p>• {t.willingnessToRelocate}: {data.additionalData.willingnessToRelocate}</p>}
              {data.additionalData.driverLicense && <p>• {t.driverLicense}: {data.additionalData.driverLicense}</p>}
              {data.additionalData.vehicleType && <p>• {t.vehicle}: {data.additionalData.vehicleType}</p>}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 p-6 text-gray-900">
        <div className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-3 pb-1 border-b-2 border-amber-400">{t.experience}</h2>
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

        {data.projects.length > 0 && (
          <div className="mb-4">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-3 pb-1 border-b-2 border-amber-400">{t.keyProjects}</h2>
            {data.projects.slice(0, 4).map((project, i) => (
              <div key={i} className="mb-2">
                <p className="text-[10px] font-semibold text-gray-800">{project.name}</p>
                <p className="text-[9px] text-gray-600 leading-relaxed">{project.description}</p>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.tags.map((tag, j) => (
                      <span key={j} className="text-[7px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {data.includeSkills && data.skills.length > 0 && (
          <div className="mb-4">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-3 pb-1 border-b-2 border-amber-400">{t.skills}</h2>
            <div className="flex flex-wrap gap-1">
              {data.skills.map((skill, i) => (
                <span key={i} className="text-[8px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded">{skill}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
