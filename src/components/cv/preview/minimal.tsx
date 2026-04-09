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

export function MinimalPreview({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-black p-10 text-[10px] leading-relaxed" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
      <div className="mb-6 pb-4 border-b border-black">
        <h1 className="text-xl font-bold tracking-wide">{data.name}</h1>
        <p className="text-[10px] text-gray-600 mb-2">{data.title}</p>
        <div className="flex flex-wrap gap-4 text-[9px] text-gray-700">
          {data.email && <a href={`mailto:${data.email}`} className="text-blue-700 hover:underline">{data.email}</a>}
          {data.phone && <a href={`tel:${data.phone}`} className="text-blue-700 hover:underline">{data.phone}</a>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">LinkedIn</a>}
          {data.github && <a href={data.github} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">GitHub</a>}
        </div>
      </div>

      {data.summary && (
        <div className="mb-4">
          <p className="text-[9px] text-gray-800 leading-relaxed">{data.summary}</p>
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-widest mb-3 pb-1 border-b border-gray-300">Experience</h2>
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
        <h2 className="text-[11px] font-bold uppercase tracking-widest mb-3 pb-1 border-b border-gray-300">Education</h2>
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
        <h2 className="text-[11px] font-bold uppercase tracking-widest mb-3 pb-1 border-b border-gray-300">Skills</h2>
        <div className="flex flex-wrap gap-1">
          {data.skills.map((skill, i) => (
            <span key={i} className="text-[9px] text-gray-800">{skill}{i < data.skills.length - 1 ? " · " : ""}</span>
          ))}
        </div>
      </div>

      {data.languages.length > 0 && (
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-widest mb-3 pb-1 border-b border-gray-300">Languages</h2>
          <p className="text-[9px] text-gray-800">{data.languages.join(", ")}</p>
        </div>
      )}
    </div>
  );
}
