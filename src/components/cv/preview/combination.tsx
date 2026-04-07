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
  experience: Array<{ role: string; company: string; period: string; description: string }>;
  education: Array<{ degree: string; school: string; period: string; description: string }>;
  skills: string[];
  projects: Array<{ name: string; description: string }>;
  languages: string[];
}

export function CombinationPreview({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-gray-900 p-8 text-[10px] leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="mb-4 pb-3 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">{data.name}</h1>
        <p className="text-[11px] text-gray-500 mb-2">{data.title}</p>
        <div className="flex flex-wrap gap-3 text-[9px] text-gray-600">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
          {data.github && <span>{data.github}</span>}
        </div>
      </div>

      {data.summary && (
        <div className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b border-gray-200">Professional Summary</h2>
          <p className="text-[10px] text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b border-gray-200">Core Skills</h2>
        <div className="flex flex-wrap gap-1">
          {data.skills.map((skill, i) => (
            <span key={i} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[9px]">{skill}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b border-gray-200">Work Experience</h2>
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
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b border-gray-200">Education</h2>
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
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b border-gray-200">Projects</h2>
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
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b border-gray-200">Languages</h2>
              <p className="text-[10px] text-gray-700">{data.languages.join(" • ")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
