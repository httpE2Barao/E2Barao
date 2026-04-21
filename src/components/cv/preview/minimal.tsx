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

export function MinimalPreview({ data }: { data: CVData }) {
  const lang = data.language || "pt";
  const t = {
    experience: lang === "pt" ? "Experiência" : lang === "en" ? "Experience" : "Experiencia",
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
    <div className="bg-white text-black p-10 text-[10px] leading-relaxed" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
      <div className="mb-6 pb-4 border-b border-black">
        <h1 className="text-xl font-bold tracking-wide">{data.name}</h1>
        <p className="text-[10px] text-gray-600 mb-2">{data.title}</p>
        <div className="flex flex-wrap gap-4 text-[9px] text-gray-700">
          {data.email && <a href={`mailto:${data.email}`} className="text-blue-700 hover:underline">{data.email}</a>}
          {data.phone && <a href={`tel:${data.phone}`} className="text-blue-700 hover:underline">{data.phone}</a>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">{t.linkedinLabel}</a>}
          {data.github && <a href={data.github} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">{t.githubLabel}</a>}
        </div>
      </div>

      {data.summary && (
        <div className="mb-4">
          <p className="text-[9px] text-gray-800 leading-relaxed">{data.summary}</p>
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-widest mb-3 pb-1 border-b border-gray-300">{t.experience}</h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-[10px]">{exp.role}</span>
              <span className="text-[9px] text-gray-600">{exp.period}</span>
            </div>
            <p className="text-[9px] text-gray-700 italic">{exp.company}</p>
            <p className="text-[9px] text-gray-800 mt-1 leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-widest mb-3 pb-1 border-b border-gray-300">{t.education}</h2>
        {data.education.map((edu, i) => (
          <div key={i} className="mb-2">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-[10px]">{edu.degree}</span>
              <span className="text-[9px] text-gray-600">{edu.period}</span>
            </div>
            <p className="text-[9px] text-gray-700 italic">{edu.school}</p>
            {edu.description && <p className="text-[9px] text-gray-800 mt-1">{edu.description}</p>}
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-widest mb-3 pb-1 border-b border-gray-300">{t.skills}</h2>
        <div className="flex flex-wrap gap-1">
          {data.skills.map((skill, i) => (
            <span key={i} className="text-[9px] text-gray-800">{skill}{i < data.skills.length - 1 ? " · " : ""}</span>
          ))}
        </div>
      </div>

      {data.languages.length > 0 && (
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-widest mb-3 pb-1 border-b border-gray-300">{t.languages}</h2>
          <p className="text-[9px] text-gray-800">{data.languages.join(", ")}</p>
        </div>
      )}

      {(data.additionalData?.willingnessToTravel || data.additionalData?.willingnessToRelocate || data.additionalData?.driverLicense || data.additionalData?.vehicleType) && (
        <div className="mt-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest mb-3 pb-1 border-b border-gray-300">{t.additionalData}</h2>
          <div className="text-[9px] text-gray-800 space-y-0.5">
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
