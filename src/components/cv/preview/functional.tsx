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

function categorizeSkills(skills: string[], lang: string) {
  const titles = {
    pt: { frontend: "Desenvolvimento Frontend", backend: "Backend & Banco de Dados", tools: "Ferramentas & Plataformas", concepts: "Conceitos & Práticas" },
    en: { frontend: "Frontend Development", backend: "Backend & Database", tools: "Tools & Platforms", concepts: "Concepts & Practices" },
    es: { frontend: "Desarrollo Frontend", backend: "Backend & Base de Datos", tools: "Herramientas & Plataformas", concepts: "Conceptos & Prácticas" },
  };
  const l = titles[lang as keyof typeof titles] || titles.pt;
  return [
    { title: l.frontend, skills: skills.filter((s) => /react|next|typescript|javascript|tailwind|html|css|sass/i.test(s)) },
    { title: l.backend, skills: skills.filter((s) => /node|python|php|postgres|mysql|prisma|api/i.test(s)) },
    { title: l.tools, skills: skills.filter((s) => /git|docker|figma|wordpress|n8n|vercel/i.test(s)) },
    { title: l.concepts, skills: skills.filter((s) => !/react|next|typescript|javascript|tailwind|html|css|sass|node|python|php|postgres|mysql|prisma|api|git|docker|figma|wordpress|n8n|vercel/i.test(s)) },
  ].filter((cat) => cat.skills.length > 0);
}

export function FunctionalPreview({ data }: { data: CVData }) {
  const lang = data.language || "pt";
  const skillCategories = categorizeSkills(data.skills, lang);
  const t = {
    professionalSummary: lang === "pt" ? "Resumo Profissional" : lang === "en" ? "Professional Summary" : "Resumen Profesional",
    professionalExperience: lang === "pt" ? "Experiência Profissional" : lang === "en" ? "Professional Experience" : "Experiencia Laboral",
    education: lang === "pt" ? "Educação" : lang === "en" ? "Education" : "Educación",
    skills: lang === "pt" ? "Habilidades" : lang === "en" ? "Skills" : "Habilidades",
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
      <div className="mb-4 pb-3 border-b border-gray-200 text-center">
        <h1 className="text-xl font-bold text-gray-900">{data.name}</h1>
        <p className="text-[11px] text-gray-500 mb-2">{data.title}</p>
        <div className="flex flex-wrap justify-center gap-3 text-[9px] text-gray-600">
          {data.email && <a href={`mailto:${data.email}`} className="text-blue-600 hover:underline">{data.email}</a>}
          {data.phone && <a href={`tel:${data.phone}`} className="text-blue-600 hover:underline">{data.phone}</a>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{t.linkedinLabel}</a>}
          {data.github && <a href={data.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{t.githubLabel}</a>}
          <a href="https://e2-barao.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Portfolio</a>
        </div>
      </div>

      <p className="text-[10px] text-gray-700 leading-relaxed mb-4">{data.summary}</p>

      <div className="mb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b border-gray-200">{t.professionalSummary}</h2>
        <p className="text-[10px] text-gray-700 leading-relaxed mb-4">{data.summary}</p>

        <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b border-gray-200">{t.skills}</h2>
        {skillCategories.map((cat, i) => (
          <div key={i} className="mb-3">
            <h3 className="text-[10px] font-semibold text-gray-800 mb-1">{cat.title}</h3>
            <div className="flex flex-wrap gap-1">
              {cat.skills.map((skill, j) => (
                <span key={j} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[9px]">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b border-gray-200">Key Projects</h2>
        {data.projects.map((project, i) => (
          <div key={i} className="mb-2">
            <p className="text-[10px] font-semibold text-gray-800">{project.name}</p>
            <p className="text-[9px] text-gray-700 leading-relaxed">{project.description}</p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b border-gray-200">{t.professionalExperience}</h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="mb-2">
            <div className="flex justify-between items-baseline">
              <span className="font-semibold text-[10px] text-gray-800">{exp.role}</span>
              <span className="text-[9px] text-gray-500">{exp.period}</span>
            </div>
            <p className="text-[9px] text-gray-600">{exp.company}</p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b border-gray-200">{t.education}</h2>
        {data.education.map((edu, i) => (
          <div key={i} className="mb-2">
            <div className="flex justify-between items-baseline">
              <span className="font-semibold text-[10px] text-gray-800">{edu.degree}</span>
              <span className="text-[9px] text-gray-500">{edu.period}</span>
            </div>
            <p className="text-[9px] text-gray-600">{edu.school}</p>
          </div>
        ))}
      </div>

      {data.languages.length > 0 && (
        <div>
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
  );
}
