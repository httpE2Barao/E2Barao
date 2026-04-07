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

export function CreativePreview({ data }: { data: CVData }) {
  return (
    <div className="bg-white flex text-[10px]" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="w-44 bg-slate-800 text-slate-200 p-6 flex-shrink-0">
        <h1 className="text-base font-bold text-white mb-1">{data.name}</h1>
        <p className="text-[9px] text-amber-400 mb-4">{data.title}</p>

        <div className="mb-4">
          <h3 className="text-[9px] font-bold uppercase tracking-wider text-amber-400 mb-2 pb-1 border-b border-amber-400">Contact</h3>
          {data.email && <p className="text-[8px] text-slate-300 mb-1">{data.email}</p>}
          {data.phone && <p className="text-[8px] text-slate-300 mb-1">{data.phone}</p>}
          {data.location && <p className="text-[8px] text-slate-300 mb-1">{data.location}</p>}
          {data.linkedin && <p className="text-[8px] text-slate-300 mb-1">{data.linkedin}</p>}
          {data.github && <p className="text-[8px] text-slate-300 mb-1">{data.github}</p>}
        </div>

        <div className="mb-4">
          <h3 className="text-[9px] font-bold uppercase tracking-wider text-amber-400 mb-2 pb-1 border-b border-amber-400">Skills</h3>
          {data.skills.slice(0, 12).map((skill, i) => (
            <p key={i} className="text-[8px] text-slate-200 mb-0.5">• {skill}</p>
          ))}
        </div>

        {data.languages.length > 0 && (
          <div className="mb-4">
            <h3 className="text-[9px] font-bold uppercase tracking-wider text-amber-400 mb-2 pb-1 border-b border-amber-400">Languages</h3>
            {data.languages.map((lang, i) => (
              <p key={i} className="text-[8px] text-slate-300 mb-0.5">{lang}</p>
            ))}
          </div>
        )}

        <div>
          <h3 className="text-[9px] font-bold uppercase tracking-wider text-amber-400 mb-2 pb-1 border-b border-amber-400">Education</h3>
          {data.education.slice(0, 2).map((edu, i) => (
            <div key={i} className="mb-2">
              <p className="text-[8px] font-semibold text-white">{edu.degree}</p>
              <p className="text-[8px] text-slate-300">{edu.school}</p>
              <p className="text-[7px] text-slate-400">{edu.period}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 text-gray-900">
        {data.summary && (
          <div className="mb-4">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b-2 border-amber-400">Profile</h2>
            <p className="text-[10px] text-gray-700 leading-relaxed">{data.summary}</p>
          </div>
        )}

        <div className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b-2 border-amber-400">Experience</h2>
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
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b-2 border-amber-400">Key Projects</h2>
            {data.projects.slice(0, 3).map((project, i) => (
              <div key={i} className="mb-2">
                <p className="text-[10px] font-semibold text-gray-800">{project.name}</p>
                <p className="text-[9px] text-gray-600 leading-relaxed">{project.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
